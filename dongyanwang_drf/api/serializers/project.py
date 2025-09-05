from rest_framework import serializers
from api.models.project import (
    Project, ProjectMetric, ProjectPost,
    ProjectCategory, ProjectModerator, ProjectPostAttachment,
    ProjectEnrollment
)
from api.models.project import ProjectQuerySet


class ProjectMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMetric
        fields = "__all__"


class ProjectCategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ProjectCategory
        fields = ["id", "name", "source", "type", "project_count"]


class ProjectPostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectPostAttachment
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    metrics = ProjectMetricSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "name", "code", "cover", "official_website", "application_guide",
            "funding_agency", "category", "location", "is_cooperation",
            "funding_amount", "start_date", "end_date", "sub_status",
            "follower_count", "view_count_cache", "last_update",
            "metrics",
        ]


class ProjectModeratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ProjectModerator
        fields = ["id", "project", "user", "role", "is_active"]


class ProjectPostSerializer(serializers.ModelSerializer):
    attachments = ProjectPostAttachmentSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField(read_only=True)
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = ProjectPost
        fields = [
            "id", "project", "project_name", "title", "creator",
            "sub_post_type", "content", "content_format", "post_status",
            "created_time", "updated_time", "is_hot", "collect_count",
            "recommend_count", "comment_count_cache", "attachments", "last_activity"
        ]
        read_only_fields = [
            "creator", "created_time", "updated_time",
            "collect_count", "recommend_count", "comment_count_cache", "last_activity"
        ]

    def create(self, validated_data):
        validated_data["creator"] = self.context["request"].user
        # Post类初始状态为draft，发布后变为pending
        validated_data.setdefault("post_status", "draft")
        return super().create(validated_data)


class ProjectEnrollmentSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    user_display = serializers.StringRelatedField(source="user", read_only=True)

    class Meta:
        model = ProjectEnrollment
        fields = [
            "id", "project", "project_name", "user", "user_display",
            "status", "motivation", "role_expectation", "created_time", "updated_time"
        ]
        read_only_fields = ["created_time", "updated_time"]


