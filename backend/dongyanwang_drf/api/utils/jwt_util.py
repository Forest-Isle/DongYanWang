import jwt
from datetime import datetime, timedelta
from django.conf import settings

def generate_jwt_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')