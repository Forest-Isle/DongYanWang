# api/serializers/stats.py
from rest_framework import serializers
from api.models.content import ContentStats  # 如果你把 ContentStats 放在 stats.py；否则改 import
class ContentStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentStats
        fields = ["id", "content_type", "object_id", "view_count", "like_count"]
        read_only_fields = ["id"]