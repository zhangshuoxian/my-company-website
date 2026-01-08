import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext'; // 引入 Auth
import { 
    SettingsEditor, HomeEditor, TechSpecEditor, ProductTreeEditor, 
    IndustryEditor, PatternEditor, IntroManager, CustomPageEditor, MiscEditor, 
    TextContentEditor, UserManagement // 引入 UserManagement
} from '../components/AdminModules';
import { 
    Globe, Home as HomeIcon, CheckCircle, Database, LayoutDashboard, 
    Layers, ListTree, Share2, FileText, Settings as SettingsIcon, 
    ClipboardList, Users, LogOut // 引入 Users 图标
} from 'lucide-react';

interface Toast { id: number; message: string; type: 'success' | 'error'; }

const Admin = () => {
    const { content, adminLanguage, setAdminLanguage } = useLanguage();
    const { currentUser, logout, isAdmin } = useAuth(); // 获取权限状态
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('settings');
    const [toasts, setToasts] = useState<Toast[]>([]);

    // 路由保护：没登录踢回 Login
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    // 基础菜单
    let tabs = [
        { id: 'settings', label: '全局设置', icon: <SettingsIcon size={18}/> },
        { id: 'home', label: '首页管理', icon: <HomeIcon size={18}/> },
        { id: 'industry', label: '行业应用', icon: <Layers size={18}/> },
        { id: 'product', label: '产品目录', icon: <ListTree size={18}/> },
        { id: 'tech', label: '技术参数', icon: <Database size={18}/> },
        { id: 'pattern', label: '花纹代号', icon: <LayoutDashboard size={18}/> },
        { id: 'custom', label: '特殊详情', icon: <FileText size={18}/> },
        { id: 'intro', label: '公司介绍', icon: <CheckCircle size={18}/> },
        { id: 'text', label: '文案管理', icon: <ClipboardList size={18}/> },
        { id: 'misc', label: '综合管理', icon: <Share2 size={18}/> },
    ];

    // 🔥 如果是超级管理员，添加“账号管理”
    if (isAdmin) {
        tabs.push({ id: 'users', label: '账号权限', icon: <Users size={18}/> });
    }

    if (!content || !currentUser) return null;

    return (
        <div className="min-h-screen bg-[#f8faff] flex font-sans text-gray-600">
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-xl text-white font-bold animate-fade-in-up ${t.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
                        {t.message}
                    </div>
                ))}
            </div>

            {/* 左侧侧边栏 */}
            <div className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">
                <div className="p-8 pb-4">
                    <div className="text-2xl font-black text-brand-blue flex items-center gap-2 tracking-tighter">
                        <div className="w-8 h-8 bg-brand-blue rounded-lg"></div> Admin
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 pl-1">
                        Hi, {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.email.split('@')[0]}
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                    {tabs.map(btn => (
                        <button
                            key={btn.id}
                            onClick={() => setActiveTab(btn.id)}
                            className={`w-full flex items-center px-4 py-4 rounded-2xl text-xs font-black transition-all duration-300 group relative overflow-hidden ${activeTab === btn.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-blue-50 hover:text-brand-blue'}`}
                        >
                            <span className={`mr-4 transition-opacity ${activeTab === btn.id ? 'opacity-100' : 'opacity-50'}`}>{btn.icon}</span>
                            <span className="uppercase tracking-widest">{btn.label}</span>
                        </button>
                    ))}
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
                     <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-xs font-black text-red-400 hover:bg-red-50 p-3 rounded-xl transition-all">
                        <LogOut size={14}/> 退出登录
                     </button>
                     <div className="flex items-center justify-between px-2 pt-2">
                        <Link to="/" className="text-xs font-bold text-gray-400 hover:text-brand-blue flex items-center gap-2"><Globe size={14}/> 返回前台</Link>
                        <button onClick={() => setAdminLanguage(adminLanguage === 'CN' ? 'EN' : 'CN')} className="text-xs font-black bg-white border px-3 py-1 rounded-lg text-brand-blue hover:shadow-sm transition-all">
                            {adminLanguage}
                        </button>
                     </div>
                </div>
            </div>

            {/* 右侧主内容区 */}
            <div className="flex-grow ml-72 p-4 md:p-8 min-h-screen">
                <div className="flex justify-between items-center mb-8 pl-2">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">{tabs.find(t=>t.id===activeTab)?.label}</h1>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">System Configuration Panel</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-500">System Online</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 p-8 md:p-12 border border-white min-h-[80vh] relative">
                    <div className="max-w-6xl mx-auto h-full animate-fade-in">
                        {activeTab === 'settings' && <SettingsEditor showToast={showToast} />}
                        {activeTab === 'home' && <HomeEditor showToast={showToast} />}
                        {activeTab === 'tech' && <TechSpecEditor showToast={showToast} adminLanguage={adminLanguage} />}
                        {activeTab === 'product' && <ProductTreeEditor showToast={showToast} />}
                        {activeTab === 'industry' && <IndustryEditor showToast={showToast} />}
                        {activeTab === 'pattern' && <PatternEditor showToast={showToast} />}
                        {activeTab === 'intro' && <IntroManager showToast={showToast} />}
                        {activeTab === 'custom' && <CustomPageEditor showToast={showToast} />}
                        {activeTab === 'text' && <TextContentEditor showToast={showToast} />}
                        {activeTab === 'misc' && <MiscEditor showToast={showToast} />}
                        {/* 🔥 渲染账号管理 */}
                        {activeTab === 'users' && <UserManagement showToast={showToast} />}
                    </div>
                </div>

                <div className="text-center mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    CMS Control Panel v2.0 &bull; Secure Connection
                </div>
            </div>
        </div>
    );
};

export default Admin;