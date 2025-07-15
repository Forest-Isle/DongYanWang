from django.contrib.auth import authenticate
from api.serializers.user import RegisterSerializer

def authenticate_user(username, password):
    user = authenticate(username=username, password=password)
    return user



def register_user(data):
    serializer = RegisterSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return user