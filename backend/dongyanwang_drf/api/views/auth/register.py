# api/views/auth/register.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.user import RegisterSerializer
from api.utils.response_util import success_response, error_response
from api.services.auth import register_user

class RegisterView(APIView):
    def post(self, request):
        register_user(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response(msg="注册成功")
        return error_response(serializer.errors, code=status.HTTP_400_BAD_REQUEST)
