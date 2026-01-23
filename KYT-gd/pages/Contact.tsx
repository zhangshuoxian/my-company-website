
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Phone, Mail, MapPin, Printer, Send, MessageCircle } from 'lucide-react';
import { generateCode, submitToCloud } from './captcha';

// --- 新增：邮件发送接口 (请修改为你自己的邮箱) ---
const CLOUD_API_URL = "https://formsubmit.co/ajax/Business@kangyitai.com";

export const Contact: React.FC = () => {
  const { data, t, addMessage } = useAppContext();
  const [formMsg, setFormMsg] = useState('');


  // 使用字符串状态，而不是原来的数字对象
  const [captcha, setCaptcha] = useState(generateCode());
  const [userAns, setUserAns] = useState('');

  const refreshCaptcha = () => {
    setCaptcha(generateCode());
    setUserAns('');
  };
  
  const handleMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 1. 验证码校验
    if (userAns.toUpperCase() !== captcha) {
      setFormMsg(t({ zh: '验证码错误，请重新输入', en: 'Incorrect CAPTCHA' }));
      refreshCaptcha(); 
      return;
    }

    const formData = new FormData(e.currentTarget);
    const msgData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      content: formData.get('content') as string,
    };

    // ---------------------------------------------------------
    // 2. 发送邮件到你的邮箱 (FormSubmit.co)
    // ---------------------------------------------------------
    try {
      fetch(CLOUD_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          // 邮件里显示的内容
          name: `${msgData.lastName}${msgData.firstName}`,
          email: msgData.email,
          phone: msgData.phone,
          message: msgData.content,
          
          // 配置项
          _subject: `【官网新留言】来自: ${msgData.lastName}${msgData.firstName}`,
          _template: "table",
          _captcha: "false"
        })
      })
      .then(res => res.json())
      .then(data => console.log("邮件发送结果:", data))
      .catch(err => console.error("网络错误:", err));
    } catch (error) {
      console.error("Fetch error:", error);
    }

    // 3. 同时保存到本地 (为了后台能看到)
    const result = addMessage(msgData);
    setFormMsg(result.message);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
      refreshCaptcha();
      setUserAns('');
    }
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-50 border-b border-gray-100 py-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
           <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Get In Touch</span>
           <h1 className="text-5xl font-bold mb-8 text-gray-900 tracking-tight">{t({ zh: '联系我们的服务团队', en: 'Contact Our Service Team' })}</h1>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">{t({ zh: '我们致力于为您提供最专业、最迅速的响应与服务。', en: 'We are committed to providing you with professional and rapid response.' })}</p>
        </div>
      </section>

      {/* Info & Form Area */}
      <section className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
           <div className="flex items-center gap-3 mb-10">
             <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
             <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t({ zh: '总部资讯', en: 'Contact Info' })}</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all"><MapPin size={24} /></div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t({ zh: '办公地址', en: 'Office' })}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{t(data.contact.address)}</p>
             </div>
             <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all"><Phone size={24} /></div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t({ zh: '服务热线', en: 'Phone' })}</h4>
                <p className="text-blue-600 font-bold text-xl">{t(data.contact.phone)}</p>
             </div>
             <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all"><Printer size={24} /></div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t({ zh: '传真', en: 'Fax' })}</h4>
                <p className="text-gray-500 text-sm font-bold">{t(data.contact.fax)}</p>
             </div>
             <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all"><Mail size={24} /></div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t({ zh: '邮箱', en: 'Email' })}</h4>
                <p className="text-gray-500 text-sm font-bold">{t(data.contact.email)}</p>
             </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
           <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><MessageCircle size={24} className="text-blue-600" /> {t({ zh: '在线留言', en: 'Inquiry Form' })}</h3>
           <form className="space-y-6" onSubmit={handleMessage}>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{t({ zh: '姓氏', en: 'Last Name' })}</label>
                   <input name="lastName" type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-xl outline-none" required />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{t({ zh: '名字', en: 'First Name' })}</label>
                   <input name="firstName" type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-xl outline-none" required />
                 </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{t({ zh: '电子邮箱', en: 'Email' })}</label>
                <input name="email" type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-xl outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{t({ zh: '详细留言', en: 'Details' })}</label>
                <textarea name="content" rows={4} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-xl outline-none" required></textarea>
              </div>
              {formMsg && <p className="text-blue-600 font-bold text-center text-sm">{formMsg}</p>}
              {/* 验证码区域 - 升级版 */}
              <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4 border border-blue-100">
                {/* 这里的 div 样式做了调整，使用了 font-mono (等宽字体) 和斜体，看起来更像验证码 */}
                <div 
                  className="font-mono text-xl font-bold text-blue-800 tracking-[0.3em] select-none bg-white px-6 py-2 rounded-lg shadow-sm italic cursor-pointer relative overflow-hidden"
                  onClick={refreshCaptcha}
                  title="看不清？点击刷新"
                >
                   {/* 增加一点干扰线的效果（用CSS模拟） */}
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:4px_4px]"></div>
                   {captcha}
                </div>
                <input 
                  type="text" 
                  value={userAns}
                  onChange={(e) => setUserAns(e.target.value)}
                  placeholder={t({ zh: '请输入4位验证码', en: 'Enter Code' })}
                  className="flex-grow px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 uppercase" // 自动大写
                  maxLength={4}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-3">
                <Send size={20} /> {t({ zh: '发送留言', en: 'Send Now' })}
              </button>
           </form>
        </div>
      </section>
      

      {/* Map Section */}
      <section className="h-[550px] w-full border-t border-gray-100">
        <iframe 
          title="Map"
          src={data.contact.mapUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'grayscale(0.5)' }} 
          loading="lazy"
        />
      </section>
    </div>
  );
};
