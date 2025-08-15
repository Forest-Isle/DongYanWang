from functools import cached_property
from django.db import models
from django.utils import timezone
from django.db.models import Subquery, OuterRef
from rest_framework.exceptions import ValidationError
from api.models.user import User, DeleteModel
from api.models.content import Content
from api.models.article import BasePost


class AdmissionsCategory(models.Model):
    """招生信息分类"""
    CATEGORY_CHOICES = [
        ('domestic', '国内招生'),
        ('international', '国际招生'),
        ('enterprise', '企业招生'),
        ('exchange', '交换/联合培养招生'),
    ]

    name = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        unique=True,
        verbose_name='分类名称'
    )

    class Meta:
        verbose_name = '招生分类'
        verbose_name_plural = verbose_name
        ordering = ['name']

    @property
    def admissions_count(self):
        """分类下招生信息总数"""
        return self.admissions.count()

    @cached_property
    def high_acceptance_count(self):
        """高录取率招生信息数量（示例阈值 >50%）"""
        current_year = timezone.now().year
        return (
            self.admissions
            .filter(
                metrics__acceptance_rate__gt=50,
                metrics__year=current_year
            )
            .distinct()
            .count()
        )

    def get_admissions_by_duration(self, min_weeks=6):
        """获取时长超过一定周数的招生信息"""
        return self.admissions.annotate(
            latest_duration=Subquery(
                AdmissionsMetric.objects.filter(
                    admissions=OuterRef('pk'),
                    year=timezone.now().year
                ).values('duration_weeks')[:1]
            )
        ).filter(latest_duration__gte=min_weeks)


class Admissions(Content):
    STATUS_CHOICES = [
        ("applying", "申请中"),
        ("ongoing", "进行中"),
        ("completed", "已结题"),
        ("paused", "已暂停"),
    ]
    """招生信息"""
    name = models.CharField(max_length=200, verbose_name='招生项目名称', db_index=True)
    application_url = models.URLField(verbose_name='申请官网')
    location = models.CharField(max_length=100, verbose_name='地点')
    organizer = models.CharField(max_length=100, verbose_name='主办单位')
    cover = models.URLField(verbose_name='封面图')

    # 运营数据
    is_scholarship = models.BooleanField(default=False, verbose_name='是否提供奖学金')
    is_competitive = models.BooleanField(default=True, verbose_name='是否竞争激烈')
    last_update = models.DateTimeField(auto_now=True, verbose_name='最后更新')

    sub_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applying", verbose_name="项目状态")

    categories = models.ManyToManyField(AdmissionsCategory, related_name='admissions', verbose_name='所属分类')

    class Meta:
        verbose_name = '招生信息'
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=['name', 'sub_status']),
            models.Index(fields=['is_scholarship']),
        ]

    def save(self, *args, **kwargs):
        self.content_type = 'admissions'
        super().save(*args, **kwargs)

    @property
    def current_acceptance_rate(self):
        """最新录取率"""
        return (
            self.metrics
            .order_by('-year')
            .values_list('acceptance_rate', flat=True)
            .first()
        )

    @property
    def current_duration(self):
        """最新时长"""
        if not hasattr(self, '_cached_duration'):
            self._cached_duration = (
                self.metrics
                .order_by('-year')
                .values_list('duration_weeks', flat=True)
                .first()
            )
        return self._cached_duration


class AdmissionsMetric(models.Model):
    """招生年度指标"""
    admissions = models.ForeignKey(Admissions, on_delete=models.CASCADE, related_name='metrics', db_index=True)
    year = models.PositiveSmallIntegerField(verbose_name='年份')
    duration_weeks = models.PositiveSmallIntegerField(verbose_name='时长(周)')
    acceptance_rate = models.FloatField(verbose_name='录取率')
    participants = models.PositiveIntegerField(verbose_name='参与人数')

    class Meta:
        unique_together = ('admissions', 'year')
        ordering = ['-year']
        indexes = [
            models.Index(fields=['-year', 'acceptance_rate']),
        ]


class AdmissionsModerator(models.Model):
    """招生社区版主"""
    admissions = models.ForeignKey(Admissions, on_delete=models.CASCADE, related_name='moderators')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    title = models.CharField(
        max_length=20,
        choices=[
            ('chief', '主版主'),
            ('deputy', '副版主'),
        ],
        verbose_name='职位类型'
    )
    is_active = models.BooleanField(default=True, verbose_name='是否在职')

    class Meta:
        unique_together = ('admissions', 'user')
        verbose_name = '招生版主'
        verbose_name_plural = '招生版主'

    def clean(self):
        if self.title == 'chief':
            exists = AdmissionsModerator.objects.filter(
                admissions=self.admissions,
                title='chief',
            ).exclude(pk=self.pk).exists()
            if exists:
                raise ValidationError('该招生信息已存在活跃的主版主')


class AdmissionsPost(BasePost):
    """招生社区帖子"""
    POST_TYPE_CHOICES = [
        ('strategy', '申请攻略'),
        ('experience', '项目体验'),
        ('question', '问答'),
        ('resource', '资源分享')
    ]
    admissions = models.ForeignKey(Admissions, on_delete=models.CASCADE, related_name='posts')

    sub_post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, verbose_name='帖子类型')
    is_hot = models.BooleanField(verbose_name='热门帖子', default=False)

    collect_count = models.BigIntegerField(verbose_name='收藏数', default=0)
    recommend_count = models.BigIntegerField(verbose_name='推荐数', default=0)
    comment_count_cache = models.BigIntegerField(default=0, verbose_name='评论数缓存')

    class Meta:
        ordering = ['-created_time']
        indexes = [
            models.Index(fields=['admissions', 'post_type', 'post_status']),
            models.Index(fields=['creator', 'post_status']),
        ]

    def save(self, *args, **kwargs):
        self.post_type = 'admissions'
        super().save(*args, **kwargs)

    @property
    def comment_count(self):
        return self.comment_count_cache or self.comments.count()


class AdmissionsPostAttachment(models.Model):
    post = models.ForeignKey(AdmissionsPost, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(
        upload_to='admissions_attachments/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='文件'
    )
    url = models.URLField(null=True, blank=True, verbose_name='外部链接')
    order = models.PositiveSmallIntegerField(default=0, verbose_name='排序权重')

    video_cover = models.ImageField(upload_to='admissions_video_covers/', null=True, blank=True)
    video_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name='视频时长(秒)')

    class Meta:
        ordering = ['order']
        verbose_name = '招生帖子附件'
        verbose_name_plural = '招生帖子附件'

class AdmissionQuerySet(models.QuerySet):
    def applying(self):
        return self.filter(sub_status="applying")

    def ongoing(self):
        return self.filter(sub_status="ongoing")

    def completed(self):
        return self.filter(sub_status="completed")

