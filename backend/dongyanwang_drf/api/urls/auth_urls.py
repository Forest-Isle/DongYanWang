from django.urls import path
from api.views.auth.login import LoginView,CaptchaView
from api.views.auth.register import RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('captcha/', CaptchaView.as_view(), name='captcha')
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