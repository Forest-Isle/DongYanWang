from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, AuthenticationFailed, NotAuthenticated, PermissionDenied, NotFound
from api.utils.response_util import error_response

def drf_exception_handler(exc, context):
    """
    DRF 自定义异常处理，统一响应结构
    """
    # 先让 DRF 处理常规异常，得到 Response 或 None
    response = exception_handler(exc, context)
    if response is not None:
        # 规范化为 error_response
        detail = response.data
        message = None
        if isinstance(exc, ValidationError):
            message = "参数校验失败"
        elif isinstance(exc, AuthenticationFailed):
            message = "认证失败"
        elif isinstance(exc, NotAuthenticated):
            message = "未认证"
        elif isinstance(exc, PermissionDenied):
            message = "无权限"
        elif isinstance(exc, NotFound):
            message = "资源不存在"

        return error_response(
            code=response.status_code,
            msg=message or detail,
            data=detail
        )

    # 未被 DRF 捕获的异常，给出 500
    return error_response(msg="服务器错误", code=500)
