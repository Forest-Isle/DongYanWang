from functools import wraps
from api.models import OperationLog

def log_action(action: str):
    """
    装饰器：在视图里调用，自动记录操作日志
    """
    def _outer(view_func):
        @wraps(view_func)
        def _inner(self, request, *args, **kwargs):
            resp = view_func(self, request, *args, **kwargs)
            try:
                OperationLog.objects.create(
                    user=getattr(request, "user", None) if getattr(request, "user", None).is_authenticated else None,
                    action=action,
                    ip=request.META.get("REMOTE_ADDR"),
                    ua=request.META.get("HTTP_USER_AGENT", ""),
                    request_id=getattr(request, "request_id", ""),
                    extra={"path": request.path, "method": request.method, "status": getattr(resp, "status_code", None)}
                )
            except Exception:
                # 避免日志写入异常影响主流程
                pass
            return resp
        return _inner
    return _outer

