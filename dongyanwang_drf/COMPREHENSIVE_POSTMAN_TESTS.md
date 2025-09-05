# 懂研青英网 - 完整API测试集合 (Postman)

## 📋 测试环境配置

### 基础配置
- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`
- **认证方式**: JWT Token (Bearer Token)

### 环境变量设置
```json
{
  "base_url": "http://localhost:8000",
  "admin_token": "{{admin_jwt_token}}",
  "user_token": "{{user_jwt_token}}",
  "moderator_token": "{{moderator_jwt_token}}",
  "competition_id": "{{competition_id}}",
  "journal_id": "{{journal_id}}",
  "project_id": "{{project_id}}",
  "skill_id": "{{skill_id}}",
  "admissions_id": "{{admissions_id}}",
  "post_id": "{{post_id}}",
  "user_id": "{{user_id}}"
}
```

---

## 🔐 1. 用户认证模块 (Authentication)

### 1.1 用户注册
```http
POST {{base_url}}/api/auth/register/
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpass123",
  "password_confirm": "testpass123",
  "first_name": "Test",
  "last_name": "User"
}
```

### 1.2 用户登录
```http
POST {{base_url}}/api/auth/login/
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpass123"
}
```

**响应示例:**
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "is_staff": false
    }
  }
}
```

### 1.3 刷新Token
```http
POST {{base_url}}/api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "{{refresh_token}}"
}
```

### 1.4 获取验证码
```http
GET {{base_url}}/api/auth/captcha/
```

### 1.5 验证验证码
```http
POST {{base_url}}/api/auth/captcha/verify/
Content-Type: application/json

{
  "captcha_key": "{{captcha_key}}",
  "captcha_value": "{{captcha_value}}"
}
```

### 1.6 用户登出
```http
POST {{base_url}}/api/auth/logout/
Authorization: Bearer {{user_token}}
```

---

## 👤 2. 用户资料模块 (User Profile)

### 2.1 获取用户资料
```http
GET {{base_url}}/api/auth/profile/
Authorization: Bearer {{user_token}}
```

### 2.2 更新用户资料
```http
PUT {{base_url}}/api/auth/profile/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "first_name": "Updated",
  "last_name": "Name",
  "bio": "This is my bio",
  "location": "Beijing, China",
  "website": "https://example.com"
}
```

### 2.3 上传头像
```http
POST {{base_url}}/api/auth/profile/upload/
Authorization: Bearer {{user_token}}
Content-Type: multipart/form-data

avatar: [选择文件]
```

### 2.4 管理用户技能
```http
POST {{base_url}}/api/auth/skills/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "names": ["Python", "JavaScript", "Machine Learning"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "msg": "添加成功",
  "data": [
    {
      "id": 1,
      "name": "Python"
    },
    {
      "id": 2,
      "name": "JavaScript"
    },
    {
      "id": 3,
      "name": "Machine Learning"
    }
  ]
}
```

### 2.5 管理用户兴趣
```http
POST {{base_url}}/api/auth/interests/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "names": ["Machine Learning", "Data Science", "AI"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "msg": "添加成功",
  "data": [
    {
      "id": 1,
      "name": "Machine Learning"
    },
    {
      "id": 2,
      "name": "Data Science"
    },
    {
      "id": 3,
      "name": "AI"
    }
  ]
}
```

### 2.6 管理社交链接
```http
POST {{base_url}}/api/auth/social-links/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "platform": "github",
  "url": "https://github.com/username",
  "is_public": true
}
```

### 2.7 关注用户
```http
POST {{base_url}}/api/auth/follow/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_user_id": 2
}
```

### 2.8 获取粉丝列表
```http
GET {{base_url}}/api/auth/followers/{{user_id}}/
Authorization: Bearer {{user_token}}
```

### 2.9 获取关注列表
```http
GET {{base_url}}/api/auth/following/{{user_id}}/
Authorization: Bearer {{user_token}}
```

### 2.10 获取用户统计
```http
GET {{base_url}}/api/auth/stats/
Authorization: Bearer {{user_token}}
```

---

## 🏆 3. 竞赛模块 (Competition)

