# api/urls/competition_urls.py
# api/urls/competition_urls.py
from rest_framework.routers import DefaultRouter
from api.views.competition import (
    CompetitionViewSet, CompetitionCategoryViewSet,
    CompetitionMetricViewSet, CompetitionPostViewSet,
    CompetitionModeratorViewSet, CompetitionPostAttachmentViewSet
)
from api.views.comment import CommentViewSet
from api.views.interaction import InteractionViewSet
from api.views.stats import ContentStatsViewSet

router = DefaultRouter()
router.register(r"competitions", CompetitionViewSet, basename="competition")
router.register(r"competition-categories", CompetitionCategoryViewSet, basename="competition-category")
router.register(r"competition-metrics", CompetitionMetricViewSet, basename="competition-metric")
router.register(r"competition-posts", CompetitionPostViewSet, basename="competition-post")
router.register(r"competition-post-attachments", CompetitionPostAttachmentViewSet, basename="competition-post-attachment")
router.register(r"comments", CommentViewSet, basename="comment")
router.register(r"interactions", InteractionViewSet, basename="interaction")
router.register(r"content-stats", ContentStatsViewSet, basename="content-stats")

urlpatterns = router.urls