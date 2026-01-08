import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

// 👇 1. 去掉这里的 export，只定义组件
const NewsList = () => {
  const { content } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Logic
  const totalItems = content.news.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = content.news.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Section>
      <SectionTitle title={content.labels.news} subtitle={content.pageSubtitles?.news} />
      <div className="space-y-8 max-w-4xl mx-auto min-h-[600px]">
        {currentItems.map(news => (
          <Link key={news.id} to={`/news/${news.id}`} className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow group">
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
              <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="md:w-2/3 p-6 flex flex-col justify-center">
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <Calendar size={14} className="mr-1" />
                {news.date}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand-blue">{news.title}</h3>
              <p className="text-gray-600 line-clamp-2">{news.summary}</p>
              <span className="mt-4 text-brand-green font-medium text-sm">{content.labels.readMore} &rarr;</span>
            </div>
          </Link>
        ))}
        {currentItems.length === 0 && <div className="text-center text-gray-500 py-10">No news available.</div>}
      </div>

      {/* Pagination Controls */}
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
    </Section>
  );
};

// 👇 2. 同样去掉这里的 export
const NewsDetail = () => {
  const { content } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const news = content.news.find(n => n.id === id);

  if (!news) return <div className="p-10 text-center">{content.labels.noResults}</div>;

  return (
    <Section>
       <div className="max-w-3xl mx-auto">
         <Link to="/news" className="inline-flex items-center text-gray-500 hover:text-brand-blue mb-6">
            <ArrowLeft size={16} className="mr-1" /> {content.labels.back}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>
          <div className="flex items-center text-gray-500 text-sm mb-8 border-b pb-4">
             <Calendar size={16} className="mr-2" /> {news.date}
          </div>
          <img src={news.image} alt={news.title} className="w-full rounded-lg shadow-md mb-8" />
          <div className="prose prose-lg text-gray-700">
            <p className="font-semibold text-lg">{news.summary}</p>
            <div className="mt-6 whitespace-pre-wrap">
              {news.content}
            </div>
          </div>
       </div>
    </Section>
  );
};

// 👇 3. 关键修改：在这里统一导出
export { NewsDetail }; // 具名导出详情页
export default NewsList; // 默认导出列表页 (这样 import News 就能用了)