# 版主申请示例

## 概述
版主申请需要提供对应的内容ID和职位类型。每个用户对同一个内容只能申请一次版主。

## 申请格式

### 1. 竞赛版主申请
```http
POST {{base_url}}/api/competition/competition-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "competition": 1,
  "title": "chief"
}
```

**字段说明**:
- `competition`: 竞赛ID（必填）
- `title`: 职位类型，只能是 `"chief"`（主版主）或 `"deputy"`（副版主）

### 2. 期刊版主申请
```http
POST {{base_url}}/api/journal/journal-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "journal": 1,
  "title": "chief"
}
```

**字段说明**:
- `journal`: 期刊ID（必填）
- `title`: 职位类型，只能是 `"chief"`（主版主）或 `"deputy"`（副版主）

### 3. 招生版主申请
```http
POST {{base_url}}/api/admissions/admissions-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "admissions": 1,
  "title": "chief"
}
```

**字段说明**:
- `admissions`: 招生ID（必填）
- `title`: 职位类型，只能是 `"chief"`（主版主）或 `"deputy"`（副版主）

### 4. 项目版主申请
```http
POST {{base_url}}/api/project/project-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "project": 1,
  "role": "moderator"
}
```

**字段说明**:
- `project`: 项目ID（必填）
- `role`: 角色类型，只能是 `"pi"`（项目负责人）、`"core"`（项目骨干）或 `"moderator"`（社区版主）

### 5. 技能版主申请
```http
POST {{base_url}}/api/skill/skill-moderators/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "skill": 1,
  "title": "chief"
}
```

**字段说明**:
- `skill`: 技能ID（必填）
- `title`: 职位类型，只能是 `"chief"`（主版主）或 `"deputy"`（副版主）

## 常见错误

### 1. 重复申请错误
```
django.db.utils.IntegrityError: (1062, "Duplicate entry '1-1' for key 'api_journalmoderator.api_journalmoderator_journal_id_user_id_8c333426_uniq'")
```

**原因**: 用户已经申请过该内容的版主
**解决方案**: 这是正常行为，表示该用户已经申请过该内容的版主

### 2. 字段值错误
```json
{
  "title": ["此字段必须是有效选项。"]
}
```

**原因**: `title` 或 `role` 字段的值不在允许的选项中
**解决方案**: 使用正确的字段值（见上面的字段说明）

### 3. 缺少必填字段
```json
{
  "journal": ["此字段是必需的。"]
}
```

**原因**: 缺少必填的ID字段
**解决方案**: 提供正确的内容ID

## 成功响应示例
```json
{
  "id": 1,
  "journal": 1,
  "user": "username",
  "title": "chief",
  "is_active": false
}
```

**注意**: 新申请的版主 `is_active` 默认为 `false`，需要管理员审核通过后才会变为 `true`。
