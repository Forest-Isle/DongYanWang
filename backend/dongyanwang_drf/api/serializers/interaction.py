from rest_framework import serializers
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType

class InteractionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    target_type = serializers.CharField(write_only=True)  # 前端直接传字符串

    class Meta:
        model = Interaction
        fields = "__all__"
        read_only_fields = ["user", "created_time", "content_type"]

    def validate(self, attrs):
        # 处理 target_type -> content_type
        target_type = attrs.pop("target_type", None)
        if not target_type:
            raise serializers.ValidationError({"target_type": "This field is required."})

        try:
            attrs["content_type"] = ContentType.objects.get(model=target_type.lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"target_type": f"Invalid target_type: {target_type}"})

        # 校验 object_id 对应对象存在
        object_id = attrs.get("object_id")
        model = attrs["content_type"].model_class()
        if not model.objects.filter(pk=object_id).exists():
            raise serializers.ValidationError({"object_id": "关联对象不存在"})

        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)