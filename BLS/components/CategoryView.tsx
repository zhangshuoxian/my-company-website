import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section, SectionTitle } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { CategoryItem } from '../types';
import { ArrowLeft } from 'lucide-react';

interface CategoryViewProps {
  type: 'industry' | 'product';
}

const findCategory = (id: string, items: CategoryItem[]): CategoryItem | undefined => {
  const item = items.find(i => i.id === id);
  if (item) return item;
  return undefined; 
};

const CategoryView: React.FC<CategoryViewProps> = ({ type }) => {
  const { content } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  const allItems = type === 'industry' ? content.industries : content.products;
  const pageTitle = type === 'industry' ? content.labels.industries : content.labels.products;

  // 1. Root View: No ID provided -> Show top-level categories
  if (!id) {
    const rootItems = allItems.filter(item => !item.parentId);
    return (
      <Section>
        <SectionTitle title={pageTitle} subtitle="Explore our solutions" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rootItems.map(item => (
            <Link key={item.id} to={`/${type === 'industry' ? 'industry' : 'products'}/${item.id}`} className="group block shadow-md hover:shadow-xl rounded-lg overflow-hidden bg-white transition-all">
              <div className="h-64 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-6 border-l-4 border-transparent group-hover:border-brand-green transition-colors">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    );
  }

  // 2. Detail/Sub-category View
  const currentItem = findCategory(id, allItems);
  
  if (!currentItem) {
    return <Section><div className="text-center text-xl">Category not found</div></Section>;
  }

  // Find children (Simulated for now, as we flattened lists, but logic remains valid for future deep nesting)
  const children = allItems.filter(item => item.parentId === id);
  const isLeaf = currentItem.isLeaf || children.length === 0;

  return (
    <div className="min-h-screen">
      {/* Header for Category */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <Link to={`/${type === 'industry' ? 'industry' : 'products'}${currentItem.parentId ? '/' + currentItem.parentId : ''}`} className="inline-flex items-center text-gray-500 hover:text-brand-blue mb-4">
            <ArrowLeft size={16} className="mr-1" /> {content.labels.back}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">{currentItem.title}</h1>
          <p className="text-xl text-gray-600 mt-2">{currentItem.description}</p>
        </div>
      </div>

      <Section>
        {isLeaf ? (
          // --- DETAIL TEMPLATE (Leaf Node) ---
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={currentItem.image} alt={currentItem.title} className="w-full h-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-6">{content.labels.details}</h2>
              <div className="prose prose-lg text-gray-700">
                <p>Detailed information about <strong>{currentItem.title}</strong>.</p>
                <p>Replace this content with specific specifications, advantages, and application scenarios.</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Feature 1: High durability</li>
                  <li>Feature 2: Precision engineering</li>
                  <li>Feature 3: Custom sizing available</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // --- SUB-CATEGORY TEMPLATE ---
          <div>
            <SectionTitle title={`${currentItem.title} - ${content.labels.related}`} align="left" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {children.map(child => (
                <Link key={child.id} to={`/${type === 'industry' ? 'industry' : 'products'}/${child.id}`} className="group block bg-white border border-gray-200 rounded-lg hover:border-brand-green transition-colors overflow-hidden">
                   <div className="h-48 overflow-hidden">
                      <img src={child.image} alt={child.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   </div>
                   <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800">{child.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{child.description}</p>
                   </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};

export default CategoryView;
