from __future__ import annotations

from functools import cached_property
from typing import Tuple

from django.db import models, transaction
from django.db.models import F, OuterRef, Subquery
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericRelation

# 你现有工程里的公共基类/模型
from api.models.user import User, DeleteModel
from api.models.content import Content  # 抽象：paper/project/competition/internship/news
from api.models.article import BasePost  # 抽象：带 GenericRelation(interactions, comments)


# ------------------------------------------------------------
# Project 分类体系
# ------------------------------------------------------------
class ProjectCategory(models.Model):
    """科研/基金/横向 项目分类。

    这里分两层含义：
    1) 项目来源/渠道（如 NSFC/科技部/教育部/地方/企业/国际合作）
    2) 项目类型（重点/重大/面上/青年/平台/联合培养等）

    为了轻量化，提供一个 name + type 的通用结构；也可按需拆为两张表。
    """

    SOURCE_CHOICES = [
        ("nsfc", "国家自然科学基金委"),
        ("most", "科技部"),
        ("moe", "教育部"),
        ("local", "地方科技厅"),
        ("enterprise", "企业合作"),
        ("international", "国际合作"),
    ]

    TYPE_CHOICES = [
        ("key", "重点项目"),
        ("major", "重大项目"),
        ("general", "面上项目"),
        ("youth", "青年基金"),
        ("platform", "平台/基地"),
        ("other", "其他"),
    ]

    name = models.CharField(max_length=100, unique=True, verbose_name="分类名称")
    source = models.CharField(max_length=32, choices=SOURCE_CHOICES, verbose_name="项目来源")
    type = models.CharField(max_length=32, choices=TYPE_CHOICES, verbose_name="项目类型")

    class Meta:
        verbose_name = "项目分类"
        verbose_name_plural = verbose_name
        ordering = ["source", "type", "name"]
        indexes = [
            models.Index(fields=["source", "type"]),
        ]

    def __str__(self) -> str:
        return f"{self.get_source_display()} · {self.get_type_display()} · {self.name}"

    @property
    def project_count(self) -> int:
        return self.projects.count()


# ------------------------------------------------------------
# Project 主体
# ------------------------------------------------------------
class Project(Content):
    """科研项目（对应你前端的正经 project 数据）。

    继承 Content（abstract），便于与其他内容统一做内容统计/权限等。
    """

    STATUS_CHOICES = [
        ("applying", "申请中"),
        ("ongoing", "进行中"),
        ("completed", "已结题"),
        ("paused", "已暂停"),
    ]

    name = models.CharField(max_length=200, db_index=True, verbose_name="项目名称")
    code = models.CharField(max_length=50, unique=True, verbose_name="项目编号")

    cover = models.URLField(blank=True, verbose_name="封面图")
    official_website = models.URLField(blank=True, verbose_name="官方网站")
    application_guide = models.URLField(blank=True, verbose_name="申报/指南链接")

    funding_agency = models.CharField(max_length=100, verbose_name="资助/主管单位")
    category = models.ForeignKey(
        ProjectCategory, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="projects", verbose_name="所属分类"
    )

    location = models.CharField(max_length=100, blank=True, verbose_name="项目所属单位/地区")
    is_cooperation = models.BooleanField(default=False, verbose_name="是否合作项目")

    # 资金相关：保留两位小数，单位：万元（或根据需要改为元）
    funding_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        verbose_name="立项经费"
    )

    # 生命周期
    start_date = models.DateField(null=True, blank=True, verbose_name="开始日期")
    end_date = models.DateField(null=True, blank=True, verbose_name="结束日期")
    sub_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applying", verbose_name="项目状态")

    # 运营/统计（也可以完全依赖 Interaction/ContentStats 做实时聚合，这里做缓存字段支持高并发）
    follower_count = models.BigIntegerField(default=0, verbose_name="关注数/收藏数")
    view_count_cache = models.BigIntegerField(default=0, verbose_name="浏览量缓存")
    last_update = models.DateTimeField(auto_now=True, verbose_name="最后更新")


    class Meta:
        verbose_name = "科研项目"
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["sub_status"]),
            models.Index(fields=["status", "start_date"]),
            models.Index(fields=["funding_agency"]),
            models.Index(fields=["is_cooperation"]),
        ]

    def save(self, *args, **kwargs):
        self.content_type = 'project'
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.name}({self.code})"

    def clean(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError("结束日期不得早于开始日期")

    @cached_property
    def duration_days(self) -> int | None:
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days
        return None

    @property
    def today_updates(self) -> int:
        """今日更新数量：统计今天产生的帖子/动态（示例依赖 ProjectPost）。"""
        today = timezone.localdate()
        return self.posts.filter(created_time__date=today).count()


# ------------------------------------------------------------
# Project 年度量化指标（可选）
# ------------------------------------------------------------
class ProjectMetric(models.Model):
    """项目年度指标：预算执行/里程碑/产出等（按需裁剪）。"""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="metrics", db_index=True)
    year = models.PositiveSmallIntegerField(verbose_name="年份")

    # 示例指标
    duration_weeks = models.PositiveSmallIntegerField(verbose_name="周期(周)")
    participants = models.PositiveIntegerField(default=0, verbose_name="参与人数")
    budget_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="执行经费(万元)")
    outputs = models.PositiveIntegerField(default=0, verbose_name="阶段产出(论文/专利等数量)")

    class Meta:
        unique_together = ("project", "year")
        ordering = ["-year"]
        indexes = [
            models.Index(fields=["project", "-year"]),
        ]
        verbose_name = "项目年度指标"
        verbose_name_plural = verbose_name


