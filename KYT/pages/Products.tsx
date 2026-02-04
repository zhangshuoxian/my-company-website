import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { Search, Send, ArrowRight, Phone, Mail, CheckCircle2, Package, Menu, ChevronRight } from 'lucide-react';
import { generateCode } from './captcha';
import { CustomTableData } from '../types';

// --- 邮件发送接口 (保持你的原设置) ---
const CLOUD_API_URL = "https://formsubmit.co/ajax/Business@kangyitai.com";

// ▼▼▼▼▼▼▼▼▼▼ CustomTableView 组件保持不变 ▼▼▼▼▼▼▼▼▼▼
const CustomTableView: React.FC<{ data: CustomTableData; t: any }> = ({ data, t }) => {
  if (!data || !data.columns || data.columns.length === 0) return null;
  
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white mb-6">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
           <tr className="bg-blue-600 text-white">
              {data.columns.map(col => (
                 <th key={col.id} className="p-4 font-bold border-r border-blue-500 last:border-0 text-sm">{t(col.label)}</th>
              ))}
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
           {data.rows.map(row => (
             <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
               {data.columns.map((col, idx) => (
                 <td key={col.id + idx} className="p-4 font-medium text-gray-700 border-r border-gray-100 last:border-0 text-sm">
                    {t(row.cells[idx] || { zh: '-', en: '-' })}
                 </td>
               ))}
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  );
};

// ▼▼▼▼▼▼▼▼▼▼ 产品列表页 (布局大改版：左侧导航 + 右侧列表) ▼▼▼▼▼▼▼▼▼▼
const ProductGrid: React.FC = () => {
  const { data, t } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [activeSeriesId, setActiveSeriesId] = useState<string>('all');
  
  const itemsPerPage = 9;

  // 过滤逻辑
  const filteredProducts = data.products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    // 1. 搜索词匹配
    const matchesSearch = !q || (
      p.name.zh.includes(q) || 
      p.name.en.toLowerCase().includes(q) ||
      p.desc.zh.includes(q) || 
      p.desc.en.toLowerCase().includes(q)
    );
    // 2. 系列匹配 (兼容旧数据，如果没有 seriesIds 则视为不匹配特定系列，除非选了All)
    const matchesSeries = activeSeriesId === 'all' || (p.seriesIds || []).includes(activeSeriesId);
    return matchesSearch && matchesSeries;
  });

  // 切换分类或搜索时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeSeriesId]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 获取当前显示的标题
  const currentCategoryName = activeSeriesId === 'all' 
    ? { zh: '全部产品', en: 'All Products' }
    : data.productSeries?.find(s => s.id === activeSeriesId)?.name;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 Banner (简单装饰) */}
      <div className="h-64 bg-blue-900 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-800 opacity-50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 to-transparent"></div>
        <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider uppercase mb-2">
            {t({ zh: '产品中心', en: 'Product Center' })}
            </h1>
            <p className="text-blue-200 text-sm tracking-widest uppercase">Innovation & Quality</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ▼▼▼▼▼▼ 左侧侧边栏 (Sidebar) ▼▼▼▼▼▼ */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="bg-blue-600 text-white p-6">
                   <h2 className="text-lg font-bold flex items-center gap-2">
                     <Menu size={20} />
                     {t({ zh: '产品分类', en: 'Categories' })}
                   </h2>
                </div>
                
                <div className="flex flex-col py-2">
                   {/* 全部产品按钮 */}
                   <button
                      onClick={() => setActiveSeriesId('all')}
                      className={`text-left px-6 py-4 font-bold text-sm border-l-4 transition-all flex justify-between items-center group ${
                         activeSeriesId === 'all' 
                           ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                           : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                      }`}
                   >
                      {t({ zh: '全部产品', en: 'All Products' })}
                      <ChevronRight size={16} className={`transition-transform ${activeSeriesId === 'all' ? 'text-blue-600' : 'text-gray-300 group-hover:text-blue-400'}`} />
                   </button>

                   {/* 动态系列按钮 */}
                   {(data.productSeries || []).map(series => (
                      <button
                        key={series.id}
                        onClick={() => setActiveSeriesId(series.id)}
                        className={`text-left px-6 py-4 font-bold text-sm border-l-4 transition-all flex justify-between items-center group ${
                           activeSeriesId === series.id 
                             ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                             : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                        }`}
                      >
                         {t(series.name)}
                         <ChevronRight size={16} className={`transition-transform ${activeSeriesId === series.id ? 'text-blue-600' : 'text-gray-300 group-hover:text-blue-400'}`} />
                      </button>
                   ))}
                </div>
             </div>

             {/* 侧边栏：联系方式卡片 */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden lg:block">
                <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">{t({ zh: '联系我们', en: 'Contact Us' })}</h3>
                <div className="space-y-4 text-sm text-gray-600">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Phone size={16}/></div>
                      <span>{t(data.contact.phone)}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Mail size={16}/></div>
                      <span className="break-all">{t(data.contact.email)}</span>
                   </div>
                </div>
             </div>
          </aside>

          {/* ▼▼▼▼▼▼ 右侧内容区 (Main Content) ▼▼▼▼▼▼ */}
          <main className="flex-1 min-w-0">
             {/* 顶部工具条：标题 + 搜索 */}
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-5 mb-8 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">{t({ zh: '当前查看', en: 'Current View' })}</span>
                   <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      {t(currentCategoryName || { zh: '产品列表', en: 'Products' })}
                      <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{filteredProducts.length}</span>
                   </h2>
                </div>
                
                <div className="relative w-full md:w-72">
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                     placeholder={t({ zh: '输入关键词搜索...', en: 'Search products...' })} 
                   />
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
             </div>

             {/* 产品网格 (3列布局) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {displayedProducts.length === 0 ? (
                   <div className="col-span-full py-24 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                      <Package size={48} className="mx-auto mb-4 opacity-20 text-blue-500"/>
                      <p className="text-lg font-bold text-gray-600">{t({ zh: '暂无相关产品', en: 'No products found' })}</p>
                      <p className="text-sm mt-2">{t({ zh: '请尝试切换分类或搜索其他关键词', en: 'Try changing category or search keyword' })}</p>
                   </div>
                ) : (
                   displayedProducts.map((p, i) => (
                      <Link 
                        to={`/products/${p.id}`} 
                        key={p.id} 
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col hover:-translate-y-1"
                      >
                         <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                            <img 
                               src={p.image} 
                               alt={t(p.name)} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            {/* 悬浮标签 */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               {(p.seriesIds || []).map(sid => {
                                  const sName = data.productSeries?.find(s => s.id === sid)?.name;
                                  return sName ? (
                                    <span key={sid} className="bg-white/90 backdrop-blur text-blue-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-blue-100">
                                       {t(sName)}
                                    </span>
                                  ) : null;
                               })}
                            </div>
                         </div>
                         
                         <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                               {t(p.name)}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                               {t(p.desc)}
                            </p>
                            
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
                               <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">{t({ zh: '查看详情', en: 'View Details' })}</span>
                               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                  <ArrowRight size={14} />
                               </div>
                            </div>
                         </div>
                      </Link>
                   ))
                )}
             </div>

             {/* 分页组件 */}
             {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                   {Array.from({ length: totalPages }, (_, i) => (
                      <button
                         key={i + 1}
                         onClick={() => handlePageChange(i + 1)}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                            currentPage === i + 1 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                         }`}
                      >
                         {i + 1}
                      </button>
                   ))}
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
};

// ▼▼▼▼▼▼▼▼▼▼ ProductDetail 保持不变 (完全复用你原来的) ▼▼▼▼▼▼▼▼▼▼
const ProductDetail: React.FC<{ id: string }> = ({ id }) => {
  const { data, t, addMessage } = useAppContext();
  const product = data.products.find(p => p.id === id);
  const [mainImg, setMainImg] = useState(product?.image || '');
  const [activeFeatIdx, setActiveFeatIdx] = useState(0);
  const [formMsg, setFormMsg] = useState('');

  const [captcha, setCaptcha] = useState(generateCode());
  const [userAns, setUserAns] = useState('');
  
  const refreshCaptcha = () => {
    setCaptcha(generateCode());
    setUserAns('');
  };
  useEffect(() => {
    if (!product) return;
    setMainImg(product.image);
    setActiveFeatIdx(0);
  }, [id]);

  if (!product) return <div className="py-40 text-center text-gray-300 font-black italic tracking-widest">PRODUCT NOT FOUND</div>;

  const handleMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. 验证码校验
    if (userAns.toUpperCase() !== captcha) {
      setFormMsg(t({ zh: '验证码错误', en: 'Wrong CAPTCHA' }));
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

    // 2. 发送邮件
    try {
      fetch(CLOUD_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: `${msgData.lastName}${msgData.firstName}`,
          email: msgData.email,
          phone: msgData.phone,
          message: msgData.content,
          _subject: `【产品咨询】来自: ${msgData.lastName}${msgData.firstName}`,
          _template: "table",
          _captcha: "false"
        })
      }).catch(err => console.error("邮件发送失败:", err));
    } catch (e) { console.error(e); }

    // 3. 本地保存
    const result = addMessage(msgData);
    setFormMsg(result.message);
    
    if (result.success) {
      (e.target as HTMLFormElement).reset();
      refreshCaptcha();
      setUserAns('');
    }
  };

  return (
    <div className="bg-white overflow-hidden pb-24 text-gray-900">
      {/* 顶部产品概要 */}
      <section className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 reveal reveal-up active">
        <div className="space-y-6 reveal reveal-left delay-200">
          <div className="aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white bg-gray-50">
            <img src={mainImg} alt="" className="w-full h-full object-cover transition-all duration-[1s] transform hover:scale-105" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setMainImg(img)}
                className={`w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-4 transition-all duration-300 transform ${mainImg === img ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col justify-center reveal reveal-right delay-300">
          <span className="text-blue-600 font-black text-sm uppercase tracking-[0.3em] mb-6 bg-blue-50 w-fit px-4 py-1.5 rounded-lg">Product Standards</span>
          <h1 className="text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">{t(product.name)}</h1>
          <p className="text-gray-500 text-xl leading-relaxed mb-12 border-l-8 border-blue-500 pl-10 font-bold italic whitespace-pre-wrap">{t(product.desc)}</p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {product.features.map((feat, i) => (
              <button
                key={feat.id}
                onClick={() => setActiveFeatIdx(i)}
                className={`px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-sm border-2 ${activeFeatIdx === i ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-xl shadow-blue-600/30' : 'bg-white text-gray-500 border-gray-100 hover:border-blue-300'}`}
              >
                {t(feat.title)}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 animate-in fade-in duration-700 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-blue-500 opacity-5 group-hover:opacity-10 transition-opacity">
               <CheckCircle2 size={120} />
             </div>
             <div className="relative z-10">
               <h3 className="font-black text-2xl text-gray-900 mb-6 flex items-center gap-3">
                 <div className="w-2 h-8 bg-blue-500 rounded-full" />
                 {t(product.features[activeFeatIdx]?.title || { zh: '信息', en: 'Info' })}
               </h3>
               <p className="text-gray-500 leading-relaxed font-bold text-lg whitespace-pre-wrap">
                 {t(product.features[activeFeatIdx]?.content || { zh: '详细内容正在完善中', en: 'Details coming soon' })}
               </p>
             </div>
          </div>
        </div>
      </section>
            
      {/* 1. 质量指标板块 */}
      <section className="py-20 max-w-7xl mx-auto px-4 reveal reveal-up">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t({ zh: '质量标准', en: 'Quality Standards' })}</h2>
            <span className="text-gray-400 font-bold uppercase text-sm tracking-widest">/ Specification</span>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
                {product.standardsType === 'image' && product.standardsImage && (
                    <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                       <img src={product.standardsImage} alt="Standards" className="w-full h-auto object-contain" />
                    </div>
                )}
                {product.standardsType === 'custom_table' && product.standardsTable && (
                    <CustomTableView data={product.standardsTable} t={t} />
                )}
                {(!product.standardsType || product.standardsType === 'simple') && (product.standards && product.standards.length > 0) && (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="p-4 font-bold">{t({ zh: '指标名称', en: 'Index Name' })}</th>
                                    <th className="p-4 font-bold text-right">{t({ zh: '指标值', en: 'Index Value' })}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {product.standards.map((std, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-700">{t(std.name)}</td>
                                        <td className="p-4 font-black text-blue-600 text-right font-mono">{std.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="space-y-6">
                <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                    <h3 className="font-bold text-xl text-blue-900 mb-4">{t({ zh: '品质承诺', en: 'Quality Commitment' })}</h3>
                    <p className="text-gray-600 leading-loose text-lg font-medium whitespace-pre-wrap text-justify tracking-wide">
                        {t(product.standardsDesc || { zh: '暂无额外说明', en: 'No extra description' })}
                    </p>
                </div>
            </div>
         </div>
      </section>

      {/* 2. 深度详情板块 */}
      {(product.detailBlocks || []).map((block, idx) => (
         <section key={block.id} className="py-20 max-w-7xl mx-auto px-4 reveal reveal-up">
            <div className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
               <div className="flex-1 space-y-6">
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                     {block.type === 'table' ? 'Data Analysis' : `Feature 0${idx + 1}`}
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 leading-tight">{t(block.title || { zh: '', en: '' })}</h3>
                  <div className="w-20 h-1.5 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-500 text-xl leading-loose font-medium whitespace-pre-wrap text-justify tracking-wide">
                     {t(block.content || { zh: '', en: '' })}
                  </p>
               </div>
               <div className="flex-1 w-full">
                  {block.type === 'table' ? (
                      block.tableData && <CustomTableView data={block.tableData} t={t} />
                  ) : (
                      <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white bg-gray-50 group">
                         <img src={block.image} alt="" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                         <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                  )}
               </div>
            </div>
         </section>
      ))}

      {/* 底部表单 */}
      <section className="py-24 bg-gray-50 reveal reveal-up">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row reveal reveal-scale delay-200">
             <div className="lg:w-2/5 bg-blue-600 text-white p-16 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-8 tracking-tighter leading-tight">{t({ zh: '定制化养殖方案支持', en: 'Enterprise Solutions' })}</h2>
                  <p className="text-blue-50 text-xl font-medium opacity-80 leading-relaxed mb-10">{t({ zh: '联系我们的技术专家，根据您的特定养殖环境量身定制高性能饲料组合。', en: 'Contact our specialists for custom feed combinations tailored to your environment.' })}</p>
                </div>
                <div className="space-y-6 text-lg font-black relative z-10">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Phone size={24}/> {t(data.contact.phone)}</div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Mail size={24}/> {t(data.contact.email)}</div>
                </div>
             </div>
             
             <form className="lg:w-3/5 p-16" onSubmit={handleMessage}>
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="col-span-1">
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">{t({ zh: '姓氏', en: 'Surname' })}</label>
                      <input name="lastName" type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-2xl outline-none shadow-sm focus:bg-white transition-all" required />
                   </div>
                   <div className="col-span-1">
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">{t({ zh: '名字', en: 'First Name' })}</label>
                      <input name="firstName" type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-2xl outline-none shadow-sm focus:bg-white transition-all" required />
                   </div>
                   <div className="col-span-1">
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">{t({ zh: '电子邮箱', en: 'Email Address' })}</label>
                      <input name="email" type="email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-2xl outline-none shadow-sm focus:bg-white transition-all" required />
                   </div>
                   <div className="col-span-1">
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">{t({ zh: '联系电话', en: 'Contact Phone' })}</label>
                      <input name="phone" type="tel" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-2xl outline-none shadow-sm focus:bg-white transition-all" required />
                   </div>
                   <div className="col-span-2">
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">{t({ zh: '咨询内容', en: 'Your Inquiry' })}</label>
                      <textarea name="content" rows={5} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:border-blue-500 rounded-2xl outline-none shadow-sm focus:bg-white transition-all" required></textarea>
                   </div>
                </div>
                {formMsg && <p className="mb-6 text-center font-black text-blue-600 text-lg uppercase animate-pulse">{formMsg}</p>}
                <div className="mb-6 bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-100 shadow-sm">
                   <span className="font-black text-gray-500 text-sm hidden sm:block">安全验证:</span>
                   <div 
                     className="font-mono font-bold text-blue-600 text-xl tracking-[0.3em] bg-gray-50 px-4 py-1 rounded-lg select-none italic cursor-pointer relative overflow-hidden"
                     onClick={refreshCaptcha}
                   >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]"></div>
                      {captcha}
                   </div>
                   <input 
                      type="text" 
                      value={userAns}
                      onChange={(e) => setUserAns(e.target.value)}
                      className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold uppercase"
                      placeholder={t({ zh: '输入代码', en: 'Code' })}
                      maxLength={4}
                      required 
                   />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group">
                  <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> {t({ zh: '立即提交您的需求', en: 'SEND INQUIRY NOW' })}
                </button>
             </form>
          </div>
        </div>
      </section>

      {/* 底部其他产品推荐 */}
      <section className="py-24 max-w-7xl mx-auto px-4 reveal reveal-up">
        <h3 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-4">
          <div className="w-10 h-1.5 bg-blue-500 rounded-full" />
          {t({ zh: '更多相关产品', en: 'RECOMMENDED PRODUCTS' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {data.products.filter(p => p.id !== id).slice(0, 4).map((p, i) => (
             <Link key={p.id} to={`/products/${p.id}`} className="group block reveal reveal-up" style={{ transitionDelay: `${(i+1)*100}ms` }}>
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 mb-6 shadow-sm group-hover:shadow-xl transition-all border border-gray-50">
                  <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{t(p.name)}</h4>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{t({ zh: '查看详情', en: 'More Info' })} →</p>
             </Link>
           ))}
        </div>
      </section>
    </div>
  );
};

export const Products: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <ProductDetail id={id} /> : <ProductGrid />;
};