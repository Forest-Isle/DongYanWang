# utils/notifications.py
from django.contrib.contenttypes.models import ContentType
from api.models import Notification

def create_notification(user, notification_type, message, related_object=None):
    """
    :param user: 接收通知的用户
    :param notification_type: 类型（comment/like/follow/application）
    :param message: 通知消息
    :param related_object: 可选，关联对象（比如帖子/评论/用户等）
    """
    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        message=message,
        content_type=ContentType.objects.get_for_model(related_object) if related_object else None,
        object_id=related_object.id if related_object else None,
    )
    return notification
