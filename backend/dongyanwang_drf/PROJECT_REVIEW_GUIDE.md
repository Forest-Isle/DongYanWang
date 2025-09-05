# 项目审核指南

## 概述
项目审核是管理员的重要功能，用于审核用户创建的项目是否合规、信息是否完整。

## 项目状态说明

### 审核状态 (status)
- `1`: 待审核 - 新创建的项目，等待管理员审核
- `2`: 已通过 - 管理员审核通过，项目对用户可见
- `3`: 未通过 - 管理员审核拒绝，项目不对外显示

### 项目状态 (sub_status)
- `applying`: 申请中 - 项目处于申请阶段
- `ongoing`: 进行中 - 项目正在执行
- `completed`: 已结题 - 项目已完成
- `paused`: 已暂停 - 项目暂时停止

## 查看未审核项目

### 1. 查看所有项目（管理员）
```http
GET {{base_url}}/api/project/projects/
Authorization: Bearer {{admin_token}}
```

### 2. 只查看待审核项目
```http
GET {{base_url}}/api/project/projects/?status=1
Authorization: Bearer {{admin_token}}
```

### 3. 查看特定项目详情
```http
GET {{base_url}}/api/project/projects/{{project_id}}/
Authorization: Bearer {{admin_token}}
```

## 审核项目

### 审核通过
```http
POST {{base_url}}/api/admin/content-review/project/{{project_id}}/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "项目信息完整，符合要求，通过审核"
}
```

### 审核拒绝
```http
POST {{base_url}}/api/admin/content-review/project/{{project_id}}/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "reject",
  "reason": "项目信息不完整，需要补充以下内容：1. 详细的项目描述 2. 明确的研究目标"
}
```

## 审核标准

### 通过标准
- ✅ 项目名称清晰明确
- ✅ 项目描述详细完整
- ✅ 研究目标明确
- ✅ 申请要求合理
- ✅ 联系方式有效
- ✅ 项目时间安排合理

### 拒绝标准
- ❌ 项目信息过于简单
- ❌ 缺少必要的联系方式
- ❌ 项目描述模糊不清
- ❌ 申请要求不合理
- ❌ 包含不当内容
- ❌ 重复或垃圾信息

## 审核流程

1. **接收通知**: 新项目创建后，管理员会收到通知
2. **查看项目**: 访问项目详情页面，仔细阅读项目信息
3. **评估标准**: 根据审核标准评估项目质量
4. **做出决定**: 选择通过或拒绝，并填写审核理由
5. **通知用户**: 系统自动通知项目创建者审核结果

## 常见问题

### Q: 如何批量审核项目？
A: 目前需要逐个审核，未来可以考虑添加批量审核功能。

### Q: 审核后可以修改决定吗？
A: 可以，管理员可以重新审核并修改状态。

### Q: 用户可以看到审核理由吗？
A: 是的，审核理由会通知给项目创建者。

### Q: 被拒绝的项目可以重新提交吗？
A: 可以，用户修改后可以重新提交审核。

## 权限说明

- **管理员**: 可以查看和审核所有项目
- **项目创建者**: 只能查看自己创建的项目
- **项目版主**: 可以查看自己管理的项目
- **普通用户**: 只能查看已通过审核的项目

## 审核记录

所有审核操作都会记录在 `Moderation` 表中，包括：
- 审核人
- 审核时间
- 审核结果
- 审核理由
- 项目ID

这确保了审核过程的透明度和可追溯性。
