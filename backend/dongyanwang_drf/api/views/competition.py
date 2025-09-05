# api/views/competition.py
from django.db.models import Count,Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Prefetch
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
from django.utils import timezone
from datetime import timedelta

class CompetitionViewSet(viewsets.ModelViewSet):

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

    def get_queryset(self):
        queryset = Competition.objects.prefetch_related("categories", "metrics")
        user = self.request.user

        # 管理员可以看到所有竞赛
        if user.is_staff:
            return queryset.prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=CompetitionModerator.objects.select_related('user')
                )
            )

        # 用户是版主，能看到自己管理的竞赛
        moderator_competitions = CompetitionModerator.objects.filter(
            user=user, is_active=True
        ).values_list("competition_id", flat=True)

        if moderator_competitions.exists():
            return queryset.filter(
                Q(status=2) | Q(id__in=moderator_competitions)
            ).prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=CompetitionModerator.objects.select_related('user')
                )
            )

        # 普通用户只能看到审核通过的竞赛
        return queryset.filter(status=2).prefetch_related(
            Prefetch(
                'moderators',
                queryset=CompetitionModerator.objects.select_related('user')
            )
        )
    def perform_create(self, serializer):
        # 新建时自动加创建者为版主，并默认 status=待审核
        competition = serializer.save(status=1)  # 1=待审核
        # 创建主版主
        CompetitionModerator.objects.create(
            competition=competition,
            user=self.request.user,
            title='chief'
        )

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

    def get_queryset(self):
        queryset = CompetitionPost.objects.select_related("competition", "creator")

        user = self.request.user
        # 管理员或者版主可以看到所有帖子
        if user.is_staff:
            return queryset
        # 检查用户是否是任何竞赛的版主
        moderator_competitions = CompetitionModerator.objects.filter(
            user=user, is_active=True
        ).values_list("competition_id", flat=True)
        if moderator_competitions.exists():
            return queryset.filter(
                Q(post_status='published') | Q(competition_id__in=moderator_competitions)
            )
        # 普通用户只看已发布的
        return queryset.filter(post_status='published')

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        """发布帖子：将状态从draft改为pending"""
        post = self.get_object()
        if post.creator != request.user:
            return Response({"detail": "只有作者可以发布帖子"}, status=status.HTTP_403_FORBIDDEN)
        
        if post.post_status != 'draft':
            return Response({"detail": "只有草稿状态的帖子可以发布"}, status=status.HTTP_400_BAD_REQUEST)
        
        post.post_status = 'pending'
        post.save()
        return Response({"detail": "帖子已提交审核", "post_status": post.post_status})

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
        """浏览计数（去重版）"""
        post = self.get_object()
        ct = ContentType.objects.get_for_model(CompetitionPost)
        now = timezone.now()
        window = now - timedelta(hours=1)  # 1小时内同一用户/IP只计一次

        # 区分登录用户和匿名用户
        if request.user.is_authenticated:
            # 登录用户，查找最近1小时是否有浏览记录
            exists = Interaction.objects.filter(
                user=request.user,
                content_type=ct,
                object_id=post.id,
                interaction_type="view",
                created_time__gte=window
            ).exists()
        else:
            # 匿名用户，用 IP + UA 作为唯一标识
            ip = request.META.get("REMOTE_ADDR")
            ua = request.META.get("HTTP_USER_AGENT", "")
            exists = Interaction.objects.filter(
                user__isnull=True,
                content_type=ct,
                object_id=post.id,
                interaction_type="view",
                ip_address=ip,
                user_agent=ua,
                created_time__gte=window
            ).exists()

        if not exists:
            # 没有重复记录才创建
            Interaction.objects.create(
                user=request.user if request.user.is_authenticated else None,
                content_type=ct,
                object_id=post.id,
                interaction_type="view",
                ip_address=request.META.get("REMOTE_ADDR") if not request.user.is_authenticated else None,
                user_agent=request.META.get("HTTP_USER_AGENT", "") if not request.user.is_authenticated else ""
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


class CompetitionModeratorViewSet(viewsets.GenericViewSet,
                                  mixins.CreateModelMixin,
                                  mixins.ListModelMixin,
                                  mixins.RetrieveModelMixin):
    queryset = CompetitionModerator.objects.select_related("competition", "user").all()
    serializer_class = CompetitionModeratorSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["competition", "title", "is_active"]
    ordering_fields = ["id"]

    def perform_create(self, serializer):
        # 用户提交申请 -> 状态默认未激活
        serializer.save(user=self.request.user, is_active=False)