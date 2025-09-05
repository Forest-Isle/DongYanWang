# api/serializers/comment.py
from rest_framework import serializers
from api.models.article import Comment
from django.contrib.contenttypes.models import ContentType

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    replies_count = serializers.SerializerMethodField()
    target_type = serializers.CharField(write_only=True)  # 前端直接传字符串

    class Meta:
        model = Comment
        fields = [
            "id", "user", "content_type", "object_id", "content",
            "parent", "root", "depth", "created_time", "updated_time",
            "replies_count", "like_count", "target_type",
        ]
        read_only_fields = ["user", "root", "depth", "created_time", "updated_time", "like_count", "content_type"]

    def validate(self, attrs):
        target_type = attrs.pop("target_type", None)
        if not target_type:
            raise serializers.ValidationError({"target_type": "This field is required."})
        try:
            attrs["content_type"] = ContentType.objects.get(model=target_type.lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"target_type": f"Invalid type: {target_type}"})
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    def get_replies_count(self, obj):
        return obj.replies.count()


