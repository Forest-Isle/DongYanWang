# Postman API Test Collection

## Base Configuration
- **Base URL**: `http://localhost:8000/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT) for protected endpoints

## Authentication Setup
1. Register a new user
2. Login to get JWT token
3. Add token to Authorization header: `Bearer <your_jwt_token>`

---

## 1. Authentication Module

### 1.1 User Registration
```http
POST {{base_url}}/auth/register/
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123"
}
```

### 1.2 User Login
```http
POST {{base_url}}/auth/login/
Content-Type: application/json

{
    "username": "testuser",
    "password": "testpass123"
}
```

### 1.3 Get User Profile
```http
GET {{base_url}}/auth/profile/
Authorization: Bearer {{jwt_token}}
```

---

## 2. Competition Module

### 2.1 List Competitions
```http
GET {{base_url}}/auth/profile/
```

### 2.2 Create Competition (Admin/Moderator)
```http
POST {{base_url}}/competition/competitions/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "全国大学生数学建模竞赛",
    "organizer": "中国工业与应用数学学会",
    "location": "全国",
    "official_website": "https://example.com",
    "is_national": true,
    "is_math_contest": true,
    "is_edu_ministry": true,
    "categories": [1, 2]
}
```

### 2.3 Follow Competition
```http
POST {{base_url}}/competition/competitions/1/follow/
Authorization: Bearer {{jwt_token}}
```

### 2.4 Create Competition Post
```http
POST {{base_url}}/competition/competition-posts/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "competition": 1,
    "title": "数学建模经验分享",
    "content": "这是一篇关于数学建模的经验分享文章...",
    "sub_post_type": "experience"
}
```

### 2.5 Like Competition Post
```http
POST {{base_url}}/competition/competition-posts/1/like/
Authorization: Bearer {{jwt_token}}
```

### 2.6 Collect Competition Post
```http
POST {{base_url}}/competition/competition-posts/1/collect/
Authorization: Bearer {{jwt_token}}
```

---

## 3. Journal Module

### 3.1 List Journals
```http
GET {{base_url}}/journal/journals/
```

### 3.2 Create Journal
```http
POST {{base_url}}/journal/journals/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Nature",
    "issn": "0028-0836",
    "publisher": "Nature Publishing Group",
    "journal_url": "https://www.nature.com",
    "is_sci": true,
    "is_oa": false,
    "categories": [1, 2]
}
```

### 3.3 Follow Journal
```http
POST {{base_url}}/journal/journals/1/follow/
Authorization: Bearer {{jwt_token}}
```

### 3.4 Create Journal Post
```http
POST {{base_url}}/journal/journal-posts/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "journal": 1,
    "title": "如何向Nature投稿",
    "content": "投稿经验分享...",
    "sub_post_type": "strategy"
}
```

---

## 4. Admissions Module

### 4.1 List Admissions
```http
GET {{base_url}}/admissions/admissions/
```

### 4.2 Create Admission
```http
POST {{base_url}}/admissions/admissions/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "清华大学计算机系研究生招生",
    "application_url": "https://admission.tsinghua.edu.cn",
    "location": "北京",
    "organizer": "清华大学",
    "cover": "https://example.com/cover.jpg",
    "is_scholarship": true,
    "is_competitive": true,
    "scholarship_amount": "50000.00",
    "sub_status": "applying",
    "categories": [1, 2]
}
```

### 4.3 Follow Admission
```http
POST {{base_url}}/admissions/admissions/1/follow/
Authorization: Bearer {{jwt_token}}
```

### 4.4 Create Admission Post
```http
POST {{base_url}}/admissions/admissions-posts/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "admissions": 1,
    "title": "清华计算机系申请攻略",
    "content": "详细申请经验...",
    "sub_post_type": "strategy"
}
```

---

## 5. Project Module

### 5.1 List Projects
```http
GET {{base_url}}/project/projects/
```

### 5.2 Create Project
```http
POST {{base_url}}/project/projects/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "人工智能算法研究项目",
    "code": "AI2024001",
    "funding_agency": "国家自然科学基金委",
    "location": "北京",
    "funding_amount": "1000000.00",
    "start_date": "2024-01-01",
    "end_date": "2026-12-31",
    "sub_status": "applying",
    "is_cooperation": false,
    "category": 1
}
```

### 5.3 Apply to Project
```http
POST {{base_url}}/project/projects/1/apply/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "motivation": "我对人工智能算法研究非常感兴趣，希望参与这个项目",
    "role_expectation": "算法研究员"
}
```

### 5.4 Follow Project
```http
POST {{base_url}}/project/projects/1/follow/
Authorization: Bearer {{jwt_token}}
```

### 5.5 Create Project Post
```http
POST {{base_url}}/project/project-posts/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "project": 1,
    "title": "AI算法开发经验分享",
    "content": "项目开发过程中的经验...",
    "sub_post_type": "experience"
}
```

---

## 6. Skill Module

### 6.1 List Skills
```http
GET {{base_url}}/skill/skills/
```

### 6.2 Create Skill
```http
POST {{base_url}}/skill/skills/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Python编程",
    "skill_type": "software",
    "difficulty": "intermediate",
    "description": "Python编程语言学习与应用",
    "is_general_software": true,
    "is_recommended": true,
    "categories": [1, 2]
}
```

### 6.3 Follow Skill
```http
POST {{base_url}}/skill/skills/1/follow/
Authorization: Bearer {{jwt_token}}
```

### 6.4 Create Skill Post
```http
POST {{base_url}}/skill/skill-posts/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "skill": 1,
    "title": "Python最佳实践指南",
    "content": "Python编程的最佳实践...",
    "sub_post_type": "guide"
}
```

---

## 7. Consultation Module

### 7.1 List Consultation Services
```http
GET {{base_url}}/consultation/services/
```

### 7.2 Create Consultation Service (Verified Users Only)
```http
POST {{base_url}}/consultation/services/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "title": "机器学习咨询",
    "description": "提供机器学习算法和模型设计咨询服务",
    "price": "500.00",
    "pricing_unit": "per_hour"
}
```

### 7.3 Create Consultation Order
```http
POST {{base_url}}/consultation/orders/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "service": 1,
    "note": "希望咨询深度学习模型优化问题",
    "scheduled_time": "2024-01-15T14:00:00Z",
    "duration_minutes": 60,
    "amount": "500.00"
}
```

---

## 8. Admin Operations

### 8.1 Review Competition
```http
POST {{base_url}}/admin/competition/1/review/
Authorization: Bearer {{admin_jwt_token}}
Content-Type: application/json

