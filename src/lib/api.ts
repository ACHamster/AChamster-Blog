// src/lib/api.ts
import axios from 'axios';

// 根据环境确定基础URL
// 开发环境使用Vite代理，生产环境使用环境变量中配置的API地址
const  baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 等同于 credentials: 'include'
});

// 请求拦截器（可选）
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

/**
 * 验证当前用户是否为管理员
 * @returns {Promise<{success: boolean}>} 返回验证结果
 */
export const verifyAdmin = async () => {
  try {
    const response = await apiClient.get('/auth/verifyadmin');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * 刷新令牌获取新的access token
 * @returns {Promise<{success: boolean}>} 返回刷新结果
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * 获取文章列表
 * @returns {Promise<{success: boolean, data?: Post[], error?: any}>} 返回文章列表或错误信息
 */
export const fetchPosts = async () => {
  try {
    const response = await apiClient.get('/posts/list');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * 获取单篇文章详情
 * @param {string | number} id 文章ID
 * @returns {Promise<{success: boolean, data?: any, error?: any}>} 返回文章详情或错误信息
 */
export const fetchPostById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

export default apiClient;

