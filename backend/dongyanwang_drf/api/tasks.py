# api/tasks.py
import io
import json
import time
import pandas as pd
import requests
from django.conf import settings
from celery import shared_task
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from api.hot import hot_top
from api.models.ops import HotRankSnapshot, WebhookEventLog, WebhookConfig
from api.models import CompetitionPost  # 示例：你可以扩展到其它 Post 子类
from api.search import get_search_client, ensure_index, index_post, POST_MAPPING
from api.search_bootstrap import  POST_MAPPING
@shared_task
def flush_hot_ranks():
    """
    从 Redis 读取热榜，落库快照（可选）
    """
    model_label = "competitionpost"
    items = hot_top(model_label, 100)
    for rank, (obj_id, score) in enumerate(items, start=1):
        HotRankSnapshot.objects.create(
            model_label=model_label, object_id=obj_id, score=score, rank=rank
        )
    return {"model": model_label, "count": len(items)}

@shared_task(bind=True, max_retries=settings.WEBHOOK_RETRY["max_retries"])
def send_webhook(self, event: str, payload: dict):
    qs = WebhookConfig.objects.filter(event=event, is_active=True)
    for cfg in qs:
        try:
            headers = {"Content-Type": "application/json"}
            if cfg.secret:
                headers["X-Webhook-Secret"] = cfg.secret
            resp = requests.post(cfg.url, data=json.dumps(payload), timeout=8, headers=headers)
            WebhookEventLog.objects.create(
                event=event, url=cfg.url, payload=payload,
                status_code=resp.status_code, success=resp.ok, response_text=resp.text[:1000],
            )
            if not resp.ok:
                raise Exception(f"HTTP {resp.status_code}")
        except Exception as e:
            WebhookEventLog.objects.create(
                event=event, url=cfg.url, payload=payload,
                status_code=None, success=False, response_text=str(e)[:1000],
            )
            # 退避重试
            try:
                countdown = settings.WEBHOOK_RETRY["retry_backoff"][self.request.retries]
            except Exception:
                countdown = 60
            raise self.retry(countdown=countdown)

@shared_task
def export_users_csv():
    """
    导出用户报表（示例）
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    data = list(User.objects.all().values("id", "username", "email", "date_joined", "is_active"))
    df = pd.DataFrame(data)
    buf = io.StringIO()
    df.to_csv(buf, index=False)
    buf.seek(0)
    path = settings.EXPORT_DIR / f"users_{int(time.time())}.csv"
    default_storage.save(str(path), ContentFile(buf.getvalue().encode("utf-8")))
    return {"file": f"/media/exports/{path.name}"}

@shared_task
def export_logs_xlsx():
    from .models import OperationLog
    data = list(OperationLog.objects.all().values("id", "user_id", "action", "ip", "request_id", "created_at"))
    df = pd.DataFrame(data)
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="logs")
    buf.seek(0)
    path = settings.EXPORT_DIR / f"logs_{int(time.time())}.xlsx"
    default_storage.save(str(path), ContentFile(buf.getvalue()))
    return {"file": f"/media/exports/{path.name}"}

@shared_task
def reindex_competition_posts():
    """
    重建索引（CompetitionPost 示例）
    """
    client = get_search_client()
    ensure_index(client, "competitionpost", POST_MAPPING)
    qs = CompetitionPost.objects.all().select_related("creator")
    for p in qs:
        body = {
            "title": p.title,
            "content": p.content,
            "creator_id": p.creator_id,
            "creator_username": p.creator.username if p.creator_id else "",
            "post_type": p.post_type,
            "created_time": p.created_time.isoformat(),
            "is_banned": False,  # 可结合 Moderation 最新记录
            "status": p.post_status,
        }
        index_post(client, "competitionpost", p.pk, body)
    return {"count": qs.count()}