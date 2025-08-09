from django.db import models
from models.user import User,DeleteModel
from models.content import ContentType


class JournalCategory(models.Model):
    """期刊学科分类体系"""
    CATEGORY_CHOICES = [
        ('cs', '计算机科学'),
        ('eng', '工程学'),
        ('med', '医学'),
        ('bio', '生物学'),
        # 其他学科...
    ]

    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)

    class Meta:
        verbose_name = '期刊分类'
        verbose_name_plural = verbose_name

class Journal(DeleteModel):
    """学术期刊模型"""
    name = models.CharField(max_length=200, verbose_name='期刊名称', db_index=True)
    issn = models.CharField(max_length=9, unique=True, verbose_name='ISSN号')
    cover = models.URLField(verbose_name='期刊封面')
    publisher = models.CharField(max_length=100, verbose_name='出版社')

    # 收录情况
    is_sci = models.BooleanField(default=False, verbose_name='SCI收录')
    is_oa = models.BooleanField(default=False, verbose_name='是否OA期刊')

    # 运营数据
    followers = models.PositiveIntegerField(default=0, verbose_name='关注人数')
    last_update = models.DateTimeField(auto_now=True, verbose_name='最后更新')
    categories = models.ManyToManyField(JournalCategory, related_name='journals', verbose_name='所属分类')

    class Meta:
        verbose_name = '学术期刊'
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=['impact_factor']),
            models.Index(fields=['is_sci']),
        ]


class JournalMetric(models.Model):
    """期刊年度指标（时间序列数据）"""
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='metrics')
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

    # def clean(self):
    #     """额外验证：每个期刊只能有一个主版主"""
    #     if self.title == 'chief' :
    #         exists = JournalModerator.objects.filter(
    #             journal=self.journal,
    #             title='chief',
    #         ).exclude(pk=self.pk).exists()
    #         if exists:
    #             raise ValidationError('该期刊已存在活跃的主版主')


class JournalPost(ContentType):
    """支持富媒体的期刊社区帖子"""
    POST_TYPE_CHOICES = [
        ('strategy', '投稿策略'),
        ('experience', '审稿经验'),
        ('question', '学术问答'),
        ('resource', '资源分享')
    ]
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='posts')

    # 富文本内容（支持Markdown/HTML）
    content = models.TextField(verbose_name='内容')
    content_format = models.CharField(
        max_length=10,
        choices=[('md', 'Markdown'), ('html', 'HTML')],
        default='md',
        verbose_name='内容格式'
    )

    # 帖子类型与状态
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, verbose_name='帖子类型')
    status = models.CharField(
        max_length=10,
        choices=[('draft', '草稿'), ('published', '已发布'), ('archived', '归档')],
        default='draft',
        verbose_name='状态'
    )

    # 元数据
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    last_activity = models.DateTimeField(auto_now=True, verbose_name='最后活跃时间')

    class Meta:
        ordering = ['-last_activity']
        indexes = [
            models.Index(fields=['journal', 'post_type', 'status']),
            models.Index(fields=['author', 'status']),
        ]


class PostAttachment(models.Model):
    """帖子附件（图片/视频/文档）"""
    ATTACHMENT_TYPES = [
        ('image', '图片'),
        ('video', '视频'),
        ('pdf', 'PDF文档'),
        ('link', '外部链接')
    ]

    post = models.ForeignKey(JournalPost, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(
        upload_to='post_attachments/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='文件'
    )
    url = models.URLField(null=True, blank=True, verbose_name='外部链接')
    attachment_type = models.CharField(max_length=10, choices=ATTACHMENT_TYPES)
    caption = models.CharField(max_length=200, blank=True, verbose_name='描述文字')
    order = models.PositiveSmallIntegerField(default=0, verbose_name='排序权重')

    # 视频专属字段
    video_cover = models.ImageField(upload_to='video_covers/', null=True, blank=True)
    video_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name='视频时长(秒)')

    class Meta:
        ordering = ['order']