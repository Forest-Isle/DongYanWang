from rest_framework import serializers
from api.models.skill import (
    Skill, SkillPost, SkillCategory, SkillModerator, SkillPostAttachment
)


class SkillCategorySerializer(serializers.ModelSerializer):
    skills_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = SkillCategory
        fields = ["id", "category_type", "name", "skills_count", "popular_count", "last_update"]


class SkillSerializer(serializers.ModelSerializer):
    categories = SkillCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Skill
        fields = [
            "id", "name", "cover", "skill_type", "difficulty", "description",
            "view_count", "followers", "last_update",
            "is_hot_top", "is_general_software", "is_recommended", "categories"
        ]


class SkillModeratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = SkillModerator
        fields = ["id", "skill", "user", "title", "is_active"]


class SkillPostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillPostAttachment
        fields = "__all__"


class SkillPostSerializer(serializers.ModelSerializer):
    attachments = SkillPostAttachmentSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField(read_only=True)
    skill_name = serializers.CharField(source="skill.name", read_only=True)

    class Meta:
        model = SkillPost
        fields = [
            "id", "skill", "skill_name", "title", "creator",
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



