
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateNavItems, DATA_TRANSLATIONS } from '../constants';
import { SiteContent, IndustryDetailData, CategoryItem, TechSpec, HeroSlide, CompanyStat, NewsItem, HistoryEvent, CertificateItem, DownloadItem, AboutPageData, ContactInfo, Branch, CustomerFeedback, PatternSpec, SocialItem, CustomPageData } from '../types';
import { DatabaseService } from '../services/db';

type Language = 'CN' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  adminLanguage: Language;
  setAdminLanguage: (lang: Language) => void;
  content: SiteContent | null;
  isLoading: boolean;
  tData: (text: string) => string;

  // -- 后台管理方法 --
  updateLogo: (data: string) => Promise<void>;
  updateFooterRights: (text: string) => void;
  updateHeroSlide: (index: number, slide: HeroSlide) => Promise<void>;
  updateCompanyStat: (index: number, stat: CompanyStat) => Promise<void>;
  updateIndustry: (id: string, updates: Partial<CategoryItem>, detailUpdates?: Partial<IndustryDetailData>) => Promise<void>;
  addIndustry: (item: CategoryItem, detail: IndustryDetailData) => void;
  deleteIndustry: (id: string) => void;
  updateProduct: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  addProduct: (item: CategoryItem) => void;
  deleteProduct: (id: string) => void;
  updateTechSpec: (id: string, spec: TechSpec) => void;
  addTechSpec: (spec: TechSpec) => void;
  deleteTechSpec: (id: string) => void;
  addTechCategory: (name: string) => void;
  updatePattern: (code: string, pattern: PatternSpec) => Promise<void>;
  addPattern: (pattern: PatternSpec) => void;
  deletePattern: (code: string) => void;
  updateIntro: (id: string, updates: Partial<CategoryItem>) => void;
  updateAboutPage: (id: string, data: AboutPageData) => void;
  addHistory: (event: HistoryEvent) => void;
  updateHistory: (event: HistoryEvent) => void;
  deleteHistory: (id: string) => void;
  addCertificate: (item: CertificateItem) => Promise<void>;
  updateCertificate: (item: CertificateItem) => void;
  deleteCertificate: (id: string) => void;
  addDownload: (item: DownloadItem) => void;
  updateDownload: (item: DownloadItem) => void;
  deleteDownload: (id: string) => void;
  updateCustomPage: (id: string, data: CustomPageData) => void;
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, item: NewsItem) => void;
  deleteNews: (id: string) => void;
  updateMainContact: (data: ContactInfo) => void;
  addBranch: (branch: Branch) => void;
  updateBranch: (id: string, branch: Branch) => void;
  deleteBranch: (id: string) => void;
  addSocial: (item: SocialItem) => void;
  updateSocial: (id: string, item: SocialItem) => void;
  deleteSocial: (id: string) => void;
  submitFeedback: (data: CustomerFeedback) => { success: boolean; message: string };
  deleteFeedback: (id: string) => void;
  resolveAsset: (id: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('CN');
  const [adminLanguage, setAdminLanguage] = useState<Language>('CN');
  const [contentCN, setContentCN] = useState<SiteContent | null>(null);
  const [contentEN, setContentEN] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    DatabaseService.seedInitialData().then(({ CN, EN }) => {
      setContentCN(CN);
      setContentEN(EN);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => { if (contentCN) DatabaseService.saveContent('CN', contentCN); }, [contentCN]);
  useEffect(() => { if (contentEN) DatabaseService.saveContent('EN', contentEN); }, [contentEN]);

  const resolveAsset = async (id: string) => await DatabaseService.getAssetURL(id) || id;

  const updateContent = (fn: (prev: SiteContent) => SiteContent, shouldUpdateNav: boolean = false) => {
    const updater = (prev: SiteContent | null) => {
      if (!prev) return null;
      const next = fn(prev);
      if (shouldUpdateNav) next.navItems = generateNavItems(next.industries, next.products, next.about.sections, language);
      return next;
    };
    if (language === 'CN') setContentCN(updater as any); else setContentEN(updater as any);
  };

  const tData = (text: string) => {
    if (language === 'CN') return text;
    if (text.includes('/')) return text.split('/').map(p => DATA_TRANSLATIONS[p.trim()] || p.trim()).join('/');
    return DATA_TRANSLATIONS[text] || text;
  };

  const updateLogo = async (data: string) => {
    const assetId = data.startsWith('data:') ? `logo_${Date.now()}` : data;
    if (data.startsWith('data:')) await DatabaseService.saveAsset(assetId, data);
    updateContent(prev => ({ ...prev, logo: assetId }));
  };

  const updateHeroSlide = async (idx: number, slide: HeroSlide) => {
    let imgId = slide.image;
    if (imgId.startsWith('data:')) { imgId = `hero_${idx}_${Date.now()}`; await DatabaseService.saveAsset(imgId, slide.image); }
    updateContent(prev => { const n = [...prev.heroSlides]; n[idx] = { ...slide, image: imgId }; return { ...prev, heroSlides: n }; });
  };

  const updateIndustry = async (id: string, up: any, det: any) => {
    if (up.image?.startsWith('data:')) { const imgId = `ind_${id}_${Date.now()}`; await DatabaseService.saveAsset(imgId, up.image); up.image = imgId; }
    updateContent(prev => ({
      ...prev,
      industries: prev.industries.map(i => i.id === id ? { ...i, ...up } : i),
      industryDetails: det ? { ...prev.industryDetails, [id]: { ...prev.industryDetails[id], ...det } } : prev.industryDetails
    }), true);
  };

  const updateProduct = async (id: string, up: any) => {
    if (up.image?.startsWith('data:')) { const imgId = `prod_${id}_${Date.now()}`; await DatabaseService.saveAsset(imgId, up.image); up.image = imgId; }
    updateContent(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? { ...p, ...up } : p) }), true);
  };

  const updatePattern = async (code: string, pat: PatternSpec) => {
    if (pat.image?.startsWith('data:')) { const imgId = `pat_${Date.now()}`; await DatabaseService.saveAsset(imgId, pat.image); pat.image = imgId; }
    updateContent(prev => ({ ...prev, patterns: prev.patterns.map(p => p.code === code ? pat : p) }));
  };

  const addCertificate = async (item: CertificateItem) => {
    if (item.image?.startsWith('data:')) { const imgId = `cert_${Date.now()}`; await DatabaseService.saveAsset(imgId, item.image); item.image = imgId; }
    updateContent(prev => ({ ...prev, about: { ...prev.about, certificates: [item, ...prev.about.certificates] } })); // 添加到顶部
  };

  const updateFooterRights = (text: string) => updateContent(prev => ({ ...prev, footerRights: text }));
  const updateCompanyStat = async (idx: number, stat: any) => {
      if (stat.image?.startsWith('data:')) { const imgId = `stat_${idx}_${Date.now()}`; await DatabaseService.saveAsset(imgId, stat.image); stat.image = imgId; }
      updateContent(prev => { const n = [...prev.stats]; n[idx] = stat; return { ...prev, stats: n }; });
  };
  const addIndustry = (item: any, det: any) => updateContent(prev => ({ ...prev, industries: [item, ...prev.industries], industryDetails: { ...prev.industryDetails, [item.id]: det } }), true);
  const deleteIndustry = (id: string) => updateContent(prev => { const n = { ...prev.industryDetails }; delete n[id]; return { ...prev, industries: prev.industries.filter(i => i.id !== id), industryDetails: n }; }, true);
  const addProduct = (item: any) => updateContent(prev => ({ ...prev, products: [item, ...prev.products] }), true);
  const deleteProduct = (id: string) => updateContent(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }), true);
  const updateTechSpec = (id: string, spec: any) => updateContent(prev => ({ ...prev, techSpecs: prev.techSpecs.map(s => s.id === id ? spec : s) }));
  const addTechSpec = (spec: any) => updateContent(prev => ({ ...prev, techSpecs: [spec, ...prev.techSpecs] }));
  const deleteTechSpec = (id: string) => updateContent(prev => ({ ...prev, techSpecs: prev.techSpecs.filter(s => s.id !== id) }));
  const addTechCategory = (name: string) => updateContent(prev => ({ ...prev, techCategories: [...new Set([...prev.techCategories, name])] }));
  const addPattern = (pat: any) => updateContent(prev => ({ ...prev, patterns: [pat, ...prev.patterns] }));
  const deletePattern = (code: string) => updateContent(prev => ({ ...prev, patterns: prev.patterns.filter(p => p.code !== code) }));
  const updateIntro = (id: string, up: any) => updateContent(prev => ({ ...prev, intros: prev.intros.map(i => i.id === id ? { ...i, ...up } : i) }));
  const updateAboutPage = (id: string, data: any) => updateContent(prev => ({ ...prev, about: { ...prev.about, pages: { ...prev.about.pages, [id]: data } } }));
  const addHistory = (ev: any) => updateContent(prev => ({ ...prev, about: { ...prev.about, history: [ev, ...prev.about.history] } }));
  const updateHistory = (ev: any) => updateContent(prev => ({ ...prev, about: { ...prev.about, history: prev.about.history.map(h => h.id === ev.id ? ev : h) } }));
  const deleteHistory = (id: string) => updateContent(prev => ({ ...prev, about: { ...prev.about, history: prev.about.history.filter(h => h.id !== id) } }));
  const updateCertificate = (item: any) => updateContent(prev => ({ ...prev, about: { ...prev.about, certificates: prev.about.certificates.map(c => c.id === item.id ? item : c) } }));
  const deleteCertificate = (id: string) => updateContent(prev => ({ ...prev, about: { ...prev.about, certificates: prev.about.certificates.filter(c => c.id !== id) } }));
  const addDownload = (item: any) => updateContent(prev => ({ ...prev, about: { ...prev.about, downloads: [item, ...prev.about.downloads] } })); // 添加到顶部
  const updateDownload = (item: any) => updateContent(prev => ({ ...prev, about: { ...prev.about, downloads: prev.about.downloads.map(d => d.id === item.id ? item : d) } }));
  const deleteDownload = (id: string) => updateContent(prev => ({ ...prev, about: { ...prev.about, downloads: prev.about.downloads.filter(d => d.id !== id) } }));
  const updateCustomPage = (id: string, data: any) => updateContent(prev => ({ ...prev, customPages: { ...prev.customPages, [id]: data } }));
  const addNews = (item: any) => updateContent(prev => ({ ...prev, news: [item, ...prev.news] }));
  const updateNews = (id: string, item: any) => updateContent(prev => ({ ...prev, news: prev.news.map(n => n.id === id ? item : n) }));
  const deleteNews = (id: string) => updateContent(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }));
  const updateMainContact = (data: any) => updateContent(prev => ({ ...prev, contact: data }));
  const addBranch = (b: any) => updateContent(prev => ({ ...prev, branches: [b, ...prev.branches] }));
  const updateBranch = (id: string, b: any) => updateContent(prev => ({ ...prev, branches: prev.branches.map(x => x.id === id ? b : x) }));
  const deleteBranch = (id: string) => updateContent(prev => ({ ...prev, branches: prev.branches.filter(x => x.id !== id) }));
  const addSocial = (s: any) => updateContent(prev => ({ ...prev, socials: [...prev.socials, s] }));
  const updateSocial = (id: string, s: any) => updateContent(prev => ({ ...prev, socials: prev.socials.map(x => x.id === id ? s : x) }));
  const deleteSocial = (id: string) => updateContent(prev => ({ ...prev, socials: prev.socials.filter(x => x.id !== id) }));
  const deleteFeedback = (id: string) => updateContent(prev => ({ ...prev, feedback: prev.feedback.filter(f => f.id !== id) }));
  const submitFeedback = (data: CustomerFeedback) => {
    updateContent(prev => ({ ...prev, feedback: [data, ...prev.feedback] }));
    return { success: true, message: 'Success' };
  };

  const activeContent = language === 'CN' ? contentCN : contentEN;

  return (
    <LanguageContext.Provider value={{
      language, setLanguage, adminLanguage, setAdminLanguage, content: activeContent, isLoading, tData, resolveAsset,
      updateLogo, updateFooterRights, updateHeroSlide, updateCompanyStat, updateIndustry, addIndustry, deleteIndustry,
      updateProduct, addProduct, deleteProduct, updateTechSpec, addTechSpec, deleteTechSpec, addTechCategory,
      updatePattern, addPattern, deletePattern, updateIntro, updateAboutPage, addHistory, updateHistory, deleteHistory,
      updateCertificate, addCertificate, deleteCertificate, addDownload, updateDownload, deleteDownload,
      updateCustomPage, addNews, updateNews, deleteNews, updateMainContact, addBranch, updateBranch, deleteBranch, addSocial, updateSocial, deleteSocial, submitFeedback, deleteFeedback
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
