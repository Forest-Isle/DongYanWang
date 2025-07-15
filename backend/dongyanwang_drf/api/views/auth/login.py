# api/views/auth/login.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.user import LoginSerializer
from api.utils.response_util import success_response, error_response
import uuid
from datetime import datetime, timedelta

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # 简易 token 生成（建议用 JWT 替代）
            user.token = uuid.uuid4().hex
            user.token_expiry = datetime.now() + timedelta(days=7)
            user.save()
            return success_response({
                "email": user.email,
                "token": user.token,
                "token_expiry": user.token_expiry
            }, msg="登录成功")
        return error_response(serializer.errors, code=status.HTTP_400_BAD_REQUEST)
