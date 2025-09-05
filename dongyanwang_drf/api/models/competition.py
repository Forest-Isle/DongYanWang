from functools import cached_property
from django.db import models, transaction
from django.utils import timezone
from django.db.models import Subquery, OuterRef, F
from rest_framework.exceptions import ValidationError

from api.models.user import User, DeleteModel
from api.models.content import Content
from api.models.article import BasePost
# 如果你有 ContentStats，可按需引入：
# from models.analytics import ContentStats

class CompetitionCategory(models.Model):
    """竞赛分类：国家级/省级/市级/校级，或按领域（创新创业/数学/编程 等）"""
    CATEGORY_CHOICES = [
        ('national', '国家级'),
        ('provincial', '省级'),
        ('municipal', '市级'),
        ('school', '校级'),
        ('innovation', '创新创业'),
        ('math', '数学'),
        ('cs', '计算机/编程'),
        ('engineering', '工程/电子'),
    ]
    name = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        unique=True,
        verbose_name='分类名称'
    )

    class Meta:
        verbose_name = '竞赛分类'
        verbose_name_plural = verbose_name
        ordering = ['name']

    @property
    def competition_count(self):
        return self.competitions.count()

    @cached_property
    def high_bonus_count(self):
        """
        高奖金竞赛数量（示例：奖金>= 50000）
        """
        current_year = timezone.now().year
        return (
            self.competitions
            .filter(
                metrics__year=current_year,
                metrics__max_bonus__gte=50000
            )
            .distinct()
            .count()
        )

    def get_competitions_by_deadline(self, before_date=None):
        """
        获取截止时间在某日期之前的竞赛（取当前年度指标的 deadline）
        """
        if before_date is None:
            return self.competitions.none()

        return self.competitions.annotate(
            current_deadline=Subquery(
                CompetitionMetric.objects.filter(
                    competition=OuterRef('pk'),
                    year=timezone.now().year
                ).values('registration_deadline')[:1]
            )
        ).filter(current_deadline__lte=before_date)

def competition_cover_path(instance, filename):
    # 文件会上传到 media/competition/<competition_id>/<filename>
    return f"competition/{instance.id}/{filename}"
class Competition(Content):
    """
    竞赛实体：如“全国大学生数学建模竞赛”
    继承 Content 以统一你的内容体系（paper/admissions/competition/...）
    """
    name = models.CharField(max_length=200, verbose_name='竞赛名称', db_index=True)
    cover = models.ImageField(verbose_name='封面图',upload_to="competition/covers/")
    official_website = models.URLField(verbose_name='竞赛官网')
    organizer = models.CharField(max_length=150, verbose_name='主办单位')
    location = models.CharField(max_length=100, verbose_name='地点', blank=True, default='')

    # 标签型布尔特征（和前端示例对齐）
    is_national = models.BooleanField(default=False, verbose_name='是否国家级')
    is_math_contest = models.BooleanField(default=False, verbose_name='是否数学类竞赛')
    is_edu_ministry = models.BooleanField(default=False, verbose_name='是否教育部体系')

    # 运营字段
    followers = models.PositiveIntegerField(default=0, verbose_name='关注人数')
    last_update = models.DateTimeField(auto_now=True, verbose_name='最后更新')

    categories = models.ManyToManyField(
        CompetitionCategory,
        related_name='competitions',
        verbose_name='所属分类'
    )

    class Meta:
        verbose_name = '竞赛'
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_national']),
        ]
    def save(self, *args, **kwargs):
        self.content_type = 'competition'
        super().save(*args, **kwargs)

    # —— 快捷取“当前年度”指标 —— #
    @property
    def current_deadline(self):
        return (
            self.metrics
            .order_by('-year')
            .values_list('registration_deadline', flat=True)
            .first()
        )

    @property
    def current_win_rate(self):
        return (
            self.metrics
            .order_by('-year')
            .values_list('avg_win_rate', flat=True)
            .first()
        )

    @property
    def current_duration_days(self):
        return (
            self.metrics
            .order_by('-year')
            .values_list('avg_duration_days', flat=True)
            .first()
        )


