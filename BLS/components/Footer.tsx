import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Settings } from 'lucide-react';
import { Reveal } from './Reveal';

const Footer = () => {
  // 👇👇👇 关键修改：这里补上了 language 👇👇👇
  const { content, language } = useLanguage();
  
  if (!content) return null;

  const mainContact = content.contact; 
  const topIndustries = content.industries.slice(0, 4);
  const topProducts = content.products.slice(0, 4);

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 overflow-x-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* 左侧：版权品牌标识 */}
          <Reveal direction="left" className="lg:col-span-1">
            <h3 className="text-3xl font-black text-white mb-8 border-l-4 border-brand-blue pl-4 uppercase tracking-tighter">
              {mainContact.companyName}
            </h3>
            {/* Slogan 显示逻辑 */}
            <p className="text-gray-500 text-sm font-bold leading-relaxed uppercase tracking-widest">
               {content.footerSlogan || (language === 'CN' ? "全球自动化行业的可靠合作伙伴" : "Reliable Solutions for Global Automation Industries")}
            </p>
          </Reveal>

          {/* 中间链接 1: 关于我们 */}
          <Reveal direction="bottom" className="lg:col-span-1" delay={100}>
            <h4 className="text-lg font-black text-gray-600 mb-8 uppercase tracking-[0.2em]">{content.labels.about}</h4>
            <ul className="space-y-4">
              {content.about.sections.map((section) => (
                <li key={section.id}>
                  <NavLink to={`/intro/${section.id}`} className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-black uppercase tracking-widest">
                    {section.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 中间链接 2: 行业应用 */}
          <Reveal direction="bottom" className="lg:col-span-1" delay={200}>
            <h4 className="text-lg font-black text-gray-600 mb-8 uppercase tracking-[0.2em]">{content.labels.footerIndustries}</h4>
            <ul className="space-y-4">
              {topIndustries.map((ind) => (
                <li key={ind.id}>
                  <NavLink to={`/industry/${ind.id}`} className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-black uppercase tracking-widest">
                    {ind.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 中间链接 3: 产品中心 */}
          <Reveal direction="bottom" className="lg:col-span-1" delay={300}>
            <h4 className="text-lg font-black text-gray-600 mb-8 uppercase tracking-[0.2em]">{content.labels.products}</h4>
            <ul className="space-y-4">
              {topProducts.map((prod) => (
                <li key={prod.id}>
                  <NavLink to={`/products/${prod.id}`} className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-black uppercase tracking-widest">
                    {prod.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 右侧：社交媒体 */}
          <Reveal direction="right" className="lg:col-span-1">
            <h4 className="text-lg font-black text-gray-600 mb-8 uppercase tracking-[0.2em]">{content.labels.footerFollow}</h4>
            <div className="grid grid-cols-2 gap-4">
               {content.socials.slice(0, 2).map((item) => (
                 <div key={item.id} className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white p-2 rounded-2xl overflow-hidden mb-3 border-4 border-white/5 shadow-xl"><img src={item.image} alt={item.text} className="w-full h-full object-contain" /></div>
                    <span className="text-xs font-black text-gray-600 text-center uppercase tracking-tighter">{item.text}</span>
                 </div>
               ))}
            </div>
          </Reveal>
        </div>

        {/* 底部版权栏 */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-sm font-black text-gray-600 uppercase tracking-widest">
          <p>{content.footerRights}</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">{content.labels.privacy}</span>
            <span className="hover:text-white cursor-pointer transition-colors">{content.labels.terms}</span>
            <NavLink to="/admin" className="hover:text-brand-blue transition-all" title="Admin Portal"><Settings size={18}/></NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;