

import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { COMPANY_NAME, IMAGES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const About = () => {
  const { content } = useLanguage();
  const { id } = useParams<{ id?: string }>(); // Optional ID for sub-route
  
  // Default to first section if no ID
  if (!id) {
     return <Navigate to={`/about/${content.about.sections[0].id}`} replace />;
  }

  const currentSection = content.about.sections.find(s => s.id === id);
  
  // Sticky Nav Component
  const StickySubNav = () => (
    <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Left: Title */}
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-brand-blue">{currentSection?.title || 'About Us'}</h1>
            </div>

            {/* Right: Sibling Navigation Bar */}
            <div className="flex space-x-4 overflow-x-auto pb-1 max-w-full">
                  {content.about.sections.map(item => (
                    <Link 
                      key={item.id}
                      to={`/about/${item.id}`}
                      className={`flex-shrink-0 group flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300
                        ${item.id === id
                          ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green hover:shadow-sm'}
                      `}
                    >
                      <span className="font-medium whitespace-nowrap">{item.title}</span>
                    </Link>
                  ))}
            </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER CONTENT BASED ON ID ---
  const renderContent = () => {
      switch(id) {
          case 'history':
              return <HistoryView />;
          case 'ip':
              return <IPView />;
          case 'downloads':
              return <DownloadsView />;
          default:
              return <StandardPageView id={id} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <StickySubNav />
       <Section className="flex-grow">
          {currentSection ? renderContent() : <div className="text-center">Section Not Found</div>}
       </Section>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. Standard Page (Profile, Culture, Strategy)
export const StandardPageView = ({ id }: { id: string }) => {
    const { content } = useLanguage();
    const pageData = content.about.pages[id];

    if (!pageData) return <div>No content available.</div>;

    return (
        <div className="flex flex-col md:flex-row gap-12 items-start">
             {/* Text Side */}
             <div className="w-full md:w-1/2">
                 <div className="prose prose-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                     {pageData.content}
                 </div>
             </div>
             {/* Image Side */}
             <div className="w-full md:w-1/2 grid grid-cols-1 gap-4">
                 {pageData.images && pageData.images.map((img, idx) => (
                     <div key={idx} className="rounded-xl overflow-hidden shadow-lg">
                         <img src={img} alt="" className="w-full h-auto object-cover" />
                     </div>
                 ))}
             </div>
        </div>
    );
};

// 2. History View (Vertical Timeline)
export const HistoryView = () => {
    const { content } = useLanguage();
    // Sort descending by year/id
    const sortedHistory = [...content.about.history].sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return (
        <div className="max-w-5xl mx-auto">
            <div className="relative border-l-4 border-brand-green ml-4 md:ml-1/2 space-y-16">
                {sortedHistory.map((event, idx) => (
                    <div key={event.id} className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        
                        {/* Dot on Line */}
                        <div className="absolute left-[-10px] md:left-1/2 md:-ml-3 w-6 h-6 rounded-full bg-brand-green border-4 border-white shadow-sm z-10"></div>

                        {/* Content Card */}
                        <div className={`w-full md:w-1/2 pl-8 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                                <span className="inline-block px-3 py-1 bg-brand-lightBlue text-brand-blue font-bold rounded mb-2">{event.year}</span>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                                <p className="text-gray-600 mb-4">{event.description}</p>
                                {event.image && <img src={event.image} className="w-full h-48 object-cover rounded" alt={event.title} />}
                            </div>
                        </div>
                        
                        {/* Spacer for other side */}
                        <div className="hidden md:block w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. IP View (Grid of Certs)
export const IPView = () => {
    const { content } = useLanguage();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items (requested 1-10)

    const totalItems = content.about.certificates.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = content.about.certificates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            {/* Pagination Controls Top */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded border">
                <div>
                     <span className="mr-2">Items per page:</span>
                     <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded p-1">
                         <option value={10}>10</option>
                         <option value={20}>20</option>
                         <option value={50}>50</option>
                     </select>
                </div>
                <div>{currentPage} / {totalPages || 1}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {currentItems.map(cert => (
                    <div key={cert.id} className="bg-white p-4 rounded-lg shadow border hover:border-brand-blue transition-colors group">
                        <div className="aspect-[3/4] overflow-hidden rounded mb-3 bg-gray-100">
                            <img src={cert.image} alt={cert.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="text-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">{cert.category}</span>
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-2" title={cert.title}>{cert.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 border rounded"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 border rounded"><ChevronRight size={20}/></button>
                </div>
            )}
        </div>
    );
};

// 4. Downloads View
export const DownloadsView = () => {
    const { content } = useLanguage();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.about.downloads.map(item => (
                <a key={item.id} href={item.fileUrl} download={item.fileName} className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-all flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <FileText size={32} />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.fileName}</p>
                    <span className="inline-flex items-center text-xs font-bold text-brand-blue uppercase tracking-wide">
                        <Download size={14} className="mr-1" /> Download
                    </span>
                </a>
            ))}
        </div>
    );
};

export default About;
