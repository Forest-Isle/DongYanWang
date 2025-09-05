from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from api.models.ops import ConsultationService, ConsultationOrder, ConsultationApplication, Moderation, WebhookConfig


class ConsultationServiceSerializer(serializers.ModelSerializer):
    provider_display = serializers.StringRelatedField(source="provider", read_only=True)

    class Meta:
        model = ConsultationService
        fields = [
            "id", "provider", "provider_display", "title", "description",
            "price", "pricing_unit", "is_verified", "is_active",
            "rating", "rating_count", "created_at", "updated_at",
        ]
        read_only_fields = ["rating", "rating_count", "created_at", "updated_at"]


class ConsultationOrderSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source="service.title", read_only=True)
    buyer_display = serializers.StringRelatedField(source="buyer", read_only=True)

    class Meta:
        model = ConsultationOrder
        fields = [
            "id", "service", "service_title", "buyer", "buyer_display",
            "note", "scheduled_time", "duration_minutes", "amount", "status",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ConsultationApplicationSerializer(serializers.ModelSerializer):
    user_display = serializers.StringRelatedField(source="user", read_only=True)

    class Meta:
        model = ConsultationApplication
        fields = [
            "id", "user", "user_display", "bio", "sample_price", "status",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "status"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class ModerationSerializer(serializers.ModelSerializer):
    operator_username = serializers.CharField(source="operator.username", read_only=True)

    class Meta:
        model = Moderation
        fields = [
            "id", "operator", "operator_username", "status", "reason",
            "content_type", "object_id", "created_at",
        ]
        read_only_fields = ["created_at"]


class WebhookConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookConfig
        fields = [
            "id", "name", "event", "url", "secret", "is_active",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class HotItemSerializer(serializers.Serializer):
    object_id = serializers.IntegerField()
    score = serializers.FloatField()


class PostReviewSerializer(serializers.Serializer):
    ct = serializers.CharField(help_text="content type model name, e.g. competitionpost")
    id = serializers.IntegerField()
    status = serializers.ChoiceField(choices=["approved", "rejected"])
    reason = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        ct_model = attrs["ct"].lower()
        obj_id = attrs["id"]
        try:
            ct = ContentType.objects.get(model=ct_model)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"ct": "invalid content type"})
        model = ct.model_class()
        obj = model.objects.filter(pk=obj_id).first()
        if obj is None:
            raise serializers.ValidationError({"id": "object not found"})
        attrs["_ct_obj"] = (ct, obj)
        return attrs


class PostBanSerializer(serializers.Serializer):
    ct = serializers.CharField()
    id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["ban", "unban"])
    reason = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        try:
            ct = ContentType.objects.get(model=attrs["ct"].lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"ct": "invalid content type"})
        model = ct.model_class()
        obj = model.objects.filter(pk=attrs["id"]).first()
        if obj is None:
            raise serializers.ValidationError({"id": "object not found"})
        attrs["target"] = obj
        return attrs


class AdminModeratorManageSerializer(serializers.Serializer):
    competition_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["add", "remove"])

# api/serializers/ops.py
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from ..models.ops import Moderation, WebhookConfig, HotRankSnapshot
from api.models.competition import CompetitionPost


class ModerationActionSerializer(serializers.Serializer):
    ct = serializers.CharField()
    id = serializers.IntegerField()
    action = serializers.CharField()
    reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        try:
            ct = ContentType.objects.get(model=attrs["ct"].lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError("Invalid content type")
        model = ct.model_class()
        try:
            obj = model.objects.get(pk=attrs["id"])
        except model.DoesNotExist:
            raise serializers.ValidationError("对象不存在")
        attrs["target"] = obj
        return attrs


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