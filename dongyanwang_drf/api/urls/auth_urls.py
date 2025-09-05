from django.urls import path
from api.views.auth.login import (LoginView,CaptchaView,CaptchaVerifyView,LogoutView)
from api.views.auth.register import RegisterView
from rest_framework_simplejwt.views import TokenRefreshView
from api.views.auth.profile import (UserProfileView,UserSkillView,UserInterestView,
                                    UserSocialLinkView, UserActivityView ,UserNotificationView,
                                    UserUploadAvatarView,UserDeleteView,UserStatsView,
                                    FollowView, FollowerListView, FollowingListView) # 包含更新、获取




urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path("follow/", FollowView.as_view(),name='follow'),  # 关注/取关
    path("followers/<int:user_id>/", FollowerListView.as_view(),name='followers'),  # 粉丝
    path("following/<int:user_id>/", FollowingListView.as_view(),name='following'),  # 关注
    path("stats/", UserStatsView.as_view(), name="user-stats"),

    path('captcha/', CaptchaView.as_view(), name='captcha'),
    path('captcha/verify/',CaptchaVerifyView.as_view(), name='captcha_verify'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/upload/', UserUploadAvatarView.as_view(), name='upload_avatar_or_cover'),
    path('profile/delete/', UserDeleteView.as_view(), name='delete_user'),

    path('skills/', UserSkillView.as_view(), name='user_skills'),
    path('interests/', UserInterestView.as_view(), name='user_interests'),
    path('social-links/', UserSocialLinkView.as_view(), name='user_social_links'),
    path('activities/', UserActivityView.as_view(), name='activities'),
    path('notifications/', UserNotificationView.as_view(), name='notifications'),
]

# from rest_framework import routers
# from api.views import account  # 用户相关的视图类存放地址
#
# router = routers.SimpleRouter()
# router.register(r'register', account.RegisterView, 'register')
#
# urlpatterns = [
#
# ]
#
# urlpatterns += router.urls


# from rest_framework import routers
# from api.views import account  # 用户相关的视图类存放地址
#
# router = routers.SimpleRouter()
# router.register(r'register', account.RegisterView, 'register')
#
# urlpatterns = [
#
# ]
#
# urlpatterns += router.urls