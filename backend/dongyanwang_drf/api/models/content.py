from api.models.user import User,DeleteModel


from django.db import models, transaction
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db.models import F
from django.core.exceptions import ValidationError

# 你的抽象 Content （保持不变）
class Content(DeleteModel):
    CONTENT_CHOICES = (
        ('journal', '学术论文'),
        ('project', '科研项目'),
        ('competition', '学科竞赛'),
        ('internship', '实习机会'),
        ('news', '行业资讯'),
        ('admissions', '招生机会')
    )
    content_type = models.CharField(max_length=20, choices=CONTENT_CHOICES, verbose_name='内容类型')
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    status_choices = ((1, '待审核'), (2, '通过'), (3, '未通过'))
    status = models.IntegerField(choices=status_choices, verbose_name='状态', default=1)

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['content_type', 'created_time']),
        ]


# ContentStats — 正确使用 ContentType + validation
class ContentStats(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('content_type', 'object_id')
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['-view_count']),
        ]

    def clean(self):
        from api.models.article import BasePost
        model_class = self.content_type.model_class()
        # model_class 可能为 None（极端情况），也要保护
        if model_class is None:
            raise ValidationError("无效的 content_type")
        # 允许指向 Content 的子类（如 Journal）或者 BasePost 的具体子类（如 JournalPost）
        if not (issubclass(model_class, Content) or issubclass(model_class, BasePost)):
            raise ValidationError("ContentStats 只能关联 Content 的子类 或 Post 的子类")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @classmethod
    def get_or_create_for(cls, obj):
        ct = ContentType.objects.get_for_model(type(obj))
        return cls.objects.get_or_create(content_type=ct, object_id=obj.pk)

    @classmethod
    def increment_view(cls, obj):
        ct = ContentType.objects.get_for_model(type(obj))
        with transaction.atomic():
            stats, created = cls.objects.get_or_create(content_type=ct, object_id=obj.pk)
            # 原子更新
            cls.objects.filter(pk=stats.pk).update(view_count=F('view_count') + 1)
            # 返回最新对象（可选）
            return cls.objects.get(pk=stats.pk)



