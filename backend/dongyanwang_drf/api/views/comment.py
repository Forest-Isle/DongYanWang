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
from api.models.article import Interaction


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("user").all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filterset_fields = ["content_type", "object_id", "root", "parent"]

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """评论点赞/取消点赞"""
        comment = self.get_object()

        # 判断当前用户是否已经点赞
        user_has_liked = Interaction.objects.filter(
            user=request.user,
            object_id=comment.id,
            content_type=ContentType.objects.get_for_model(Comment),
            interaction_type="like"
        ).exists()

        if user_has_liked:
            # 取消点赞
            Interaction.objects.filter(
                user=request.user,
                object_id=comment.id,
                content_type=ContentType.objects.get_for_model(Comment),
                interaction_type="like"
            ).delete()
            Comment.objects.filter(pk=comment.pk).update(like_count=F("like_count") - 1)
            return Response({"detail": "取消点赞成功"}, status=200)

        # 点赞
        Interaction.objects.create(
            user=request.user,
            object_id=comment.id,
            content_type=ContentType.objects.get_for_model(Comment),
            interaction_type="like"
        )
        Comment.objects.filter(pk=comment.pk).update(like_count=F("like_count") + 1)
        return Response({"detail": "点赞成功"}, status=201)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def report(self, request, pk=None):
        """举报评论"""
        comment = self.get_object()
        interaction, created = Interaction.objects.get_or_create(
            user=request.user,
            object_id=comment.id,
            content_type=ContentType.objects.get_for_model(Comment),
            interaction_type="report"
        )
        if not created:
            return Response({"detail": "已经举报过了"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "举报成功"}, status=status.HTTP_201_CREATED)

