# api/admin_views.py
import csv

from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAdminUser
from django.db.models import Count
from django.contrib.contenttypes.models import ContentType
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, serializers
from rest_framework.permissions import IsAuthenticated
from api.services.permissions import IsAdminUserOrReadOnly
from ..serializers.ops import (
    ModerationSerializer, WebhookConfigSerializer, HotItemSerializer,
    PostReviewSerializer, PostBanSerializer, AdminModeratorManageSerializer
)
from ..models.ops import Moderation, WebhookConfig
from ..models import CompetitionPost, CompetitionModerator
from ..tasks import send_webhook, export_users_csv, export_logs_xlsx
import datetime
import openpyxl
from django.http import HttpResponse, StreamingHttpResponse
from api.models.competition import Competition, CompetitionModerator, CompetitionPost
from api.models.journal import Journal, JournalPost
from api.models.admissions import Admissions, AdmissionsPost
from api.models.project import Project, ProjectPost
from api.models.skill import Skill, SkillPost
from api.serializers.competition import CompetitionPostSerializer,CompetitionModeratorSerializer


class BaseModerationView(APIView):
    """
    后台操作基类：
    - 校验参数（交给 serializer）
    - 找到目标对象
    - 记录流水
    - 调用 perform_action 执行业务
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = None  # 子类必须定义

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 执行业务逻辑（子类实现）
        self.perform_action(serializer)

        return Response({"msg": "ok"})

    def perform_action(self, serializer):
        """子类必须实现"""
        raise NotImplementedError

# —— 审核竞赛 —— #
class AdminCompetitionReviewView(APIView):
    """
    审核竞赛：approve / reject
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, competition_id):
        comp = get_object_or_404(Competition, pk=competition_id)
        action = request.data.get("action")  # approve / reject
        reason = request.data.get("reason", "")

        if action not in ("approve", "reject"):
            return Response({"msg": "action 必须为 approve/reject"}, status=400)

        comp.status = 2 if action == "approve" else 3
        comp.save(update_fields=["status"])

        Moderation.objects.create(
            operator=request.user,
            status="approved" if action == "approve" else "rejected",
            reason=reason,
            content_type=ContentType.objects.get_for_model(comp),
            object_id=comp.id
        )
        send_webhook.delay("competition_review", {
            "action": action, "id": comp.id, "reason": reason,
            "operator": request.user.username
        })

        return Response({"msg": f"竞赛已 {action}"})


# —— 审核期刊/招生/项目/技能/咨询 服务 —— #
class AdminContentReviewView(APIView):
    """
    通用内容审核：approve / reject
    支持 model 参数：journal/admissions/project/skill/consultation_service
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    MODEL_MAP = {
        "journal": Journal,
        "admissions": Admissions,
        "project": Project,
        "skill": Skill,
    }

    def post(self, request, model_name, object_id):
        Model = self.MODEL_MAP.get(model_name)
        if not Model:
            return Response({"msg": "invalid model"}, status=400)
        obj = get_object_or_404(Model, pk=object_id)
        action = request.data.get("action")
        reason = request.data.get("reason", "")
        if action not in ("approve", "reject"):
            return Response({"msg": "action 必须为 approve/reject"}, status=400)
        obj.status = 2 if action == "approve" else 3
        obj.save(update_fields=["status"])

        Moderation.objects.create(
            operator=request.user,
            status="approved" if action == "approve" else "rejected",
            reason=reason,
            content_type=ContentType.objects.get_for_model(obj),
            object_id=obj.id
        )

        send_webhook.delay(f"{model_name}_review", {
            "action": action, "id": obj.id, "reason": reason,
            "operator": request.user.username
        })
        return Response({"msg": f"{model_name} 已 {action}"})


# —— 审核帖子 —— #
class PostReviewView(APIView):
    """
    审核帖子：approved / rejected
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        serializer = PostReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ct, obj = serializer.validated_data["_ct_obj"]
        status_value = serializer.validated_data["status"]
        reason = serializer.validated_data.get("reason", "")

        obj.post_status = "published" if status_value == "approved" else "rejected"
        obj.save(update_fields=["post_status"])

        rec = Moderation.objects.create(
            operator=request.user, status=status_value, reason=reason,
            content_type=ct, object_id=obj.pk
        )
        section = detect_post_section(obj)
        send_webhook.delay("post_review", {
            "status": status_value, "reason": reason, "ct": ct.model, "id": obj.id,
            "operator": request.user.username, "section": section,
        })

        return Response({"msg": "ok", "data": {"moderation_id": rec.id}})