# ------------------------------------------------------------
# Project 论坛/社区角色（用于你前端展示的“项目负责人/项目骨干/版主”等）
# ------------------------------------------------------------
class ProjectModerator(models.Model):
    ROLE_CHOICES = [
        ("pi", "项目负责人"),
        ("core", "项目骨干"),
        ("moderator", "社区版主"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="moderators")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="moderator", verbose_name="角色")
    is_active = models.BooleanField(default=True, verbose_name="是否在职/有效")

    class Meta:
        unique_together = ("project", "user")
        indexes = [
            models.Index(fields=["project", "role"]),
        ]
        verbose_name = "项目角色/版主"
        verbose_name_plural = verbose_name

    def clean(self):
        # 每个项目最多 1 位 PI（项目负责人）
        if self.role == "pi":
            exists = ProjectModerator.objects.filter(
                project=self.project, role="pi", is_active=True
            ).exclude(pk=self.pk).exists()
            if exists:
                raise ValidationError("该项目已存在活跃的项目负责人(PI)")


# ------------------------------------------------------------
# Project 帖子（继承你已有的 BasePost）
# ------------------------------------------------------------
class ProjectPost(BasePost):
    SUB_POST_TYPE_CHOICES = [
        ("strategy", "申报/管理攻略"),
        ("experience", "经验分享"),
        ("question", "问答"),
        ("resource", "资源分享"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="posts", verbose_name="所属项目")

    # 细分帖子类型 + 运营位
    sub_post_type = models.CharField(max_length=20, choices=SUB_POST_TYPE_CHOICES, verbose_name="帖子类型")
    is_hot = models.BooleanField(default=False, verbose_name="热门")

    # 高并发下的缓存计数（可选）
    collect_count = models.BigIntegerField(default=0, verbose_name="收藏数")
    recommend_count = models.BigIntegerField(default=0, verbose_name="推荐数")
    comment_count_cache = models.BigIntegerField(default=0, verbose_name="评论数缓存")

    # 为方便按活跃度排序
    last_activity = models.DateTimeField(auto_now=True, verbose_name="最后活跃时间")

    class Meta:
        ordering = ["-last_activity"]
        indexes = [
            models.Index(fields=["project", "post_type", "post_status"]),
            models.Index(fields=["creator", "post_status"]),
            models.Index(fields=["is_hot", "-last_activity"]),
        ]
        verbose_name = "项目帖子"
        verbose_name_plural = verbose_name

    def save(self, *args, **kwargs):
        # 固定归类到 project 频道
        self.post_type = "project"
        super().save(*args, **kwargs)

    @property
    def comment_count(self) -> int:
        # 优先返回缓存，缺失则实时计算
        return self.comment_count_cache or self.comments.count()


class ProjectPostAttachment(models.Model):
    """帖子附件（图片/视频/文档/链接）。"""

    ATTACHMENT_TYPES = [
        ("image", "图片"),
        ("video", "视频"),
        ("pdf", "PDF文档"),
        ("doc", "Office文档"),
        ("link", "外部链接"),
    ]

    post = models.ForeignKey(ProjectPost, on_delete=models.CASCADE, related_name="attachments")

    file = models.FileField(upload_to="project_attachments/%Y/%m/", null=True, blank=True, verbose_name="文件")
    url = models.URLField(null=True, blank=True, verbose_name="外部链接")
    attachment_type = models.CharField(max_length=10, choices=ATTACHMENT_TYPES, verbose_name="附件类型")
    caption = models.CharField(max_length=200, blank=True, verbose_name="描述")
    order = models.PositiveSmallIntegerField(default=0, verbose_name="排序")

    # 视频专属
    video_cover = models.ImageField(upload_to="project_video_covers/", null=True, blank=True, verbose_name="视频封面")
    video_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name="视频时长(秒)")

    class Meta:
        ordering = ["order"]
        indexes = [
            models.Index(fields=["post", "order"]),
        ]
        verbose_name = "项目帖子附件"
        verbose_name_plural = verbose_name


# ------------------------------------------------------------
# 常用查询示例（便于服务层/ViewSet 调用）
# ------------------------------------------------------------
class ProjectQuerySet(models.QuerySet):
    def applying(self):
        return self.filter(sub_status="applying")

    def ongoing(self):
        return self.filter(sub_status="ongoing")

    def completed(self):
        return self.filter(sub_status="completed")

    def by_agency(self, agency: str):
        return self.filter(funding_agency=agency)

    def coop(self, yes: bool = True):
        return self.filter(is_cooperation=yes)


Project.add_to_class("objects", models.Manager.from_queryset(ProjectQuerySet)())


# ------------------------------------------------------------
# 计数原子更新工具（可在 Service/Signal 中调用）
# ------------------------------------------------------------
class ProjectCounters:
    @staticmethod
    def inc_view(project: Project, step: int = 1) -> None:
        Project.objects.filter(pk=project.pk).update(view_count_cache=F("view_count_cache") + step)

    @staticmethod
    def inc_followers(project: Project, step: int = 1) -> None:
        Project.objects.filter(pk=project.pk).update(follower_count=F("follower_count") + step)


# 备注：
# - Interaction/Comment 通用表请沿用你现有实现（GenericForeignKey）。
# - 如需与 ContentStats 绑定，可在创建 Project 时同步创建一条统计记录，或在首次读取时 get_or_create。
# - 管理后台可为 Project/ProjectPost/ProjectCategory/ProjectModerator/ProjectMetric 注册 ModelAdmin。
