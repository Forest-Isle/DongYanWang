# api/admin_views.py
import csv
from openpyxl import Workbook
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser


from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsAdminUserOrReadOnly
from ..serializers.ops import ModerationSerializer, WebhookConfigSerializer, HotItemSerializer
from ..models.ops import Moderation
from ..models import CompetitionPost, CompetitionModerator
from ..tasks import send_webhook

from api.models.competition import (
    Competition, CompetitionModerator, CompetitionPost
)
from api.serializers import CompetitionPostSerializer


# 比赛帖子审核管理
class AdminPostModerationViewSet(viewsets.ModelViewSet):
    queryset = CompetitionPost.objects.all()
    serializer_class = CompetitionPostSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        post = self.get_object()
        post.status = "approved"
        post.save(update_fields=["status"])
        return Response({"status": "approved"})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        post = self.get_object()
        post.status = "rejected"
        post.save(update_fields=["status"])
        return Response({"status": "rejected"})

    @action(detail=True, methods=["post"])
    def ban(self, request, pk=None):
        post = self.get_object()
        post.status = "banned"
        post.save(update_fields=["status"])
        return Response({"status": "banned"})


# 比赛版主管理
class AdminModeratorManageView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        competition_id = request.data.get("competition_id")
        user_id = request.data.get("user_id")
        rel = CompetitionModerator.objects.filter(
            competition_id=competition_id, user_id=user_id
        )
        if rel.exists():
            rel.delete()
            return Response({"msg": "Moderator removed"})
        return Response({"msg": "Not found"}, status=404)


# 导出 CSV 报表
class AdminReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="competition_report.csv"'
        writer = csv.writer(response)
        writer.writerow(["Competition", "Followers", "Posts", "Likes"])
        for comp in Competition.objects.all():
            writer.writerow([
                comp.title,
                comp.followers.count() if hasattr(comp, "followers") else 0,
                comp.posts.count() if hasattr(comp, "posts") else 0,
                sum(p.likes.count() for p in comp.posts.all()) if hasattr(comp, "posts") else 0
            ])
        return response


# 导出 Excel 报表
class AdminReportXLSXView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        wb = Workbook()
        ws = wb.active
        ws.append(["Competition", "Followers", "Posts", "Likes"])
        for comp in Competition.objects.all():
            ws.append([
                comp.title,
                comp.followers.count() if hasattr(comp, "followers") else 0,
                comp.posts.count() if hasattr(comp, "posts") else 0,
                sum(p.likes.count() for p in comp.posts.all()) if hasattr(comp, "posts") else 0
            ])
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="competition_report.xlsx"'
        wb.save(response)
        return response

def _get_ct_and_obj(ct_model: str, obj_id: int):
    ct = ContentType.objects.get(model=ct_model.lower())
    model = ct.model_class()
    obj = model.objects.get(pk=obj_id)
    return ct, obj

class PostReviewView(APIView):
    """
    审核帖子：approved / rejected
    POST /api/admin/posts/review/
    body: { "ct": "competitionpost", "id": 123, "status": "approved", "reason": "" }
    """
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def post(self, request):
        ct_model = request.data.get("ct")
        obj_id = request.data.get("id")
        status_value = request.data.get("status")
        reason = request.data.get("reason", "")
        if status_value not in ("approved", "rejected"):
            return Response({"msg": "status 只能是 approved/rejected"}, status=400)
        with transaction.atomic():
            ct, obj = _get_ct_and_obj(ct_model, obj_id)
            rec = Moderation.objects.create(
                operator=request.user, status=status_value, reason=reason,
                content_type=ct, object_id=obj.pk
            )
        send_webhook.delay("post_review", {
            "status": status_value, "reason": reason, "ct": ct_model, "id": obj_id,
            "operator": request.user.username,
        })
        return Response({"msg": "ok", "data": {"moderation_id": rec.id}})

class PostBanView(APIView):
    """
    封禁/解禁：banned / unbanned
    POST /api/admin/posts/ban/
    body: { "ct": "competitionpost", "id": 123, "action": "ban/unban", "reason": "" }
    """
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def post(self, request):
        ct_model = request.data.get("ct")
        obj_id = request.data.get("id")
        action = request.data.get("action")  # "ban" or "unban"
        reason = request.data.get("reason", "")
        if action not in ("ban", "unban"):
            return Response({"msg": "action 只能为 ban/unban"}, status=400)

        status_value = "banned" if action == "ban" else "unbanned"
        ct, obj = _get_ct_and_obj(ct_model, obj_id)
        rec = Moderation.objects.create(
            operator=request.user, status=status_value, reason=reason,
            content_type=ct, object_id=obj.pk
        )
        send_webhook.delay("post_ban", {
            "action": action, "ct": ct_model, "id": obj_id,
            "reason": reason, "operator": request.user.username,
        })
        return Response({"msg": "ok", "data": {"moderation_id": rec.id}})

class RemoveModeratorView(APIView):
    """
    移除版主
    POST /api/admin/moderator/remove/
    body: { "id": 88, "reason": "" }
    """
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def post(self, request):
        mod_id = request.data.get("id")
        reason = request.data.get("reason", "")
        try:
            mod = CompetitionModerator.objects.get(pk=mod_id)
        except CompetitionModerator.DoesNotExist:
            return Response({"msg": "版主不存在"}, status=404)
        mod.is_active = False
        mod.save(update_fields=["is_active"])
        send_webhook.delay("mod_removed", {
            "moderator_id": mod_id,
            "competition_id": mod.competition_id,
            "user_id": mod.user_id,
            "reason": reason,
            "operator": request.user.username,
        })
        return Response({"msg": "已移除版主"})

class WebhookConfigView(generics.ListCreateAPIView):
    queryset = ...
    serializer_class = WebhookConfigSerializer
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get_queryset(self):
        from ..models.ops import WebhookConfig
        return WebhookConfig.objects.all()

# —— 报表导出 —— #
from ..tasks import export_users_csv, export_logs_xlsx

class ExportUsersCSVView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]
    def post(self, request):
        r = export_users_csv.delay()
        return Response({"msg": "任务已提交", "task_id": r.id})

class ExportLogsXLSXView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]
    def post(self, request):
        r = export_logs_xlsx.delay()
        return Response({"msg": "任务已提交", "task_id": r.id})