# —— 封禁/解禁帖子 —— #
class PostBanView(BaseModerationView):
    """
    封禁 / 解禁帖子：ban / unban
    - ban: 已发布的帖子 → archived
    - unban: 已封禁的帖子 → published
    - 被拒绝(rejected)的帖子不能被 unban
    """
    serializer_class = PostBanSerializer

    def perform_action(self, serializer):
        obj = serializer.validated_data["target"]
        action = serializer.validated_data["action"]
        reason = serializer.validated_data.get("reason", "")

        if action == "ban":
            if obj.post_status == "published":
                obj.post_status = "archived"
        elif action == "unban":
            # 只允许从 archived 恢复，reject 的帖子不能 unban
            if obj.post_status == "archived":
                obj.post_status = "published"
            else:
             raise serializers.ValidationError("只有 archived 状态的帖子才能解禁")

        obj.save(update_fields=["post_status"])

        # 记录流水
        Moderation.objects.create(
            operator=self.request.user,
            status="banned" if action == "ban" else "unbanned",
            reason=reason,
            content_type=ContentType.objects.get_for_model(obj),
            object_id=obj.id
        )

        # 发 webhook
        WebhookConfig.trigger_event("post_ban", {
            "post_id": obj.id,
            "status": obj.post_status,
            "action": action,
            "reason": reason,
            "operator": self.request.user.username,
        })



# —— 添加版主 —— #
class AddModeratorView(APIView):
    """
    添加版主
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        s = AdminModeratorManageSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        competition_id = s.validated_data["competition_id"]
        user_id = s.validated_data["user_id"]
        mod, created = CompetitionModerator.objects.get_or_create(
            competition_id=competition_id, user_id=user_id,
            defaults={"is_active": True}
        )
        if not created and not mod.is_active:
            mod.is_active = True
            mod.save(update_fields=["is_active"])

        send_webhook.delay("mod_added", {
            "competition_id": competition_id,
            "user_id": user_id,
            "operator": request.user.username,
        })
        return Response({"msg": "Moderator added"})


# —— 移除版主 —— #
class RemoveModeratorView(APIView):
    """
    移除版主
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

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


# —— 公共工具 —— #
def _get_ct_and_obj(ct_model, obj_id):
    try:
        ct = ContentType.objects.get(model=ct_model.lower())
        model = ct.model_class()
        obj = get_object_or_404(model, pk=obj_id)
        return ct, obj
    except ContentType.DoesNotExist:
        raise NotFound(f"Invalid content type: {ct_model}")


def detect_post_section(obj) -> str:
    """返回帖子所属频道：competition/journal/admissions/project/skill"""
    model_name = obj.__class__.__name__.lower()
    if model_name.endswith("post"):
        return model_name.replace("post", "")
    return "unknown"


class ModerationExportView(APIView):
    def get(self, request):
        # 查询需要导出的数据
        queryset = Moderation.objects.select_related("operator").order_by("-created_at")

        # 创建 Excel 工作簿
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Moderation Report"

        # 表头
        ws.append(["ID", "操作人", "操作对象", "动作", "原因", "时间"])

        # 写入数据
        for rec in queryset:
            ws.append([
                rec.id,
                rec.operator.username if rec.operator else "系统",
                f"{rec.content_type.model} #{rec.object_id}",
                rec.status,
                rec.reason,
                rec.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            ])

        # 输出到 HttpResponse
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        filename = f"moderation_report_{datetime.date.today()}.xlsx"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        wb.save(response)
        return response

class ModerationCSVExportView(APIView):
    """
    导出审核/封禁/解禁记录报表（CSV）
    支持参数过滤：
    - ?start=2025-09-01&end=2025-09-03&status=approved&operator=admin
    """

    def get(self, request):
        # 过滤条件
        start = request.GET.get("start")
        end = request.GET.get("end")
        status = request.GET.get("status")
        operator = request.GET.get("operator")

        queryset = Moderation.objects.select_related("operator").all()
        if start:
            queryset = queryset.filter(created_at__gte=start)
        if end:
            queryset = queryset.filter(created_at__lte=end)
        if status:
            queryset = queryset.filter(status=status)
        if operator:
            queryset = queryset.filter(operator__username=operator)
        queryset = queryset.order_by("-created_at")

        # 文件名
        filename = f"moderation_report_{datetime.date.today()}.csv"

        # 定义生成器，避免一次性写入内存
        def generate():
            # 表头
            yield ",".join(["ID", "操作人", "对象", "动作", "原因", "时间"]) + "\n"
            for rec in queryset.iterator():
                yield ",".join([
                    str(rec.id),
                    rec.operator.username if rec.operator else "系统",
                    f"{rec.content_type.model} #{rec.object_id}",
                    rec.status,
                    rec.reason.replace(",", "，"),  # 避免 reason 里有逗号
                    rec.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                ]) + "\n"

            # --- 汇总统计 ---
            yield "\n操作类型汇总\n"
            summary = queryset.values("status").annotate(count=Count("id"))
            yield "类型,次数\n"
            for row in summary:
                yield f"{row['status']},{row['count']}\n"

            yield "\n操作员汇总\n"
            summary_op = queryset.values("operator__username").annotate(count=Count("id"))
            yield "操作员,次数\n"
            for row in summary_op:
                yield f"{row['operator__username'] or '系统'},{row['count']}\n"

        response = StreamingHttpResponse(generate(), content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response

class WebhookConfigView(generics.ListCreateAPIView):
    queryset = WebhookConfig.objects.all()
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