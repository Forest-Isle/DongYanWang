# api/serializers/comment.py
from rest_framework import serializers
from api.models.article import Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id", "user", "content_type", "object_id", "content",
            "parent", "root", "depth", "created_time", "updated_time",
            "replies_count", "like_count"
        ]
        read_only_fields = ["user", "root", "depth", "created_time", "updated_time", "like_count"]

    def get_replies_count(self, obj):
        return obj.replies.count()

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)