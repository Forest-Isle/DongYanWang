import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理token刷新和错误
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是401错误且不是刷新token的请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem(AUTH_TOKEN_KEY, access);
          
          // 重新发送原始请求
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除token并跳转到登录页
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// 通用API方法
export const api = {
  // GET请求
  get: (url, config = {}) => apiClient.get(url, config),
  
  // POST请求
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  
  // PUT请求
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  
  // PATCH请求
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  
  // DELETE请求
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // 文件上传
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// 认证相关API
export const authAPI = {
  // 登录
  login: (credentials) => {
    // 将username字段转换为username_or_email
    const loginData = {
      username_or_email: credentials.username,
      password: credentials.password
    };
    return api.post('/api/auth/login/', loginData);
  },
  
  // 注册
  register: (userData) => api.post('/api/auth/register/', userData),
  
  // 刷新token
  refresh: (refreshToken) => api.post('/api/auth/refresh/', { refresh: refreshToken }),
  
  // 登出
  logout: () => api.post('/api/auth/logout/'),
  
  // 获取用户信息
  getProfile: () => api.get('/api/auth/profile/'),
  
  // 更新用户信息
  updateProfile: (data) => api.patch('/api/auth/profile/', data),
  
  // 用户技能管理
  getSkills: () => api.get('/api/auth/skills/'),
  addSkills: (skills) => api.post('/api/auth/skills/', { names: skills }),
  removeSkill: (skillId) => api.delete(`/api/auth/skills/${skillId}/`),
  
  // 用户兴趣管理
  getInterests: () => api.get('/api/auth/interests/'),
  addInterests: (interests) => api.post('/api/auth/interests/', { names: interests }),
  removeInterest: (interestId) => api.delete(`/api/auth/interests/${interestId}/`),
};

// 内容模块API
export const contentAPI = {
  // 竞赛模块
  competitions: {
    list: (params = {}) => api.get('/api/competition/competitions/', { params }),
    detail: (id) => api.get(`/api/competition/competitions/${id}/`),
    categories: () => api.get('/api/competition/categories/'),
    posts: (params = {}) => api.get('/api/competition/posts/', { params }),
    postDetail: (id) => api.get(`/api/competition/posts/${id}/`),
    createPost: (data) => api.post('/api/competition/posts/', data),
    updatePost: (id, data) => api.patch(`/api/competition/posts/${id}/`, data),
    deletePost: (id) => api.delete(`/api/competition/posts/${id}/`),
    publishPost: (id) => api.post(`/api/competition/posts/${id}/publish/`),
  },
  
  // 期刊模块
  journals: {
    list: (params = {}) => api.get('/api/journal/journals/', { params }),
    detail: (id) => api.get(`/api/journal/journals/${id}/`),
    categories: () => api.get('/api/journal/categories/'),
    posts: (params = {}) => api.get('/api/journal/posts/', { params }),
    postDetail: (id) => api.get(`/api/journal/posts/${id}/`),
    createPost: (data) => api.post('/api/journal/posts/', data),
    updatePost: (id, data) => api.patch(`/api/journal/posts/${id}/`, data),
    deletePost: (id) => api.delete(`/api/journal/posts/${id}/`),
    publishPost: (id) => api.post(`/api/journal/posts/${id}/publish/`),
  },
  
  // 项目模块
  projects: {
    list: (params = {}) => api.get('/api/project/projects/', { params }),
    detail: (id) => api.get(`/api/project/projects/${id}/`),
    categories: () => api.get('/api/project/categories/'),
    posts: (params = {}) => api.get('/api/project/posts/', { params }),
    postDetail: (id) => api.get(`/api/project/posts/${id}/`),
    createPost: (data) => api.post('/api/project/posts/', data),
    updatePost: (id, data) => api.patch(`/api/project/posts/${id}/`, data),
    deletePost: (id) => api.delete(`/api/project/posts/${id}/`),
    publishPost: (id) => api.post(`/api/project/posts/${id}/publish/`),
    apply: (id, data = {}) => api.post(`/api/project/projects/${id}/apply/`, data),
    enrollments: (params = {}) => api.get('/api/project/enrollments/', { params }),
  },
  
  // 招生模块
  admissions: {
    list: (params = {}) => api.get('/api/admissions/admissions/', { params }),
    detail: (id) => api.get(`/api/admissions/admissions/${id}/`),
    categories: () => api.get('/api/admissions/categories/'),
    posts: (params = {}) => api.get('/api/admissions/posts/', { params }),
    postDetail: (id) => api.get(`/api/admissions/posts/${id}/`),
    createPost: (data) => api.post('/api/admissions/posts/', data),
    updatePost: (id, data) => api.patch(`/api/admissions/posts/${id}/`, data),
    deletePost: (id) => api.delete(`/api/admissions/posts/${id}/`),
    publishPost: (id) => api.post(`/api/admissions/posts/${id}/publish/`),
  },
  
  // 技能模块
  skills: {
    list: (params = {}) => api.get('/api/skill/skills/', { params }),
    detail: (id) => api.get(`/api/skill/skills/${id}/`),
    categories: () => api.get('/api/skill/categories/'),
    posts: (params = {}) => api.get('/api/skill/posts/', { params }),
    postDetail: (id) => api.get(`/api/skill/posts/${id}/`),
    createPost: (data) => api.post('/api/skill/posts/', data),
    updatePost: (id, data) => api.patch(`/api/skill/posts/${id}/`, data),
    deletePost: (id) => api.delete(`/api/skill/posts/${id}/`),
    publishPost: (id) => api.post(`/api/skill/posts/${id}/publish/`),
  },
};

// 通用功能API
export const commonAPI = {
  // 搜索
  search: (query, params = {}) => api.get('/api/search/', { params: { q: query, ...params } }),
  
  // 热门内容
  hotPosts: (params = {}) => api.get('/api/hot-posts/', { params }),
  
  // 评论
  comments: {
    list: (params = {}) => api.get('/api/article/comments/', { params }),
    create: (data) => api.post('/api/article/comments/', data),
    update: (id, data) => api.patch(`/api/article/comments/${id}/`, data),
    delete: (id) => api.delete(`/api/article/comments/${id}/`),
  },
  
  // 交互（点赞、收藏等）
  interactions: {
    list: (params = {}) => api.get('/api/article/interactions/', { params }),
    create: (data) => api.post('/api/article/interactions/', data),
    delete: (id) => api.delete(`/api/article/interactions/${id}/`),
  },
};

// 咨询模块API
export const consultationAPI = {
  services: {
    list: (params = {}) => api.get('/api/consultation/services/', { params }),
    detail: (id) => api.get(`/api/consultation/services/${id}/`),
    create: (data) => api.post('/api/consultation/services/', data),
    update: (id, data) => api.patch(`/api/consultation/services/${id}/`, data),
    delete: (id) => api.delete(`/api/consultation/services/${id}/`),
  },
  orders: {
    list: (params = {}) => api.get('/api/consultation/orders/', { params }),
    detail: (id) => api.get(`/api/consultation/orders/${id}/`),
    create: (data) => api.post('/api/consultation/orders/', data),
  },
  applications: {
    list: (params = {}) => api.get('/api/consultation/applications/', { params }),
    detail: (id) => api.get(`/api/consultation/applications/${id}/`),
    create: (data) => api.post('/api/consultation/applications/', data),
  },
};

export default apiClient;
