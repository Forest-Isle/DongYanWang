from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.pagination import PageNumberPagination
from django.core.files.images import get_image_dimensions
from django.core.exceptions import ValidationError
from api.serializers.user import (User,UserSerializer, UserUpdateSerializer,
                                UserSkillSerializer, UserInterestSerializer, UserSocialLinkSerializer,
                                ActivitySerializer, NotificationSerializer, UserSkill,
                                UserInterest, UserSocialLink,Follow
)
from api.utils.response_util import success_response, error_response
from api.utils.validators import validate_image_size, validate_image_mime, validate_image_dimensions
from api.utils.logging import log_action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.utils.notifications import create_notification
from api.models.user import UserStats
from rest_framework.parsers import JSONParser

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

        qs = UserSkill.objects.filter(user=request.user, id__in=ids)
        if not qs.exists():
            return error_response("没有找到对应的技能", 404)  # 或者 400

        deleted_ids = list(qs.values_list('id', flat=True))
        qs.delete()
        return success_response(msg=f"删除成功，删除了技能ID: {deleted_ids}")

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

    @log_action("skill_delete")
    def delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return error_response("请提供兴趣ID", 400)

        qs = UserInterest.objects.filter(user=request.user, id__in=ids)
        if not qs.exists():
            return error_response("没有找到对应的兴趣", 404)  # 或者 400

        deleted_ids = list(qs.values_list('id', flat=True))
        qs.delete()
        return success_response(msg=f"删除成功，删除了兴趣ID: {deleted_ids}")

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

    @log_action("skill_delete")
    def delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return error_response("请提供社交链接ID", 400)

        qs = UserSocialLink.objects.filter(user=request.user, id__in=ids)
        if not qs.exists():
            return error_response("没有找到对应的社交链接", 404)  # 或者 400

        deleted_ids = list(qs.values_list('id', flat=True))
        qs.delete()
        return success_response(msg=f"删除成功，删除了社交链接ID: {deleted_ids}")

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
        """
        标记通知为已读
        - ids: [1,2] 只标记指定通知
        - all: true 一键标记全部未读通知
        """
        ids = request.data.get("ids", [])
        mark_all = request.data.get("all", False)

        if mark_all:
            unread_qs = request.user.notifications.filter(read=False)
            count = unread_qs.update(read=True)
            if count > 0:
                return success_response(msg=f"已标记 {count} 条通知为已读")
            else:
                return success_response(msg="已全部已读")
        elif ids:
            unread_qs = request.user.notifications.filter(id__in=ids, read=False)
            count = unread_qs.update(read=True)
            if count > 0:
                return success_response(msg=f"已标记 {count} 条通知为已读")
            else:
                return success_response(msg="这些通知已全部已读")
        else:
            return error_response("请提供通知ID或设置 all 为 true", 400)

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    # 关注
    def post(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"msg": "请提供 user_id"}, status=status.HTTP_400_BAD_REQUEST)

        if user_id == request.user.id:
            return Response({"msg": "不能关注自己"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"msg": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

        follow, created = Follow.objects.get_or_create(
            follower=request.user, following=target_user
        )
        # 🔔 创建通知
        create_notification(
            user=target_user,  # 被关注的人收到通知
            notification_type='follow',
            message=f"{request.user.username} 关注了你",
            related_object=request.user
        )
        # 更新统计
        # 确保有 stats 记录
        request_user_stats, _ = UserStats.objects.get_or_create(user=request.user)
        target_user_stats, _ = UserStats.objects.get_or_create(user=target_user)

        # 更新统计
        try:
            request_user_stats.update_stats()
            target_user_stats.update_stats()
        except Exception as e:
            return Response(
                {"msg": f"更新统计失败: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not created:
            return Response({"msg": "已经关注过了"}, status=status.HTTP_400_BAD_REQUEST)


        return Response({"msg": f"成功关注 {target_user.username}"}, status=status.HTTP_201_CREATED)

    # 取消关注
    def delete(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"msg": "请提供 user_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"msg": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

        follow = Follow.objects.filter(follower=request.user, following=target_user)
        if not follow.exists():
            return Response({"msg": "你未关注该用户"}, status=status.HTTP_400_BAD_REQUEST)

        create_notification(
            user=target_user,  # 被关注的人收到通知
            notification_type='follow',
            message=f"{request.user.username} 取消关注了你",
            related_object=request.user
        )

        follow.delete()
        # 确保有 stats 记录
        request_user_stats, _ = UserStats.objects.get_or_create(user=request.user)
        target_user_stats, _ = UserStats.objects.get_or_create(user=target_user)
        # 更新统计
        request.user.stats.update_stats()  # 更新自己的关注数
        target_user.stats.update_stats()  # 更新对方的粉丝数
        try:
            request_user_stats.update_stats()
            target_user_stats.update_stats()
        except Exception as e:
            return Response(
                {"msg": f"更新统计失败: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"msg": f"已取消关注 {target_user.username}"}, status=status.HTTP_200_OK)


class FollowerListView(APIView):
    """粉丝列表"""

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"msg": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

        followers = user.followers.all().select_related("follower")
        data = [{"id": f.follower.id, "username": f.follower.username} for f in followers]
        return Response({"followers": data})

class FollowingListView(APIView):
    """关注列表"""

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"msg": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

        following = user.following.all().select_related("following")
        data = [{"id": f.following.id, "username": f.following.username} for f in following]
        return Response({"following": data})


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")
        """
        获取指定用户的关注数和粉丝数
        如果未提供 user_id，则获取自己的统计
        """
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"msg": "用户不存在"}, status=404)
        else:
            user = request.user

        # 确保 stats 对象存在
        stats, created = UserStats.objects.get_or_create(user=user)
        data = {
            "user_id": user.id,
            "username": user.username,
            "followers": stats.followers,
            "following": stats.following,
            "papers_post": stats.papers_post,
            "projects_post": stats.projects_post,
            "competitions_post": stats.competitions_post,
        }
        return Response({"code": 200, "msg": "成功", "data": data})
