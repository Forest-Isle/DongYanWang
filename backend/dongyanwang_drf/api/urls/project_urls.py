from rest_framework.routers import DefaultRouter
from api.views.projects import (
    ProjectViewSet, ProjectCategoryViewSet,
    ProjectMetricViewSet, ProjectPostViewSet,
    ProjectModeratorViewSet, ProjectPostAttachmentViewSet,
    ProjectEnrollmentViewSet
)


router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"project-categories", ProjectCategoryViewSet, basename="project-category")
router.register(r"project-metrics", ProjectMetricViewSet, basename="project-metric")
router.register(r"project-posts", ProjectPostViewSet, basename="project-post")
router.register(r"project-post-attachments", ProjectPostAttachmentViewSet, basename="project-post-attachment")
router.register(r"project-moderators", ProjectModeratorViewSet, basename="project-moderators")
router.register(r"project-enrollments", ProjectEnrollmentViewSet, basename="project-enrollments")


urlpatterns = router.urls


