// src/lib/api.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 检查是否是401/403且未重试过，并且不是刷新token的请求本身
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        // 调用刷新token接口
        await apiClient.post('/auth/refresh');
        // 刷新成功，重发原请求
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新失败，直接返回错误，不再重试
        return Promise.reject(refreshError);
      }
    }

    // 对于其他错误或已经重试过的请求，直接返回错误
    return Promise.reject(error);
  }
);

// 验证管理员身份
export const verifyAdmin = async () => {
  try {
    const response = await apiClient.get('/auth/verifyadmin');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

// 刷新token
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

// 获取文章列表
export const fetchPosts = async () => {
  try {
    const response = await apiClient.get('/posts/list');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

// 获取单篇文章详情
export const fetchPostById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

// 检查登录状态
export const checkLoginStatus = async () => {
  try {
    const response = await apiClient.get('/auth/status');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

export default apiClient;
