from rest_framework import serializers
from api.models.admissions import (
    Admissions, AdmissionsMetric, AdmissionsPost,
    AdmissionsCategory, AdmissionsModerator, AdmissionsPostAttachment
)


class AdmissionsMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionsMetric
        fields = "__all__"


class AdmissionsCategorySerializer(serializers.ModelSerializer):
    admissions_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = AdmissionsCategory
        fields = ["id", "name", "admissions_count", "id"]


class AdmissionsPostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionsPostAttachment
        fields = "__all__"


class AdmissionsSerializer(serializers.ModelSerializer):
    metrics = AdmissionsMetricSerializer(many=True, read_only=True)
    categories = AdmissionsCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Admissions
        fields = [
            "id", "name", "application_url", "location", "organizer", "cover",
            "is_scholarship", "is_competitive", "last_update", "scholarship_amount",
            "sub_status", "categories", "metrics",
            "current_acceptance_rate", "current_duration",
        ]


class AdmissionsModeratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = AdmissionsModerator
        fields = ["id", "admissions", "user", "title", "is_active"]


class AdmissionsPostSerializer(serializers.ModelSerializer):
    attachments = AdmissionsPostAttachmentSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField(read_only=True)
    admissions_name = serializers.CharField(source="admissions.name", read_only=True)

    class Meta:
        model = AdmissionsPost
        fields = [
            "id", "admissions", "admissions_name", "title", "creator",
            "sub_post_type", "content", "content_format", "post_status",
            "created_time", "updated_time", "is_hot", "collect_count",
            "recommend_count", "comment_count_cache", "attachments"
        ]
        read_only_fields = [
            "creator", "created_time", "updated_time",
            "collect_count", "recommend_count", "comment_count_cache"
        ]

    def create(self, validated_data):
        validated_data["creator"] = self.context["request"].user
        # Post类初始状态为draft，发布后变为pending
        validated_data.setdefault("post_status", "draft")
        return super().create(validated_data)


