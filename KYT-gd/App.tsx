import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* 1. 登录页：独立路由，没有 Layout 包裹，所以没有头尾 */}
          <Route path="/login" element={<Login />} />

          {/* 2. 其他所有页面：使用 Layout 包裹，显示导航栏和页脚 */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<Products />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<News />} />
                <Route path="/contact" element={<Contact />} />
                
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;