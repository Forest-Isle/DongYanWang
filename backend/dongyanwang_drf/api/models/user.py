from django.db import models

class DeleteModel(models.Model):
    is_delete = models.BooleanField(verbose_name='是否删除', default=False)

    class Meta:
        abstract = True  # 不生成表，仅作为基类使用

class User(DeleteModel):
    username = models.CharField(max_length=150, unique=True, verbose_name='用户名')
    email = models.EmailField(unique=True, verbose_name='邮箱')
    password = models.CharField(max_length=128, verbose_name='密码')  # hash后长度建议128
    avatar = models.ImageField(upload_to='avatar/%Y')

    STATUS_CHOICES = (
        (1, '激活'),
        (2, '禁用'),
    )
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name='状态')

    token = models.CharField(max_length=64, verbose_name='token验证', null=True, blank=True)
    token_expiry = models.DateTimeField(verbose_name='token有效期', null=True, blank=True)

    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户'
        indexes = [
            models.Index(fields=['email'], name='idx_email'),
            models.Index(fields=['username'], name='idx_username'),
        ]
