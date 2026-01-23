import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('is_admin_logged_in') === 'true';

  if (!isLoggedIn) {
    // 如果没登录，强制跳转到登录页
    return <Navigate to="/login" replace />;
  }

  // 如果登录了，显示正常内容
  return <>{children}</>;
};