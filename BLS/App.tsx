import React from 'react';
// 1. 引入路由核心工具
import { Routes, Route, useLocation } from 'react-router-dom';

// 2. 引入我们写的两个“管家” (上下文)
import { LanguageProvider } from './context/LanguageContext'; // 负责管中英文
import { AuthProvider } from './context/AuthContext';         // 🔥 新引入：负责管账号安全

// 3. 引入页面组件
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';           // 🔥 新引入：登录页面
// ... 如果你有其他页面 (比如 Industry, Product) 也要保留引入
// import Industry from './pages/Industry'; 
// import Product from './pages/Product';

function App() {
  // 获取当前浏览器的网址路径 (比如 "/admin" 或 "/login")
  const location = useLocation();

  // 判断是否是“纯净模式”页面 (后台和登录页不需要显示网站通用的 Header 和 Footer)
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    /* 最外层：语言管家 */
    <LanguageProvider>
      
      {/* 🔥 第二层：安全管家 (AuthProvider) 
          把它包在里面，意味着里面的 Header, Admin, Login 都能获取登录状态 
      */}
      <AuthProvider>
        
        {/* 如果不是后台/登录页，就显示顶部的导航栏 */}
        {!isAdminRoute && <Header />}

        {/* 路由配置区：决定网址对应哪个页面 */}
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* 🔥 新增：登录页路由 */}
          <Route path="/login" element={<Login />} />
          
          {/* 后台页路由 (Admin 内部已经写了逻辑：没登录会被踢回 Login) */}
          <Route path="/admin" element={<Admin />} />

          {/* ... 在这里保留你原来的其他路由 ... */}
          {/* 例如: <Route path="/industry/:id" element={<CategoryView type="industry" />} /> */}
          {/* 例如: <Route path="/products/:id" element={<CategoryView type="product" />} /> */}
          
        </Routes>

        {/* 如果不是后台/登录页，就显示底部的页脚 */}
        {!isAdminRoute && <Footer />}

      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;