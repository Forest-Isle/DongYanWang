from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Prefetch

from api.services.pagination import StandardResultsSetPagination
from api.services.permissions import IsOwnerOrReadOnly, IsModeratorOrReadOnly
from api.models.skill import (
    Skill, SkillPost, SkillCategory,
    SkillModerator, SkillPostAttachment
)
from api.serializers.skill import (
    SkillSerializer, SkillPostSerializer, SkillCategorySerializer,
    SkillModeratorSerializer, SkillPostAttachmentSerializer
)
from api.models.article import Interaction
from django.contrib.contenttypes.models import ContentType


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["last_update", "followers", "view_count"]
    filterset_fields = {
        "skill_type": ["exact", "in"],
        "difficulty": ["exact", "in"],
        "categories__name": ["exact", "in"],
        "status": ["exact", "in"],
    }

    def get_queryset(self):
        queryset = Skill.objects.prefetch_related("categories")
        user = self.request.user

        if user.is_staff:
            return queryset.prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=SkillModerator.objects.select_related('user')
                )
            )

        moderator_skills = SkillModerator.objects.filter(
            user=user, is_active=True
        ).values_list("skill_id", flat=True)

        if moderator_skills.exists():
            return queryset.filter(
                Q(status=2) | Q(id__in=moderator_skills)
            ).prefetch_related(
                Prefetch(
                    'moderators',
                    queryset=SkillModerator.objects.select_related('user')
                )
            )

        return queryset.filter(status=2).prefetch_related(
            Prefetch(
                'moderators',
                queryset=SkillModerator.objects.select_related('user')
            )
        )

    def perform_create(self, serializer):
        skill = serializer.save(status=1)
        SkillModerator.objects.create(
            skill=skill,
            user=self.request.user,
            title='chief'
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        skill = self.get_object()
        ct = ContentType.objects.get_for_model(Skill)
        qs = Interaction.objects.filter(
            user=request.user, content_type=ct, object_id=skill.id, interaction_type="collect"
        )
        if qs.exists():
            qs.delete()
            return Response({"detail": "已取消关注"}, status=status.HTTP_200_OK)
        Interaction.objects.create(
            user=request.user, content_type=ct, object_id=skill.id, interaction_type="collect"
        )
        return Response({"detail": "关注成功"}, status=status.HTTP_201_CREATED)


class SkillCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillCategory.objects.annotate(
        skills_count=Count("skills")
    )
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class SkillPostViewSet(viewsets.ModelViewSet):
    serializer_class = SkillPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly | IsModeratorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "skill": ["exact"],
        "sub_post_type": ["exact", "in"],
        "post_status": ["exact", "in"],
        "creator": ["exact"],
        "is_hot": ["exact"],
    }
    search_fields = ["title", "content"]
    ordering_fields = ["created_time", "collect_count", "recommend_count"]

    def get_queryset(self):
        queryset = SkillPost.objects.select_related("skill", "creator")
        user = self.request.user
        if user.is_staff:
            return queryset
        moderator_skills = SkillModerator.objects.filter(
            user=user, is_active=True
        ).values_list("skill_id", flat=True)
        if moderator_skills.exists():
            return queryset.filter(
                Q(post_status='published') | Q(skill_id__in=moderator_skills)
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



