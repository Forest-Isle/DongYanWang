# api/models/ops.py
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

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
    - 可启用/禁用
    - 可附加 secret 用于验证
    """
    EVENT_CHOICES = [
        ("post_review", "帖子审核"),
        ("post_ban", "帖子封禁"),
        ("mod_removed", "移除版主"),
        ("export_done", "导出完成"),
        # 可以在未来继续扩展
    ]

    name = models.CharField(max_length=64, help_text="Webhook 配置名称，便于识别")
    event = models.CharField(
        max_length=32,
        choices=EVENT_CHOICES,
        help_text="绑定的事件类型"
    )
    url = models.URLField(help_text="Webhook 接收 URL")
    secret = models.CharField(
        max_length=128,
        blank=True,
        default="",
        help_text="可选的密钥，用于验证请求"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="是否启用该 Webhook"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="创建时间"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="更新时间"
    )

    class Meta:
        verbose_name = "Webhook 配置"
        verbose_name_plural = "Webhook 配置"
        unique_together = ("event", "url")  # 同一事件不允许重复 URL

    def __str__(self):
        return f"{self.name} ({self.event})"

    @classmethod
    def trigger_event(cls, event_name: str, payload: dict):
        """
        调用已激活的 Webhook 配置
        """
        from ..tasks import send_webhook
        qs = cls.objects.filter(event=event_name, is_active=True)
        for cfg in qs:
            send_webhook.delay(event_name, payload)


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

class WebhookEventLog(models.Model):
    event = models.CharField(max_length=64)
    url = models.URLField()
    payload = models.JSONField()
    status_code = models.IntegerField(null=True, blank=True)
    success = models.BooleanField()
    response_text = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)


class ConsultationService(models.Model):
    """
    付费咨询服务：由已认证/授权用户发起，支持按时长、每次计费。
    """
    PRICING_UNIT_CHOICES = [
        ("per_hour", "按小时"),
        ("per_session", "按次")
    ]

    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultation_services")
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pricing_unit = models.CharField(max_length=16, choices=PRICING_UNIT_CHOICES, default="per_hour")
    is_verified = models.BooleanField(default=False, help_text="是否已通过平台认证/授权")
    is_active = models.BooleanField(default=True)
    rating = models.FloatField(default=0)
    rating_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["provider", "is_active"]),
            models.Index(fields=["-rating", "-rating_count"]),
        ]
        verbose_name = "咨询服务"
        verbose_name_plural = verbose_name


class ConsultationOrder(models.Model):
    """
    咨询订单：用户向服务提供者发起预约。
    """
    STATUS_CHOICES = [
        ("pending", "待确认"),
        ("confirmed", "已确认"),
        ("completed", "已完成"),
        ("cancelled", "已取消"),
        ("refunded", "已退款"),
    ]

    service = models.ForeignKey(ConsultationService, on_delete=models.CASCADE, related_name="orders")
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultation_orders")
    note = models.CharField(max_length=255, blank=True, default="")
    scheduled_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=60)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["buyer", "status"]),
            models.Index(fields=["service", "status"]),
        ]
        verbose_name = "咨询订单"
        verbose_name_plural = verbose_name


class ConsultationApplication(models.Model):
    """
    付费咨询开通申请：用户申请成为咨询者
    """
    STATUS_CHOICES = [
        ("pending", "待审核"),
        ("approved", "已通过"),
        ("rejected", "已拒绝"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultation_applications")
    bio = models.TextField(blank=True, default="", verbose_name="个人简介")
    sample_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="示例价格")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", verbose_name="审核状态")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="申请时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        unique_together = ("user",)  # 每个用户只能申请一次
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["status", "created_at"]),
        ]
        verbose_name = "咨询申请"
        verbose_name_plural = verbose_name
