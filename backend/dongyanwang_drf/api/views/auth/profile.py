from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from django.core.files.images import get_image_dimensions
from django.core.exceptions import ValidationError
from api.serializers.user import (
    UserSerializer, UserUpdateSerializer,
    UserSkillSerializer, UserInterestSerializer, UserSocialLinkSerializer,
    ActivitySerializer, NotificationSerializer, UserSkill, UserInterest, UserSocialLink
)
from api.utils.response_util import success_response, error_response
from api.utils.validators import validate_image_size, validate_image_mime, validate_image_dimensions
from api.utils.logging import log_action


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return success_response(serializer.data)


    @log_action("profile_update")
    def put(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, msg="更新成功")
        return error_response(serializer.errors, code=400)

class UserUploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    @log_action("avatar_or_cover_upload")
    def post(self, request):
        user = request.user
        avatar_file = request.data.get("avatar")
        cover_file = request.data.get("cover_image")

        try:
            # 头像
            if avatar_file:
                validate_image_size(avatar_file, max_size_mb=5)
                validate_image_mime(avatar_file)
                validate_image_dimensions(lambda: get_image_dimensions(avatar_file), max_w=1024, max_h=1024)
                user.avatar = avatar_file  # ImageField 直接赋值

            # 封面
            if cover_file:
                validate_image_size(cover_file, max_size_mb=8)
                validate_image_mime(cover_file)
                validate_image_dimensions(lambda: get_image_dimensions(cover_file), max_w=3840, max_h=2160)
                user.cover_image = cover_file

            if not avatar_file and not cover_file:
                return error_response("请上传 avatar 或 cover_image", 400)

            user.save()
            return success_response({
                "avatar": user.avatar.url if user.avatar else None,
                "cover_image": user.cover_image.url if user.cover_image else None
            }, msg="上传成功")

        except ValidationError as ve:
            return error_response(str(ve), 400)

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @log_action("user_soft_delete")
    def delete(self, request):
        request.user.delete()
        return success_response(msg="账户已删除")

class UserSkillView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSkillSerializer(request.user.skills.all(), many=True)
        return success_response(serializer.data)

    @log_action("skill_add")
    def post(self, request):
        names = request.data.get("names", [])
        if not names:
            return error_response("缺少技能名称", 400)
        skills = []
        for name in names:
            obj, _ = UserSkill.objects.get_or_create(user=request.user, name=name)
            skills.append(obj)
        return success_response(UserSkillSerializer(skills, many=True).data, msg="添加成功")

    @log_action("skill_delete")
    def delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return error_response("请提供技能ID", 400)
        UserSkill.objects.filter(user=request.user, id__in=ids).delete()
        return success_response(msg="删除成功")

class UserInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInterestSerializer(request.user.interests.all(), many=True)
        return success_response(serializer.data)

    @log_action("interest_add")
    def post(self, request):
        names = request.data.get("names", [])
        if not names:
            return error_response("缺少兴趣名称", 400)
        objs = []
        for name in names:
            obj, _ = UserInterest.objects.get_or_create(user=request.user, name=name)
            objs.append(obj)
        return success_response(UserInterestSerializer(objs, many=True).data, msg="添加成功")

    @log_action("interest_delete")
    def delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return error_response("请提供兴趣ID", 400)
        UserInterest.objects.filter(user=request.user, id__in=ids).delete()
        return success_response(msg="删除成功")

class UserSocialLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSocialLinkSerializer(request.user.social_links.all(), many=True)
        return success_response(serializer.data)

    @log_action("social_link_add")
    def post(self, request):
        links = request.data.get("links", [])  # [{"platform":"github","url":"https://..."}, ...]
        if not links:
            return error_response("缺少链接", 400)
        objs = []
        for l in links:
            platform, url = l.get("platform"), l.get("url")
            if not platform or not url:
                return error_response("platform 与 url 必填", 400)
            obj, _ = UserSocialLink.objects.get_or_create(user=request.user, platform=platform, url=url)
            objs.append(obj)
        return success_response(UserSocialLinkSerializer(objs, many=True).data, msg="添加成功")

    @log_action("social_link_delete")
    def delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return error_response("请提供链接ID", 400)
        UserSocialLink.objects.filter(user=request.user, id__in=ids).delete()
        return success_response(msg="删除成功")

class UserActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        paginator = StandardResultsSetPagination()
        qs = request.user.activity_set.all().order_by('-created_at')
        page = paginator.paginate_queryset(qs, request)
        data = ActivitySerializer(page, many=True).data
        return paginator.get_paginated_response(data)

class UserNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        paginator = StandardResultsSetPagination()
        qs = request.user.notifications.all().order_by('-date')
        page = paginator.paginate_queryset(qs, request)
        data = NotificationSerializer(page, many=True).data
        return paginator.get_paginated_response(data)

    @log_action("notification_mark_read")
    def put(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return error_response("请提供通知ID", 400)
        request.user.notifications.filter(id__in=ids).update(read=True)
        return success_response(msg="标记已读")
