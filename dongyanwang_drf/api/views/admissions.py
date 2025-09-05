from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Prefetch

from api.services.pagination import StandardResultsSetPagination
from api.services.permissions import IsOwnerOrReadOnly, IsModeratorOrReadOnly
from api.models.admissions import (
    Admissions, AdmissionsPost, AdmissionsCategory,
    AdmissionsMetric, AdmissionsModerator, AdmissionsPostAttachment
)
from api.serializers.admissions import (
    AdmissionsSerializer, AdmissionsPostSerializer, AdmissionsCategorySerializer,
    AdmissionsMetricSerializer, AdmissionsModeratorSerializer, AdmissionsPostAttachmentSerializer
)
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType


class AdmissionsViewSet(viewsets.ModelViewSet):
    serializer_class = AdmissionsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "organizer", "location"]
    ordering_fields = ["last_update"]
    filterset_fields = {
        "is_scholarship": ["exact"],
        "is_competitive": ["exact"],
        "categories__name": ["exact", "in"],
        "sub_status": ["exact", "in"],
        "status": ["exact", "in"],
    }

    def get_queryset(self):
        queryset = Admissions.objects.prefetch_related("categories", "metrics")
        user = self.request.user

        if user.is_staff:
            return queryset.prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=AdmissionsModerator.objects.select_related('user')
                )
            )

        moderator_objs = AdmissionsModerator.objects.filter(
            user=user, is_active=True
        ).values_list("admissions_id", flat=True)

        if moderator_objs.exists():
            return queryset.filter(
                Q(status=2) | Q(id__in=moderator_objs)
            ).prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=AdmissionsModerator.objects.select_related('user')
                )
            )

        return queryset.filter(status=2).prefetch_related(
            Prefetch(
                'moderators',
                queryset=AdmissionsModerator.objects.select_related('user')
            )
        )

    def perform_create(self, serializer):
        admissions = serializer.save(status=1)
        AdmissionsModerator.objects.create(
            admissions=admissions,
            user=self.request.user,
            title='chief'
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        admissions = self.get_object()
        ct = ContentType.objects.get_for_model(Admissions)
        qs = Interaction.objects.filter(
            user=request.user, content_type=ct, object_id=admissions.id, interaction_type="collect"
        )
        if qs.exists():
            qs.delete()
            return Response({"detail": "已取消关注"}, status=status.HTTP_200_OK)
        Interaction.objects.create(
            user=request.user, content_type=ct, object_id=admissions.id, interaction_type="collect"
        )
        return Response({"detail": "关注成功"}, status=status.HTTP_201_CREATED)


class AdmissionsCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdmissionsCategory.objects.annotate(
        admissions_count=Count("admissions")
    )
    serializer_class = AdmissionsCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class AdmissionsMetricViewSet(viewsets.ModelViewSet):
    queryset = AdmissionsMetric.objects.select_related("admissions").all()
    serializer_class = AdmissionsMetricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["admissions", "year"]
    ordering_fields = ["year", "acceptance_rate"]


class AdmissionsPostViewSet(viewsets.ModelViewSet):
    serializer_class = AdmissionsPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "admissions": ["exact"],
        "sub_post_type": ["exact", "in"],
        "post_status": ["exact", "in"],
        "creator": ["exact"],
        "is_hot": ["exact"],
    }
    search_fields = ["title", "content"]
    ordering_fields = ["created_time", "collect_count", "recommend_count"]

    def get_queryset(self):
        queryset = AdmissionsPost.objects.select_related("admissions", "creator")
        user = self.request.user
        if user.is_staff:
            return queryset
        moderator_objs = AdmissionsModerator.objects.filter(
            user=user, is_active=True
        ).values_list("admissions_id", flat=True)
        if moderator_objs.exists():
            return queryset.filter(
                Q(post_status='published') | Q(admissions_id__in=moderator_objs)
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


class AdmissionsPostAttachmentViewSet(viewsets.ModelViewSet):
    queryset = AdmissionsPostAttachment.objects.select_related("post").all()
    serializer_class = AdmissionsPostAttachmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post"]
    ordering_fields = ["order"]

    def perform_create(self, serializer):
        post = serializer.validated_data["post"]
        user = self.request.user
        if (post.creator != user and
            not post.admissions.moderators.filter(user=user, is_active=True).exists()):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("无权限为该帖子添加附件")
        serializer.save()


class AdmissionsModeratorViewSet(viewsets.GenericViewSet,
                                 mixins.CreateModelMixin,
                                 mixins.ListModelMixin,
                                 mixins.RetrieveModelMixin):
    queryset = AdmissionsModerator.objects.select_related("admissions", "user").all()
    serializer_class = AdmissionsModeratorSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["admissions", "title", "is_active"]
    ordering_fields = ["id"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_active=False)



