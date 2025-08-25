# api/views/interaction.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models.article import (Interaction)
from api.serializers.interaction import InteractionSerializer

class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def toggle_like(self, request):
        obj_id = request.data.get("object_id")
        ct_id = request.data.get("content_type")
        interaction, created = Interaction.objects.get_or_create(
            user=request.user,
            object_id=obj_id,
            content_type_id=ct_id,
            interaction_type="like"
        )
        if not created:
            interaction.delete()
            return Response({"detail": "取消点赞"}, status=status.HTTP_200_OK)
        return Response({"detail": "点赞成功"}, status=status.HTTP_201_CREATED)