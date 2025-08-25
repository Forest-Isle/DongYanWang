from rest_framework import serializers
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = "__all__"
        read_only_fields = ["user", "created_time"]

    def validate(self, attrs):
        # 基础校验：content_type + object_id 必须存在对应对象
        ct = attrs.get("content_type")
        object_id = attrs.get("object_id")
        model = ct.model_class() if isinstance(ct, ContentType) else None
        if not model or not model.objects.filter(pk=object_id).exists():
            raise serializers.ValidationError("关联对象不存在")
        return attrs