class CompetitionMetric(models.Model):
    """
    竞赛年度指标：报名截止、平均时长、平均获奖率、奖金范围等
    """
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='metrics',
        db_index=True
    )
    year = models.PositiveSmallIntegerField(verbose_name='年份')

    registration_deadline = models.DateField(verbose_name='报名截止')
    avg_duration_days = models.PositiveSmallIntegerField(verbose_name='平均竞赛时长(天)')
    avg_win_rate = models.FloatField(verbose_name='平均获奖率(%)')  # 0~100
    participants = models.PositiveIntegerField(verbose_name='参赛人数', default=0)

    has_bonus = models.BooleanField(default=False, verbose_name='是否有奖金')
    max_bonus = models.PositiveIntegerField(default=0, verbose_name='最高单项奖金(元)')

    class Meta:
        unique_together = ('competition', 'year')
        ordering = ['-year']
        indexes = [
            models.Index(fields=['-year', 'registration_deadline']),
            models.Index(fields=['-year', 'avg_win_rate']),
            models.Index(fields=['-year', 'has_bonus', 'max_bonus']),
        ]


class CompetitionModerator(models.Model):
    """竞赛社区版主"""
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='moderators')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    title = models.CharField(
        max_length=20,
        choices=[('chief', '主版主'), ('deputy', '副版主')],
        verbose_name='职位类型'
    )
    is_active = models.BooleanField(default=True, verbose_name='是否在职')

    class Meta:
        unique_together = ('competition', 'user')
        verbose_name = '竞赛版主'
        verbose_name_plural = verbose_name

    def clean(self):
        """保证每个竞赛仅一个活跃主版主"""
        if self.title == 'chief':
            exists = CompetitionModerator.objects.filter(
                competition=self.competition,
                title='chief',
                is_active=True
            ).exclude(pk=self.pk).exists()
            if exists:
                raise ValidationError('该竞赛已存在活跃的主版主')


class CompetitionPost(BasePost):
    """
    竞赛专区帖子：攻略/经验/问答/资源
    继承 BasePost，post_type 固定为 'competition'
    """
    SUB_TYPE_CHOICES = [
        ('strategy', '报名/备赛攻略'),
        ('experience', '参赛经验'),
        ('question', '问答'),
        ('resource', '资料分享'),
    ]

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='posts')
    sub_post_type = models.CharField(max_length=20, choices=SUB_TYPE_CHOICES, verbose_name='帖子类型')

    # 热门标记 + 计数字段（高并发可走聚合表/缓存）
    is_hot = models.BooleanField(default=False, verbose_name='热门帖子')
    collect_count = models.BigIntegerField(default=0, verbose_name='收藏数')
    recommend_count = models.BigIntegerField(default=0, verbose_name='推荐数')
    comment_count_cache = models.BigIntegerField(default=0, verbose_name='评论数缓存')

    # 最后活跃时间（排序用），可在评论/互动时更新
    last_activity = models.DateTimeField(auto_now=True, verbose_name='最后活跃时间')

    class Meta:
        ordering = ['-last_activity']
        indexes = [
            models.Index(fields=['competition', 'post_type', 'post_status']),
            models.Index(fields=['creator', 'post_status']),
            models.Index(fields=['is_hot', 'last_activity']),
        ]

    def save(self, *args, **kwargs):
        self.post_type = 'competition'
        super().save(*args, **kwargs)

    @property
    def comment_count(self):
        return self.comment_count_cache or self.comments.count()


class CompetitionPostAttachment(models.Model):
    """帖子附件"""
    ATTACHMENT_TYPES = [
        ('image', '图片'),
        ('video', '视频'),
        ('pdf', 'PDF文档'),
        ('link', '外部链接'),
    ]

    post = models.ForeignKey(CompetitionPost, on_delete=models.CASCADE, related_name='attachments')
    attachment_type = models.CharField(max_length=10, choices=ATTACHMENT_TYPES, verbose_name='附件类型')

    file = models.FileField(upload_to='competition_attachments/%Y/%m/', null=True, blank=True)
    url = models.URLField(null=True, blank=True, verbose_name='外部链接')
    caption = models.CharField(max_length=200, blank=True, verbose_name='描述文字')
    order = models.PositiveSmallIntegerField(default=0, verbose_name='排序权重')

    # 视频扩展
    video_cover = models.ImageField(upload_to='competition_video_covers/', null=True, blank=True)
    video_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name='视频时长(秒)')

    class Meta:
        ordering = ['order']
        verbose_name = '竞赛帖子附件'
        verbose_name_plural = verbose_name
