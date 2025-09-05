from rest_framework.routers import DefaultRouter
from api.views.admissions import (
    AdmissionsViewSet, AdmissionsCategoryViewSet,
    AdmissionsMetricViewSet, AdmissionsPostViewSet,
    AdmissionsModeratorViewSet, AdmissionsPostAttachmentViewSet
)


router = DefaultRouter()
router.register(r"admissions", AdmissionsViewSet, basename="admissions")
router.register(r"admissions-categories", AdmissionsCategoryViewSet, basename="admissions-category")
router.register(r"admissions-metrics", AdmissionsMetricViewSet, basename="admissions-metric")
router.register(r"admissions-posts", AdmissionsPostViewSet, basename="admissions-post")
router.register(r"admissions-post-attachments", AdmissionsPostAttachmentViewSet, basename="admissions-post-attachment")
router.register(r"admissions-moderators", AdmissionsModeratorViewSet, basename="admissions-moderators")


urlpatterns = router.urls



