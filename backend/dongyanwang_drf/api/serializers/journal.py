from rest_framework import serializers
from api.models.journal import (
    Journal, JournalMetric, JournalPost,
    JournalCategory, JournalModerator, JournalPostAttachment
)
from api.models.content import ContentStats


class JournalMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalMetric
        fields = "__all__"


class JournalCategorySerializer(serializers.ModelSerializer):
    journal_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = JournalCategory
        fields = ["id", "name", "journal_count"]


class JournalPostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalPostAttachment
        fields = "__all__"
        read_only_fields = ["id"]


class JournalSerializer(serializers.ModelSerializer):
    metrics = JournalMetricSerializer(many=True, read_only=True)
    categories = JournalCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Journal
        fields = [
            "id", "name", "issn", "cover", "publisher", "journal_url",
            "is_sci", "is_oa", "last_update", "categories", "metrics",
            "current_impact_factor", "current_quartile",
        ]


class JournalModeratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = JournalModerator
        fields = ["id", "journal", "user", "title", "is_active"]


class JournalPostSerializer(serializers.ModelSerializer):
    attachments = JournalPostAttachmentSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField(read_only=True)
    journal_name = serializers.CharField(source="journal.name", read_only=True)

    class Meta:
        model = JournalPost
        fields = [
            "id", "journal", "journal_name", "title", "creator",
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


class ContentStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentStats
        fields = ["id", "content_type", "object_id", "view_count", "like_count"]
        read_only_fields = ["id"]




