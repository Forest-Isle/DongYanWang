
from rest_framework.permissions import BasePermission, SAFE_METHODS
class IsOwnerOrReadOnly(BasePermission):
    """对象的创建者可写，其他只读"""
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        creator = getattr(obj, "creator", None)
        return creator == request.user

class IsModeratorOrReadOnly(BasePermission):
    """
    竞赛版主（chief/deputy）对该 competition 下的帖子具备写权限；
    其他人只读（或仅对自己的帖子可写，交由 IsOwnerOrReadOnly 叠加判断）
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        # competition 对象或帖子对象
        competition = getattr(obj, "competition", None) or obj
        if not user.is_authenticated:
            return False
        return competition.moderators.filter(user=user, is_active=True).exists()



class IsAdminUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)