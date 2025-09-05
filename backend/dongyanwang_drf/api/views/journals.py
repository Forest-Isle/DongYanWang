from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Prefetch

from api.services.pagination import StandardResultsSetPagination
from api.services.permissions import IsOwnerOrReadOnly, IsModeratorOrReadOnly
from api.models.journal import (
    Journal, JournalPost, JournalCategory,
    JournalMetric, JournalModerator, JournalPostAttachment
)
from api.serializers.journal import (
    JournalSerializer, JournalPostSerializer, JournalCategorySerializer,
    JournalMetricSerializer, JournalModeratorSerializer, JournalPostAttachmentSerializer
)
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from datetime import timedelta


class JournalViewSet(viewsets.ModelViewSet):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "publisher", "issn"]
    ordering_fields = ["last_update"]
    filterset_fields = {
        "is_sci": ["exact"],
        "is_oa": ["exact"],
        "categories__name": ["exact", "in"],
        "status": ["exact", "in"],
    }

    def get_queryset(self):
        queryset = Journal.objects.prefetch_related("categories", "metrics")
        user = self.request.user

        if user.is_staff:
            return queryset.prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=JournalModerator.objects.select_related('user')
                )
            )

        moderator_journals = JournalModerator.objects.filter(
            user=user, is_active=True
        ).values_list("journal_id", flat=True)

        if moderator_journals.exists():
            return queryset.filter(
                Q(status=2) | Q(id__in=moderator_journals)
            ).prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=JournalModerator.objects.select_related('user')
                )
            )

        return queryset.filter(status=2).prefetch_related(
            Prefetch(
                'moderators',
                queryset=JournalModerator.objects.select_related('user')
            )
        )

    def perform_create(self, serializer):
        journal = serializer.save(status=1)
        JournalModerator.objects.create(
            journal=journal,
            user=self.request.user,
            title='chief'
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        journal = self.get_object()
        ct = ContentType.objects.get_for_model(Journal)
        qs = Interaction.objects.filter(
            user=request.user, content_type=ct, object_id=journal.id, interaction_type="collect"
        )
        if qs.exists():
            qs.delete()
            return Response({"detail": "已取消关注"}, status=status.HTTP_200_OK)
        Interaction.objects.create(
            user=request.user, content_type=ct, object_id=journal.id, interaction_type="collect"
        )
        return Response({"detail": "关注成功"}, status=status.HTTP_201_CREATED)


class JournalCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JournalCategory.objects.annotate(
        journal_count=Count("journals")
    )
    serializer_class = JournalCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class JournalMetricViewSet(viewsets.ModelViewSet):
    queryset = JournalMetric.objects.select_related("journal").all()
    serializer_class = JournalMetricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["journal", "year"]
    ordering_fields = ["year", "impact_factor"]


class JournalPostViewSet(viewsets.ModelViewSet):
    serializer_class = JournalPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "journal": ["exact"],
        "sub_post_type": ["exact", "in"],
        "post_status": ["exact", "in"],
        "creator": ["exact"],
        "is_hot": ["exact"],
    }
    search_fields = ["title", "content"]
    ordering_fields = ["created_time", "collect_count", "recommend_count"]

    def get_queryset(self):
        queryset = JournalPost.objects.select_related("journal", "creator")
        user = self.request.user
        if user.is_staff:
            return queryset
        moderator_journals = JournalModerator.objects.filter(
            user=user, is_active=True
        ).values_list("journal_id", flat=True)
        if moderator_journals.exists():
            return queryset.filter(
                Q(post_status='published') | Q(journal_id__in=moderator_journals)
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
        ct = ContentType.objects.get_for_model(JournalPost)
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
        ct = ContentType.objects.get_for_model(JournalPost)
        inter, created = Interaction.objects.get_or_create(
            user=request.user, content_type=ct, object_id=post.id, interaction_type="collect"
        )
        if not created:
            inter.delete()
            return Response({"detail": "取消收藏"}, status=status.HTTP_200_OK)
        return Response({"detail": "收藏成功"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticatedOrReadOnly])
    def view(self, request, pk=None):
        post = self.get_object()
        ct = ContentType.objects.get_for_model(JournalPost)
        now = timezone.now()
        window = now - timedelta(hours=1)

        if request.user.is_authenticated:
            exists = Interaction.objects.filter(
                user=request.user,
                content_type=ct,
                object_id=post.id,
                interaction_type="view",
                created_time__gte=window
            ).exists()
        else:
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
            Interaction.objects.create(
                user=request.user if request.user.is_authenticated else None,
                content_type=ct,
                object_id=post.id,
                interaction_type="view",
                ip_address=request.META.get("REMOTE_ADDR") if not request.user.is_authenticated else None,
                user_agent=request.META.get("HTTP_USER_AGENT", "") if not request.user.is_authenticated else ""
            )

        return Response({"detail": "ok"}, status=status.HTTP_201_CREATED)


class JournalPostAttachmentViewSet(viewsets.ModelViewSet):
    queryset = JournalPostAttachment.objects.select_related("post").all()
    serializer_class = JournalPostAttachmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post"]
    ordering_fields = ["order"]

    def perform_create(self, serializer):
        post = serializer.validated_data["post"]
        user = self.request.user
        if (post.creator != user and
            not post.journal.moderators.filter(user=user, is_active=True).exists()):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("无权限为该帖子添加附件")
        serializer.save()


class JournalModeratorViewSet(viewsets.GenericViewSet,
                              mixins.CreateModelMixin,
                              mixins.ListModelMixin,
                              mixins.RetrieveModelMixin):
    queryset = JournalModerator.objects.select_related("journal", "user").all()
    serializer_class = JournalModeratorSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["journal", "title", "is_active"]
    ordering_fields = ["id"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_active=False)




