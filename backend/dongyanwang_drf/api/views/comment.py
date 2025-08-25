# api/views/comment.py
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.db.models import F

from api.services.pagination import StandardResultsSetPagination
from api.serializers.comment import CommentSerializer
from api.models.article import Comment
from api.services.permissions import IsOwnerOrReadOnly

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("user").all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filterset_fields = ["content_type", "object_id", "root", "parent"]

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """评论点赞计数（简单实现）"""
        comment = self.get_object()
        Comment.objects.filter(pk=comment.pk).update(like_count=F("like_count") + 1)
        return Response({"detail": "ok"})

