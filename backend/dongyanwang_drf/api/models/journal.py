from functools import cached_property
from api.models.article import BasePost
from django.utils import timezone
from django.db import models
from django.db.models import Subquery, OuterRef
from api.models.user import User,DeleteModel
from api.models.content import Content
from rest_framework.exceptions import ValidationError


class JournalCategory(models.Model):
    """增强版期刊学科分类体系"""
    CATEGORY_CHOICES = [
        ('cs', '计算机科学'),
        ('eng', '工程学'),
        ('med', '医学'),
        ('bio', '生物学'),
        ('math', '数学'),
        ('phy', '物理学'),
        ('chem', '化学'),
        ('composite','综合性期刊'),
        ('engineering','工程类期刊'),

    ]

    name = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        unique=True,
        verbose_name='分类名称'
    )


    class Meta:
        verbose_name = '期刊分类'
        verbose_name_plural = verbose_name
        ordering = ['name']

    @property
    def journal_count(self):
        """该分类下的期刊总数"""
        return self.journals.count()

    @cached_property  # 添加缓存装饰器
    def q1_journal_count(self):
        """优化性能的Q1期刊计数"""
        current_year = timezone.now().year
        return (
            self.journals
            .filter(
                metrics__jcr_division='Q1',
                metrics__year=current_year
            )
            .distinct()
            .count()
        )

    @property
    def top_impact_factor(self):
        """该分类下最高影响因子期刊"""
        return self.journals.annotate(
            current_impact=Subquery(
                JournalMetric.objects.filter(
                    journal=OuterRef('pk'),
                    year=timezone.now().year
                ).order_by('-year').values('impact_factor')[:1]
            )
        ).order_by('-current_impact').first()

    def get_journals_by_impact(self, min_impact=10.0):
        """获取分类下影响因子超过阈值的期刊"""
        return self.journals.annotate(
            latest_impact=Subquery(
                JournalMetric.objects.filter(
                    journal=OuterRef('pk'),
                    year=timezone.now().year
                ).values('impact_factor')[:1]
            )
        ).filter(latest_impact__gte=min_impact)

class Journal(Content):
    """学术期刊模型"""
    name = models.CharField(max_length=200, verbose_name='期刊名称', db_index=True)
    issn = models.CharField(max_length=9, unique=True, verbose_name='ISSN号')
    cover = models.URLField(verbose_name='期刊封面')
    publisher = models.CharField(max_length=100, verbose_name='出版商')
    journal_url = models.URLField(max_length=200, verbose_name='期刊官网')


    # 收录情况
    is_sci = models.BooleanField(default=False, verbose_name='SCI收录')
    is_oa = models.BooleanField(default=False, verbose_name='是否OA期刊')

    # 运营数据

    last_update = models.DateTimeField(auto_now=True, verbose_name='最后更新')
    categories = models.ManyToManyField(JournalCategory, related_name='journals', verbose_name='所属分类')

    class Meta:
        verbose_name = '学术期刊'
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=['issn']),
            models.Index(fields=['is_sci']),
        ]

    def save(self, *args, **kwargs):
        self.content_type = 'journal'
        super().save(*args, **kwargs)

    @property
    def current_impact_factor(self):
        """获取最新影响因子（优化查询）"""
        return (
            self.metrics
            .order_by('-year')
            .values_list('impact_factor', flat=True)
            .first()
        )

    @property
    def current_quartile(self):
        """获取最新JCR分区（使用缓存）"""
        if not hasattr(self, '_cached_quartile'):
            self._cached_quartile = (
                self.metrics
                .order_by('-year')
                .values_list('jcr_division', flat=True)
                .first()
            )
        return self._cached_quartile

class JournalMetric(models.Model):
    """期刊年度指标（时间序列数据）"""
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='metrics', db_index=True)  # 添加索引
    year = models.PositiveSmallIntegerField(verbose_name='年份')
    impact_factor = models.FloatField(verbose_name='影响因子')
    acceptance_rate = models.FloatField(verbose_name='录用率')
    review_period = models.PositiveSmallIntegerField(verbose_name='审稿周期(天)')
    # 指标数据
    jcr_division = models.CharField(max_length=20, choices=[
        ('Q1', 'Q1区'), ('Q2', 'Q2区'), ('Q3', 'Q3区'), ('Q4', 'Q4区')
    ], verbose_name='JCR分区')

    class Meta:
        unique_together = ('journal', 'year')
        ordering = ['-year']
        indexes = [
            models.Index(fields=['-year', 'jcr_division']),  # 复合索引
        ]

class JournalModerator(models.Model):
    """期刊社区版主"""
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='moderators')
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
        unique_together = ('journal', 'user')  # 确保每个用户在每期刊唯一
        verbose_name = '期刊版主'
        verbose_name_plural = verbose_name

    def clean(self):
        """额外验证：每个期刊只能有一个主版主"""
        if self.title == 'chief' :
            exists = JournalModerator.objects.filter(
                journal=self.journal,
                title='chief',
            ).exclude(pk=self.pk).exists()
            if exists:
                raise ValidationError('该期刊已存在活跃的主版主')


class JournalPost(BasePost):
    """支持富媒体的期刊社区帖子"""
    POST_TYPE_CHOICES = [
        ('strategy', '投稿策略'),
        ('experience', '审稿经验'),
        ('question', '学术问答'),
        ('resource', '资源分享')
    ]
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='posts')

    # 帖子类型与状态
    sub_post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, verbose_name='帖子类型')
    is_hot = models.BooleanField(verbose_name='热门帖子', default=False)

    # 存储型计数字段（高并发场景更快）
    collect_count = models.BigIntegerField(verbose_name='收藏数', default=0)
    recommend_count = models.BigIntegerField(verbose_name='推荐数', default=0)
    comment_count_cache = models.BigIntegerField(default=0, verbose_name='评论数缓存')

    class Meta:
        ordering = ['-created_time']
        indexes = [
            models.Index(fields=['journal', 'sub_post_type', 'post_status']),
            models.Index(fields=['creator', 'post_status']),
        ]

    def save(self, *args, **kwargs):
            # 固定 post_type 为 journal
        self.post_type = 'journal'
        super().save(*args, **kwargs)

    @property
    def comment_count(self):
        """优先返回缓存值，必要时动态计算"""
        return self.comment_count_cache or self.comments.count()


class JournalPostAttachment(models.Model):
    post = models.ForeignKey(JournalPost, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(
        upload_to='post_attachments/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='文件'
    )
    url = models.URLField(null=True, blank=True, verbose_name='外部链接')
    order = models.PositiveSmallIntegerField(default=0, verbose_name='排序权重')

    # 视频专属字段
    video_cover = models.ImageField(upload_to='video_covers/', null=True, blank=True)
    video_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name='视频时长(秒)')

    class Meta:
        ordering = ['order']
        verbose_name = '帖子附件'
        verbose_name_plural = '帖子附件'