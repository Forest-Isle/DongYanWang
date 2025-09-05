# api/views/interaction.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models.article import (Interaction)
from api.serializers.interaction import InteractionSerializer
from django.contrib.contenttypes.models import ContentType
class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def _toggle_or_create(self, request, interaction_type):
        """通用的交互逻辑"""
        obj_id = request.data.get("object_id")
        target_type = request.data.get("target_type")  # e.g. "competitionpost"

        if not obj_id or not target_type:
            return Response({"error": "缺少参数"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ct = ContentType.objects.get(model=target_type.lower())
        except ContentType.DoesNotExist:
            return Response({"error": "无效的 target_type"}, status=status.HTTP_400_BAD_REQUEST)

        # toggle 类型（like/collect）
        if interaction_type in ["like", "collect"]:
            interaction, created = Interaction.objects.get_or_create(
                user=request.user,
                object_id=obj_id,
                content_type=ct,
                interaction_type=interaction_type,
            )
            if not created:  # 已存在 → 取消
                interaction.delete()
                return Response({"detail": f"取消{interaction_type}"}, status=status.HTTP_200_OK)
            return Response({"detail": f"{interaction_type} 成功"}, status=status.HTTP_201_CREATED)

        # 一次性类型（view/share/report）
        Interaction.objects.create(
            user=request.user,
            object_id=obj_id,
            content_type=ct,
            interaction_type=interaction_type,
        )
        return Response({"detail": f"{interaction_type} 记录成功"}, status=status.HTTP_201_CREATED)

    # ========== actions ==========
    @action(detail=False, methods=["post"])
    def toggle_like(self, request):
        return self._toggle_or_create(request, "like")

    @action(detail=False, methods=["post"])
    def toggle_collect(self, request):
        return self._toggle_or_create(request, "collect")

    @action(detail=False, methods=["post"])
    def view(self, request):
        return self._toggle_or_create(request, "view")

    @action(detail=False, methods=["post"])
    def share(self, request):
        return self._toggle_or_create(request, "share")

    @action(detail=False, methods=["post"])
    def report(self, request):
        return self._toggle_or_create(request, "report")