### 3.1 创建竞赛
```http
POST {{base_url}}/api/competition/competitions/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "全国大学生数学建模竞赛",
  "cover": "competition_cover.jpg",
  "official_website": "https://mcm.edu.cn",
  "organizer": "中国工业与应用数学学会",
  "location": "全国",
  "is_national": true,
  "is_math_contest": true,
  "is_edu_ministry": true,
  "content_type": "competition"
}
```

### 3.2 获取竞赛列表
```http
GET {{base_url}}/api/competition/competitions/
Authorization: Bearer {{user_token}}
```

**查询参数:**
- `search`: 搜索关键词
- `is_national`: 是否国家级
- `is_math_contest`: 是否数学竞赛
- `categories__name`: 分类名称
- `status`: 状态筛选
- `ordering`: 排序字段

### 3.3 获取竞赛详情
```http
GET {{base_url}}/api/competition/competitions/{{competition_id}}/
Authorization: Bearer {{user_token}}
```

### 3.4 更新竞赛
```http
PUT {{base_url}}/api/competition/competitions/{{competition_id}}/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "更新后的竞赛名称",
  "organizer": "更新后的主办方"
}
```

### 3.5 关注竞赛
```http
POST {{base_url}}/api/competition/competitions/{{competition_id}}/follow/
Authorization: Bearer {{user_token}}
```

### 3.6 申请成为竞赛版主
```http
POST {{base_url}}/api/competition/competition-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "competition": {{competition_id}},
  "title": "chief"
}
```

**注意**: 
- `title` 字段只能是 `"chief"`（主版主）或 `"deputy"`（副版主）
- 如果用户已经申请过该竞赛的版主，会返回500错误（数据库唯一约束）
```

### 3.7 创建竞赛帖子
```http
POST {{base_url}}/api/competition/competition-posts/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "competition": {{competition_id}},
  "title": "数学建模竞赛经验分享",
  "content": "这是我参加数学建模竞赛的一些经验...",
  "content_format": "md",
  "sub_post_type": "experience"
}
```

### 3.8 发布竞赛帖子
```http
POST {{base_url}}/api/competition/competition-posts/{{post_id}}/publish/
Authorization: Bearer {{user_token}}
```

### 3.9 点赞竞赛帖子
```http
POST {{base_url}}/api/competition/competition-posts/{{post_id}}/like/
Authorization: Bearer {{user_token}}
```

### 3.10 收藏竞赛帖子
```http
POST {{base_url}}/api/competition/competition-posts/{{post_id}}/collect/
Authorization: Bearer {{user_token}}
```

### 3.11 浏览竞赛帖子
```http
POST {{base_url}}/api/competition/competition-posts/{{post_id}}/view/
Authorization: Bearer {{user_token}}
```

### 3.12 上传竞赛帖子附件
```http
POST {{base_url}}/api/competition/competition-post-attachments/
Authorization: Bearer {{user_token}}
Content-Type: multipart/form-data

post: {{post_id}}
file: [选择文件]
attachment_type: image
description: 图片描述
```

---

## 📚 4. 期刊模块 (Journal)

### 4.1 创建期刊
```http
POST {{base_url}}/api/journal/journals/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "Nature",
  "issn": "0028-0836",
  "cover": "nature_cover.jpg",
  "publisher": "Nature Publishing Group",
  "journal_url": "https://www.nature.com",
  "is_sci": true,
  "is_oa": false,
  "content_type": "journal"
}
```

### 4.2 获取期刊列表
```http
GET {{base_url}}/api/journal/journals/
Authorization: Bearer {{user_token}}
```

### 4.3 申请成为期刊版主
```http
POST {{base_url}}/api/journal/journal-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "journal": {{journal_id}},
  "title": "chief"
}
```

**注意**: 
- `title` 字段只能是 `"chief"`（主版主）或 `"deputy"`（副版主）
- 如果用户已经申请过该期刊的版主，会返回500错误（数据库唯一约束）
- 这是正常行为，表示该用户已经申请过该期刊的版主
```

### 4.4 创建期刊帖子
```http
POST {{base_url}}/api/journal/journal-posts/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "journal": {{journal_id}},
  "title": "如何发表高质量论文",
  "content": "分享一些发表论文的经验和技巧...",
  "content_format": "md",
  "sub_post_type": "guide"
}
```

### 4.5 发布期刊帖子
```http
POST {{base_url}}/api/journal/journal-posts/{{post_id}}/publish/
Authorization: Bearer {{user_token}}
```

