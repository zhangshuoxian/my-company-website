
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { Slider } from '../components/Slider';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Activity, CheckCircle, Award, Target, FlaskConical } from 'lucide-react';

const Hero: React.FC = () => {
  const { data, t } = useAppContext();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % data.heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [data.heroSlides.length]);

  return (
// 在 Home.tsx 的 Hero 组件中

// 1. 修改 section 的 className
// 原来是: h-[700px]
// 修改为: h-[550px] md:h-[700px]
// 解释: 手机高度减小到 550px，电脑保持 700px
<section className="relative h-[550px] md:h-[700px] overflow-hidden bg-gray-100 reveal reveal-scale active">
  {data.heroSlides.map((slide, idx) => (
    <div 
      key={slide.id}
      className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
    >
      <img src={slide.image} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/10 bg-gradient-to-r from-black/10 via-black/20 to-transparent flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          
          {/* 2. 修改标题字号 */}
          {/* 原来是: text-5xl md:text-8xl */}
          {/* 修改为: text-4xl md:text-6xl lg:text-8xl */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter reveal reveal-left active delay-200 drop-shadow-lg">
            {t(slide.title)}
          </h1>

          {/* 3. 修改描述文字字号和间距 */}
          {/* 原来是: text-xl md:text-3xl mb-12 */}
          {/* 修改为: text-lg md:text-3xl mb-8 md:mb-12 */}
          <p className="text-lg md:text-3xl mb-8 md:mb-12 max-w-2xl text-white/90 font-medium reveal reveal-left active delay-300 drop-shadow-md whitespace-pre-wrap">
            {t(slide.desc)}
          </p>

          {/* 4. 修改按钮大小 */}
          {/* 原来是: px-10 py-4 text-lg */}
          {/* 修改为: px-6 py-3 text-base md:px-10 md:py-4 md:text-lg */}
          <Link to="/products" className="inline-flex items-center gap-2 md:gap-3 bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-2xl font-black text-base md:text-lg transition-all shadow-2xl reveal reveal-up active delay-500 uppercase tracking-wider">
            {t({ zh: '开启未来养殖', en: 'Explore Solutions' })} <ArrowRight size={20} className="md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </div>
  ))}
  {/* ...指示器圆点部分不用变... */}
  {/* 在 </section> 标签的上方插入这段代码 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {data.heroSlides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            // 样式逻辑：当前页显示蓝色长条(w-8)，其他页显示白色圆点(w-2)
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              i === current ? 'w-8 bg-blue-600' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
</section>
  );
};

export const Home: React.FC = () => {
  const { data, t } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white">
      <Hero />

      {/* 1. 实验室欢迎板块 */}
      <section className="py-24 bg-white reveal reveal-up">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="reveal reveal-left delay-200">
            <div className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-6 bg-blue-50 px-4 py-2 rounded-lg">
              <FlaskConical size={18}/> INNOVATION LAB
            </div>
            <h2 className="text-5xl font-black mb-8 text-gray-900 leading-tight tracking-tighter">{t(data.labSection.title)}</h2>
            <p className="text-gray-500 leading-relaxed text-xl mb-12 font-medium whitespace-pre-wrap">{t(data.labSection.desc)}</p>
            <div className="grid grid-cols-2 gap-8">
              {data.labSection.stats.map((stat, i) => (
                <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 transition-all reveal reveal-up" style={{ transitionDelay: `${(i+1)*100}ms` }}>
                  <p className="text-5xl font-black text-blue-600 mb-2 tracking-tighter">{stat.value}</p>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{t(stat.label)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group reveal reveal-right delay-200">
            <div className="absolute -inset-4 bg-blue-50 rounded-[4rem] group-hover:-inset-6 transition-all duration-700"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] border-8 border-white">
              <img src={data.labSection.image} alt="Lab" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-10">
                 <p className="text-white font-black text-xl italic tracking-widest">{t({ zh: "品质成就未来", en: "QUALITY FOR FUTURE" })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 产品列表板块 */}
      <section className="py-24 bg-gray-50 reveal reveal-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{t({ zh: '核心产品系列', en: 'Core Products' })}</h2>
              <div className="w-16 h-1.5 bg-blue-500 mt-5 rounded-full" />
            </div>
            <Link to="/products" className="group bg-white border border-gray-200 px-8 py-3 rounded-2xl font-black text-blue-600 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              {t({ zh: '全部产品', en: 'Browse All' })} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Slider itemsToShow={4}>
            {data.products.map((p, i) => (
              <Link to={`/products/${p.id}`} key={p.id} className="group reveal reveal-up h-full">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s]" />
                    <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-blue-600 shadow-md">
                      <Star size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-xl text-gray-900 mb-3 line-clamp-1">{t(p.name)}</h3>
                      <p className="text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed">{t(p.desc)}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-blue-600 text-sm font-black uppercase tracking-widest">{t({ zh: '查看详情', en: 'Explore' })}</span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      </section>

      {/* 3. 为什么选择我们 */}
      <section className="py-24 bg-white reveal reveal-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">{t(data.whyChooseUs.title)}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em]">{t({ zh: '我们的核心竞争力', en: 'OUR CORE COMPETENCIES' })}</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-16 lg:text-right">
              {data.whyChooseUs.points.slice(0, 2).map((p, i) => (
                <div key={i} className="flex gap-8 items-start lg:flex-row-reverse group reveal reveal-left delay-200">
                  <div className="bg-blue-600 shadow-xl shadow-blue-600/30 p-5 rounded-[2rem] text-white shrink-0 transform group-hover:rotate-12 transition-all"><Star size={32} /></div>
                  <div>
                    <h4 className="font-black text-2xl mb-4 text-gray-900">{t(p.title)}</h4>
                    <p className="text-gray-500 text-lg leading-relaxed font-medium">{t(p.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-96 h-96 shrink-0 relative p-6 reveal reveal-scale delay-300">
               <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
               <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30"></div>
               <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-[12px] border-white shadow-2xl">
                 <img src={data.whyChooseUs.centerImage} alt="" className="w-full h-full object-cover transition-transform duration-[5s] hover:scale-125" />
               </div>
            </div>
            <div className="flex-1 space-y-16">
              {data.whyChooseUs.points.slice(2, 4).map((p, i) => (
                <div key={i} className="flex gap-8 items-start group reveal reveal-right delay-200">
                  <div className="bg-blue-600 shadow-xl shadow-blue-600/30 p-5 rounded-[2rem] text-white shrink-0 transform group-hover:-rotate-12 transition-all"><Activity size={32} /></div>
                  <div>
                    <h4 className="font-black text-2xl mb-4 text-gray-900">{t(p.title)}</h4>
                    <p className="text-gray-500 text-lg leading-relaxed font-medium">{t(p.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 关于我们预览 (3个简报) */}
      <section className="py-24 bg-gray-50 reveal reveal-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {data.aboutTabs.tabs.slice(0, 3).map((tab, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all reveal reveal-up group" style={{ transitionDelay: `${(i+1)*150}ms` }}>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {i === 0 ? <Award size={32}/> : i === 1 ? <Target size={32}/> : <CheckCircle size={32}/>}
                </div>
                <h3 className="font-black text-2xl mb-6 text-gray-900">{t(tab.title)}</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-medium line-clamp-3 whitespace-pre-wrap">{t(tab.content)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 最新咨询 (资讯动态) */}
      <section className="py-24 bg-white reveal reveal-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 reveal reveal-left gap-8">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{t({ zh: '最新咨询动态', en: 'News & Insights' })}</h2>
            <Link to="/news" className="text-blue-600 font-black flex items-center gap-2 hover:underline tracking-widest uppercase text-sm">{t({ zh: '查看全部资讯', en: 'View All News' })} <ArrowRight size={18}/></Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {data.news[0] && (
              <Link to={`/news/${data.news[0].id}`} className="lg:w-1/2 flex group relative overflow-hidden rounded-[3.5rem] shadow-2xl bg-white reveal reveal-left delay-200 min-h-[500px]">
                <img src={data.news[0].image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent flex flex-col justify-end p-12">
                  <span className="text-blue-400 font-black text-sm mb-4 tracking-[0.2em] uppercase">{data.news[0].date}</span>
                  <h3 className="text-white text-3xl md:text-4xl font-black mb-6 line-clamp-2 leading-tight tracking-tight">{t(data.news[0].title)}</h3>
                  <p className="text-gray-300 text-lg line-clamp-2 font-medium">{t(data.news[0].summary)}</p>
                </div>
              </Link>
            )}
            <div className="lg:w-1/2 flex flex-col gap-8 justify-between">
              {data.news.slice(1, 4).map((n, i) => (
                <Link to={`/news/${n.id}`} key={n.id} className="group flex-1 bg-white rounded-[2.5rem] p-6 flex gap-8 border border-gray-100 hover:border-blue-200 transition-all shadow-sm reveal reveal-right" style={{ transitionDelay: `${(i+1)*150}ms` }}>
                  <div className="w-40 shrink-0 overflow-hidden rounded-[1.8rem] aspect-[4/3] border border-gray-50">
                    <img src={n.image} alt="" className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-gray-400 text-xs font-black mb-2 tracking-widest">{n.date}</span>
                    <h4 className="font-black text-xl text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors leading-snug">{t(n.title)}</h4>
                    <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{t(n.summary)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
