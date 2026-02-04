
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { Slider } from '../components/Slider';

export const About: React.FC = () => {
  const { data, t } = useAppContext();
  const [activeInfo, setActiveInfo] = useState<number>(0);
  // ▼▼▼▼▼▼ 修改开始：改用 activeSlideIdx 控制顶部轮播 ▼▼▼▼▼▼
  const [activeSlideIdx, setActiveSlideIdx] = useState(0); 
  const carouselTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. 检查新的 aboutSlides 数据是否存在
    const slides = data.aboutSlides || [];
    if (slides.length === 0) return;

    carouselTimerRef.current = window.setInterval(() => {
      // 2. 循环长度也改成 slides.length
      setActiveSlideIdx(prev => (prev + 1) % slides.length);
    }, 4000);

    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    }
  }, [data.aboutSlides?.length]); // 依赖项也改成这个
  // ▲▲▲▲▲▲ 修改结束 ▲▲▲▲▲▲

  return (
    <div className="bg-white overflow-hidden text-gray-900">
      {/* 1. 关于我们 & 核心标签 */}
      <section className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center reveal reveal-up active">
        <div className="reveal reveal-left delay-200">
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-6 block bg-blue-50 w-fit px-4 py-1.5 rounded-lg">Corporate DNA</span>
          <h2 className="text-5xl font-black mb-12 text-gray-900 leading-tight tracking-tighter">
            {t({ zh: '以科技之力，重构养殖生态', en: 'Pioneering Sustainable Ecosystems' })}
          </h2>
          
          <div className="flex gap-10 border-b border-gray-100 mb-10">
            {data.aboutTabs.tabs.map((tab, i) => (
              <button 
                key={i}
                onClick={() => setActiveInfo(i)}
                className={`text-lg font-black transition-all pb-5 relative ${activeInfo === i ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t(tab.title)}
                {activeInfo === i && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>
          
          <div className="min-h-[160px] animate-in fade-in slide-in-from-bottom-2 duration-700">
             <p className="text-gray-500 leading-relaxed text-xl font-medium whitespace-pre-wrap">
               {t(data.aboutTabs.tabs[activeInfo]?.content || { zh: '暂无内容', en: 'Empty content' })}
             </p>
          </div>
        </div>

        {/* ▼▼▼▼▼▼ 修改开始：顶部大图区域读取 aboutSlides ▼▼▼▼▼▼ */}
        <div className="flex flex-col gap-6 reveal reveal-right delay-300">
          <div className="aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white bg-gray-50">
            {/* 1. 安全获取当前图片 */}
            {(data.aboutSlides || [])[activeSlideIdx] && (
              <img 
                src={(data.aboutSlides || [])[activeSlideIdx].image} 
                alt="About Slide" 
                className="w-full h-full object-cover transition-all duration-1000 transform hover:scale-105" 
              />
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-5">
            {/* 2. 缩略图列表也改成 aboutSlides */}
            {(data.aboutSlides || []).slice(0, 4).map((slide, i) => (
              <button 
                key={slide.id} 
                onClick={() => {
                   setActiveSlideIdx(i);
                   if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
                }}
                className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-500 transform ${activeSlideIdx === i ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        {/* ▲▲▲▲▲▲ 修改结束 ▲▲▲▲▲▲ */}
      </section>

      {/* 2. 发展历程 (背景大图) */}
      <section 
        className="relative py-32 text-white bg-fixed bg-cover bg-center overflow-hidden reveal reveal-scale"
        style={{ backgroundImage: `url(${data.history.bgImage})` }}
      >
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[2px]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 reveal reveal-up delay-100">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic">{t(data.history.title)}</h2>
            <div className="w-24 h-1.5 bg-blue-500 mx-auto mt-8 rounded-full" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 relative">
             <div className="absolute top-14 left-0 right-0 h-1 bg-white/10 hidden md:block rounded-full" />
             {data.history.events.map((ev, i) => (
               <div key={ev.id} className="flex-1 relative pt-14 text-center md:text-left group reveal reveal-up" style={{ transitionDelay: `${(i+1)*200}ms` }}>
                  <div className="absolute top-[3.15rem] left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.6)] z-10 group-hover:scale-150 transition-transform duration-500" />
                  <h3 className="text-5xl font-black text-white mb-6 tracking-tighter group-hover:text-blue-400 transition-colors">{ev.year}</h3>
                  <p className="text-white/80 leading-relaxed text-lg font-bold">{t(ev.content)}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. 荣誉资质 (轮播) */}
      <section className="py-24 bg-gray-50 reveal reveal-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{t({ zh: '全球资质认证', en: 'GLOBAL CERTIFICATIONS' })}</h2>
            <div className="w-12 h-1 bg-blue-500 mx-auto mt-4 rounded-full" />
          </div>
          <Slider itemsToShow={4}>
            {data.honors.map((h, i) => (
              <div key={h.id} className="text-center px-4 group reveal reveal-scale" style={{ transitionDelay: `${(i+1)*100}ms` }}>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-sm border-8 border-white bg-white group-hover:border-blue-100 transition-all duration-700 transform group-hover:-translate-y-4 group-hover:shadow-2xl">
                  <img src={h.image} alt={t(h.name)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <p className="mt-8 font-black text-gray-800 text-lg uppercase tracking-wider">{t(h.name)}</p>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};
