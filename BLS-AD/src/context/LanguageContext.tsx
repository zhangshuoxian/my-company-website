

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DICTIONARY, generateNavItems, DATA_TRANSLATIONS } from '../constants';
import { SiteContent, IndustryDetailData, CategoryItem, TechSpec, HeroSlide, CompanyStat, NewsItem, HistoryEvent, CertificateItem, DownloadItem, AboutPageData, ContactInfo, Branch, CustomerFeedback, PatternSpec, SocialItem, CustomPageData } from '../types';

type Language = 'CN' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  adminLanguage: Language; // New Admin UI Language
  setAdminLanguage: (lang: Language) => void;
  content: SiteContent;
  
  // Translation Helper
  tData: (text: string) => string;

  // -- Actions --
  updateLogo: (url: string) => void;
  updateFooterRights: (text: string) => void;
  
  updateIndustry: (id: string, updates: Partial<CategoryItem>, detailUpdates?: Partial<IndustryDetailData>) => void;
  addIndustry: (item: CategoryItem, detail: IndustryDetailData) => void; // New
  deleteIndustry: (id: string) => void; // New
  
  updateIntro: (id: string, updates: Partial<CategoryItem>) => void; // New Intro Update
  updateProduct: (id: string, updates: Partial<CategoryItem>) => void;
  updateCustomPage: (id: string, data: CustomPageData) => void;

  addProduct: (item: CategoryItem) => void;
  deleteProduct: (id: string) => void;
  updateTechSpec: (id: string, spec: TechSpec) => void;
  addTechSpec: (spec: TechSpec) => void;
  deleteTechSpec: (id: string) => void;
  addTechCategory: (name: string) => void; // New action for dynamic categories
  
  // Patterns
  updatePattern: (code: string, pattern: PatternSpec) => void;
  addPattern: (pattern: PatternSpec) => void;
  deletePattern: (code: string) => void;

  updateHeroSlide: (index: number, slide: HeroSlide) => void;
  updateCompanyStat: (index: number, stat: CompanyStat) => void;
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, item: NewsItem) => void;
  deleteNews: (id: string) => void;
  updateAboutPage: (id: string, data: AboutPageData) => void;
  updateHistory: (event: HistoryEvent) => void;
  addHistory: (event: HistoryEvent) => void;
  deleteHistory: (id: string) => void;
  updateCertificate: (item: CertificateItem) => void;
  addCertificate: (item: CertificateItem) => void;
  deleteCertificate: (id: string) => void;
  updateDownload: (item: DownloadItem) => void;
  addDownload: (item: DownloadItem) => void;
  deleteDownload: (id: string) => void;
  addAboutSection: (item: CategoryItem) => void;
  
  // Contact & Feedback & Socials Actions
  updateMainContact: (data: ContactInfo) => void;
  addBranch: (branch: Branch) => void;
  updateBranch: (id: string, branch: Branch) => void;
  deleteBranch: (id: string) => void;
  
  // Feedback (with rate limit/dedupe check result)
  submitFeedback: (data: CustomerFeedback) => { success: boolean; message: string }; 
  deleteFeedback: (id: string) => void;

  // Socials
  updateSocial: (id: string, item: SocialItem) => void;
  addSocial: (item: SocialItem) => void;
  deleteSocial: (id: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('CN');
  const [adminLanguage, setAdminLanguage] = useState<Language>('CN');

  const [contentCN, setContentCN] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('siteContentCN');
    return saved ? JSON.parse(saved) : DICTIONARY.CN;
  });

  const [contentEN, setContentEN] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('siteContentEN');
    return saved ? JSON.parse(saved) : DICTIONARY.EN;
  });

  useEffect(() => { localStorage.setItem('siteContentCN', JSON.stringify(contentCN)); }, [contentCN]);
  useEffect(() => { localStorage.setItem('siteContentEN', JSON.stringify(contentEN)); }, [contentEN]);

  const updateContent = (fn: (prev: SiteContent) => SiteContent, shouldUpdateNav: boolean = false) => {
    const updateFn = (prev: SiteContent) => {
        const newState = fn(prev);
        if (shouldUpdateNav) {
            newState.navItems = generateNavItems(newState.industries, newState.products, newState.about.sections, language);
        }
        return newState;
    };
    if (language === 'CN') setContentCN(updateFn);
    else setContentEN(updateFn);
  };

  // Helper for translating data strings (from CN source to EN)
  const tData = (text: string): string => {
      if (language === 'CN') return text;
      // Split compound strings like "光滑/织物"
      if (text.includes('/')) {
          return text.split('/').map(part => DATA_TRANSLATIONS[part.trim()] || part.trim()).join('/');
      }
      return DATA_TRANSLATIONS[text] || text;
  };

  // --- Implementations ---

  const updateLogo = (url: string) => {
      updateContent(prev => ({ ...prev, logo: url }));
  };

  const updateFooterRights = (text: string) => {
      updateContent(prev => ({ ...prev, footerRights: text }));
  };

  const updateIndustry = (id: string, updates: Partial<CategoryItem>, detailUpdates?: Partial<IndustryDetailData>) => {
    updateContent(prev => ({
      ...prev,
      industries: prev.industries.map(ind => ind.id === id ? { ...ind, ...updates } : ind),
      industryDetails: detailUpdates ? { ...prev.industryDetails, [id]: { ...prev.industryDetails[id], ...detailUpdates } } : prev.industryDetails
    }), true);
  };

  const addIndustry = (item: CategoryItem, detail: IndustryDetailData) => {
    updateContent(prev => ({
      ...prev,
      industries: [...prev.industries, item],
      industryDetails: { ...prev.industryDetails, [item.id]: detail }
    }), true);
  };

  const deleteIndustry = (id: string) => {
    updateContent(prev => {
        const newDetails = { ...prev.industryDetails };
        delete newDetails[id];
        return {
            ...prev,
            industries: prev.industries.filter(ind => ind.id !== id),
            industryDetails: newDetails
        };
    }, true);
  };

  const updateIntro = (id: string, updates: Partial<CategoryItem>) => {
    updateContent(prev => ({
      ...prev,
      intros: prev.intros.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const updateProduct = (id: string, updates: Partial<CategoryItem>) => {
    updateContent(prev => ({ ...prev, products: prev.products.map(prod => prod.id === id ? { ...prod, ...updates } : prod) }), true);
  };

  const updateCustomPage = (id: string, data: CustomPageData) => {
    updateContent(prev => ({
      ...prev,
      customPages: {
        ...prev.customPages,
        [id]: data
      }
    }));
  };

  const addProduct = (item: CategoryItem) => {
    updateContent(prev => ({ ...prev, products: [...prev.products, item] }), true);
  };
  const deleteProduct = (id: string) => {
    updateContent(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }), true);
  };

  const updateTechSpec = (id: string, spec: TechSpec) => { updateContent(prev => ({ ...prev, techSpecs: prev.techSpecs.map(t => t.id === id ? spec : t) })); };
  const addTechSpec = (spec: TechSpec) => { updateContent(prev => ({ ...prev, techSpecs: [...prev.techSpecs, spec] })); };
  const deleteTechSpec = (id: string) => { updateContent(prev => ({ ...prev, techSpecs: prev.techSpecs.filter(t => t.id !== id) })); };
  
  const addTechCategory = (name: string) => {
      updateContent(prev => {
          if (prev.techCategories.includes(name)) return prev;
          // Generate a default/random item for this new category
          const defaultSpec: TechSpec = {
              id: `${Date.now()}_default`,
              model: `${name}-001`,
              materialType: name,
              ply: '2',
              color: 'Green',
              colorHex: '#009944',
              pattern: 'Matte',
              totalThickness: '2.0',
              coatingThickness: '0.5',
              weight: '2.5',
              force1pct: '10',
              minPulley: '50',
              workingTemp: '-10/80',
              conveying: { plate: true, roller: true, trough: false },
              features: {},
              ruleData: {}
          };
          return {
              ...prev,
              techCategories: [...prev.techCategories, name],
              techSpecs: [...prev.techSpecs, defaultSpec]
          };
      });
  };

  // Pattern Actions
  const updatePattern = (code: string, pattern: PatternSpec) => { 
    updateContent(prev => ({ ...prev, patterns: prev.patterns.map(p => p.code === code ? pattern : p) })); 
  };
  const addPattern = (pattern: PatternSpec) => { 
    updateContent(prev => ({ ...prev, patterns: [...prev.patterns, pattern] })); 
  };
  const deletePattern = (code: string) => { 
    updateContent(prev => ({ ...prev, patterns: prev.patterns.filter(p => p.code !== code) })); 
  };

  const updateHeroSlide = (index: number, slide: HeroSlide) => {
    updateContent(prev => { const n = [...prev.heroSlides]; n[index] = slide; return { ...prev, heroSlides: n }; });
  };
  const updateCompanyStat = (index: number, stat: CompanyStat) => {
    updateContent(prev => { const n = [...prev.stats]; n[index] = stat; return { ...prev, stats: n }; });
  };

  const addNews = (item: NewsItem) => { updateContent(prev => ({ ...prev, news: [item, ...prev.news] })); };
  const updateNews = (id: string, item: NewsItem) => { updateContent(prev => ({ ...prev, news: prev.news.map(n => n.id === id ? item : n) })); };
  const deleteNews = (id: string) => { updateContent(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) })); };

  const updateAboutPage = (id: string, data: AboutPageData) => { updateContent(prev => ({ ...prev, about: { ...prev.about, pages: { ...prev.about.pages, [id]: data } } })); };
  const updateHistory = (event: HistoryEvent) => { updateContent(prev => ({ ...prev, about: { ...prev.about, history: prev.about.history.map(h => h.id === event.id ? event : h) } })); };
  const addHistory = (event: HistoryEvent) => { updateContent(prev => ({ ...prev, about: { ...prev.about, history: [event, ...prev.about.history] } })); };
  const deleteHistory = (id: string) => { updateContent(prev => ({ ...prev, about: { ...prev.about, history: prev.about.history.filter(h => h.id !== id) } })); };
  const updateCertificate = (item: CertificateItem) => { updateContent(prev => ({ ...prev, about: { ...prev.about, certificates: prev.about.certificates.map(c => c.id === item.id ? item : c) } })); };
  const addCertificate = (item: CertificateItem) => { updateContent(prev => ({ ...prev, about: { ...prev.about, certificates: [...prev.about.certificates, item] } })); };
  const deleteCertificate = (id: string) => { updateContent(prev => ({ ...prev, about: { ...prev.about, certificates: prev.about.certificates.filter(c => c.id !== id) } })); };
  const updateDownload = (item: DownloadItem) => { updateContent(prev => ({ ...prev, about: { ...prev.about, downloads: prev.about.downloads.map(d => d.id === item.id ? item : d) } })); };
  const addDownload = (item: DownloadItem) => { updateContent(prev => ({ ...prev, about: { ...prev.about, downloads: [...prev.about.downloads, item] } })); };
  const deleteDownload = (id: string) => { updateContent(prev => ({ ...prev, about: { ...prev.about, downloads: prev.about.downloads.filter(d => d.id !== id) } })); };
  const addAboutSection = (item: CategoryItem) => { updateContent(prev => ({ ...prev, about: { ...prev.about, sections: [...prev.about.sections, item] } }), true); };

  // --- Contact & Feedback Logic ---

  const updateMainContact = (data: ContactInfo) => {
      updateContent(prev => ({ ...prev, contact: data }));
  };

  const addBranch = (branch: Branch) => {
      updateContent(prev => ({ ...prev, branches: [...prev.branches, branch] }));
  };
  const updateBranch = (id: string, branch: Branch) => {
      updateContent(prev => ({ ...prev, branches: prev.branches.map(b => b.id === id ? branch : b) }));
  };
  const deleteBranch = (id: string) => {
      updateContent(prev => ({ ...prev, branches: prev.branches.filter(b => b.id !== id) }));
  };

  const submitFeedback = (data: CustomerFeedback): { success: boolean; message: string } => {
      const today = new Date().toISOString().split('T')[0];
      const key = `feedback_count_${today}`;
      const count = parseInt(localStorage.getItem(key) || '0');
      
      if (count >= 5) {
          return { success: false, message: 'Too frequent submissions. Please try again tomorrow.' };
      }

      const activeContent = language === 'CN' ? contentCN : contentEN;
      const cleanList = activeContent.feedback.filter(f => f.email !== data.email && f.phone !== data.phone);
      
      const newFeedback = [data, ...cleanList];

      updateContent(prev => ({ ...prev, feedback: newFeedback }));
      localStorage.setItem(key, (count + 1).toString());

      return { success: true, message: 'Success' };
  };

  const deleteFeedback = (id: string) => {
      updateContent(prev => ({ ...prev, feedback: prev.feedback.filter(f => f.id !== id) }));
  };

  // Socials
  const updateSocial = (id: string, item: SocialItem) => { updateContent(prev => ({ ...prev, socials: prev.socials.map(s => s.id === id ? item : s) })); };
  const addSocial = (item: SocialItem) => { updateContent(prev => ({ ...prev, socials: [...prev.socials, item] })); };
  const deleteSocial = (id: string) => { updateContent(prev => ({ ...prev, socials: prev.socials.filter(s => s.id !== id) })); };

  const activeContent = language === 'CN' ? contentCN : contentEN;

  return (
    <LanguageContext.Provider value={{ 
      language, setLanguage, 
      adminLanguage, setAdminLanguage,
      content: activeContent,
      tData, // Export translation helper
      updateLogo, updateFooterRights,
      updateIndustry, addIndustry, deleteIndustry, updateIntro, updateProduct, updateCustomPage, addProduct, deleteProduct,
      updateTechSpec, addTechSpec, deleteTechSpec, addTechCategory,
      updatePattern, addPattern, deletePattern,
      updateHeroSlide, updateCompanyStat,
      addNews, updateNews, deleteNews,
      updateAboutPage, updateHistory, addHistory, deleteHistory,
      updateCertificate, addCertificate, deleteCertificate,
      updateDownload, addDownload, deleteDownload, addAboutSection,
      // Contact
      updateMainContact, addBranch, updateBranch, deleteBranch,
      submitFeedback, deleteFeedback,
      // Socials
      updateSocial, addSocial, deleteSocial
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
