# api/models/ops.py
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Moderation(models.Model):
    """
    针对任意内容对象的运营审核/封禁记录（保留流水）
    """
    STATUS_CHOICES = [
        ("approved", "通过"),
        ("rejected", "拒绝"),
        ("banned", "封禁"),
        ("unbanned", "解禁"),
    ]
    operator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="moderations")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    reason = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    # 任意对象
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id", "-created_at"]),
        ]
        ordering = ["-created_at"]


class WebhookConfig(models.Model):
    """
    运营事件的 Webhook 配置（按事件类型）
    """
    EVENT_CHOICES = [
        ("post_review", "帖子审核"),
        ("post_ban", "帖子封禁"),
        ("mod_removed", "移除版主"),
        ("export_done", "导出完成"),
    ]
    name = models.CharField(max_length=64)
    event = models.CharField(max_length=32, choices=EVENT_CHOICES)
    url = models.URLField()
    secret = models.CharField(max_length=128, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class WebhookEventLog(models.Model):
    """
    Webhook 发送流水
    """
    event = models.CharField(max_length=32)
    url = models.URLField()
    payload = models.JSONField()
    status_code = models.PositiveSmallIntegerField(null=True, blank=True)
    success = models.BooleanField(default=False)
    response_text = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)


class HotRankSnapshot(models.Model):
    """
    可选：定时把 Redis 热度刷入数据库做留档、离线报表
    """
    model_label = models.CharField(max_length=64)  # 如 "competitionpost"
    object_id = models.PositiveIntegerField()
    score = models.FloatField()
    rank = models.PositiveIntegerField()  # 当时名次
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["model_label", "-created_at"]),
        ]

