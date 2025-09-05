

from rest_framework.routers import DefaultRouter

from api.views.comment import CommentViewSet
from api.views.interaction import InteractionViewSet
from api.views.stats import ContentStatsViewSet
from api.views.search_hot import PostSearchView,HotPostsView
from django.urls import path, include

router = DefaultRouter()
router.register(r"comments", CommentViewSet, basename="comment")
router.register(r"interactions", InteractionViewSet, basename="interaction")
router.register(r"content-stats", ContentStatsViewSet, basename="content-stats")

urlpatterns = [
    path("search/", PostSearchView.as_view(), name="search"),
    path("hot/", HotPostsView.as_view(), name="hot"),
    path('', include(router.urls)),
]



