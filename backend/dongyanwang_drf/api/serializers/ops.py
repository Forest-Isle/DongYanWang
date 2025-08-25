# api/serializers/ops.py
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from ..models.ops import Moderation, WebhookConfig, HotRankSnapshot
from api.models.competition import CompetitionPost

class ModerationSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(slug_field="model", queryset=ContentType.objects.all())
    class Meta:
        model = Moderation
        fields = ["id", "operator", "status", "reason", "created_at", "content_type", "object_id"]
        read_only_fields = ["id", "operator", "created_at"]

class WebhookConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookConfig
        fields = "__all__"

class HotItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    score = serializers.FloatField()
    title = serializers.CharField()
    post_type = serializers.CharField()
    creator_username = serializers.CharField()