# api/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Interaction, Comment
from .hot import hot_incr
# api/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F, Count
from django.contrib.contenttypes.models import ContentType

from api.models.article import Comment, Interaction
from api.models.competition import CompetitionPost
from api.models.content import ContentStats  # 或你的实际路径

@receiver([post_save, post_delete], sender=Comment)
def sync_comment_cache_on_change(sender, instance: Comment, **kwargs):
    ct = ContentType.objects.get_for_id(instance.content_type_id)
    model = ct.model_class()
    if model is CompetitionPost:
        post = model.objects.filter(pk=instance.object_id).first()
        if post:
            # 实时同步评论数缓存
            total = Comment.objects.filter(
                content_type_id=instance.content_type_id, object_id=instance.object_id
            ).count()
            CompetitionPost.objects.filter(pk=post.pk).update(comment_count_cache=total)

@receiver(post_save, sender=Interaction)
def touch_stats_on_interaction_create(sender, instance: Interaction, created, **kwargs):
    if not created:
        return
    # 点赞/收藏等可以统一计入 ContentStats 的 like_count（按需）
    if instance.interaction_type in ("like", "collect"):
        stats, _ = ContentStats.objects.get_or_create(
            content_type_id=instance.content_type_id, object_id=instance.object_id
        )
        ContentStats.objects.filter(pk=stats.pk).update(like_count=F("like_count") + 1)

@receiver(post_delete, sender=Interaction)
def touch_stats_on_interaction_delete(sender, instance: Interaction, **kwargs):
    if instance.interaction_type in ("like", "collect"):
        stats = ContentStats.objects.filter(
            content_type_id=instance.content_type_id, object_id=instance.object_id
        ).first()
        if stats and stats.like_count > 0:
            ContentStats.objects.filter(pk=stats.pk).update(like_count=F("like_count") - 1)
def _model_label_for(obj) -> str:
    return obj.__class__.__name__.lower()  # e.g. competitionpost

@receiver(post_save, sender=Interaction)
def on_interaction_created(sender, instance, created, **kwargs):
    if not created:
        return
    label = _model_label_for(instance.content_object)
    # like +2, collect +3, view +0.2, share +1
    weight = {"like": 2, "collect": 3, "view": 0.2, "share": 1}.get(instance.interaction_type, 0.5)
    hot_incr(label, instance.object_id, weight)

@receiver(post_save, sender=Comment)
def on_comment_created(sender, instance, created, **kwargs):
    if not created:
        return
    label = _model_label_for(instance.content_object)
    hot_incr(label, instance.object_id, 2.5)