import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// 1. 引入上下文
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

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

// 引入新闻 (注意：这里用我们修好的方式引入)
import News, { NewsDetail } from './pages/News';

// 引入核心分类页
import CategoryView from './pages/CategoryView';

// 引入特殊产品页
import ModelRules from './pages/ModelRules';
import PatternsFabrics from './pages/PatternsFabrics';
import PUTimingBelts from './pages/PUTimingBelts';
import PURoundVBelts from './pages/PURoundVBelts';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    <LanguageProvider>
      <AuthProvider>
        {!isAdminRoute && <Header />}

        <Routes>
          {/* === 核心页面 === */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/technical-data" element={<TechnicalData />} />
          <Route path="/search" element={<Search />} />

          {/* === 新闻模块 === */}
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          {/* === 公司介绍 (修复点：增加大厅入口) === */}
          <Route path="/intro" element={<CategoryView type="intro" />} />      {/* 👈 修复 */}
          <Route path="/intro/:id" element={<CategoryView type="intro" />} />

          {/* === 行业应用 (修复点：增加大厅入口) === */}
          <Route path="/industry" element={<CategoryView type="industry" />} />  {/* 👈 修复 */}
          <Route path="/industry/:id" element={<CategoryView type="industry" />} />

          {/* === 产品中心 === */}
          {/* 特殊产品页 (必须放在通用路由之前) */}
          <Route path="/products/model-rules" element={<ModelRules />} />
          <Route path="/products/patterns-fabrics" element={<PatternsFabrics />} />
          <Route path="/products/pu-timing-belts" element={<PUTimingBelts />} />
          <Route path="/products/round-v-belts" element={<PURoundVBelts />} />

          {/* 通用产品页 (修复点：增加大厅入口) */}
          <Route path="/products" element={<CategoryView type="product" />} />   {/* 👈 修复 */}
          <Route path="/products/:id" element={<CategoryView type="product" />} />

        </Routes>

        {!isAdminRoute && <Footer />}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;