from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Prefetch
from django.utils import timezone
from datetime import timedelta

from api.services.pagination import StandardResultsSetPagination
from api.services.permissions import IsOwnerOrReadOnly, IsModeratorOrReadOnly
from api.models.project import (
    Project, ProjectPost, ProjectCategory,
    ProjectMetric, ProjectModerator, ProjectPostAttachment,
    ProjectEnrollment
)
from api.serializers.project import (
    ProjectSerializer, ProjectPostSerializer, ProjectCategorySerializer,
    ProjectMetricSerializer, ProjectModeratorSerializer, ProjectPostAttachmentSerializer,
    ProjectEnrollmentSerializer
)
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code", "funding_agency", "location"]
    ordering_fields = ["last_update", "follower_count", "view_count_cache", "start_date"]
    filterset_fields = {
        "sub_status": ["exact", "in"],
        "is_cooperation": ["exact"],
        "category": ["exact"],
        "status": ["exact", "in"],
    }

    def get_queryset(self):
        queryset = Project.objects.select_related("category").prefetch_related("metrics")
        user = self.request.user

        if user.is_staff:
            return queryset.prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=ProjectModerator.objects.select_related('user')
                )
            )

        moderator_projects = ProjectModerator.objects.filter(
            user=user, is_active=True
        ).values_list("project_id", flat=True)

        if moderator_projects.exists():
            return queryset.filter(
                Q(status=2) | Q(id__in=moderator_projects)
            ).prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=ProjectModerator.objects.select_related('user')
                )
            )

        return queryset.filter(status=2).prefetch_related(
            Prefetch(
                'moderators',
                queryset=ProjectModerator.objects.select_related('user')
            )
        )

    def perform_create(self, serializer):
        project = serializer.save(status=1)
        ProjectModerator.objects.create(
            project=project,
            user=self.request.user,
            role='pi'
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        project = self.get_object()
        ct = ContentType.objects.get_for_model(Project)
        qs = Interaction.objects.filter(
            user=request.user, content_type=ct, object_id=project.id, interaction_type="collect"
        )
        if qs.exists():
            qs.delete()
            return Response({"detail": "已取消关注"}, status=status.HTTP_200_OK)
        Interaction.objects.create(
            user=request.user, content_type=ct, object_id=project.id, interaction_type="collect"
        )
        return Response({"detail": "关注成功"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        """项目报名：当前用户申请加入，去重防重复申请。"""
        project = self.get_object()
        exists = ProjectEnrollment.objects.filter(project=project, user=request.user).exists()
        if exists:
            return Response({"detail": "已申请，无需重复"}, status=status.HTTP_200_OK)
        enrollment = ProjectEnrollment.objects.create(
            project=project,
            user=request.user,
            motivation=request.data.get("motivation", ""),
            role_expectation=request.data.get("role_expectation", "")
        )
        return Response(ProjectEnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)


class ProjectCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjectCategory.objects.annotate(
        project_count=Count("projects")
    )
    serializer_class = ProjectCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class ProjectMetricViewSet(viewsets.ModelViewSet):
    queryset = ProjectMetric.objects.select_related("project").all()
    serializer_class = ProjectMetricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["project", "year"]
    ordering_fields = ["year", "participants", "duration_weeks"]


class ProjectPostViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "project": ["exact"],
        "sub_post_type": ["exact", "in"],
        "post_status": ["exact", "in"],
        "creator": ["exact"],
        "is_hot": ["exact"],
    }
    search_fields = ["title", "content"]
    ordering_fields = ["last_activity", "collect_count", "recommend_count", "created_time"]

    def get_queryset(self):
        queryset = ProjectPost.objects.select_related("project", "creator")
        user = self.request.user
        if user.is_staff:
            return queryset
        moderator_projects = ProjectModerator.objects.filter(
            user=user, is_active=True
        ).values_list("project_id", flat=True)
        if moderator_projects.exists():
            return queryset.filter(
                Q(post_status='published') | Q(project_id__in=moderator_projects)
            )
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
        ct = ContentType.objects.get_for_model(ProjectPost)
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
        ct = ContentType.objects.get_for_model(ProjectPost)
        inter, created = Interaction.objects.get_or_create(
            user=request.user, content_type=ct, object_id=post.id, interaction_type="collect"
        )
        if not created:
            inter.delete()
            return Response({"detail": "取消收藏"}, status=status.HTTP_200_OK)
        return Response({"detail": "收藏成功"}, status=status.HTTP_201_CREATED)


class ProjectPostAttachmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectPostAttachment.objects.select_related("post").all()
    serializer_class = ProjectPostAttachmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post", "attachment_type"]
    ordering_fields = ["order"]

    def perform_create(self, serializer):
        post = serializer.validated_data["post"]
        user = self.request.user
        if (post.creator != user and
            not post.project.moderators.filter(user=user, is_active=True).exists()):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("无权限为该帖子添加附件")
        serializer.save()


class ProjectModeratorViewSet(viewsets.GenericViewSet,
                              mixins.CreateModelMixin,
                              mixins.ListModelMixin,
                              mixins.RetrieveModelMixin):
    queryset = ProjectModerator.objects.select_related("project", "user").all()
    serializer_class = ProjectModeratorSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["project", "role", "is_active"]
    ordering_fields = ["id"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_active=False)


class ProjectEnrollmentViewSet(viewsets.GenericViewSet,
                               mixins.CreateModelMixin,
                               mixins.ListModelMixin,
                               mixins.RetrieveModelMixin,
                               mixins.UpdateModelMixin):
    queryset = ProjectEnrollment.objects.select_related("project", "user").all()
    serializer_class = ProjectEnrollmentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {"project": ["exact"], "user": ["exact"], "status": ["exact", "in"]}
    ordering_fields = ["created_time"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


