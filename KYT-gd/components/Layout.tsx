
import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Globe, Phone, Mail, MapPin, Printer } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { X, ChevronRight, FileText, Package } from 'lucide-react';

const Header: React.FC = () => {
  const { lang, setLang, t, data } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKw, setSearchKw] = useState(''); // 搜索关键词
  
  const navLinks = [
    { name: { zh: '首页', en: 'Home' }, path: '/' },
    { name: { zh: '关于我们', en: 'About' }, path: '/about' },
    { name: { zh: '产品', en: 'Products' }, path: '/products' },
    { name: { zh: '新闻', en: 'News' }, path: '/news' },
    { name: { zh: '联系我们', en: 'Contact' }, path: '/contact' },
  ];

  // 核心：全局搜索逻辑
  const searchResults = React.useMemo(() => {
    if (!searchKw.trim()) return [];
    const q = searchKw.toLowerCase();
    const results = [];

    // 1. 搜产品
    data.products.forEach(p => {
      if (t(p.name).toLowerCase().includes(q) || t(p.desc).toLowerCase().includes(q)) {
        results.push({ 
          type: 'product', 
          id: p.id, 
          title: t(p.name), 
          desc: t(p.desc),
          path: `/products/${p.id}` 
        });
      }
    });

    // 2. 搜新闻
    data.news.forEach(n => {
      if (t(n.title).toLowerCase().includes(q) || t(n.summary).toLowerCase().includes(q)) {
        results.push({ 
          type: 'news', 
          id: n.id, 
          title: t(n.title), 
          desc: t(n.summary),
          path: `/news/${n.id}` 
        });
      }
    });

    return results;
  }, [searchKw, data, lang, t]);

  // 关闭搜索时的重置操作
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchKw('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={data.logo} alt="Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
          <span className="font-bold text-xl text-blue-800 hidden lg:block tracking-tight">
            {t(data.companyName)}
          </span>
        </Link>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-semibold transition-all hover:text-blue-600 ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`
              }
            >
              {t(link.name)}
            </RouterNavLink>
          ))}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              // 打开时自动聚焦逻辑通常需要 ref，这里简化处理，手动点击输入即可
              if (isSearchOpen) setSearchKw(''); // 关闭时清空
            }} 
            className={`p-2 transition-colors rounded-full ${isSearchOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
          >
            {isSearchOpen ? <X size={22} /> : <Search size={22} />}
          </button>
          
          <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
            <button 
              disabled={lang === 'zh'}
              onClick={() => setLang('zh')} 
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'zh' ? 'bg-blue-600 text-white shadow-sm cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'}`}
            >
              中文
            </button>
            <button 
              disabled={lang === 'en'}
              onClick={() => setLang('en')} 
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* 搜索下拉面板 */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            <div className="relative mb-6">
              <input 
                type="text" 
                autoFocus
                value={searchKw}
                onChange={(e) => setSearchKw(e.target.value)}
                placeholder={lang === 'zh' ? '全局搜索产品或新闻动态...' : 'Search global products or news...'}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl text-lg font-bold outline-none transition-all shadow-inner focus:bg-white"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={24} />
            </div>

            {/* 搜索结果展示区域 */}
            <div className="space-y-2">
              {searchKw && searchResults.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                   <p className="font-bold">{t({ zh: '没有找到相关内容', en: 'No results found' })}</p>
                </div>
              )}

              {searchResults.map((res, idx) => (
                <Link 
                  key={idx} 
                  to={res.path} 
                  onClick={closeSearch}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
                >
                  <div className={`mt-1 p-2 rounded-lg shrink-0 ${res.type === 'product' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {res.type === 'product' ? <Package size={20}/> : <FileText size={20}/>}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${res.type === 'product' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                        {res.type === 'product' ? (lang === 'zh' ? '产品' : 'PROD') : (lang === 'zh' ? '新闻' : 'NEWS')}
                      </span>
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{res.title}</h4>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-1">{res.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 self-center" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  const { t, data } = useAppContext();
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gray-50 text-gray-600 pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            {t({ zh: '在线咨询', en: 'Consultation' })}
          </h3>
          <p className="text-sm leading-relaxed mb-8 text-gray-500">
            {t({ zh: '新材料饲料科技的领先者，为您的农业生产提供持续的技术创新与品质保障。', en: 'Leader in bio-feed tech, providing innovation and quality for your production.' })}
          </p>
          <Link to="/contact" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
            {t({ zh: '立即咨询', en: 'Inquire Now' })}
          </Link>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            {t({ zh: '快速链接', en: 'Quick Links' })}
          </h3>
          <ul className="space-y-3 font-medium text-sm">
            <li><Link to="/about" className="hover:text-blue-600 transition-colors"> {t({ zh: '关于我们', en: 'About Us' })}</Link></li>
            <li><Link to="/products" className="hover:text-blue-600 transition-colors"> {t({ zh: '产品中心', en: 'Products' })}</Link></li>
            <li><Link to="/news" className="hover:text-blue-600 transition-colors"> {t({ zh: '动态资讯', en: 'News' })}</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 transition-colors"> {t({ zh: '联系我们', en: 'Contact' })}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            {t({ zh: '联系方式', en: 'Contact' })}
          </h3>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <span>{t(data.contact.address)}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-600 shrink-0" />
              <span>{t(data.contact.phone)}</span>
            </li>
            <li className="flex items-center gap-3">
              <Printer size={18} className="text-blue-600 shrink-0" />
              <span>{t({ zh: '传真: ', en: 'Fax: ' })}{t(data.contact.fax)}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-600 shrink-0" />
              <span>{t(data.contact.email)}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            {t({ zh: '关注我们', en: 'Follow Us' })}
          </h3>
          <div className="flex items-center gap-4">
             <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
               <img src={data.followUs.qrCode} alt="QR" className="w-full h-full" />
             </div>
             <p className="text-xs font-bold text-gray-400">{t(data.followUs.text)}</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>
          {t(data.copyright)}
        </p>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // ----------- 这里是你新增的代码 Start -----------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  // ----------- 这里是你新增的代码 End   -----------

  useEffect(() => {
    // 滚动入场监听逻辑
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const observeElements = () => {
      const revealElements = document.querySelectorAll('.reveal:not(.active)');
      revealElements.forEach(el => observer.observe(el));
    };

    observeElements();

    // 使用 MutationObserver 监听 DOM 变化（如分页加载新内容）
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  if (isAdminPage) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
