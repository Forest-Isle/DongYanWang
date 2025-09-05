# 前后端端口对接配置指南

## 概述

本项目已完成前后端端口对接配置，支持前端React应用与后端Django API的无缝通信。

## 端口配置

- **后端 (Django)**: `http://127.0.0.1:8000`
- **前端 (React)**: `http://localhost:3000`

## 已完成的配置

### 1. 后端配置 (Django)

#### CORS设置
- 已安装并配置 `django-cors-headers`
- 允许前端跨域访问
- 支持认证token传递

#### 关键配置项
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_ALL_ORIGINS = DEBUG  # 开发环境允许所有来源
CORS_ALLOW_CREDENTIALS = True   # 允许携带认证信息
```

### 2. 前端配置 (React)

#### API配置文件
- `src/config/api.js` - 统一管理API端点
- `src/services/api.js` - 封装HTTP请求和认证

#### 关键特性
- 自动token管理
- 请求/响应拦截器
- 错误处理和token刷新
- 统一的API调用接口

## 快速启动

### 方法1: 使用启动脚本 (推荐)

#### Windows
```bash
# 1. 安装依赖
install-dependencies.bat

# 2. 启动开发环境
start-dev.bat
```

#### Linux/Mac
```bash
# 1. 安装依赖
chmod +x install-dependencies.sh
./install-dependencies.sh

# 2. 启动开发环境
chmod +x start-dev.sh
./start-dev.sh
```

### 方法2: 手动启动

#### 启动后端
```bash
cd dongyanwang_drf
pip install django-cors-headers  # 如果还没安装
python manage.py runserver 0.0.0.0:8000
```

#### 启动前端
```bash
cd frontend
npm install axios  # 如果还没安装
npm start
```

## API使用示例

### 认证相关
```javascript
import { authAPI } from './services/api';

// 登录
const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  // token会自动保存到localStorage
};

// 注册
const register = async (userData) => {
  const response = await authAPI.register(userData);
};
```

### 内容模块
```javascript
import { contentAPI } from './services/api';

// 获取竞赛列表
const competitions = await contentAPI.competitions.list();

// 获取项目详情
const project = await contentAPI.projects.detail(1);

// 申请项目
await contentAPI.projects.apply(1, { motivation: '申请理由' });
```

## 已集成的组件

### 认证页面
- ✅ `LoginPage.js` - 集成真实登录API
- ✅ `RegisterPage.js` - 集成真实注册API

### 待集成的组件
- ⏳ 各模块的首页组件 (获取数据列表)
- ⏳ 详情页面组件 (获取详情数据)
- ⏳ 创建/编辑表单组件

## 开发注意事项

### 1. 认证流程
- 登录成功后，token自动保存到localStorage
- 所有API请求自动携带Authorization头
- token过期时自动刷新

### 2. 错误处理
- 统一的错误处理机制
- 用户友好的错误提示
- 网络错误自动重试

### 3. 开发调试
- 后端API文档: `http://127.0.0.1:8000/api/`
- 前端开发工具: React DevTools
- 网络请求调试: 浏览器开发者工具

## 常见问题

### Q: 前端无法访问后端API
A: 检查CORS配置，确保后端允许前端域名访问

### Q: 登录后token丢失
A: 检查localStorage是否被清除，确认token保存逻辑

### Q: API请求失败
A: 检查后端服务是否正常运行，查看控制台错误信息

## 下一步开发

1. 完善各模块的数据展示组件
2. 实现CRUD操作界面
3. 添加数据加载状态和错误处理
4. 优化用户体验和界面交互

## 技术栈

- **后端**: Django + DRF + MySQL + Redis
- **前端**: React + Ant Design + Axios
- **认证**: JWT Token
- **跨域**: django-cors-headers
