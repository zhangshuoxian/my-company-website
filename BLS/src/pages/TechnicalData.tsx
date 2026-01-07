

import React, { useState, useMemo } from 'react';
import { Section } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TechnicalData = () => {
  const { content, language, tData } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filter Logic
  const filteredItems = useMemo(() => {
    let items = content.techSpecs;
    if (activeTab === 'All') return items;
    return items.filter(item => item.materialType === activeTab);
  }, [content.techSpecs, activeTab]);
  
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Ensure page is valid after filtering
  if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Tab Definitions from Context Categories
  const tabs = [
    { id: 'All', label: content.labels.tabAll },
    ...content.techCategories.map(cat => ({ id: cat, label: cat }))
  ];

  // Headers for Conveying Modes and Features
  const headers = language === 'CN' ? {
      plate: '平板', roller: '滚轮', trough: '槽型',
      sideslip: '抗侧滑', // Renamed from Lateral Stability
      anti: '抗静电', 
      food: '符合食品级', // FDA basically
      oil: '耐油性', flame: '阻燃性', noise: '低噪音', bac: '抗菌性',
      turning: '适用于转弯', stick: '防粘连', lowTemp: '抗低温',
      coating: '涂层厚度/内'
  } : {
      plate: 'Plate', roller: 'Roller', trough: 'Trough',
      sideslip: 'Anti-sideslip', // Renamed
      anti: 'Antistatic', 
      food: 'FDA Compliant', // FDA
      oil: 'Oil Res.', flame: 'Flame Ret.', noise: 'Low Noise', bac: 'Antibac.',
      turning: 'Turning', stick: 'Anti-stick', lowTemp: 'Low Temp',
      coating: 'Coating/Inner'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <div className="bg-brand-blue text-white py-16 mt-0">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{content.labels.techParams}</h1>
        </div>
      </div>

      {/* Sticky Tabs Bar - Top 24 (96px) to sit below Main Header */}
      <div className="sticky top-24 z-30 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                className={`px-6 py-4 text-base font-bold uppercase tracking-wide border-b-4 transition-colors whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'border-brand-green text-brand-blue bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-brand-blue hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Section className="flex-grow !py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
          
          {/* Controls - Moved to Top */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center bg-gray-50 gap-4">
             <div className="flex items-center space-x-4">
               <span className="text-base text-gray-700 font-medium">{content.labels.rowsPerPage}</span>
               <select 
                 className="border border-gray-300 rounded px-3 py-2 text-base outline-none focus:border-brand-blue cursor-pointer"
                 value={itemsPerPage}
                 onChange={(e) => {
                   setItemsPerPage(Number(e.target.value));
                   setCurrentPage(1);
                 }}
               >
                 <option value={10}>10</option>
                 <option value={20}>20</option>
                 <option value={50}>50</option>
                 <option value={100}>100</option>
               </select>
             </div>

             {/* Pagination Top */}
             <div className="flex items-center space-x-4">
                <span className="text-base font-medium text-gray-700">
                  {filteredItems.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, totalItems)} {content.labels.of} {totalItems}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 border border-gray-300"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 border border-gray-300"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead className="bg-gray-100">
                <tr className="divide-x divide-gray-200">
                  {/* Basic Info - Sticky Header (top-0 relative to container) */}
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky left-0 top-0 bg-gray-200 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[140px]">{content.labels.thModel}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{content.labels.thPly}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{content.labels.thColor}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10 min-w-[120px]">{content.labels.thPattern}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{content.labels.thThickness}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{headers.coating}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{content.labels.thWeight}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{content.labels.thForce}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{content.labels.thMinPulley}</th>
                  <th className="px-3 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider sticky top-0 bg-gray-100 z-10 min-w-[100px]">{content.labels.thTemp}</th>
                  
                  {/* Conveying Modes Header Group */}
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-blue uppercase tracking-wider sticky top-0 bg-gray-100 z-10 border-l-2 border-gray-300">{headers.plate}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-blue uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{headers.roller}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-blue uppercase tracking-wider sticky top-0 bg-gray-100 z-10">{headers.trough}</th>

                  {/* Features Header Group */}
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10 border-l-2 border-gray-300" title="Anti-sideslip">{headers.sideslip}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Antistatic">{headers.anti}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="FDA Compliant">{headers.food}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Oil Resistant">{headers.oil}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Flame Retardant">{headers.flame}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Low Noise">{headers.noise}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Antibacterial">{headers.bac}</th>
                  {/* New Cols */}
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Turning">{headers.turning}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Anti-stick">{headers.stick}</th>
                  <th className="px-2 py-4 text-center text-sm font-bold text-brand-green uppercase tracking-wider sticky top-0 bg-gray-100 z-10" title="Low Temp">{headers.lowTemp}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      
                      {/* Sticky Model Column */}
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-brand-blue sticky left-0 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 border-r border-gray-200 text-base">
                        {item.model}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{tData(item.ply)}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span 
                            className="block w-12 h-6 rounded border border-gray-300 shadow-sm"
                            style={{ backgroundColor: item.colorHex }}
                            title={tData(item.color)}
                          ></span>
                          <span className="text-xs">{tData(item.color)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{tData(item.pattern)}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700 font-medium">{item.totalThickness}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{item.coatingThickness}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{item.weight}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{item.force1pct}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{item.minPulley}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{item.workingTemp}</td>
                      
                      {/* Conveying Modes */}
                      <td className="px-2 py-3 text-center border-l-2 border-gray-200">{item.conveying.plate && <span className="text-lg text-brand-blue">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.conveying.roller && <span className="text-lg text-brand-blue">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.conveying.trough && <span className="text-lg text-brand-blue">★</span>}</td>

                      {/* Features */}
                      <td className="px-2 py-3 text-center border-l-2 border-gray-200">{item.features.lateralStability && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.antistatic && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.foodGrade && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.oilResistant && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.flameRetardant && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.lowNoise && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.antibacterial && <span className="text-lg text-brand-green">★</span>}</td>
                      {/* New Features */}
                      <td className="px-2 py-3 text-center">{item.features.turning && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.antiStick && <span className="text-lg text-brand-green">★</span>}</td>
                      <td className="px-2 py-3 text-center">{item.features.lowTemp && <span className="text-lg text-brand-green">★</span>}</td>

                    </tr>
                  ))
                ) : (
                   <tr>
                     <td colSpan={21} className="text-center py-10 text-gray-500 text-lg">
                       {content.labels.noResults}
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default TechnicalData;
