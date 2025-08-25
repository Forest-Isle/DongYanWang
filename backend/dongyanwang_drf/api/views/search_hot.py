# api/views/search_hot.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_list_or_404
from ..search import get_search_client, search_posts
from ..hot import hot_top
from ..serializers.ops import HotItemSerializer
from ..models import CompetitionPost

class PostSearchView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        q = request.query_params.get("q", "").strip()
        page = int(request.query_params.get("page", 1))
        size = int(request.query_params.get("size", 10))
        if not q:
            return Response({"msg": "缺少 q 参数"}, status=400)
        client = get_search_client()
        res = search_posts(client, "competitionpost", q, page, size)
        hits = res.get("hits", {}).get("hits", [])
        out = [{"id": h["_id"], **h["_source"]} for h in hits]
        return Response({"msg": "ok", "data": out})

class HotPostsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        limit = int(request.query_params.get("limit", 20))
        top = hot_top("competitionpost", limit)
        # 批量拉取详情
        ids = [i for i, _ in top]
        posts = CompetitionPost.objects.filter(id__in=ids).select_related("creator")
        pmap = {p.id: p for p in posts}
        result = []
        for pid, score in top:
            p = pmap.get(pid)
            if not p:
                continue
            result.append({
                "id": p.id,
                "score": score,
                "title": p.title,
                "post_type": p.post_type,
                "creator_username": p.creator.username if p.creator_id else "",
            })
        return Response({"msg": "ok", "data": result})