from rest_framework import serializers
from api.models.user import User
from django.contrib.auth.hashers import make_password, check_password

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']
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
        return User.objects.create(**validated_data)


class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.db.models import Q
        try:
            user = User.objects.get(
                Q(email=data['username_or_email']) | Q(username=data['username_or_email']),
                is_delete=False
            )
        except User.DoesNotExist:
            raise serializers.ValidationError("用户不存在")

        if not check_password(data['password'], user.password):
            raise serializers.ValidationError("密码错误")

        data['user'] = user
        return data
