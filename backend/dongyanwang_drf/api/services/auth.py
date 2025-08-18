from django.contrib.auth import authenticate
from api.serializers.user import RegisterSerializer
from api.models.user import User
from rest_framework.exceptions import ValidationError

def authenticate_user(username, password):
    user = authenticate(username=username, password=password)
    return user



def register_user(data):
    """业务逻辑校验，不直接保存"""
    username = data.get('username')
    email = data.get('email')

    if User.objects.filter(username=username).exists():
        raise ValidationError("用户名已存在")
    if User.objects.filter(email=email).exists():
        raise ValidationError("邮箱已存在")