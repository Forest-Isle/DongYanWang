from django.db import models
from models.user import User,DeleteModel


class ContentType(DeleteModel):
    """内容类型基础模型（论文/项目/竞赛/实习的父类）"""
    CONTENT_CHOICES = (
        ('paper', '学术论文'),
        ('project', '科研项目'),
        ('competition', '学科竞赛'),
        ('internship', '实习机会'),
        ('news', '行业资讯')
    )

    title = models.CharField(max_length=100, verbose_name='标题')
    creator = models.ForeignKey('User', on_delete=models.CASCADE, verbose_name='创建者')
    content_type = models.CharField(max_length=20, choices=CONTENT_CHOICES, verbose_name='内容类型')
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    status_choices = ((1, '待审核'), (2, '通过'), (3, '未通过'))
    status = models.IntegerField(choices=status_choices, verbose_name='状态', default=1)

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['content_type', 'created_time']),
        ]


# class ResearchProject(ContentType):
#     """科研项目专项字段"""
#     PI = models.CharField(max_length=50, verbose_name='项目负责人')
#     institution = models.CharField(max_length=100, verbose_name='所属机构')
#     funding_source = models.CharField(max_length=100, blank=True, verbose_name='资金来源')
#     duration = models.CharField(max_length=50, verbose_name='项目周期')
#
#
# class Competition(ContentType):
#     """学科竞赛专项字段"""
#     organizer = models.CharField(max_length=100, verbose_name='主办方')
#     deadline = models.DateField(verbose_name='截止日期')
#     prize_setting = models.TextField(verbose_name='奖项设置（JSON存储）')
#
#
# class Internship(ContentType):
#     """实习专项字段"""
#     company = models.ForeignKey('Company', on_delete=models.CASCADE, verbose_name='企业')
#     position = models.CharField(max_length=100, verbose_name='职位')
#     location = models.CharField(max_length=100, verbose_name='工作地点')
#     apply_url = models.URLField(verbose_name='申请链接')