import React, { useState } from 'react';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, ChevronLeft, ChevronRight, Check, Minus } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const getAnimDir = (idx: number, cols: number) => {
  const pos = idx % cols;
  if (pos === 0) return 'left';
  if (pos === cols - 1) return 'right';
  return 'bottom';
};

const TechnicalData = () => {
  const { content, tData, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  if (!content) return null;

  const pageTitle = language === 'CN' ? '技术参数' : 'Technical Data';
  const pageSubtitle = content.pageSubtitles?.tech || (language === 'CN' ? '所有皮带系列的详细规格表' : 'Comprehensive specifications for all belt series');
  const searchPlaceholder = language === 'CN' ? '搜索型号、颜色...' : 'Search model, color...';
  const allMaterialsText = language === 'CN' ? '全部材质' : 'All Materials';
  const itemsPerPageText = language === 'CN' ? '条/页' : '/ page';

  const filteredSpecs = content.techSpecs.filter(spec => {
    const matchSearch = spec.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (spec.color && spec.color.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = filterCategory === 'All' || spec.materialType === filterCategory;
    return matchSearch && matchCat;
  });

  const totalItems = filteredSpecs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpecs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 完整表头定义 (共 25 列)
  const headers = [
    { key: 'model', label: language==='CN'?'型号':'Model', w: 'w-48 sticky left-0 z-10 bg-white shadow-md' }, // 固定首列
    { key: 'material', label: language==='CN'?'材质':'Material', w: 'w-24' },
    { key: 'color', label: language==='CN'?'颜色':'Color', w: 'w-24' },
    { key: 'pattern', label: language==='CN'?'花纹':'Pattern', w: 'w-28' },
    { key: 'ply', label: language==='CN'?'层数':'Ply', w: 'w-20' },
    { key: 'thickness', label: language==='CN'?'总厚度':'Total Thk', w: 'w-24' },
    { key: 'coating', label: language==='CN'?'涂层':'Coat Thk', w: 'w-24' },
    { key: 'weight', label: language==='CN'?'重量':'Weight', w: 'w-20' },
    { key: 'force', label: language==='CN'?'1%延展':'1% Force', w: 'w-24' },
    { key: 'pulley', label: language==='CN'?'最小轮径':'Min Pulley', w: 'w-24' },
    { key: 'temp', label: language==='CN'?'温度':'Temp', w: 'w-24' },
    // 新增属性 (14项)
    { key: 'plate', label: language==='CN'?'滑动':'Sliding', w: 'w-20', type: 'bool' },
    { key: 'roller', label: language==='CN'?'滚筒':'Roller', w: 'w-20', type: 'bool' },
    { key: 'trough', label: language==='CN'?'沟槽':'Trough', w: 'w-20', type: 'bool' },
    { key: 'lateralStable', label: language==='CN'?'横向稳定':'Lateral Stable', w: 'w-24', type: 'bool' },
    { key: 'nonStickCover', label: language==='CN'?'防粘层':'Non-Stick Cover', w: 'w-24', type: 'bool' },
    { key: 'foodGrade', label: language==='CN'?'食品级':'Food Grade', w: 'w-24', type: 'bool' },
    { key: 'oilRes', label: language==='CN'?'耐油':'Oil Res', w: 'w-20', type: 'bool' },
    { key: 'lowNoise', label: language==='CN'?'低噪音':'Low Noise', w: 'w-24', type: 'bool' },
    { key: 'flameRetardant', label: language==='CN'?'阻燃':'Flame Retardant', w: 'w-24', type: 'bool' },
    { key: 'conductivity', label: language==='CN'?'耐电流':'Conductive', w: 'w-24', type: 'bool' },
    { key: 'curve', label: language==='CN'?'弯曲':'Curved', w: 'w-20', type: 'bool' },
    { key: 'fragile', label: language==='CN'?'易脆':'Fragile', w: 'w-20', type: 'bool' },
    { key: 'nonAdhesive', label: language==='CN'?'不粘':'Non-Adhesive', w: 'w-20', type: 'bool' },
    { key: 'antiMicrobial', label: language==='CN'?'抗微生物':'Anti-Microbial', w: 'w-24', type: 'bool' },
  ];

  // 辅助：获取特性的值 (从 conveying 或 features 中取)
  const getFeatureVal = (item: any, key: string) => {
      if (['plate', 'roller', 'trough'].includes(key)) return item.conveying?.[key];
      return item.features?.[key];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Section className="flex-grow">
        <Reveal direction="top">
          <SectionTitle title={pageTitle} subtitle={pageSubtitle} />
        </Reveal>

        {/* 顶部工具栏 (Sticky) */}
        <div className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur-sm pt-4 pb-2 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border-x border-t border-gray-100 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder={searchPlaceholder} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none transition-all font-bold text-gray-700" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-grow md:flex-grow-0">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select className="w-full md:w-48 pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none font-bold text-gray-700 appearance-none cursor-pointer" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
                    <option value="All">{allMaterialsText}</option>
                    {content.techCategories?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>
               <select className="pl-4 pr-8 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none font-bold text-gray-700 cursor-pointer" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                 <option value={15}>15 {itemsPerPageText}</option>
                 <option value={30}>30 {itemsPerPageText}</option>
                 <option value={50}>50 {itemsPerPageText}</option>
               </select>
            </div>
          </div>
        </div>

        {/* 宽表格容器 (支持横向滚动) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-max text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} className={`p-4 text-[11px] font-black text-gray-600 uppercase tracking-widest text-center ${h.w} ${h.key === 'model' ? 'border-r border-gray-200' : ''}`}>
                                {h.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {currentItems.length > 0 ? (
                        currentItems.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                {/* Model (固定左侧) */}
                                <td className="p-4 font-black text-brand-blue text-sm sticky left-0 bg-white group-hover:bg-blue-50/30 border-r border-gray-100 shadow-sm z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-4 rounded-full bg-brand-green"></div>
                                        {item.model}
                                    </div>
                                </td>
                                
                                {/* 基础属性 */}
                                <td className="p-4 text-center text-gray-600 font-bold">{item.materialType}</td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-3 h-3 rounded-full border shadow-sm" style={{backgroundColor: item.colorHex || '#ccc'}}></div>
                                        <span className="text-xs text-gray-500">{item.color}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center text-gray-600 font-bold">{tData(item.pattern)}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.ply}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.totalThickness}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.coatingThickness || '-'}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.weight}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.force1pct || '-'}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.minPulley || '-'}</td>
                                <td className="p-4 text-center text-gray-500 font-bold">{item.workingTemp}</td>

                                {/* 特性属性 (Checkbox 渲染) */}
                                {headers.slice(11).map(h => {
                                    const val = getFeatureVal(item, h.key);
                                    return (
                                        <td key={h.key} className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {val ? <Check size={16} className="text-green-500 stroke-[3]"/> : <Minus size={16} className="text-gray-200"/>}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={25} className="p-20 text-center text-gray-400 font-bold bg-gray-50">No Data Found</td></tr>
                    )}
                </tbody>
            </table>
          </div>
        </div>

        {/* 分页控制器 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all text-gray-600 bg-gray-100"><ChevronLeft size={20} /></button>
            <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p = i + 1;
                    if (currentPage > 3 && totalPages > 5) p = currentPage - 2 + i;
                    if (p > totalPages) return null;
                    return <button key={p} onClick={() => paginate(p)} className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === p ? 'bg-brand-blue text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>;
                })}
            </div>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all text-gray-600 bg-gray-100"><ChevronRight size={20} /></button>
          </div>
        )}
      </Section>
    </div>
  );
};

export default TechnicalData;