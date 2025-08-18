from rest_framework import serializers
from api.models.user import User
from django.contrib.auth.hashers import make_password, check_password
from django.core.files import File
import os
from django.conf import settings


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone', 'avatar', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("两次输入的密码不一致")
        return attrs


    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        if not validated_data.get('avatar'):
            validated_data['avatar'] = 'b9d8936090314399a51ef9143c48678.jpg'


        return User.objects.create(**validated_data)


class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.db.models import Q
        try:
            user = User.objects.get(
                Q(email=data['username_or_email']) | Q(username=data['username_or_email']),
                is_deleted=False
            )
        except User.DoesNotExist:
            raise serializers.ValidationError("用户不存在")

        if not check_password(data['password'], user.password):
            raise serializers.ValidationError("密码错误")

        if user.status != 1:  # 禁用
            raise serializers.ValidationError("账号已禁用")

        data['user'] = user
        return data

from django.contrib.auth.hashers import make_password
from api.models.user import User, UserSkill, UserInterest, UserSocialLink, Activity, Notification

class UserSerializer(serializers.ModelSerializer):
    """用户详情序列化器，用于展示用户信息"""
    skills = serializers.StringRelatedField(many=True, read_only=True)
    interests = serializers.StringRelatedField(many=True, read_only=True)
    social_links = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'avatar', 'cover_image',
            'school', 'major', 'degree', 'grade', 'location', 'bio',
            'status', 'create_time', 'skills', 'interests', 'social_links'
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    """用户信息更新序列化器"""
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password', 'phone',
            'avatar', 'cover_image', 'school', 'major', 'degree', 'grade',
            'location', 'bio'
        ]
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
        }

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password or confirm_password:
            if password != confirm_password:
                raise serializers.ValidationError("两次输入的密码不一致")
        return attrs

    def update(self, instance, validated_data):
        # 处理密码
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)

        if password:
            instance.password = make_password(password)

        # 更新其他字段
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

# 技能序列化器
class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        fields = ['id', 'name']


# 兴趣序列化器
class UserInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInterest
        fields = ['id', 'name']


# 社交链接序列化器
class UserSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSocialLink
        fields = ['id', 'platform', 'url']

# 活动
class ActivitySerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    target_str = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['id','action','action_display','target_str','created_at']

    def get_target_str(self, obj):
        return str(obj.target)

# 通知
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','notification_type','message','read','date']