{
    "action": "approve",
    "reason": "符合平台规范"
}
```

### 8.2 Review Content (Generic)
```http
POST {{base_url}}/admin/journal/1/review/
Authorization: Bearer {{admin_jwt_token}}
Content-Type: application/json

{
    "action": "approve",
    "reason": "期刊信息准确"
}
```

### 8.3 Review Post
```http
POST {{base_url}}/admin/posts/review/
Authorization: Bearer {{admin_jwt_token}}
Content-Type: application/json

{
    "ct": "competitionpost",
    "id": 1,
    "status": "approved",
    "reason": "内容质量良好"
}
```

### 8.4 Ban Post
```http
POST {{base_url}}/admin/posts/ban/
Authorization: Bearer {{admin_jwt_token}}
Content-Type: application/json

{
    "ct": "competitionpost",
    "id": 1,
    "action": "ban",
    "reason": "违反社区规范"
}
```

### 8.5 Add Moderator
```http
POST {{base_url}}/admin/moderator/add/
Authorization: Bearer {{admin_jwt_token}}
Content-Type: application/json

{
    "competition_id": 1,
    "user_id": 2
}
```

### 8.6 Remove Moderator
```http
POST {{base_url}}/admin/moderator/remove/
Authorization: Bearer {{admin_jwt_token}}
Content-Type: application/json

