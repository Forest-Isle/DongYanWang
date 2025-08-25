# api/serializers/competition.py
from rest_framework import serializers
from api.models.competition import (
    Competition, CompetitionMetric, CompetitionPost,
    CompetitionCategory, CompetitionModerator, CompetitionPostAttachment
)
from api.models.content import ContentStats
class CompetitionMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionMetric
        fields = "__all__"


class CompetitionCategorySerializer(serializers.ModelSerializer):
    competition_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = CompetitionCategory
        fields = ["id", "name", "competition_count"]


class CompetitionPostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionPostAttachment
        fields = "__all__"
        read_only_fields = ["id", "upload_time"]


class CompetitionSerializer(serializers.ModelSerializer):
    metrics = CompetitionMetricSerializer(many=True, read_only=True)
    categories = CompetitionCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Competition
        fields = [
            "id", "name", "cover", "official_website", "organizer", "location",
            "is_national", "is_math_contest", "is_edu_ministry",
            "followers", "last_update", "categories", "metrics",
            "current_deadline", "current_win_rate", "current_duration_days",
        ]


class CompetitionModeratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = CompetitionModerator
        fields = ["id", "competition", "user", "title", "is_active"]


class CompetitionPostSerializer(serializers.ModelSerializer):
    attachments = CompetitionPostAttachmentSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField(read_only=True)
    competition_name = serializers.CharField(source="competition.name", read_only=True)

    class Meta:
        model = CompetitionPost
        fields = [
            "id", "competition", "competition_name", "title", "creator",
            "sub_post_type", "content", "content_format", "post_status",
            "created_time", "updated_time", "is_hot", "collect_count",
            "recommend_count", "comment_count_cache", "last_activity", "attachments"
        ]
        read_only_fields = [
            "creator", "created_time", "updated_time",
            "collect_count", "recommend_count", "comment_count_cache", "last_activity"
        ]

    def create(self, validated_data):
        validated_data["creator"] = self.context["request"].user
        return super().create(validated_data)

class ContentStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentStats
        fields = ["id", "content_type", "object_id", "view_count", "like_count"]
        read_only_fields = ["id"]