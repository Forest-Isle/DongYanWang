from api.models.content import Content
from api.models.user import User,DeleteModel
from django.utils import timezone
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType



class BasePost(DeleteModel):
    """
    帖子基础模型（抽象基类）
    """
    POST_TYPES = (
        ('journal', '学术论文'),
        ('project', '科研项目'),
        ('competition', '学科竞赛'),
        ('internship', '实习机会'),
        ('skill', '科研技巧'),
        ('admissions', '招生机会')
    )

    STATUS_CHOICES = (
        ('draft', '草稿'),
        ('pending', '待审核'),
        ('published', '已发布'),
        ('rejected', '已拒绝'),
        ('archived', '已归档'),
    )

    title = models.CharField(max_length=200, verbose_name='标题')
    creator = models.ForeignKey('User', on_delete=models.CASCADE, verbose_name='创建者')
    post_type = models.CharField(max_length=20, choices=POST_TYPES, editable=False)
    # 富文本内容（支持Markdown/HTML）
    content = models.TextField(verbose_name='内容')
    content_format = models.CharField(
        max_length=10,
        choices=[('md', 'Markdown'), ('html', 'HTML')],
        default='md',
        verbose_name='内容格式'
    )
    post_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    # 通用关系字段用于关联各种交互
    interactions = GenericRelation('Interaction')
    comments = GenericRelation('Comment')

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['post_type', 'created_time']),
            models.Index(fields=['post_status', 'created_time']),
            models.Index(fields=['creator', 'post_status']),  # 新增
        ]

    def save(self, *args, **kwargs):
        if not self.post_type:
            raise ValueError("post_type 必须在子类显式指定")
        super().save(*args, **kwargs)

    @property
    def like_count(self):
        return self.interactions.filter(interaction_type='like').count()

    @property
    def collect_count(self):
        return self.interactions.filter(interaction_type='collect').count()

    @property
    def comment_count(self):
        return self.comments.count()


class PostAttachment(models.Model):
    """
    帖子附件模型（支持多类型内容）
    """
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    file = models.FileField(upload_to='post_attachments/%Y/%m/')
    file_type = models.CharField(max_length=50, blank=True)  # image, video, document等
    file_size = models.PositiveIntegerField(help_text="文件大小(字节)")
    order = models.PositiveSmallIntegerField(default=0)
    upload_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
        verbose_name = '帖子附件'
        verbose_name_plural = '帖子附件'


class Interaction(models.Model):
    """
    通用交互行为模型（替代原有的Recommend/Collect/UpAndDown等模型）
    """
    INTERACTION_TYPES = (
        ('like', '点赞'),
        ('collect', '收藏'),
        ('share', '分享'),
        ('report', '举报'),
        ('view', '浏览'),
    )

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='interactions')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    created_time = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)  # 存储额外信息，如分享渠道、举报原因等


    class Meta:
        unique_together = ('user', 'content_type', 'object_id', 'interaction_type')
        indexes = [
            models.Index(fields=['content_type', 'object_id', 'interaction_type']),
            models.Index(fields=['user', 'interaction_type']),
        ]
        verbose_name = '用户交互'
        verbose_name_plural = '用户交互'

class Interactionable(models.Model):
    """
    如果模型需要支持互动（点赞、评论等），继承这个
    """
    interactions = GenericRelation(
        Interaction,
        related_query_name="%(app_label)s_%(class)s"
    )

    class Meta:
        abstract = True


class Comment(DeleteModel):
    """
    通用评论系统（支持多级嵌套）
    """
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='comments')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    content = models.TextField(max_length=1000, verbose_name='评论内容')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    # 评论层级结构
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE,
                               related_name='replies')
    root = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL,
                             related_name='descendants')
    depth = models.PositiveSmallIntegerField(default=0)

    # 互动统计
    like_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_time']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['root']),
        ]
        verbose_name = '评论'
        verbose_name_plural = '评论'

    def save(self, *args, **kwargs):
        # 自动计算评论层级
        if self.parent:
            self.depth = self.parent.depth + 1
            if self.parent.root:
                self.root = self.parent.root
            else:
                self.root = self.parent
        super().save(*args, **kwargs)



