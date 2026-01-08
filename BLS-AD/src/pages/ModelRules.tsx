

import React, { useState, useMemo } from 'react';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { CODE_DEFINITIONS } from '../constants';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const ModelRules = () => {
  const { content, language } = useLanguage();
  
  // -- Filter State --
  const [filters, setFilters] = useState({
      thickness: '', // Dynamic
      coverMaterial: '', // Code (P, U...)
      ply: '', // 1,2,3,4
      fabricType: '', // Code (0-9, M)
      color: '', // Code (0-9)
      topSurface: '', // Dynamic (Pattern Name)
      bottomSurface: '', // Dynamic (Pattern Name)
      coverAttr: '', // Code (1-9, 0)
      otherCoverAttr: '', // Code (B, H...)
      otherFabricAttr: '' // Code (A, D...)
  });

  // Results State
  const [results, setResults] = useState(content.techSpecs);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // -- Dynamic Options Extraction --
  const thicknesses = useMemo(() => {
      const set = new Set(content.techSpecs.map(i => i.totalThickness));
      return Array.from(set).sort((a: string, b: string) => parseFloat(a) - parseFloat(b));
  }, [content.techSpecs]);

  const patterns = useMemo(() => {
      // Extract unique patterns from TechSpecs (some might be strings like "Matte/Fabric")
      // And also available patterns from PATTERNS_DATA
      const set = new Set<string>();
      content.techSpecs.forEach(t => {
          if (t.pattern) {
             // Split if compound like "Matte/Fabric"
             t.pattern.split('/').forEach(p => set.add(p.trim()));
          }
      });
      content.patterns.forEach(p => set.add(p.name));
      return Array.from(set).sort();
  }, [content.techSpecs, content.patterns]);

  // -- Handlers --
  const handleFilterChange = (key: string, value: string) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetSearch = () => {
    setFilters({
        thickness: '', coverMaterial: '', ply: '', fabricType: '', color: '',
        topSurface: '', bottomSurface: '', coverAttr: '', otherCoverAttr: '', otherFabricAttr: ''
    });
    setResults(content.techSpecs);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(1);
    
    // Filter Logic
    const filtered = content.techSpecs.filter(item => {
        // 1. Mandatory Fields Check (Must match if selected, if not selected, they are ignored in filter but user must pick them per requirement? 
        // User said: "Thickness, Coating, Ply, Color are mandatory". I assume this means mandatory to *Select* to run a precise search, 
        // OR mandatory data on the product. Let's assume standard filtering: if selected, must match.)
        
        // Thickness (Exact string match)
        if (filters.thickness && item.totalThickness !== filters.thickness) return false;

        // Cover Material (Map Code to MaterialType or RuleData)
        if (filters.coverMaterial) {
            const def = CODE_DEFINITIONS.coverMaterial.find(c => c.code === filters.coverMaterial);
            // Match against explicit ruleData OR fallback to materialType text check
            const match = item.ruleData?.coverMaterial === filters.coverMaterial || 
                          (def && item.materialType.includes(def.en)) || 
                          (def && item.model.includes(filters.coverMaterial));
            if (!match) return false;
        }

        // Ply
        if (filters.ply) {
            const match = item.ruleData?.ply === filters.ply || 
                          item.ply.includes(filters.ply) || 
                          item.model.includes(`P${filters.ply}`); // Simple guess
            if (!match) return false;
        }

        // Color (Code Match)
        if (filters.color) {
            const def = CODE_DEFINITIONS.color.find(c => c.code === filters.color);
            // Match against explicit ruleData OR text color match (EN or CN)
            const colorName = language === 'CN' ? def?.cn : def?.en.split('/')[0]; // Simple match
            const match = item.ruleData?.colorCode === filters.color || 
                          (colorName && item.color.includes(colorName));
            if (!match) return false;
        }

        // Fabric Type
        if (filters.fabricType) {
            if (item.ruleData?.fabricType !== filters.fabricType) return false;
        }

        // Surfaces (Pattern)
        if (filters.topSurface) {
            // Check if pattern string contains this surface
            const match = item.ruleData?.topSurface === filters.topSurface || item.pattern.includes(filters.topSurface);
            if (!match) return false;
        }
        if (filters.bottomSurface) {
             const match = item.ruleData?.bottomSurface === filters.bottomSurface || item.pattern.includes(filters.bottomSurface);
             if (!match) return false;
        }

        // Attributes
        if (filters.coverAttr && item.ruleData?.coverAttr !== filters.coverAttr) return false;
        if (filters.otherCoverAttr && !item.ruleData?.otherCoverAttr?.includes(filters.otherCoverAttr)) return false;
        if (filters.otherFabricAttr && !item.ruleData?.otherFabricAttr?.includes(filters.otherFabricAttr)) return false;

        return true;
    });

    setResults(filtered);
  };

  // Helper to render label based on current language
  const renderLabel = (item: { cn: string, en: string }) => language === 'CN' ? item.cn : item.en;

  // Pagination Logic
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-brand-blue text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{content.labels.ruleTitle}</h1>
          <p className="mt-2 text-blue-100">{content.labels.ruleSubtitle}</p>
        </div>
      </div>

      <Section>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            
            {/* Row 1: Thickness & Cover Material (Mandatory) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleThickness} <span className="text-red-500">*</span></label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.thickness} onChange={e => handleFilterChange('thickness', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {thicknesses.map((t: string) => <option key={t} value={t}>{t} mm</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleMaterial} <span className="text-red-500">*</span></label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.coverMaterial} onChange={e => handleFilterChange('coverMaterial', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {CODE_DEFINITIONS.coverMaterial.map(m => (
                            <option key={m.code} value={m.code}>{m.code} : {renderLabel(m)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 2: Ply & Fabric Type (Ply Mandatory) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.rulePly} <span className="text-red-500">*</span></label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.ply} onChange={e => handleFilterChange('ply', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {[1,2,3,4].map(p => <option key={p} value={p.toString()}>{p} Ply</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleFabricType}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.fabricType} onChange={e => handleFilterChange('fabricType', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {CODE_DEFINITIONS.fabricType.map(f => (
                            <option key={f.code} value={f.code}>{f.code} : {renderLabel(f)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 3: Color & Surfaces (Color Mandatory) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleColor} <span className="text-red-500">*</span></label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.color} onChange={e => handleFilterChange('color', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {CODE_DEFINITIONS.color.map(c => (
                            <option key={c.code} value={c.code}>{c.code} : {renderLabel(c)}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleTopSurface}</label>
                        <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                            value={filters.topSurface} onChange={e => handleFilterChange('topSurface', e.target.value)}>
                            <option value="">{language==='CN'?'全部':'All'}</option>
                            {patterns.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleBottomSurface}</label>
                        <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                            value={filters.bottomSurface} onChange={e => handleFilterChange('bottomSurface', e.target.value)}>
                            <option value="">{language==='CN'?'全部':'All'}</option>
                            {patterns.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Row 4: Cover Attr & Other Cover Attr */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleCoverAttr}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.coverAttr} onChange={e => handleFilterChange('coverAttr', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {CODE_DEFINITIONS.coverAttr.map(c => (
                            <option key={c.code} value={c.code}>{c.code} : {renderLabel(c)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleOtherCover}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.otherCoverAttr} onChange={e => handleFilterChange('otherCoverAttr', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {CODE_DEFINITIONS.otherCoverAttr.map(c => (
                            <option key={c.code} value={c.code} title={renderLabel(c)}>{c.code} : {renderLabel(c).substring(0, 30)}...</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 5: Other Fabric Attr & Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{content.labels.ruleOtherFabric}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-brand-blue"
                        value={filters.otherFabricAttr} onChange={e => handleFilterChange('otherFabricAttr', e.target.value)}>
                        <option value="">{language==='CN'?'全部':'All'}</option>
                        {CODE_DEFINITIONS.otherFabricAttr.map(c => (
                            <option key={c.code} value={c.code}>{c.code} : {renderLabel(c)}</option>
                        ))}
                    </select>
                </div>
                
                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={resetSearch}
                        className="flex items-center px-6 py-2 text-gray-600 hover:text-brand-blue font-medium"
                    >
                        <RefreshCw size={18} className="mr-2" /> {content.labels.ruleResetBtn}
                    </button>
                    <button 
                        type="submit" 
                        className="flex items-center bg-brand-green text-white px-8 py-2 rounded shadow hover:bg-brand-darkGreen transition-colors font-bold"
                    >
                        <Search size={18} className="mr-2" /> {content.labels.ruleSearchBtn}
                    </button>
                </div>
            </div>

          </form>
        </div>

        {/* Results Area */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
             <SectionTitle title={hasSearched ? `Found ${results.length} Products` : "All Products"} align="left" />
             
             {results.length > 0 && (
               <div className="flex items-center space-x-4 bg-white p-2 rounded shadow-sm border border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">{content.labels.rowsPerPage}</span>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-blue cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                  </select>
               </div>
             )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-brand-blue">{item.model}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold uppercase">{item.materialType}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span>{content.labels.thThickness}:</span>
                    <span className="font-medium text-gray-800">{item.totalThickness}mm</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                     <span>{content.labels.thPly}:</span>
                     <span className="font-medium text-gray-800">{item.ply}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                     <span>{content.labels.thColor}:</span>
                     <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full mr-2 border border-gray-300 shadow-sm" style={{backgroundColor: item.colorHex}}></span>
                        <span className="font-medium text-gray-800">{item.color}</span>
                     </div>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                     <span>{content.labels.thPattern}:</span>
                     <span className="font-medium text-gray-800">{item.pattern}</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link to="/technical-data" className="text-brand-green font-bold text-sm hover:underline inline-flex items-center">
                    View Full Specs <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {results.length === 0 && (
             <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                {content.labels.noResults}
             </div>
          )}

           {/* Pagination Controls Bottom */}
           {totalPages > 1 && (
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
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                >
                    <ChevronRight size={20} />
                </button>
             </div>
           )}
        </div>

      </Section>
    </div>
  );
};

export default ModelRules;