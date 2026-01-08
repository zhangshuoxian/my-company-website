import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { CategoryItem, HistoryEvent, CertificateItem, DownloadItem } from '../types';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Reveal } from '../components/Reveal';

interface CategoryViewProps {
  type: 'industry' | 'product' | 'intro';
}

const findCategory = (id: string, items: CategoryItem[]): CategoryItem | undefined => {
  return items.find(i => i.id === id);
};

const getAnimDir = (idx: number, cols: number) => {
  const pos = idx % cols;
  if (pos === 0) return 'left';
  if (pos === cols - 1) return 'right';
  return 'bottom';
};

const CategoryView: React.FC<CategoryViewProps> = ({ type }) => {
  const { content, language, tData } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  if (!content) return null;

  let allItems: CategoryItem[] = [];
  let pageTitle = '';
  let pageSubtitle = '';

  if (type === 'industry') { 
      allItems = content.industries; 
      pageTitle = content.labels.industries; 
      pageSubtitle = content.pageSubtitles?.industry;
  } else if (type === 'product') { 
      allItems = content.products; 
      pageTitle = content.labels.products; 
      pageSubtitle = content.pageSubtitles?.product;
  } else if (type === 'intro') { 
      allItems = content.intros; 
      pageTitle = content.labels.intro; 
      pageSubtitle = content.pageSubtitles?.about;
  }

  // 1. 列表根视图
  if (!id) {
    const rootItems = allItems.filter(item => !item.parentId);
    return (
      <Section className="min-h-screen">
        <Reveal direction="top">
          <SectionTitle title={pageTitle} subtitle={pageSubtitle} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {rootItems.map((item, idx) => (
            <Reveal key={item.id} direction={getAnimDir(idx, 3)} delay={idx * 100}>
              <Link to={`/${type === 'industry' ? 'industry' : type === 'intro' ? 'intro' : 'products'}/${item.id}`} className="group block shadow-lg hover:shadow-2xl rounded-[3rem] overflow-hidden bg-white transition-all border-2 border-gray-50">
                <div className="h-80 overflow-hidden bg-gray-50">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-10 border-l-[12px] border-transparent group-hover:border-brand-blue transition-all">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 text-sm font-bold line-clamp-2">{item.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    );
  }

  // 2. 详情视图
  const currentItem = findCategory(id, allItems);
  if (!currentItem) return <Section><div className="text-center p-20 font-black text-gray-300 uppercase tracking-widest opacity-20">Content Not Found</div></Section>;

  const siblings = type === 'product' 
    ? allItems.filter(item => item.parentId === currentItem.parentId)
    : allItems.filter(i => !i.parentId); 

  const basePath = type === 'industry' ? 'industry' : type === 'intro' ? 'intro' : 'products';

  // 双语表头配置
  const tableHeaders = language === 'CN' 
    ? ['型号', '总厚度', '层数', '工作温度', '主要特性'] 
    : ['Model', 'Thickness', 'Ply', 'Temp', 'Features'];

  const IntroContent = () => {
    switch(id) {
      case 'history': return <HistoryView history={content.about.history} />;
      case 'ip': return <IPView certs={content.about.certificates} />;
      case 'downloads': return <DownloadsView files={content.about.downloads} />;
      default:
        const pageData = content.about.pages[id || ''];
        return (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <Reveal direction="left" className="w-full lg:w-1/2">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-brand-blue mb-8 border-l-8 border-brand-blue pl-6 uppercase tracking-tight">{currentItem.title}</h2>
                <div className="prose prose-lg text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {pageData?.content || currentItem.description}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" className="w-full lg:w-1/2 grid grid-cols-1 gap-6">
              {(pageData?.images || [currentItem.image]).map((img, idx) => (
                <div key={idx} className="rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white bg-white">
                  <img src={img} alt="" className="w-full h-auto object-cover" />
                </div>
              ))}
            </Reveal>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* === 顶部导航栏 (普通文档流) === */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="mb-2 md:mb-0">
               <Link to={`/${basePath}${currentItem.parentId ? '/' + currentItem.parentId : ''}`} className="inline-flex items-center text-sm text-gray-500 hover:text-brand-blue mb-1">
                  <ArrowLeft size={14} className="mr-1" /> {content.labels.back}
               </Link>
               <h1 className="text-2xl font-bold text-brand-blue uppercase">{currentItem.title}</h1>
             </div>
             
             {/* 应用选项 */}
             <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 max-w-full no-scrollbar">
                {siblings.map(item => (
                  <Link key={item.id} to={`/${basePath}/${item.id}`} className={`flex-shrink-0 px-6 py-2 rounded-full font-bold text-sm uppercase transition-all border ${item.id === id ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue hover:text-brand-blue hover:shadow-sm'}`}>{item.title}</Link>
                ))}
             </div>
          </div>
        </div>
      </div>

      <Section className="flex-grow !pt-8 !pb-20">
        <div className="pt-4">
          {type === 'intro' ? (
            <IntroContent />
          ) : type === 'industry' ? (
            <>
              {/* 顶部介绍区域 */}
              <div className="flex flex-col lg:flex-row gap-10 items-start mb-12">
                 <Reveal direction="left" className="w-full lg:w-1/2">
                   <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-white">
                     <img src={currentItem.image} alt={currentItem.title} className="w-full h-auto object-cover" />
                   </div>
                 </Reveal>
                 <Reveal direction="right" className="w-full lg:w-1/2">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                      <h2 className="text-2xl font-black text-brand-blue mb-6 border-l-8 border-brand-blue pl-4 uppercase tracking-tighter">
                        {language === 'CN' ? '行业技术方案' : 'Engineering Solutions'}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                        {content.industryDetails[id]?.description || currentItem.description}
                      </p>
                    </div>
                 </Reveal>
              </div>
              
              {/* === Grid 布局的产品表格 === */}
              {content.industryDetails[id]?.productModels.length > 0 && (
                <div className="mt-10">
                  
                  {/* 1. 表头 (Sticky 容器) 
                    - pt-4 pb-2: 关键！增加了上下内边距，让它不那么紧凑，留出呼吸空间。
                    - bg-gray-50: 背景色遮挡住滚上来的内容，防止文字重叠。
                  */}
                  <div className="sticky top-20 z-30 bg-gray-50 pt-4 pb-2 transition-all">
                    {/* 内部的圆角表头条 */}
                    <div className="bg-gray-100 rounded-t-[2rem] border-x border-t border-gray-200 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-5 p-5">
                        {tableHeaders.map((h, i) => (
                          <div key={i} className="text-sm font-black text-gray-600 uppercase tracking-widest text-left">
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. 数据列表主体 (圆角底部) */}
                  <div className="bg-white rounded-b-[2rem] border border-gray-100 shadow-lg overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {content.techSpecs.filter(spec => content.industryDetails[id].productModels.includes(spec.model)).map((item, idx) => (
                        <div key={idx} className="grid grid-cols-5 p-5 hover:bg-blue-50/30 transition-colors items-center group">
                          
                          {/* Model */}
                          <div className="font-black text-brand-blue text-sm">{item.model}</div>
                          
                          {/* Thickness */}
                          <div className="font-bold text-gray-500 text-sm">{item.totalThickness}mm</div>
                          
                          {/* Ply */}
                          <div className="font-bold text-gray-500 text-sm">{item.ply}</div>
                          
                          {/* Temp */}
                          <div className="font-bold text-gray-500 text-sm">{item.workingTemp}</div>
                          
                          {/* Features */}
                          <div className="text-xs font-black text-brand-green uppercase">{tData(item.pattern)}</div>
                          
                        </div>
                      ))}
                    </div>
                    
                    {/* 无数据时的提示 */}
                    {content.techSpecs.filter(spec => content.industryDetails[id].productModels.includes(spec.model)).length === 0 && (
                      <div className="p-10 text-center text-gray-400 font-bold">
                        {language === 'CN' ? '暂无推荐型号' : 'No recommended models available'}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </>
          ) : (
            /* 标准产品详情 (保持不变) */
            (() => {
              const children = allItems.filter(item => item.parentId === id);
              const isLeaf = children.length === 0;
              return isLeaf ? (
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <Reveal direction="left" className="w-full md:w-1/2">
                    <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-white">
                      <img src={currentItem.image} alt={currentItem.title} className="w-full h-auto" />
                    </div>
                  </Reveal>
                  <Reveal direction="right" className="w-full md:w-1/2">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <h2 className="text-2xl font-black text-brand-blue mb-6 border-b-4 border-brand-blue/10 pb-2 uppercase tracking-tight">SPECIFICATIONS</h2>
                      <div className="prose prose-lg text-gray-600 font-medium leading-relaxed">
                        <p className="text-2xl font-black text-gray-900 mb-6">{currentItem.title}</p>
                        <p>{currentItem.description}</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ) : (
                <div>
                  <Reveal direction="top"><SectionTitle title={currentItem.title} align="left" /></Reveal>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                    {children.map((child, idx) => (
                      <Reveal key={child.id} direction={getAnimDir(idx, 3)} delay={idx * 50}>
                        <Link to={`/${basePath}/${child.id}`} className="group block bg-white border-2 border-gray-100 rounded-[2.5rem] hover:shadow-xl transition-all overflow-hidden p-2">
                          <div className="h-56 overflow-hidden rounded-[2rem] bg-gray-50"><img src={child.image} alt={child.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                          <div className="p-8 text-center"><h3 className="text-lg font-black text-gray-900 group-hover:text-brand-blue transition-colors uppercase tracking-tight">{child.title}</h3></div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </Section>
    </div>
  );
};

// ... (子组件保持不变) ...
const HistoryView = ({ history }: { history: HistoryEvent[] }) => (
  <div className="max-w-4xl mx-auto py-10">
    <div className="relative border-l-4 border-brand-blue ml-4 space-y-12">
      {history.map((event, idx) => (
        <Reveal key={event.id} direction="left" delay={idx * 100} className="relative pl-10">
          <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-brand-blue border-4 border-white shadow-md"></div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="inline-block px-4 py-1 bg-brand-lightBlue text-brand-blue font-black rounded-full text-xs mb-4 uppercase tracking-widest">{event.year}</span>
            <h3 className="text-xl font-black text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{event.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

const IPView = ({ certs }: { certs: CertificateItem[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
    {certs.map((cert, idx) => (
      <Reveal key={cert.id} direction={getAnimDir(idx, 5)} delay={idx * 50}>
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 hover:border-brand-blue transition-colors text-center group">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-gray-50 border-2 border-gray-50">
            <img src={cert.image} alt={cert.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{cert.category}</span>
          <h4 className="text-xs font-bold text-gray-800 line-clamp-2">{cert.title}</h4>
        </div>
      </Reveal>
    ))}
  </div>
);

const DownloadsView = ({ files }: { files: DownloadItem[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
    {files.map((item, idx) => (
      <Reveal key={item.id} direction={getAnimDir(idx, 3)} delay={idx * 50}>
        <a href={item.fileUrl} download={item.fileName} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all flex items-center gap-6 group">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <FileText size={32} />
          </div>
          <div className="flex-grow">
            <h3 className="font-black text-gray-900 mb-1 leading-tight">{item.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
          </div>
          <Download size={20} className="text-gray-300 group-hover:text-brand-blue transition-colors" />
        </a>
      </Reveal>
    ))}
  </div>
);

export default CategoryView;