{
    "id": 1,
    "reason": "不再担任版主"
}
```

---

## 9. Search & Hot Posts

### 9.1 Search Posts
```http
GET {{base_url}}/search/posts/?q=机器学习
```

### 9.2 Get Hot Posts
```http
GET {{base_url}}/hot/posts/
```

---

## 10. Comments & Interactions

### 10.1 Create Comment
```http
POST {{base_url}}/comments/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "content": "这是一条评论",
    "content_type": "competitionpost",
    "object_id": 1
}
```

### 10.2 Create Interaction
```http
POST {{base_url}}/interactions/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "content_type": "competitionpost",
    "object_id": 1,
    "interaction_type": "like"
}
```

---

## 11. Export Operations

### 11.1 Export Users CSV
```http
POST {{base_url}}/admin/export/users_csv/
Authorization: Bearer {{admin_jwt_token}}
```

### 11.2 Export Moderation Report (Excel)
```http
GET {{base_url}}/admin/export/moderation_xlsx/
Authorization: Bearer {{admin_jwt_token}}
```

### 11.3 Export Moderation Report (CSV)
```http
GET {{base_url}}/admin/export/moderation_csv/
Authorization: Bearer {{admin_jwt_token}}
```

---

## 12. Filtering & Pagination Examples

### 12.1 Filter Competitions
```http
GET {{base_url}}/competition/competitions/?is_national=true&categories__name=math&search=数学
```

### 12.2 Filter Projects by Status
```http
GET {{base_url}}/project/projects/?sub_status=ongoing&is_cooperation=false
```

### 12.3 Filter Skills by Type
```http
GET {{base_url}}/skill/skills/?skill_type=software&difficulty=advanced
```

### 12.4 Pagination
```http
GET {{base_url}}/competition/competitions/?page=2&page_size=10
```

---

## Environment Variables for Postman

Create these variables in your Postman environment:

```json
{
    "base_url": "http://localhost:8000/api",
    "jwt_token": "your_jwt_token_here",
    "admin_jwt_token": "admin_jwt_token_here"
}
```

---

## Test Scenarios

### Scenario 1: Complete User Journey
1. Register user
2. Login to get token
3. Browse competitions
4. Follow a competition
5. Create a post in competition
6. Like/collect posts
7. Apply to a project
8. Create consultation order

### Scenario 2: Admin Workflow
1. Login as admin
2. Review pending content
3. Approve/reject submissions
4. Manage moderators
5. Export reports

### Scenario 3: Search & Discovery
1. Search across all content
2. View hot posts
3. Filter by categories
4. Use pagination

---

## Error Handling Examples

### 401 Unauthorized
```http
GET {{base_url}}/competition/competitions/
Authorization: Bearer invalid_token
```

### 403 Forbidden (Unverified User Creating Consultation)
```http
POST {{base_url}}/consultation/services/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "title": "Test Service",
    "price": "100.00"
}
```

### 400 Bad Request (Duplicate Project Application)
```http
POST {{base_url}}/project/projects/1/apply/
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "motivation": "Already applied"
}
```

---

## Notes

1. **Authentication**: Most endpoints require JWT token in Authorization header
2. **File Uploads**: For endpoints with file uploads, use `multipart/form-data` instead of `application/json`
3. **Pagination**: All list endpoints support `page` and `page_size` parameters
4. **Filtering**: Use query parameters for filtering (e.g., `?is_national=true`)
5. **Search**: Use `search` parameter for text search across relevant fields
6. **Admin Operations**: Require admin-level JWT token
7. **Rate Limiting**: Some endpoints may have rate limiting applied
8. **Content Types**: Use appropriate content types for different operations

This collection covers all major functionality of the platform. Adjust the base URL and tokens according to your environment setup.
