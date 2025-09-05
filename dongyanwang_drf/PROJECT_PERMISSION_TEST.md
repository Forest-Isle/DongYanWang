# 项目权限测试指南

## 权限逻辑说明

### 项目状态流转
```
创建 → 待审核 (status=1) → 管理员审核 → 已通过 (status=2) → 对普通用户可见
                ↓
            未通过 (status=3) → 不对普通用户可见
```

### 权限层级
1. **管理员**: 可以看到所有项目（包括待审核、已通过、未通过）
2. **项目版主**: 可以看到已通过的项目 + 自己管理的项目（无论状态）
3. **普通用户**: 只能看到已通过的项目

## 测试场景

### 场景1: 用户创建项目
1. **操作**: 普通用户创建项目
2. **预期结果**: 
   - 项目状态为 `status=1`（待审核）
   - 创建者自动成为版主
   - 创建者可以看到自己的项目（即使待审核）
   - 其他普通用户看不到这个项目

### 场景2: 管理员审核项目
1. **操作**: 管理员审核项目
2. **预期结果**:
   - 审核通过：`status=2`，所有用户都能看到
   - 审核拒绝：`status=3`，只有管理员和版主能看到

### 场景3: 版主权限
1. **操作**: 用户申请成为项目版主
2. **预期结果**:
   - 版主可以看到自己管理的项目，无论状态如何
   - 版主不能看到其他待审核的项目

## API测试示例

### 1. 创建项目（普通用户）
```http
POST {{base_url}}/api/project/projects/
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "name": "测试项目",
  "code": "TEST001",
  "funding_agency": "测试机构",
  "location": "北京"
}
```

**预期响应**:
```json
{
  "id": 1,
  "name": "测试项目",
  "status": 1,  // 待审核
  "sub_status": "applying"
}
```

### 2. 查看项目列表（同一用户）
```http
GET {{base_url}}/api/project/projects/
Authorization: Bearer {{user_token}}
```

**预期结果**: 可以看到自己创建的项目（因为自己是版主）

### 3. 查看项目列表（其他用户）
```http
GET {{base_url}}/api/project/projects/
Authorization: Bearer {{other_user_token}}
```

**预期结果**: 看不到待审核的项目

### 4. 管理员审核项目
```http
POST {{base_url}}/api/admin/content-review/project/1/
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "action": "approve",
  "reason": "项目信息完整，通过审核"
}
```

### 5. 查看项目列表（所有用户）
```http
GET {{base_url}}/api/project/projects/
Authorization: Bearer {{any_user_token}}
```

**预期结果**: 所有用户都能看到已审核通过的项目

## 权限验证要点

### ✅ 正确的行为
- 项目创建者可以看到自己的待审核项目
- 版主可以看到自己管理的项目（无论状态）
- 普通用户只能看到已审核通过的项目
- 管理员可以看到所有项目

### ❌ 错误的行为
- 普通用户看到其他用户的待审核项目
- 项目创建者看不到自己的项目
- 已审核通过的项目对普通用户不可见

## 总结

当前的权限设计是**正确的**：

1. **项目创建者**需要能够看到和管理自己的项目，即使待审核
2. **版主**需要管理权限，可以看到自己管理的项目
3. **普通用户**只能看到已审核通过的项目，确保内容质量
4. **管理员**有完全权限，可以管理所有项目

这种设计既保证了内容审核的严格性，又保证了项目创建者和版主的管理需求。
