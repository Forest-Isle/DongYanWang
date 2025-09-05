from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status, filters
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from api.services.pagination import StandardResultsSetPagination
from api.models.ops import ConsultationService, ConsultationOrder, ConsultationApplication
from api.serializers.ops import ConsultationServiceSerializer, ConsultationOrderSerializer, ConsultationApplicationSerializer


class ConsultationServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "provider__username"]
    ordering_fields = ["rating", "rating_count", "created_at"]
    filterset_fields = {"is_active": ["exact"], "is_verified": ["exact"], "provider": ["exact"]}

    def get_queryset(self):
        queryset = ConsultationService.objects.select_related("provider").all()
        user = self.request.user
        
        # 管理员可以看到所有咨询服务
        if user.is_staff:
            return queryset
        
        # 普通用户只能看到已激活且已验证的咨询服务
        return queryset.filter(is_active=True, is_verified=True)

    def perform_create(self, serializer):
        # 仅允许已认证/授权（示例：is_staff）用户开通付费咨询
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("未认证用户不可开通咨询服务")
        serializer.save(provider=self.request.user, is_verified=True)


class ConsultationOrderViewSet(viewsets.GenericViewSet,
                               mixins.CreateModelMixin,
                               mixins.ListModelMixin,
                               mixins.RetrieveModelMixin,
                               mixins.UpdateModelMixin):
    queryset = ConsultationOrder.objects.select_related("service", "buyer").all()
    serializer_class = ConsultationOrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {"service": ["exact"], "buyer": ["exact"], "status": ["exact", "in"]}
    ordering_fields = ["created_at"]

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class ConsultationApplicationViewSet(viewsets.GenericViewSet,
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    mixins.RetrieveModelMixin):
    queryset = ConsultationApplication.objects.select_related("user").all()
    serializer_class = ConsultationApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {"user": ["exact"], "status": ["exact", "in"]}
    ordering_fields = ["created_at"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


