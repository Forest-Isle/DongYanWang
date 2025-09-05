from rest_framework.routers import DefaultRouter
from api.views.consultation import ConsultationServiceViewSet, ConsultationOrderViewSet, ConsultationApplicationViewSet


router = DefaultRouter()
router.register(r"services", ConsultationServiceViewSet, basename="consultation-service")
router.register(r"orders", ConsultationOrderViewSet, basename="consultation-order")
router.register(r"applications", ConsultationApplicationViewSet, basename="consultation-application")


urlpatterns = router.urls




