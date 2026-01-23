import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// 1. 引入上下文
import { LanguageProvider } from './context/LanguageContext';
// 👇 引入 useAuth 用于路由保护
import { AuthProvider, useAuth } from './context/AuthContext';

// 2. 引入布局
import Header from './components/Header';
import Footer from './components/Footer';

// 3. 引入页面
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Contact from './pages/Contact';
import TechnicalData from './pages/TechnicalData';
import Search from './pages/Search';
import News, { NewsDetail } from './pages/News';
import CategoryView from './pages/CategoryView';

// 引入特殊产品页
import ModelRules from './pages/ModelRules';
import PatternsFabrics from './pages/PatternsFabrics';
import PUTimingBelts from './pages/PUTimingBelts';
import PURoundVBelts from './pages/PURoundVBelts';

import ScrollToTop from './components/ScrollToTop';

// --- 🔒 路由守卫 (修复了 JSX 类型报错) ---
// 👇 这里把 JSX.Element 改成了 React.ReactNode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    <LanguageProvider>
      {/* 👇 这一层必须有，否则会报 Context 错误 */}
      <AuthProvider>
        <ScrollToTop />
        {!isAdminRoute && <Header />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* 👇 后台保护路由 */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={<Login />} />
          
          {/* 其他业务路由 */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/technical-data" element={<TechnicalData />} />
          <Route path="/search" element={<Search />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/intro" element={<CategoryView type="intro" />} />
          <Route path="/intro/:id" element={<CategoryView type="intro" />} />
          <Route path="/industry" element={<CategoryView type="industry" />} />
          <Route path="/industry/:id" element={<CategoryView type="industry" />} />
          <Route path="/products/model-rules" element={<ModelRules />} />
          <Route path="/products/patterns-fabrics" element={<PatternsFabrics />} />
          <Route path="/products/pu-timing-belts" element={<PUTimingBelts />} />
          <Route path="/products/round-v-belts" element={<PURoundVBelts />} />
          <Route path="/products" element={<CategoryView type="product" />} />
          <Route path="/products/:id" element={<CategoryView type="product" />} />
        </Routes>

        {!isAdminRoute && <Footer />}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;