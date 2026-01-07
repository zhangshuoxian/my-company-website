import React, { useState } from 'react';
import { Section } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { IMAGES } from '../constants';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal'; // 引入动画组件

const PatternsFabrics = () => {
  const { content, tData } = useLanguage();
  
  const parentId = 'conveyor-belts';
  const sameLevelItems = content.products.filter(item => item.parentId === parentId);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const totalItems = content.patterns.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = content.patterns.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 动画方向计算
  const getAnimDir = (idx: number, cols: number) => {
    const pos = idx % cols;
    if (pos === 0) return 'left';
    if (pos === cols - 1) return 'right';
    return 'bottom';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Sibling Nav */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
             
             <div className="mb-4 md:mb-0">
               <Link to={`/products/${parentId}`} className="inline-flex items-center text-sm text-gray-500 hover:text-brand-blue mb-1">
                  <ArrowLeft size={14} className="mr-1" /> {content.labels.back}
               </Link>
               <h1 className="text-2xl font-bold text-brand-blue">{content.labels.patternTitle}</h1>
             </div>

             {sameLevelItems.length > 0 && (
                <div className="flex space-x-4 overflow-x-auto pb-1 max-w-full">
                   {sameLevelItems.map(item => (
                     <Link 
                       key={item.id}
                       to={`/products/${item.id}`}
                       className={`flex-shrink-0 group flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300
                         ${item.id === 'patterns-fabrics' 
                           ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                           : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green hover:shadow-sm'}
                       `}
                     >
                        <span className="font-medium whitespace-nowrap">{item.title}</span>
                     </Link>
                   ))}
                </div>
             )}
          </div>
        </div>
      </div>

      <Section className="flex-grow">
        {/* Pagination Controls Top */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
           <div className="flex items-center space-x-4 mb-4 md:mb-0">
               <span className="text-gray-700 font-medium">{content.labels.rowsPerPage}</span>
               <select 
                 className="border border-gray-300 rounded px-3 py-1 outline-none focus:border-brand-blue cursor-pointer"
                 value={itemsPerPage}
                 onChange={(e) => {
                   setItemsPerPage(Number(e.target.value));
                   setCurrentPage(1);
                 }}
               >
                 <option value={6}>6</option>
                 <option value={12}>12</option>
                 <option value={24}>24</option>
               </select>
           </div>
           
           <div className="text-gray-600 font-medium">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} {content.labels.of} {totalItems}
           </div>
        </div>

        {/* 3列布局动画 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item, index) => (
            <Reveal key={index} direction={getAnimDir(index, 3)} delay={index * 50}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 flex h-60 hover:shadow-xl transition-shadow">
                
                <div className="w-2/5 relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gray-100">
                    <img 
                      src={item.image || IMAGES.patternPlaceholder} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 origin-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/E6F0FF/0047AB?text=Boshun'; 
                      }}
                    />
                  </div>
                </div>

                <div className="w-3/5 p-4 flex flex-col justify-center text-sm space-y-2 bg-white relative z-10">
                  <div className="pb-2 border-b border-gray-100 mb-1">
                    <h3 className="font-bold text-lg text-brand-blue">{tData(item.name)}</h3>
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-gray-500 font-medium">{content.labels.patternCode}:</span>
                    <span className="text-gray-800 font-bold">{item.code}</span>

                    <span className="text-gray-500 font-medium">{content.labels.patternThickness}:</span>
                    <span className="text-gray-800">{item.thickness}</span>

                    <span className="text-gray-500 font-medium">{content.labels.patternWidth}:</span>
                    <span className="text-gray-800">{item.width}</span>

                    <span className="text-gray-500 font-medium">{content.labels.patternFeatures}:</span>
                    <span className="text-gray-800 line-clamp-1" title={tData(item.features || '')}>{tData(item.features || '') || '-'}</span>

                    <span className="text-gray-500 font-medium">{content.labels.patternApp}:</span>
                    <span className="text-gray-800 line-clamp-2" title={tData(item.application || '')}>{tData(item.application || '') || '-'}</span>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

        {/* Pagination Controls Bottom */}
        <div className="mt-12 flex justify-center items-center space-x-2">
            <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
                <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-md font-bold transition-colors ${
                        currentPage === i + 1 
                        ? 'bg-brand-green text-white shadow-md' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
                <ChevronRight size={20} />
            </button>
        </div>

      </Section>
    </div>
  );
};

export default PatternsFabrics;