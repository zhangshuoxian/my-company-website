import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, Language, UserMessage } from './types';
import { INITIAL_DATA } from './constants';
import AV from 'leancloud-storage';

interface AppContextType {
  data: SiteData;
  setData: (data: SiteData) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (item: { zh: string; en: string }) => string;
  messages: UserMessage[];
  addMessage: (msg: Omit<UserMessage, 'id' | 'date' | 'ip'>) => { success: boolean; message: string };
  deleteMessage: (id: string) => void; // 新增：删除方法定义
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ... 顶部的 import 保持不变 ...

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. 数据状态
  const [data, setData] = useState<SiteData>(() => {
    // 这里的初始值其实不重要了，因为我们会强制显示 Loading
    const saved = localStorage.getItem('site_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  // 1. 修改语言初始化：优先读取本地缓存 'app_lang'
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'zh' || saved === 'en') ? saved : 'zh';
  });
  
  const [messages, setMessages] = useState<UserMessage[]>(() => {
    const saved = localStorage.getItem('user_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // ✨✨✨ 新增：加载状态，默认是 true (正在加载) ✨✨✨
  const [loading, setLoading] = useState(true); 

  // ▼▼▼▼▼▼▼▼▼▼ 修复版：解决“存储空间不足”导致回滚的问题 ▼▼▼▼▼▼▼▼▼▼
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // 1. 发起请求
        const ossUrl = `https://kangyitai-data.oss-cn-hongkong.aliyuncs.com/site_data.json?t=${Date.now()}`;
        const response = await fetch(ossUrl);

        if (response.ok) {
          const cloudData = await response.json();
          
          // 2.【关键修改】先更新页面！哪怕后面存缓存失败了，页面也必须是新的
          setData(cloudData); 
          console.log('✅ 云端数据已加载到页面');

          // ▼▼▼▼▼▼▼▼▼▼ 新增：应用后台设置的默认语言 ▼▼▼▼▼▼▼▼▼▼
          // 逻辑：只有当用户从未手动切换过语言（本地没缓存）时，才听后台的
          const userPref = localStorage.getItem('app_lang');
          if (!userPref && cloudData.defaultLang) {
             setLang(cloudData.defaultLang);
          }
          // ▲▲▲▲▲▲▲▲▲▲ 新增结束 ▲▲▲▲▲▲▲▲▲▲

          // 3.【关键修改】尝试存入本地，如果满了就忽略，不要报错
          try {
            localStorage.setItem('site_data', JSON.stringify(cloudData));
          } catch (storageError) {
            console.warn('⚠️ 手机存储空间不足，但这不影响正常浏览:', storageError);
            // 这里我们什么都不做，仅仅是在控制台记录一下
            // 绝对不能抛出错误，否则会触发外面的 catch 导致回滚
          }
        } else {
          throw new Error('阿里云响应异常: ' + response.status);
        }

      } catch (e: any) {
        console.error('❌ 网络或逻辑错误:', e);
        // 只有真的连不上网（fetch失败）的时候，才去读本地旧数据
        const local = localStorage.getItem('site_data');
        if (local) {
            try {
                setData(JSON.parse(local));
            } catch (parseError) {
                console.error('本地数据损坏');
            }
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // ... (中间的 useEffect 和其他函数保持不变) ...
  useEffect(() => {
    localStorage.setItem('user_messages', JSON.stringify(messages));
  }, [messages]);

  

  const t = (item: { zh: string; en: string }) => item[lang];

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const addMessage = (msg: Omit<UserMessage, 'id' | 'date' | 'ip'>) => {
    const submitCount = parseInt(localStorage.getItem('submit_count_ip_sim') || '0');
    if (submitCount >= 5) {
      return { 
        success: false, 
        message: lang === 'zh' ? '您今日的留言次数已达上限 (5次)' : 'Daily message limit reached' 
      };
    }
    const newMessage: UserMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      ip: 'Client-IP'
    };
    setMessages(prev => [newMessage, ...prev]);
    localStorage.setItem('submit_count_ip_sim', (submitCount + 1).toString());
    return { success: true, message: lang === 'zh' ? '留言提交成功！' : 'Success!' };
  };

  // ✨✨✨ 修改：读取后台配置的 loadingText ✨✨✨
  if (loading) {
    // 优先使用数据里的配置，如果没有则用默认文案兜底
    const loadingZh = data.loadingText?.zh || '欢迎来到康以泰，数据加载中...';
    const loadingEn = data.loadingText?.en || 'Welcome to Kangyitai, loading data...';

    return (
      <div style={{ 
        position: 'fixed', inset: 0, background: '#f9fafb', zIndex: 9999, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' 
      }}>
        {/* 这里你可以换成一个转圈圈的图标 */}
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px', textAlign: 'center', padding: '0 20px' }}>
          {/* 根据当前语言显示对应的加载文案 */}
          {lang === 'zh' ? loadingZh : loadingEn}
        </div>
        
        {/* 副标题显示另一种语言，或者 Loading 动画 */}
        <div style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '0 20px' }}>
          {lang === 'zh' ? loadingEn : loadingZh}
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ data, setData, lang, setLang, t, messages, addMessage, deleteMessage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};