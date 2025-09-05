# api/views/search_hot.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_list_or_404
from django.contrib.auth import get_user_model
from ..search import get_search_client, search_posts
from ..hot import hot_top
from ..serializers.ops import HotItemSerializer
from ..models import CompetitionPost
from api.models.journal import JournalPost
from api.models.admissions import AdmissionsPost
from api.models.project import ProjectPost
from api.models.skill import SkillPost

User = get_user_model()

class PostSearchView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        q = request.query_params.get("q", "").strip()
        page = int(request.query_params.get("page", 1))
        size = int(request.query_params.get("size", 10))
        search_type = request.query_params.get("type", "all")  # all, posts, users, projects
        
        if not q:
            return Response({"msg": "缺少 q 参数"}, status=400)
        
        results = []
        
        # Search posts if type is all or posts
        if search_type in ["all", "posts"]:
            post_models = [
                ("competitionpost", CompetitionPost),
                ("journalpost", JournalPost),
                ("admissionspost", AdmissionsPost),
                ("projectpost", ProjectPost),
                ("skillpost", SkillPost),
            ]
            
            for model_name, model_class in post_models:
                try:
                    client = get_search_client()
                    res = search_posts(client, model_name, q, page, size)
                    hits = res.get("hits", {}).get("hits", [])
                    for h in hits:
                        results.append({
                            "id": h["_id"],
                            "type": "post",
                            "subtype": model_name.replace("post", ""),
                            "title": h["_source"].get("title", ""),
                            "content": h["_source"].get("content", ""),
                            "creator_username": h["_source"].get("creator_username", ""),
                            "created_time": h["_source"].get("created_time", ""),
                        })
                except Exception as e:
                    # Fallback to DB search if ES fails
                    posts = model_class.objects.filter(
                        Q(title__icontains=q) | Q(content__icontains=q),
                        post_status="published"
                    ).select_related("creator")[:size]
                    for post in posts:
                        results.append({
                            "id": post.id,
                            "type": "post",
                            "subtype": model_name.replace("post", ""),
                            "title": post.title,
                            "content": post.content[:200] + "..." if len(post.content) > 200 else post.content,
                            "creator_username": post.creator.username if post.creator else "",
                            "created_time": post.created_time.isoformat() if post.created_time else "",
                        })
        
        # Search users if type is all or users
        if search_type in ["all", "users"]:
            users = User.objects.filter(
                Q(username__icontains=q) | Q(email__icontains=q)
            )[:size]
            for user in users:
                results.append({
                    "id": user.id,
                    "type": "user",
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                })
        
        # Search projects if type is all or projects
        if search_type in ["all", "projects"]:
            from api.models.project import Project
            projects = Project.objects.filter(
                Q(name__icontains=q) | Q(code__icontains=q),
                status=2  # Only approved projects
            )[:size]
            for project in projects:
                results.append({
                    "id": project.id,
                    "type": "project",
                    "name": project.name,
                    "code": project.code,
                    "funding_agency": project.funding_agency,
                    "sub_status": project.sub_status,
                })
        
        return Response({"msg": "ok", "data": results, "total": len(results)})

class HotPostsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        limit = int(request.query_params.get("limit", 20))
        top = hot_top("competitionpost", limit)
        # 批量拉取详情
        ids = [i for i, _ in top]
        posts = CompetitionPost.objects.filter(id__in=ids, post_status="published").select_related("creator")
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