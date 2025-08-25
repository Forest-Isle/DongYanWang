# api/views/competition.py

from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from api.services.pagination import StandardResultsSetPagination
from api.services.permissions import IsOwnerOrReadOnly, IsModeratorOrReadOnly
from api.models.competition import (
    Competition, CompetitionPost, CompetitionCategory,
    CompetitionMetric, CompetitionModerator, CompetitionPostAttachment
)
from api.serializers.competition import (
    CompetitionSerializer, CompetitionPostSerializer, CompetitionCategorySerializer,
    CompetitionMetricSerializer, CompetitionModeratorSerializer, CompetitionPostAttachmentSerializer
)
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.db.models import F

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all().prefetch_related("categories", "metrics")
    serializer_class = CompetitionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "organizer", "location"]
    ordering_fields = ["last_update", "followers"]
    filterset_fields = {
        "is_national": ["exact"],
        "is_math_contest": ["exact"],
        "is_edu_ministry": ["exact"],
        "categories__name": ["exact", "in"],
        "status": ["exact", "in"]
    }

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        """关注/取关竞赛（收藏维度），用 Interaction.collect 表示"""
        competition = self.get_object()
        ct = ContentType.objects.get_for_model(Competition)
        qs = Interaction.objects.filter(
            user=request.user, content_type=ct, object_id=competition.id, interaction_type="collect"
        )
        if qs.exists():
            qs.delete()
            # 同步 followers 计数（可选，或交给定时任务/信号）
            Competition.objects.filter(pk=competition.pk).update(followers=F("followers") - 1)
            return Response({"detail": "已取消关注"}, status=status.HTTP_200_OK)
        Interaction.objects.create(
            user=request.user, content_type=ct, object_id=competition.id, interaction_type="collect"
        )
        Competition.objects.filter(pk=competition.pk).update(followers=F("followers") + 1)
        return Response({"detail": "关注成功"}, status=status.HTTP_201_CREATED)


class CompetitionCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CompetitionCategory.objects.annotate(
        competition_count=Count("competitions")
    )
    serializer_class = CompetitionCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class CompetitionMetricViewSet(viewsets.ModelViewSet):
    queryset = CompetitionMetric.objects.select_related("competition").all()
    serializer_class = CompetitionMetricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["competition", "year"]
    ordering_fields = ["year", "registration_deadline"]


class CompetitionPostViewSet(viewsets.ModelViewSet):
    queryset = CompetitionPost.objects.select_related("competition", "creator").all()
    serializer_class = CompetitionPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "competition": ["exact"],
        "sub_post_type": ["exact", "in"],
        "post_status": ["exact", "in"],
        "creator": ["exact"],
        "is_hot": ["exact"]
    }
    search_fields = ["title", "content"]
    ordering_fields = ["last_activity", "collect_count", "recommend_count", "created_time"]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        ct = ContentType.objects.get_for_model(CompetitionPost)
        inter, created = Interaction.objects.get_or_create(
            user=request.user, content_type=ct, object_id=post.id, interaction_type="like"
        )
        if not created:
            inter.delete()
            return Response({"detail": "取消点赞"}, status=status.HTTP_200_OK)
        return Response({"detail": "点赞成功"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def collect(self, request, pk=None):
        post = self.get_object()
        ct = ContentType.objects.get_for_model(CompetitionPost)
        inter, created = Interaction.objects.get_or_create(
            user=request.user, content_type=ct, object_id=post.id, interaction_type="collect"
        )
        if not created:
            inter.delete()
            return Response({"detail": "取消收藏"}, status=status.HTTP_200_OK)
        return Response({"detail": "收藏成功"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticatedOrReadOnly])
    def view(self, request, pk=None):
        """浏览计数（无登录也可记一次，可在中间件里做去重，这里做最简版）"""
        post = self.get_object()
        ct = ContentType.objects.get_for_model(CompetitionPost)
        # 记录一条 view（可选：对匿名 user 用 UA/IP 做幂等）
        Interaction.objects.create(
            user=request.user if request.user.is_authenticated else None,
            content_type=ct, object_id=post.id, interaction_type="view"
        )
        return Response({"detail": "ok"}, status=status.HTTP_201_CREATED)


class CompetitionPostAttachmentViewSet(viewsets.ModelViewSet):
    queryset = CompetitionPostAttachment.objects.select_related("post").all()
    serializer_class = CompetitionPostAttachmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post", "attachment_type"]
    ordering_fields = ["order", "upload_time"]

    def perform_create(self, serializer):
        # 校验上传者为帖子作者或版主
        post = serializer.validated_data["post"]
        user = self.request.user
        if (post.creator != user and
            not post.competition.moderators.filter(user=user, is_active=True).exists()):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("无权限为该帖子添加附件")
        serializer.save()


class CompetitionModeratorViewSet(viewsets.ModelViewSet):
    queryset = CompetitionModerator.objects.select_related("competition", "user").all()
    serializer_class = CompetitionModeratorSerializer
    permission_classes = [IsAuthenticated]  # 实际生产建议仅管理员可改
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["competition", "title", "is_active"]
    ordering_fields = ["id"]