# api/urls.py
from django.urls import path
from .views.admin_ops import (
    PostReviewView, PostBanView, RemoveModeratorView,
    WebhookConfigView, ExportUsersCSVView, ExportLogsXLSXView
)
from .views.search_hot import PostSearchView, HotPostsView

urlpatterns = [
    # 运营
    path("admin/posts/review/", PostReviewView.as_view()),
    path("admin/posts/ban/", PostBanView.as_view()),
    path("admin/moderator/remove/", RemoveModeratorView.as_view()),
    path("admin/webhooks/", WebhookConfigView.as_view()),

    # 报表导出（异步）
    path("admin/export/users_csv/", ExportUsersCSVView.as_view()),
    path("admin/export/logs_xlsx/", ExportLogsXLSXView.as_view()),

    # 搜索 & 热榜
    path("search/posts/", PostSearchView.as_view()),
    path("hot/posts/", HotPostsView.as_view()),
]