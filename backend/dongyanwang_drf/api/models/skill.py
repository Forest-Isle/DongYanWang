from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from api.models.user import User, DeleteModel
from api.models.content import Content
from api.models.article import BasePost


class SkillCategory(models.Model):
    """技能分类（可用于学科、仪器类别、大学学科等）"""
    CATEGORY_TYPE_CHOICES = [
        ("subject", "学科分类"),
        ("instrument", "仪器类别"),
        ("academic", "大学学科"),
    ]

    category_type = models.CharField(
        max_length=20,
        choices=CATEGORY_TYPE_CHOICES,
        verbose_name="分类类型",
        db_index=True
    )
    name = models.CharField(max_length=100, verbose_name="分类名称", db_index=True)

    # 附加信息（可选）
    skill_count = models.PositiveIntegerField(default=0, verbose_name="技能数缓存")
    popular_count = models.PositiveIntegerField(default=0, verbose_name="热门技能数缓存")
    last_update = models.DateField(default=timezone.now, verbose_name="最近更新")

    class Meta:
        verbose_name = "技能分类"
        verbose_name_plural = verbose_name
        unique_together = ("category_type", "name")
        ordering = ["category_type", "name"]

    def clean(self):
        """防止同类型分类重名"""
        if SkillCategory.objects.filter(
            category_type=self.category_type,
            name=self.name
        ).exclude(pk=self.pk).exists():
            raise ValidationError("同类型分类已存在相同名称")

    @property
    def skills_count(self):
        return self.skills.count()

    @property
    def latest_skills(self):
        """获取最近更新的技能"""
        return self.skills.order_by("-last_update")[:5]


class Skill( Content):
    """技能（软件、方法、设备等）"""
    SKILL_TYPE_CHOICES = [
        ("software", "软件"),
        ("method", "方法"),
        ("device", "设备"),
    ]
    DIFFICULTY_CHOICES = [
        ("beginner", "入门"),
        ("intermediate", "中级"),
        ("advanced", "高级"),
    ]

    name = models.CharField(max_length=200, verbose_name="技能名称", db_index=True)
    cover = models.URLField(verbose_name="封面图", blank=True, null=True)
    skill_type = models.CharField(max_length=20, choices=SKILL_TYPE_CHOICES, verbose_name="技能类型")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, verbose_name="难度")
    description = models.TextField(verbose_name="简介", blank=True)

    categories = models.ManyToManyField(SkillCategory, related_name="skills", verbose_name="所属分类")

    # 运营数据
    view_count = models.BigIntegerField(default=0, verbose_name="浏览数")
    followers = models.BigIntegerField(default=0, verbose_name="关注人数")
    last_update = models.DateTimeField(auto_now=True, verbose_name="最后更新")

    is_hot_top = models.BooleanField(default=False, verbose_name="置顶热门")
    is_general_software = models.BooleanField(default=False, verbose_name="是否通用软件")
    is_recommended = models.BooleanField(default=False, verbose_name="是否推荐")

    class Meta:
        verbose_name = "技能"
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=["name", "skill_type"]),
            models.Index(fields=["is_hot_top"]),
        ]

    def save(self, *args, **kwargs):
        self.content_type = "skill"
        super().save(*args, **kwargs)


class SkillModerator(models.Model):
    """技能板块版主"""
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="moderators")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
    title = models.CharField(
        max_length=20,
        choices=[
            ("chief", "主版主"),
            ("deputy", "副版主"),
        ],
        verbose_name="职位类型"
    )
    is_active = models.BooleanField(default=True, verbose_name="是否在职")

    class Meta:
        unique_together = ("skill", "user")
        verbose_name = "技能版主"
        verbose_name_plural = "技能版主"

    def clean(self):
        if self.title == "chief":
            exists = SkillModerator.objects.filter(
                skill=self.skill,
                title="chief",
                is_active=True
            ).exclude(pk=self.pk).exists()
            if exists:
                raise ValidationError("该技能已有活跃的主版主")


class SkillPost(BasePost):
    """技能社区帖子"""
    POST_TYPE_CHOICES = [
        ("guide", "使用指南"),
        ("experience", "使用体验"),
        ("question", "问答"),
        ("resource", "资源分享"),
    ]
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="posts")
    sub_post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, verbose_name="帖子类型")
    is_hot = models.BooleanField(default=False, verbose_name="热门帖子")

    collect_count = models.BigIntegerField(default=0, verbose_name="收藏数")
    recommend_count = models.BigIntegerField(default=0, verbose_name="推荐数")
    comment_count_cache = models.BigIntegerField(default=0, verbose_name="评论数缓存")

    class Meta:
        ordering = ["-created_time"]

    def save(self, *args, **kwargs):
        # 固定 post_type 为 journal
        self.post_type = 'skill'
        super().save(*args, **kwargs)

    @property
    def comment_count(self):
        return self.comment_count_cache or self.comments.count()

class SkillPostAttachment(models.Model):
    """
    帖子附件（图片、视频、文档等）
    """
    post = models.ForeignKey(SkillPost, on_delete=models.CASCADE, related_name="attachments")
    file_url = models.URLField()
    file_type = models.CharField(max_length=20)  # image/video/pdf/link
    uploaded_at = models.DateTimeField(auto_now_add=True)