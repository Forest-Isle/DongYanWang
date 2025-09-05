from rest_framework.routers import DefaultRouter
from api.views.skills import (
    SkillViewSet, SkillCategoryViewSet, SkillPostViewSet
)


router = DefaultRouter()
router.register(r"skills", SkillViewSet, basename="skill")
router.register(r"skill-categories", SkillCategoryViewSet, basename="skill-category")
router.register(r"skill-posts", SkillPostViewSet, basename="skill-post")


urlpatterns = router.urls



