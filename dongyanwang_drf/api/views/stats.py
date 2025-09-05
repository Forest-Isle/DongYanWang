# api/views/stats.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.db.models import F

from api.models.content import ContentStats  # 或你的实际路径
from api.serializers.stats import ContentStatsSerializer

class ContentStatsViewSet(viewsets.GenericViewSet):
    queryset = ContentStats.objects.all()
    serializer_class = ContentStatsSerializer
    permission_classes = [AllowAny]  # 浏览计数可放开，或使用更细粒度中间件

    @action(detail=False, methods=["post"])
    def touch_view(self, request):
        """
        浏览 +1： {content_type: id, object_id: id}
        """
        ct_id = request.data.get("content_type")
        obj_id = request.data.get("object_id")
        if not (ct_id and obj_id):
            return Response({"detail": "参数不完整"}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            stats, _ = ContentStats.objects.get_or_create(content_type_id=ct_id, object_id=obj_id)
            ContentStats.objects.filter(pk=stats.pk).update(view_count=F("view_count") + 1)
        return Response({"detail": "ok"})