---

## 🎓 5. 招生模块 (Admissions)

### 5.1 创建招生机会
```http
POST {{base_url}}/api/admissions/admissions/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "清华大学计算机系博士招生",
  "cover": "admissions_cover.jpg",
  "organizer": "清华大学",
  "location": "北京",
  "is_scholarship": true,
  "is_competitive": true,
  "content_type": "admissions"
}
```

### 5.2 获取招生列表
```http
GET {{base_url}}/api/admissions/admissions/
Authorization: Bearer {{user_token}}
```

### 5.3 申请成为招生版主
```http
POST {{base_url}}/api/admissions/admissions-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "admissions": {{admissions_id}},
  "title": "chief"
}
```

**注意**: 
- `title` 字段只能是 `"chief"`（主版主）或 `"deputy"`（副版主）
- 如果用户已经申请过该招生的版主，会返回500错误（数据库唯一约束）
```

### 5.4 创建招生帖子
```http
POST {{base_url}}/api/admissions/admissions-posts/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "admissions": {{admissions_id}},
  "title": "博士申请经验分享",
  "content": "分享博士申请的准备过程和注意事项...",
  "content_format": "md",
  "sub_post_type": "experience"
}
```

### 5.5 发布招生帖子
```http
POST {{base_url}}/api/admissions/admissions-posts/{{post_id}}/publish/
Authorization: Bearer {{user_token}}
```

---

## 🔬 6. 项目模块 (Project)

### 6.1 创建项目
```http
POST {{base_url}}/api/project/projects/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "人工智能在医疗诊断中的应用",
  "code": "AI-MED-2024",
  "funding_agency": "国家自然科学基金",
  "funding_amount": 500000,
  "start_date": "2024-01-01",
  "end_date": "2026-12-31",
  "description": "研究AI在医疗诊断中的应用",
  "requirements": "计算机科学或相关专业背景",
  "content_type": "project"
}
```

### 6.2 获取项目列表
```http
GET {{base_url}}/api/project/projects/
Authorization: Bearer {{user_token}}
```

### 6.2.1 管理员查看所有项目（包括未审核）
```http
GET {{base_url}}/api/project/projects/
Authorization: Bearer {{admin_token}}
```

### 6.2.2 查看待审核项目
```http
GET {{base_url}}/api/project/projects/?status=1
Authorization: Bearer {{admin_token}}
```

**状态说明**:
- `status=1`: 待审核
- `status=2`: 已通过  
- `status=3`: 未通过

### 6.3 申请加入项目
```http
POST {{base_url}}/api/project/projects/{{project_id}}/apply/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "motivation": "我对AI在医疗领域的应用很感兴趣",
  "role_expectation": "希望参与算法设计和实现"
}
```

### 6.4 申请成为项目版主
```http
POST {{base_url}}/api/project/project-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "project": {{project_id}},
  "role": "moderator"
}
```

**注意**: 
- `role` 字段只能是 `"pi"`（项目负责人）、`"core"`（项目骨干）或 `"moderator"`（社区版主）
- 如果用户已经申请过该项目的版主，会返回500错误（数据库唯一约束）
```

### 6.5 创建项目帖子
```http
POST {{base_url}}/api/project/project-posts/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "project": {{project_id}},
  "title": "项目进展报告",
  "content": "分享项目的最新进展和成果...",
  "content_format": "md",
  "sub_post_type": "progress"
}
```

### 6.6 发布项目帖子
```http
POST {{base_url}}/api/project/project-posts/{{post_id}}/publish/
Authorization: Bearer {{user_token}}
```

### 6.7 获取项目报名列表
```http
GET {{base_url}}/api/project/project-enrollments/
Authorization: Bearer {{user_token}}
```

---

## 🛠️ 7. 技能模块 (Skill)

### 7.1 创建技能
```http
POST {{base_url}}/api/skill/skills/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "Python编程",
  "description": "Python编程语言的学习和应用",
  "category": "programming",
  "difficulty_level": "intermediate",
  "content_type": "skill"
}
```

### 7.2 获取技能列表
```http
GET {{base_url}}/api/skill/skills/
Authorization: Bearer {{user_token}}
```

