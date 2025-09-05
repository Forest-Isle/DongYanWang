// API配置文件
const API_CONFIG = {
  // 开发环境
  development: {
    baseURL: 'http://127.0.0.1:8000',
    timeout: 10000,
  },
  // 生产环境
  production: {
    baseURL: 'https://api.dongyanwang.com',
    timeout: 10000,
  },
  // 测试环境
  test: {
    baseURL: 'http://127.0.0.1:8000',
    timeout: 5000,
  }
};

// 根据环境变量选择配置
const env = process.env.NODE_ENV || 'development';
const config = API_CONFIG[env];

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    REFRESH: '/api/auth/refresh/',
    LOGOUT: '/api/auth/logout/',
    PROFILE: '/api/auth/profile/',
    SKILLS: '/api/auth/skills/',
    INTERESTS: '/api/auth/interests/',
  },
  
  // 内容模块
  COMPETITIONS: {
    LIST: '/api/competition/competitions/',
    DETAIL: (id) => `/api/competition/competitions/${id}/`,
    CATEGORIES: '/api/competition/categories/',
    POSTS: '/api/competition/posts/',
    POST_DETAIL: (id) => `/api/competition/posts/${id}/`,
  },
  
  JOURNALS: {
    LIST: '/api/journal/journals/',
    DETAIL: (id) => `/api/journal/journals/${id}/`,
    CATEGORIES: '/api/journal/categories/',
    POSTS: '/api/journal/posts/',
    POST_DETAIL: (id) => `/api/journal/posts/${id}/`,
  },
  
  PROJECTS: {
    LIST: '/api/project/projects/',
    DETAIL: (id) => `/api/project/projects/${id}/`,
    CATEGORIES: '/api/project/categories/',
    POSTS: '/api/project/posts/',
    POST_DETAIL: (id) => `/api/project/posts/${id}/`,
    APPLY: (id) => `/api/project/projects/${id}/apply/`,
    ENROLLMENTS: '/api/project/enrollments/',
  },
  
  ADMISSIONS: {
    LIST: '/api/admissions/admissions/',
    DETAIL: (id) => `/api/admissions/admissions/${id}/`,
    CATEGORIES: '/api/admissions/categories/',
    POSTS: '/api/admissions/posts/',
    POST_DETAIL: (id) => `/api/admissions/posts/${id}/`,
  },
  
  SKILLS: {
    LIST: '/api/skill/skills/',
    DETAIL: (id) => `/api/skill/skills/${id}/`,
    CATEGORIES: '/api/skill/categories/',
    POSTS: '/api/skill/posts/',
    POST_DETAIL: (id) => `/api/skill/posts/${id}/`,
  },
  
  CONSULTATION: {
    SERVICES: '/api/consultation/services/',
    ORDERS: '/api/consultation/orders/',
    APPLICATIONS: '/api/consultation/applications/',
  },
  
  // 通用功能
  COMMON: {
    SEARCH: '/api/search/',
    HOT_POSTS: '/api/hot-posts/',
    COMMENTS: '/api/article/comments/',
    INTERACTIONS: '/api/article/interactions/',
  },
  
  // 管理功能
  ADMIN: {
    CONTENT_REVIEW: (model, id) => `/api/admin/content-review/${model}/${id}/`,
    POST_REVIEW: (id) => `/api/admin/post-review/${id}/`,
    POST_BAN: (id) => `/api/admin/post-ban/${id}/`,
    MODERATOR_MANAGE: '/api/admin/moderator-manage/',
    EXPORTS: '/api/admin/exports/',
  }
};

// 导出配置
export const API_BASE_URL = config.baseURL;
export const API_TIMEOUT = config.timeout;

// 默认请求头
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// 认证相关
export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export default config;
