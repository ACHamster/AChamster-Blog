import React, { useEffect, useState } from "react"
import { Navigate, useLocation } from 'react-router';
import { verifyAdmin, refreshToken } from '../lib/api'; // 导入API方法

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // 发送请求到后端验证用户是否已登录且是管理员
    const verifyAuth = async () => {
      try {
        // 首先尝试验证当前token是否有效且用户是否为管理员
        const response = await verifyAdmin();

        if (response.success) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // 如果验证失败，尝试刷新令牌
        const refreshResponse = await refreshToken();

        if (refreshResponse.success) {
          // refresh token有效，获取了新的access token，再次验证管理员权限
          const verifyAgain = await verifyAdmin();

          if (verifyAgain.success) {
            setIsAuthenticated(true);
          } else {
            // 用户已登录但不是管理员
            setIsAuthenticated(false);
          }
        } else {
          // refresh token也失效，需要重新登录
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("验证管理员权限失败:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // 加载中状态
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  // 未认证或不是管理员，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />
  }

  // 已认证且是管理员，渲染子组件
  return <>{children}</>
}

export default ProtectedRoute