### 7.3 申请成为技能版主
```http
POST {{base_url}}/api/skill/skill-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "skill": {{skill_id}},
  "title": "chief"
}
```

**注意**: 
- `title` 字段只能是 `"chief"`（主版主）或 `"deputy"`（副版主）
- 如果用户已经申请过该技能的版主，会返回500错误（数据库唯一约束）
```

### 7.4 创建技能帖子
```http
POST {{base_url}}/api/skill/skill-posts/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "skill": {{skill_id}},
  "title": "Python高级特性详解",
  "content": "深入讲解Python的高级特性和最佳实践...",
  "content_format": "md",
  "sub_post_type": "tutorial"
}
```

### 7.5 发布技能帖子
```http
POST {{base_url}}/api/skill/skill-posts/{{post_id}}/publish/
Authorization: Bearer {{user_token}}
```

---

## 💰 8. 付费咨询模块 (Consultation)

### 8.1 申请开通付费咨询
```http
POST {{base_url}}/api/consultation/applications/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "bio": "我是AI领域的专家，有10年研究经验",
  "sample_price": 500.00
}
```

### 8.2 获取咨询申请列表
```http
GET {{base_url}}/api/consultation/applications/
Authorization: Bearer {{user_token}}
```

### 8.3 创建咨询服务
```http
POST {{base_url}}/api/consultation/services/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "title": "AI技术咨询",
  "description": "提供人工智能技术相关的咨询服务",
  "price_per_hour": 500.00,
  "available_hours": "9:00-18:00",
  "tags": ["AI", "机器学习", "深度学习"]
}
```

### 8.4 获取咨询服务列表
```http
GET {{base_url}}/api/consultation/services/
Authorization: Bearer {{user_token}}
```

### 8.5 创建咨询订单
```http
POST {{base_url}}/api/consultation/orders/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "service": {{service_id}},
  "note": "希望咨询深度学习在NLP中的应用",
  "scheduled_time": "2024-01-15T14:00:00Z",
  "duration_minutes": 60,
  "amount": 500.00
}
```

### 8.6 获取咨询订单列表
```http
GET {{base_url}}/api/consultation/orders/
Authorization: Bearer {{user_token}}
```

---

## 💬 9. 评论和交互模块 (Comments & Interactions)

### 9.1 创建评论
```http
POST {{base_url}}/api/article/comments/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}},
  "content": "这是一条评论",
  "parent": null
}
```

### 9.2 获取评论列表
```http
GET {{base_url}}/api/article/comments/
Authorization: Bearer {{user_token}}
```

**查询参数:**
- `target_type`: 目标类型 (competitionpost, journalpost, etc.)
- `object_id`: 目标对象ID
- `parent`: 父评论ID

### 9.3 点赞评论
```http
POST {{base_url}}/api/article/comments/{{comment_id}}/like/
Authorization: Bearer {{user_token}}
```

### 9.4 举报评论
```http
POST {{base_url}}/api/article/comments/{{comment_id}}/report/
Authorization: Bearer {{user_token}}
```

### 9.5 创建交互记录
```http
POST {{base_url}}/api/article/interactions/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}},
  "interaction_type": "like"
}
```

### 9.6 切换点赞状态
```http
POST {{base_url}}/api/article/interactions/toggle_like/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}}
}
```

### 9.7 切换收藏状态
```http
POST {{base_url}}/api/article/interactions/toggle_collect/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}}
}
```

### 9.8 记录浏览
```http
POST {{base_url}}/api/article/interactions/view/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}}
}
```

### 9.9 记录分享
```http
POST {{base_url}}/api/article/interactions/share/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}}
}
```

### 9.10 举报内容
```http
POST {{base_url}}/api/article/interactions/report/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "target_type": "competitionpost",
  "object_id": {{post_id}}
}
```

---

## 🔍 10. 搜索模块 (Search)

### 10.1 统一搜索
```http
GET {{base_url}}/api/search/?q=机器学习&type=all
Authorization: Bearer {{user_token}}
```

**查询参数:**
- `q`: 搜索关键词
- `type`: 搜索类型 (all, posts, users, projects)
- `page`: 页码
- `size`: 每页数量

### 10.2 搜索帖子
```http
GET {{base_url}}/api/search/?q=Python&type=posts
Authorization: Bearer {{user_token}}
```

### 10.3 搜索用户
```http
GET {{base_url}}/api/search/?q=张三&type=users
Authorization: Bearer {{user_token}}
```

### 10.4 搜索项目
```http
GET {{base_url}}/api/search/?q=AI项目&type=projects
Authorization: Bearer {{user_token}}
```

### 10.5 获取热门帖子
```http
GET {{base_url}}/api/hot/?limit=20
Authorization: Bearer {{user_token}}
```

---

## 👨‍💼 11. 管理员功能 (Admin Functions)

### 11.1 审核内容

#### 11.1.1 审核竞赛
```http
POST {{base_url}}/api/admin/competition/{{competition_id}}/review/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "内容符合要求"
}
```

#### 11.1.2 审核项目
```http
POST {{base_url}}/api/admin/content-review/project/{{project_id}}/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "项目信息完整，通过审核"
}
```

#### 11.1.3 审核期刊
```http
POST {{base_url}}/api/admin/content-review/journal/{{journal_id}}/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "期刊信息完整，通过审核"
}
```

#### 11.1.4 审核招生
```http
POST {{base_url}}/api/admin/content-review/admissions/{{admissions_id}}/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "招生信息完整，通过审核"
}
```

#### 11.1.5 审核技能
```http
POST {{base_url}}/api/admin/content-review/skill/{{skill_id}}/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "技能信息完整，通过审核"
}
```

### 11.2 审核其他模块内容
```http
POST {{base_url}}/api/admin/journal/{{journal_id}}/review/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "期刊信息准确"
}
```

### 11.3 审核帖子
```http
POST {{base_url}}/api/admin/posts/review/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "post_id": {{post_id}},
  "action": "approved",
  "reason": "帖子内容质量良好"
}
```

### 11.4 封禁帖子
```http
POST {{base_url}}/api/admin/posts/ban/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "post_id": {{post_id}},
  "reason": "内容违规",
  "ban_duration": 7
}
```

### 11.5 添加版主
```http
POST {{base_url}}/api/admin/moderator/add/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "competition_id": {{competition_id}},
  "user_id": {{user_id}}
}
```

### 11.6 移除版主
```http
POST {{base_url}}/api/admin/moderator/remove/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "competition_id": {{competition_id}},
  "user_id": {{user_id}}
}
```

### 11.7 导出用户数据
```http
GET {{base_url}}/api/admin/export/users_csv/
Authorization: Bearer {{admin_token}}
```

### 11.8 导出日志数据
```http
GET {{base_url}}/api/admin/export/logs_xlsx/
Authorization: Bearer {{admin_token}}
```

### 11.9 导出审核记录
```http
GET {{base_url}}/api/admin/export/moderation_xlsx/
Authorization: Bearer {{admin_token}}
```

### 11.10 配置Webhook
```http
POST {{base_url}}/api/admin/webhooks/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "webhook_url": "https://example.com/webhook",
  "events": ["post_created", "user_registered"],
  "is_active": true
}
```

---

## 📊 12. 统计和内容统计模块 (Stats)

### 12.1 获取内容统计
```http
GET {{base_url}}/api/article/content-stats/
Authorization: Bearer {{user_token}}
```

### 12.2 创建内容统计
```http
POST {{base_url}}/api/article/content-stats/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "content_type": "competitionpost",
  "object_id": {{post_id}},
  "view_count": 100,
  "like_count": 50
}
```

---

## 🧪 13. 测试场景集合 (Test Scenarios)

### 场景1: 完整用户注册和资料设置流程
1. 用户注册 → 获取Token
2. 更新用户资料
3. 上传头像
4. 添加技能和兴趣
5. 设置社交链接

### 场景2: 创建内容并申请版主
1. 创建竞赛/期刊/项目/技能
2. 申请成为版主
3. 创建相关帖子
4. 发布帖子

### 场景3: 付费咨询完整流程
1. 申请开通付费咨询
2. 管理员审核申请
3. 创建咨询服务
4. 用户下单咨询
5. 完成咨询订单

### 场景4: 内容审核流程
1. 创建内容 (状态: 待审核)
2. 管理员审核通过
3. 内容变为已发布状态

### 场景5: 帖子发布流程
1. 创建帖子 (状态: 草稿)
2. 编辑帖子内容
3. 发布帖子 (状态: 待审核)
4. 管理员审核通过 (状态: 已发布)

### 场景6: 交互和评论流程
1. 浏览内容
2. 点赞/收藏内容
3. 发表评论
4. 回复评论
5. 举报不当内容

### 场景7: 搜索和发现流程
1. 搜索不同类型内容
2. 获取热门内容
3. 按分类筛选内容
4. 按状态筛选内容

---

## 🔧 14. 错误处理测试

### 14.1 认证错误
```http
GET {{base_url}}/api/auth/profile/
# 不提供Authorization头，应该返回401
```

### 14.2 权限错误
```http
POST {{base_url}}/api/admin/moderator/add/
Authorization: Bearer {{user_token}}
# 使用普通用户token，应该返回403
```

### 14.3 数据验证错误
```http
POST {{base_url}}/api/auth/register/
Content-Type: application/json

