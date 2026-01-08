import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { ArrowRight, MapPin, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from '../components/Reveal';

const Home = () => {
  const { content, language } = useLanguage();
  if (!content) return null;

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.heroSlides;

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 稍微延长到6秒，让动画展示更从容
    return () => clearInterval(timer);
  }, [slides.length]);

  // 动画方向计算助手
  const getDirection = (index: number, total: number) => {
    if (total <= 2) return index === 0 ? 'left' : 'right';
    if (index === 0) return 'left';
    if (index === total - 1) return 'right';
    return 'bottom';
  };

  const featuredProducts = content.products.slice(0, 4);
  const featuredNews = content.news.slice(0, 3);
  const featuredIndustries = content.industries.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
      {/* 1. Hero 轮播区域 (含入场动画) */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-gray-900 overflow-hidden group">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* 图片动画：缓慢缩放 */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`} 
              />
              
              {/* 遮罩层 & 文字内容 */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center px-4">
                
                {/* 标题动画：延迟300ms，上浮显示 */}
                <div className={`transition-all duration-1000 delay-300 ease-out transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-shadow-lg drop-shadow-md">
                    {slide.title}
                  </h1>
                </div>

                {/* 副标题动画：延迟500ms，上浮显示 */}
                {slide.subtitle && (
                  <div className={`transition-all duration-1000 delay-500 ease-out transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                    <p className="text-lg md:text-xl max-w-2xl mb-8 text-white font-bold drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  </div>
                )}

                {/* 按钮动画：延迟700ms，上浮显示 */}
                <div className={`transition-all duration-1000 delay-700 ease-out transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <Link to="/products" className="bg-brand-blue hover:bg-blue-700 text-white px-10 py-4 rounded-full font-black transition-all flex items-center shadow-2xl active:scale-95 hover:shadow-blue-500/30">
                    {content.labels.heroCTA} <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>

              </div>
            </div>
          );
        })}

        {/* 底部轮播点 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                index === currentSlide 
                  ? 'w-10 bg-brand-blue' // 选中时稍长一点，强调当前
                  : 'w-2 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. 行业应用 */}
      <Section bgColor="white">
        <Reveal direction="top">
          <SectionTitle title={content.labels.industries} subtitle={content.pageSubtitles?.industry} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {featuredIndustries.map((item, idx) => (
            <Reveal key={item.id} direction={getDirection(idx, 4)} delay={idx * 100}>
              <Link to={`/industry/${item.id}`} className="group relative overflow-hidden rounded-[2.5rem] shadow-xl aspect-square block border-4 border-transparent hover:border-brand-blue transition-all">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-brand-blue transition-colors uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-300 text-xs font-bold line-clamp-2">{item.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 3. 产品中心 */}
      <Section bgColor="gray" className="!bg-blue-50/30">
        <Reveal direction="top">
          <SectionTitle title={content.labels.products} subtitle={content.pageSubtitles?.product} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {featuredProducts.map((prod, idx) => (
            <Reveal key={prod.id} direction={getDirection(idx, 4)} delay={idx * 100}>
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100">
                <div className="h-56 overflow-hidden bg-gray-100">
                   <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">{prod.title}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2">{prod.description}</p>
                  <Link to={`/products/${prod.id}`} className="inline-block bg-brand-lightBlue text-brand-blue px-6 py-2 rounded-full font-black text-xs hover:bg-brand-blue hover:text-white transition-all">{content.labels.details}</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 4. 新闻动态 */}
      <Section bgColor="white">
        <Reveal direction="top">
          <SectionTitle title={content.labels.news} subtitle={content.pageSubtitles?.news} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredNews.map((news, idx) => (
            <Reveal key={news.id} direction={getDirection(idx, 3)} delay={idx * 150}>
              <Link to={`/news/${news.id}`} className="group block">
                <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-6 shadow-lg">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-brand-green text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{news.date}</div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-brand-blue transition-colors leading-tight">{news.title}</h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-2">{news.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5. 核心统计 + 公司基本联络 */}
      <Section bgColor="white" className="!pt-0">
        <Reveal direction="top">
           <SectionTitle 
             title={language === 'CN' ? '公司实力与联系方式' : 'Company Strength & Contact'} 
             subtitle={content.contact.companyName} 
           />
        </Reveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
            {content.stats.map((stat, idx) => (
              <Reveal key={idx} direction={getDirection(idx, content.stats.length)} delay={idx * 100} className="h-full">
                <div className="relative group overflow-hidden bg-gray-50 rounded-[2.5rem] border-2 border-gray-100 p-8 text-center transition-all hover:border-brand-blue/30 hover:shadow-xl h-48 flex flex-col justify-center items-center">
                    {stat.image && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                        <img src={stat.image} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="text-4xl font-black text-brand-blue mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="right">
            <div className="bg-brand-blue p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group text-white">
              <div className="absolute -top-10 -right-10 opacity-10 rotate-12 transform group-hover:scale-110 transition-transform text-white">
                <ImageIcon size={200}/>
              </div>
              <h3 className="text-2xl font-black mb-8 border-b border-white/20 pb-4 uppercase tracking-tighter">{content.contact.companyName}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><MapPin size={20} className="text-blue-200"/></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-blue-300 tracking-widest">{language === 'CN' ? '联系地址' : 'Address'}</div>
                    <div className="text-sm font-bold text-gray-100 leading-tight">{content.contact.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><Phone size={20} className="text-blue-200"/></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-blue-300 tracking-widest">{language === 'CN' ? '服务热线' : 'Hotline'}</div>
                    <div className="text-sm font-bold text-gray-100">{content.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><Mail size={20} className="text-blue-200"/></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-blue-300 tracking-widest">{language === 'CN' ? '电子邮箱' : 'Email'}</div>
                    <div className="text-sm font-bold text-gray-100">{content.contact.email}</div>
                  </div>
                </div>
              </div>
              <Link to="/contact" className="mt-10 block text-center bg-white text-brand-blue py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                {language === 'CN' ? '立即咨询' : 'Inquiry Now'}
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

    </div>
  );
};

export default Home;