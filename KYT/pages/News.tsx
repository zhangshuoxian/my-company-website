
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { Calendar, ChevronRight } from 'lucide-react';

const NewsList: React.FC = () => {
  const { data, t } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.news.length / itemsPerPage);

  const displayedNews = data.news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="py-24 max-w-5xl mx-auto px-4 bg-white text-gray-900">
      <h1 className="text-4xl font-bold text-center mb-16 text-gray-900 tracking-tight">{t({ zh: '新闻资讯', en: 'News Center' })}</h1>
      <div className="space-y-12">
        {displayedNews.map(n => (
          <Link to={`/news/${n.id}`} key={n.id} className="flex flex-col md:flex-row gap-10 group bg-white p-4 rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-sm transition-all">
             <div className="md:w-1/3 aspect-[16/10] rounded-2xl overflow-hidden bg-gray-50 border border-gray-50">
               <img src={n.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             </div>
             <div className="md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                  <Calendar size={14} />
                  <span>{n.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">{t(n.title)}</h3>
                <p className="text-gray-400 leading-relaxed line-clamp-2 mb-6 font-medium">{t(n.summary)}</p>
                <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                  {t({ zh: '查看更多', en: 'Read More' })} <ChevronRight size={16} />
                </div>
             </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center gap-3">
          <button 
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(prev => prev - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 font-bold text-gray-500"
          >
            {t({ zh: '上一页', en: 'Prev' })}
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 font-bold shadow-md shadow-blue-600/10"
          >
            {t({ zh: '下一页', en: 'Next' })}
          </button>
        </div>
      )}
    </div>
  );
};

const NewsDetail: React.FC<{ id: string }> = ({ id }) => {
  const { data, t } = useAppContext();
  const n = data.news.find(item => item.id === id);

  if (!n) return <div className="py-24 text-center font-bold text-gray-300 tracking-widest italic uppercase">Article Not Found</div>;

  return (
    <div className="py-24 max-w-4xl mx-auto px-4 bg-white text-gray-900">
      <Link to="/news" className="text-blue-600 font-bold mb-10 inline-block hover:underline">← {t({ zh: '返回列表', en: 'Back' })}</Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">{t(n.title)}</h1>
      <div className="flex items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider mb-12 border-b border-gray-100 pb-8">
        <span className="flex items-center gap-1.5"><Calendar size={14} /> {n.date}</span>
        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
        <span>{t({ zh: '企业动态', en: 'Corporate News' })}</span>
      </div>
      
      <article className="space-y-8 text-gray-600 leading-relaxed text-lg font-medium">
         <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-50">
            <img src={n.image} alt="" className="w-full" />
         </div>
         <p className="font-bold text-gray-900 text-xl border-l-4 border-blue-500 pl-6">{t(n.summary)}</p>
         <div className="whitespace-pre-wrap">{t(n.content)}</div>
      </article>
    </div>
  );
};

export const News: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <NewsDetail id={id} /> : <NewsList />;
};