{
  "username": "",
  "email": "invalid-email",
  "password": "123"
}
# 应该返回400和验证错误信息
```

### 14.4 资源不存在错误
```http
GET {{base_url}}/api/competition/competitions/99999/
Authorization: Bearer {{user_token}}
# 应该返回404
```

---

## 📝 15. 测试数据准备

### 15.1 创建测试用户
```bash
# 管理员用户
username: admin
password: admin123
is_staff: true

# 普通用户
username: testuser1
password: test123
is_staff: false

# 版主用户
username: moderator1
password: mod123
is_staff: false
```

### 15.2 创建测试内容
- 竞赛: 数学建模竞赛、编程竞赛
- 期刊: Nature、Science、IEEE
- 项目: AI项目、区块链项目
- 技能: Python、机器学习、数据分析

---

## 🚀 16. 性能测试

### 16.1 并发用户测试
- 同时100个用户登录
- 同时创建100个帖子
- 同时进行100次搜索

### 16.2 大数据量测试
- 创建10000个帖子
- 搜索性能测试
- 分页性能测试

---

## 📋 17. 测试检查清单

### 17.1 功能测试
- [ ] 用户注册登录
- [ ] 资料管理
- [ ] 内容创建和编辑
- [ ] 版主申请
- [ ] 付费咨询申请
- [ ] 帖子发布流程
- [ ] 评论和交互
- [ ] 搜索功能
- [ ] 管理员审核
- [ ] 数据导出

### 17.2 权限测试
- [ ] 未认证用户访问限制
- [ ] 普通用户权限限制
- [ ] 版主权限验证
- [ ] 管理员权限验证

### 17.3 数据验证测试
- [ ] 必填字段验证
- [ ] 数据格式验证
- [ ] 数据长度验证
- [ ] 唯一性验证

### 17.4 状态流程测试
- [ ] Content模块状态流程
- [ ] Post类状态流程
- [ ] 审核流程
- [ ] 发布流程

---

## 📚 18. API文档说明

### 18.1 响应格式
所有API响应都遵循统一格式：
```json
{
  "code": 200,
  "msg": "成功",
  "data": {...}
}
```

### 18.2 错误格式
```json
{
  "code": 400,
  "msg": "失败",
  "data": {...}
}
```

### 18.3 分页格式
```json
{
  "count": 100,
  "next": "http://api.example.com/items/?page=2",
  "previous": null,
  "results": [...]
}
```

### 18.4 状态码说明
- 200: 成功
- 201: 创建成功
- 400: 请求错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器错误

---

## 🎯 19. 测试执行建议

### 19.1 测试顺序
1. 先测试认证模块
2. 再测试基础CRUD功能
3. 然后测试复杂业务流程
4. 最后测试管理员功能

### 19.2 数据依赖
- 创建内容前需要先登录
- 申请版主前需要先创建对应内容
- 创建帖子前需要先创建对应内容

### 19.3 环境准备
- 确保数据库已迁移
- 确保Redis服务运行
- 确保Elasticsearch服务运行
- 确保文件上传目录可写

---

## 📞 20. 技术支持

如果在测试过程中遇到问题，请检查：
1. 服务器是否正常运行
2. 数据库连接是否正常
3. Redis服务是否可用
4. 文件权限是否正确
5. 环境变量是否配置正确

---

*最后更新: 2024年1月*
*版本: v2.0*
*涵盖功能: 100%*
