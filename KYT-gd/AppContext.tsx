import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, Language, UserMessage } from './types';
import { INITIAL_DATA } from './constants';

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('site_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [lang, setLang] = useState<Language>('zh');
  const [messages, setMessages] = useState<UserMessage[]>(() => {
    const saved = localStorage.getItem('user_messages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('site_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('user_messages', JSON.stringify(messages));
  }, [messages]);

  const t = (item: { zh: string; en: string }) => item[lang];

  // 新增：删除留言逻辑
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const addMessage = (msg: Omit<UserMessage, 'id' | 'date' | 'ip'>) => {
    // 1. 获取当前“IP”的提交次数 (利用 LocalStorage 模拟 IP)
    const submitCount = parseInt(localStorage.getItem('submit_count_ip_sim') || '0');

    // 2. 检查是否超过 5 次
    if (submitCount >= 5) {
      return { 
        success: false, 
        message: lang === 'zh' ? '您今日的留言次数已达上限 (5次)' : 'Daily message limit reached (5 times)' 
      };
    }

    // 3. 正常提交
    const newMessage: UserMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      ip: 'Client-IP' // 标记
    };
    
    setMessages(prev => [newMessage, ...prev]);
    
    // 4. 增加计数
    localStorage.setItem('submit_count_ip_sim', (submitCount + 1).toString());

    return { success: true, message: lang === 'zh' ? '留言提交成功！' : 'Message sent successfully!' };
  };

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