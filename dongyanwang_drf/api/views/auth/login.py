# api/views/auth/login.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.user import LoginSerializer
from api.utils.response_util import success_response, error_response
import random
from io import BytesIO
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # 简易 token 生成（建议用 JWT 替代）
            refresh = RefreshToken.for_user(user)

            return success_response({
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                 "avatar": user.avatar.url if user.avatar else None,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, msg="登录成功")
        return error_response(serializer.errors, code=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    登出接口：
    1. 前端传 refresh token，会被加入黑名单，防止刷新。
    2. 前端需要清理 access token。
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 从请求头获取 access token
        auth_header = request.headers.get("Authorization", "")
        access_token_str = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else None
        refresh_token_str = request.data.get("refresh")

        try:
            # 处理 refresh token 黑名单
            if refresh_token_str:
                token = RefreshToken(refresh_token_str)
                token.blacklist()  # 加入黑名单
            # 可选：检查 access token 是否有效
            if access_token_str:
                try:
                    AccessToken(access_token_str)  # 如果无效会抛异常
                except TokenError:
                    pass  # access token 过期或者无效，忽略
            return Response({"msg": "退出登录成功"}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"msg": "退出失败", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"msg": "退出失败", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CaptchaView(APIView):
    """验证码生成视图（支持自定义配置）"""

    # 可配置参数
    IMAGE_WIDTH = 300  # 图片宽度
    IMAGE_HEIGHT = 35  # 图片高度
    CODE_LENGTH = 4  # 验证码长度
    FONT_SIZE = 25 # 字体大小
    SESSION_KEY = 'captcha'  # session存储键名

    @staticmethod
    def get_color():
        """生成随机RGB颜色"""
        return (
            random.randint(50, 200),  # 限制范围避免颜色过浅
            random.randint(50, 200),
            random.randint(50, 200)
        )

    def get_font(self):
        try:
            font_path = r"D:\ProgramData\DongYanWang\backend\dongyanwang_drf\api\views\auth\111.ttf"
            return ImageFont.truetype(font_path, self.FONT_SIZE)
        except Exception as e:
            print(f"字体加载失败：{e}")
            return ImageFont.load_default()

    def generate_code(self):
        """生成随机验证码字符串"""
        chars = []
        for _ in range(self.CODE_LENGTH):
            # 随机选择字符类型（大小写字母+数字）
            char_type = random.choice(['upper', 'lower', 'digit'])

            if char_type == 'upper':
                chars.append(chr(random.randint(65, 90)))  # A-Z
            elif char_type == 'lower':
                chars.append(chr(random.randint(97, 122)))  # a-z
            else:
                chars.append(str(random.randint(0, 9)))  # 0-9
        return ''.join(chars)

    def get(self, request):
        """处理GET请求，生成验证码图片"""
        # 1. 创建画布（背景随机颜色）
        img = Image.new(
            'RGB',
            (self.IMAGE_WIDTH, self.IMAGE_HEIGHT),
            self.get_color()
        )
        draw = ImageDraw.Draw(img)

        # 2. 获取字体
        font = self.get_font()

        # 3. 生成并绘制验证码
        code = self.generate_code()
        for i, char in enumerate(code):
            # 计算字符位置（等间距分布）
            x_pos = int(self.IMAGE_WIDTH / (self.CODE_LENGTH + 1)) * (i + 1)

            # 绘制字符（每个字符随机颜色）
            draw.text(
                (x_pos, 0),  # 坐标
                char,
                self.get_color(),  # 字体颜色
                font
            )

        # 4. 添加干扰元素（提高安全性）
        self.add_noise(draw, img.size)

        # 5. 保存验证码到session（包含生成时间）
        request.session[self.SESSION_KEY] = {
            'code': code,
            'created_at': datetime.now().isoformat()
        }

        # 6. 返回图片响应
        return self.create_image_response(img)

    def add_noise(self, draw, image_size):
        """添加干扰元素"""
        width, height = image_size

        # 添加随机干扰点
        for _ in range(100):
            draw.point(
                (random.randint(0, width), random.randint(0, height)),
                fill=self.get_color()
            )

        # 添加随机干扰线
        for _ in range(5):
            draw.line(
                [
                    (random.randint(0, width), random.randint(0, height)),
                    (random.randint(0, width), random.randint(0, height))
                ],
                fill=self.get_color(),
                width=1
            )

    def create_image_response(self, image):
        """创建图片HTTP响应"""
        buffer = BytesIO()
        image.save(buffer, 'png')

        response = HttpResponse(
            buffer.getvalue(),
            content_type='image/png'
        )

        # 设置禁止缓存头
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'

        return response

class CaptchaVerifyView(APIView):
    def post(self, request):
        code = request.data.get("code")
        session_data = request.session.get("captcha")
        if not session_data or session_data['code'].lower() != code.lower():
            return error_response("验证码错误", 400)
        return success_response(msg="验证码正确")
