
import React from 'react';
import { Link } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const PURoundVBelts = () => {
  const { content, language } = useLanguage();
  if (!content) return null;

  const currentId = 'round-v-belts';
  const currentItem = content.products.find(p => p.id === currentId);
  const pageData = content.customPages[currentId];
  const sameLevelItems = content.products.filter(item => !item.parentId);

  if (!pageData) return <div className="text-center p-20 font-black text-gray-200">DATA LOAD FAILED</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部吸顶导航 */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="mb-4 md:mb-0">
               <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-blue mb-1">
                  <ArrowLeft size={14} className="mr-1" /> {content.labels.back}
               </Link>
               <h1 className="text-2xl font-bold text-brand-blue uppercase">{currentItem?.title || 'ROUND & V-BELTS'}</h1>
             </div>
             <div className="flex space-x-4 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {sameLevelItems.map(item => (
                  <Link key={item.id} to={item.path || `/products/${item.id}`} className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm uppercase transition-all border ${item.id === currentId ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue hover:text-brand-blue'}`}>{item.title}</Link>
                ))}
             </div>
          </div>
        </div>
      </div>

      <Section className="flex-grow !pt-0 !pb-20">
        <div className="pt-8 md:pt-10 max-w-7xl mx-auto">
          {/* 产品简介 */}
          <Reveal direction="top">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-12 border-l-[16px] border-l-brand-blue">
               <h2 className="text-xl font-black text-brand-blue mb-4 uppercase tracking-widest">PU Materials & Application</h2>
               <p className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{pageData.introText}</p>
            </div>
          </Reveal>

          {/* 表格区 */}
          <div className="space-y-16">
            {pageData.tables.map((table, idx) => (
              <Reveal key={idx} direction="bottom" delay={idx * 100}>
                <div className="flex flex-col lg:flex-row gap-12 bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                   <div className="lg:w-1/3 flex items-center justify-center bg-gray-50 rounded-[2.5rem] p-8 border-2 border-gray-50 shrink-0">
                      <img src={table.image} alt={table.title} className="max-w-full h-auto object-contain mix-blend-multiply hover:scale-105 transition-transform" />
                   </div>

                   <div className="lg:w-2/3 flex flex-col justify-center">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tighter border-b-4 border-brand-blue/10 pb-2 inline-block">{table.title}</h3>
                      <div className="overflow-x-auto rounded-3xl border border-gray-100 mb-6">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-brand-blue text-white">
                              {table.cols.map((col, cIdx) => (
                                <th key={cIdx} className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest border-r border-white/10 last:border-0">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-6 py-4 text-center text-sm font-bold text-gray-600 border-r border-gray-50 last:border-0">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {table.pretensionValue && (
                         <div className="self-start flex items-center gap-3 px-6 py-3 bg-brand-lightBlue/40 text-brand-blue text-sm font-black rounded-2xl border border-brand-blue/10">
                            <Zap size={18} className="fill-brand-blue"/>
                            <span className="uppercase tracking-widest">Recommended Pretension: <span className="text-xl ml-1">{table.pretensionValue}%</span></span>
                         </div>
                      )}
                   </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 公差规格 */}
          {pageData.toleranceText && (
            <Reveal direction="bottom">
              <div className="mt-16 p-10 bg-white rounded-[3.5rem] border-2 border-gray-100 shadow-sm">
                <h4 className="text-xl font-black text-brand-blue uppercase tracking-widest mb-6 border-l-8 border-brand-blue pl-4">Engineering Tolerances</h4>
                <div className="text-lg text-gray-600 font-bold leading-relaxed whitespace-pre-wrap bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                    {pageData.toleranceText}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </div>
  );
};

export default PURoundVBelts;
