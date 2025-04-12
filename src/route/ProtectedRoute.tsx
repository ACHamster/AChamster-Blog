import React, { useEffect, useState } from "react"
import { Navigate, useLocation } from 'react-router';
import { verifyAdmin } from '../lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // 调用验证接口，axios拦截器会自动处理token刷新
        const response = await verifyAdmin();
        setIsAuthenticated(response.success);
      } catch (err) {
        console.error("验证管理员权限失败:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, error: "您的用户组无法访问该页面" }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
