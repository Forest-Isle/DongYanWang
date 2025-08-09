from django.db import models
from models.content import ContentType
from models.user import User,DeleteModel

# 个人站点表
# 话题表
class Topic(DeleteModel):
    title = models.CharField(max_length=32, verbose_name='话题', db_index=True)
    is_hot = models.BooleanField(verbose_name='热门话题', default=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)


# 资讯表
class News(DeleteModel):
    title = models.CharField(verbose_name='文字', max_length=150)
    # 上传图片(多张图片, 用逗号隔开图片地址)
    image = models.TextField(verbose_name='图片地址', null=True, blank=True)
    # 链接
    url = models.CharField(verbose_name='链接', max_length=200, null=True, blank=True)

    # 一对多话题:一个资讯属于一个话题, 一个话题下有多个资讯
    topic = models.ForeignKey('Topic', on_delete=models.CASCADE)
    # 一对多用户
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)

    status_choices = ((1, '待审核'), (2, '通过'), (3, '未通过'))
    status = models.IntegerField(choices=status_choices, verbose_name='状态', default=1)

    collect_count = models.BigIntegerField(verbose_name='收藏数', default=0)
    recommend_count = models.BigIntegerField(verbose_name='推荐数', default=0)
    comment_count = models.BigIntegerField(default=0, verbose_name='评论数')


# 推荐表
class Recommend(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    news = models.ForeignKey('News', on_delete=models.CASCADE)
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)


# 收藏表
class Collect(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    news = models.ForeignKey('News', on_delete=models.CASCADE)
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)


# 评论表
class Comment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    news = models.ForeignKey('News', on_delete=models.CASCADE)
    content = models.CharField(max_length=150, verbose_name='内容')
    create_time = models.DateTimeField(verbose_name='评论时间', auto_now_add=True)
    # 根评论
    root = models.ForeignKey('Comment', on_delete=models.CASCADE,
                             null=True, blank=True, verbose_name='根评论',
                             related_name='descendant')
    # 父评论
    reply = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True,
                              verbose_name='回复', related_name='reply_list')

    # 根评论:1-->子评论:2-->孙评论:3
    depth = models.IntegerField(default=0, verbose_name='深度')

    # 针对根评论,保存后代更新时间
    descendant_update_datetime = models.DateTimeField(verbose_name='后代更新时间', auto_now=True)

# 点赞点踩表
class UpAndDown(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    topic = models.ForeignKey('Topic', on_delete=models.CASCADE)
    is_up = models.BooleanField()
