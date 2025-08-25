# api/throttles.py
import time
from django.core.cache import cache
from rest_framework.throttling import BaseThrottle

def _allow_rate(key: str, limit: int, window_sec: int) -> bool:
    """
    Redis 滑动窗口：使用 list/timestamp（简单实现基于 Django cache）
    """
    now = int(time.time())
    window_start = now - window_sec
    pipeline = cache.client.get_client(write=True).pipeline()
    # 使用 Redis ZSET：score=timestamp
    pipeline.zremrangebyscore(key, 0, window_start)
    pipeline.zadd(key, {str(now): now})
    pipeline.zcard(key)
    pipeline.expire(key, window_sec)
    _, _, count, _ = pipeline.execute()
    return count <= limit

class SlidingWindowAnonThrottle(BaseThrottle):
    scope = "anon"
    rate = (100, 60)  # 100 req / 60 sec

    def allow_request(self, request, view):
        limit, window = self.rate
        ident = request.META.get("REMOTE_ADDR", "anon")
        key = f"throttle:anon:{ident}"
        return _allow_rate(key, limit, window)

class SlidingWindowUserThrottle(BaseThrottle):
    scope = "user"
    rate = (600, 60)  # 600 req / 60 sec

    def allow_request(self, request, view):
        if not request.user.is_authenticated:
            return True
        limit, window = self.rate
        key = f"throttle:user:{request.user.id}"
        return _allow_rate(key, limit, window)