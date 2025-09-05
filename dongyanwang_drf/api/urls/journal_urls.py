from rest_framework.routers import DefaultRouter
from api.views.journals import (
    JournalViewSet, JournalCategoryViewSet,
    JournalMetricViewSet, JournalPostViewSet,
    JournalModeratorViewSet, JournalPostAttachmentViewSet
)


router = DefaultRouter()
router.register(r"journals", JournalViewSet, basename="journal")
router.register(r"journal-categories", JournalCategoryViewSet, basename="journal-category")
router.register(r"journal-metrics", JournalMetricViewSet, basename="journal-metric")
router.register(r"journal-posts", JournalPostViewSet, basename="journal-post")
router.register(r"journal-post-attachments", JournalPostAttachmentViewSet, basename="journal-post-attachment")
router.register(r"journal-moderators", JournalModeratorViewSet, basename="journal-moderators")


urlpatterns = router.urls


