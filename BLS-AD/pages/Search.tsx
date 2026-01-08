
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';

const Search = () => {
  const { content } = useLanguage();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const lowerQuery = query.toLowerCase();

  // Search logic on current language content
  // Added: Search in TechSpecs (Models) and Patterns
  const matchedTechSpecs = content.techSpecs.filter(spec => spec.model.toLowerCase().includes(lowerQuery));
  const matchedPatterns = content.patterns.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.code.toLowerCase().includes(lowerQuery));

  // Regular items
  const matchedItems = [...content.products, ...content.industries].filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );

  return (
    <Section>
      <SectionTitle title={content.labels.searchPlaceholder} subtitle={`"${query}"`} />
      
      {matchedItems.length === 0 && matchedTechSpecs.length === 0 && matchedPatterns.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">{content.labels.noResults}</p>
          <Link to="/products" className="text-brand-blue mt-4 inline-block hover:underline">{content.labels.viewAll}</Link>
        </div>
      ) : (
        <div className="space-y-12">
            
            {/* Standard Results */}
            {matchedItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matchedItems.map(item => (
                    <Link 
                    key={item.id} 
                    to={`/${item.type === 'industry' ? 'industry' : 'products'}/${item.id}`}
                    className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow border hover:border-brand-green transition-colors"
                    >
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    <div>
                        <span className="text-xs font-bold text-brand-green uppercase">{item.type}</span>
                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                    </div>
                    </Link>
                ))}
                </div>
            )}

            {/* Model Results */}
            {matchedTechSpecs.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Matching Models</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {matchedTechSpecs.map(spec => (
                            <Link key={spec.id} to="/technical-data" className="block bg-blue-50 p-4 rounded text-center hover:bg-blue-100 transition-colors">
                                <div className="font-bold text-brand-blue">{spec.model}</div>
                                <div className="text-xs text-gray-500">{spec.materialType} | {spec.totalThickness}mm</div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Pattern Results */}
            {matchedPatterns.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Matching Patterns</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {matchedPatterns.map(p => (
                            <Link key={p.code} to="/products/patterns-fabrics" className="block bg-green-50 p-4 rounded hover:bg-green-100 transition-colors flex items-center gap-3">
                                {p.image && <img src={p.image} className="w-10 h-10 object-cover rounded" />}
                                <div>
                                    <div className="font-bold text-gray-800">{p.name}</div>
                                    <div className="text-xs text-gray-500">{p.code}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </Section>
  );
};

export default Search;
