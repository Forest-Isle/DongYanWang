# api/urls.py
from django.urls import path
from api.views.admin_views import (
    PostReviewView, PostBanView, RemoveModeratorView,
    WebhookConfigView, ExportUsersCSVView, ExportLogsXLSXView,
    AdminCompetitionReviewView, AddModeratorView, AdminContentReviewView,
    ModerationExportView, ModerationCSVExportView
)
from api.views.search_hot import PostSearchView, HotPostsView

urlpatterns = [
    # 运营
    path("admin/competition/<int:competition_id>/review/", AdminCompetitionReviewView.as_view()),
    path("admin/<str:model_name>/<int:object_id>/review/", AdminContentReviewView.as_view()),
    path("admin/posts/review/", PostReviewView.as_view()),
    path("admin/posts/ban/", PostBanView.as_view()),
    path("admin/moderator/add/", AddModeratorView.as_view()),
    path("admin/moderator/remove/", RemoveModeratorView.as_view()),
    path("admin/webhooks/", WebhookConfigView.as_view()),

    # 报表导出（异步）
    path("admin/export/users_csv/", ExportUsersCSVView.as_view()),
    path("admin/export/logs_xlsx/", ExportLogsXLSXView.as_view()),
    path("admin/export/moderation_xlsx/", ModerationExportView.as_view()),
    path("admin/export/moderation_csv/", ModerationCSVExportView.as_view()),

    # 搜索 & 热榜
    path("search/posts/", PostSearchView.as_view()),
    path("hot/posts/", HotPostsView.as_view()),
]