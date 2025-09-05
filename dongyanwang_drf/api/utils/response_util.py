from rest_framework.response import Response

def success_response(data=None, msg='成功', code=200):
    return Response({
        'code': code,
        'msg': msg,
        'data': data,
    }, status=code)

def error_response(msg='失败', code=400, data=None):
    return Response({
        'code': code,
        'msg': msg,
        'data': data,
    }, status=code)

