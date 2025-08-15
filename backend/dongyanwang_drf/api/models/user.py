from django.db import models
from django.utils import timezone
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
class User(DeleteModel):
    username = models.CharField(max_length=150, unique=True, verbose_name='用户名')
    email = models.EmailField(unique=True, verbose_name='邮箱')
    password = models.CharField(max_length=128, verbose_name='密码')  # hash后长度建议128
    phone = models.CharField(max_length=11, verbose_name='手机号', null=True, blank=True)
    avatar = models.URLField(verbose_name='头像')

    cover_image = models.URLField(verbose_name='封面图', blank=True)
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
    token = models.CharField(max_length=64, verbose_name='token验证', null=True, blank=True)
    token_expiry = models.DateTimeField(verbose_name='token有效期', null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户'
        indexes = [
            models.Index(fields=['username', 'password'], name='idx_name_pwd')
        ]

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
    ACTIVITY_TYPES = (
        ('paper', '论文'),
        ('project', '项目'),
        ('competition', '竞赛'),
        ('internship', '实习'),

    )

    activity_type = models.CharField('类型', max_length=20, choices=ACTIVITY_TYPES)
    action = models.CharField('动作', max_length=50)  # e.g. "分享了", "参加了"
    title = models.CharField('标题', max_length=200)
    date = models.DateTimeField('时间', auto_now_add=True)
    likes = models.PositiveIntegerField('点赞数', default=0)
    comments = models.PositiveIntegerField('评论数', default=0)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')

    class Meta:
        verbose_name_plural = '动态'
        ordering = ['-date']


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('application', '申请'),
        ('comment', '评论'),
        ('like', '点赞'),
    )


    notification_type = models.CharField('类型', max_length=20, choices=NOTIFICATION_TYPES)
    message = models.CharField('消息', max_length=200)
    date = models.DateTimeField('时间', auto_now_add=True)
    read = models.BooleanField('已读', default=False)
    related_id = models.PositiveIntegerField('关联ID', null=True)  # 关联到其他表的ID

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')

    class Meta:
        ordering = ['-date']


class UserStats(models.Model):

    papers = models.PositiveIntegerField('论文数', default=0)
    projects = models.PositiveIntegerField('项目数', default=0)
    competitions = models.PositiveIntegerField('竞赛数', default=0)
    internships = models.PositiveIntegerField('实习数', default=0)
    followers = models.PositiveIntegerField('粉丝数', default=0)
    following = models.PositiveIntegerField('关注数', default=0)

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')

    def update_stats(self):
        """更新统计字段"""
        self.papers = self.user.collections.filter(collection_type='paper').count()
        # 其他字段类似...
        self.save()