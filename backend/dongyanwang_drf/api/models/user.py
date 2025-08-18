from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import AbstractUser


def avatar_upload_to(instance, filename):
    return f"avatars/{instance.id}/{timezone.now().strftime('%Y%m%d_%H%M%S')}_{filename}"

def cover_upload_to(instance, filename):
    return f"covers/{instance.id}/{timezone.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
class DeleteModel(models.Model):
    """
    软删除基类模型
    """
    is_deleted = models.BooleanField(default=False, verbose_name='已删除')
    deleted_time = models.DateTimeField(null=True, blank=True, verbose_name='删除时间')

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.deleted_time = timezone.now()
        self.save()
class User(DeleteModel,AbstractUser):
    username = models.CharField(max_length=150, unique=True, verbose_name='用户名')
    email = models.EmailField(unique=True, verbose_name='邮箱')
    password = models.CharField(max_length=128, verbose_name='密码')  # hash后长度建议128
    phone = models.CharField(max_length=11, verbose_name='手机号', null=True, blank=True)
    # ✅ 改为 ImageField（商业推荐）
    avatar = models.ImageField(upload_to=avatar_upload_to, null=True, blank=True, verbose_name='头像')
    cover_image = models.ImageField(upload_to=cover_upload_to, null=True, blank=True, verbose_name='封面图')
    school = models.CharField(verbose_name='学校', max_length=100, blank=True)
    major = models.CharField(verbose_name='专业', max_length=80, blank=True)
    degree = models.CharField(verbose_name='学历', max_length=50, blank=True)
    grade = models.CharField(verbose_name='年级', max_length=50, blank=True)
    location = models.CharField(verbose_name='所在地', max_length=100, blank=True)
    bio = models.TextField(verbose_name='个人简介', max_length=100,blank=True)

    STATUS_CHOICES = (
        (1, '激活'),
        (2, '禁用'),
    )
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name='状态')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户'
        indexes = [
            models.Index(fields=['username', 'password'], name='idx_name_pwd')
        ]


class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")


class UserSocialLink(models.Model):
    platform = models.CharField('平台', max_length=20)  # e.g. 'github', 'linkedin'
    url = models.URLField('链接')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_links')

class UserSkill(models.Model):
    name = models.CharField('技能名称', max_length=50)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')

class UserInterest(models.Model):
    name = models.CharField('兴趣名称', max_length=50)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interests')


class Activity(models.Model):
    class ActionType(models.TextChoices):
        CREATED = "created", "Created"
        UPDATED = "updated", "Updated"
        JOINED = "joined", "Joined"
        FOLLOWED = "followed", "Followed"
        LIKED = "liked", "Liked"
        COMMENTED = "commented", "Commented"

    user = models.ForeignKey("User", on_delete=models.CASCADE)
    action = models.CharField(
        max_length=20,
        choices=ActionType.choices,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # 通用外键
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")

    def __str__(self):
        return f"{self.user} {self.get_action_display()} {self.target}"



class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('application', '申请'),
        ('comment', '评论'),
        ('like', '点赞'),
        ('follow', '关注'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField('类型', max_length=20, choices=NOTIFICATION_TYPES)
    message = models.CharField('消息', max_length=200)
    read = models.BooleanField('已读', default=False)
    date = models.DateTimeField('时间', auto_now_add=True)

    # 关联到任意对象
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField(null=True)
    related_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        ordering = ['-date']



class UserStats(models.Model):
    papers_post = models.PositiveIntegerField('论文帖子数', default=0)
    projects_post = models.PositiveIntegerField('项目帖子数', default=0)
    competitions_post = models.PositiveIntegerField('竞赛帖子数', default=0)

    followers = models.PositiveIntegerField('粉丝数', default=0)
    following = models.PositiveIntegerField('关注数', default=0)

    user = models.OneToOneField("User", on_delete=models.CASCADE, related_name="stats")

    def update_stats(self):
        """更新统计字段：以 creator 为准"""
        from .models import PaperPost, ProjectPost, CompetitionPost,  Follow
        # 用户创建的论文帖子数量
        self.papers_post = PaperPost.objects.filter(creator=self.user).count()
        # 用户创建的项目帖子数量
        self.projects_post = ProjectPost.objects.filter(creator=self.user).count()
        # 用户创建的竞赛帖子数量
        self.competitions_post = CompetitionPost.objects.filter(creator=self.user).count()
        # 粉丝数量：谁关注了我
        self.followers = Follow.objects.filter(following=self.user).count()
        # 关注数量：我关注了谁
        self.following = Follow.objects.filter(follower=self.user).count()
        self.save()



# ✅ 简单审计日志
class OperationLog(models.Model):
    user = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=64)  # e.g. "profile_update", "avatar_upload"
    ip = models.GenericIPAddressField(null=True, blank=True)
    ua = models.TextField(blank=True)
    request_id = models.CharField(max_length=64, blank=True)
    extra = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)