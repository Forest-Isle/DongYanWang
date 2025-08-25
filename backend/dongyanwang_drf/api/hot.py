from django.conf import settings
from django_redis import get_redis_connection

def _key(model_label: str) -> str:
    return f"{settings.HOTSET_PREFIX}:{model_label}"

def hot_incr(model_label: str, obj_id: int, score: float = 1.0):
    r = get_redis_connection("default")
    r.zincrby(_key(model_label), score, obj_id)

def hot_top(model_label: str, limit: int = 20):
    r = get_redis_connection("default")
    # 返回 [(id, score), ...]
    data = r.zrevrange(_key(model_label), 0, limit - 1, withscores=True)
    return [(int(i.decode()), s) for i, s in data]