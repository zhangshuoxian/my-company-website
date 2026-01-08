

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface CompanyStat {
  label: string;
  value: string;
  icon?: string;
  image?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  parentId?: string;
  type: 'industry' | 'product' | 'about' | 'intro';
  isLeaf?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}

// Updated Contact Info
export interface ContactInfo {
  companyName: string;
  image: string;
  address: string;
  zip: string;
  factoryAddress: string;
  factoryZip: string;
  phone: string;
  fax: string;
  email: string;
}

export interface Branch {
  id: string;
  name: string;
  image: string;
  address: string;
  zip?: string; 
  phone: string;
  fax: string;
  email: string;
}

export interface CustomerFeedback {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  message: string;
  date: string;
  ip?: string; 
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface TechSpec {
  id: string;
  model: string;         
  materialType: string; // Changed from fixed union to string for dynamic categories
  ply: string;           
  color: string;         
  colorHex: string;      
  pattern: string;       
  totalThickness: string; 
  coatingThickness: string; 
  weight: string;        
  force1pct: string;     
  minPulley: string;     
  workingTemp: string;   
  conveying: {
    plate: boolean;    
    roller: boolean;   
    trough: boolean;   
  };
  features: {
    lateralStability?: boolean; // Renamed display to Anti-sideslip
    antistatic?: boolean;       
    foodGrade?: boolean; // Represents FDA 
    oilResistant?: boolean;     
    flameRetardant?: boolean;   
    lowNoise?: boolean;         
    antibacterial?: boolean;
    // New Fields
    turning?: boolean;
    antiStick?: boolean;
    lowTemp?: boolean;
  };
  // New Detailed Fields for Rules Filter
  ruleData?: {
    coverMaterial?: string; // P, U, E...
    fabricType?: string; // 0-9, M
    colorCode?: string; // 0-9
    topSurface?: string; // Pattern ID/Name
    bottomSurface?: string; // Pattern ID/Name
    coverAttr?: string; // 1-9, 0
    otherCoverAttr?: string[]; // B, H, Y...
    otherFabricAttr?: string[]; // A, D, 1...
    ply?: string; // Added missing field
  }
}

export interface PatternSpec {
  name: string;        
  code: string;        
  thickness: string;   
  width: string;       
  features: string;    
  application: string; 
  image?: string;      
}

export interface IndustryDetailData {
  id: string;
  description: string; 
  productModels: string[];
  commonPatterns?: string[]; // Added field
}

export interface HistoryEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  category: string; 
  image: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  category: string;
}

export interface AboutPageData {
  id: string;
  content: string; 
  images: string[];
}

export interface SocialItem {
  id: string;
  image: string;
  text: string;
}

// Custom Page Types (PU Timing, V-Belts)
export interface CustomTable {
  title: string;
  image: string;
  cols: string[];
  rows: string[][];
  pretensionValue?: string; // Optional for merged cell
}

export interface CustomPageData {
  id: string;
  introText: string;
  toleranceText?: string;
  tables: CustomTable[];
}

// New Interface for full site content
export interface SiteContent {
  logo: string;
  footerRights: string;
  navItems: NavItem[];
  heroSlides: HeroSlide[]; 
  stats: CompanyStat[];
  industries: CategoryItem[];
  intros: CategoryItem[]; 
  industryDetails: Record<string, IndustryDetailData>; 
  products: CategoryItem[];
  customPages: Record<string, CustomPageData>; // For static-like pages
  about: {
    sections: CategoryItem[]; 
    pages: Record<string, AboutPageData>; 
    history: HistoryEvent[];
    certificates: CertificateItem[];
    downloads: DownloadItem[];
  };
  news: NewsItem[];
  contact: ContactInfo; 
  branches: Branch[]; 
  feedback: CustomerFeedback[];
  socials: SocialItem[]; 
  techSpecs: TechSpec[];
  techCategories: string[]; // New: Dynamic Categories for Tech Specs
  patterns: PatternSpec[]; 
  labels: {
    home: string;
    about: string;
    contact: string;
    news: string;
    products: string;
    industries: string;
    intro: string; 
    searchPlaceholder: string;
    readMore: string;
    footerQuickLinks: string;
    footerIndustries: string;
    footerFollow: string;
    footerSubscribe: string;
    footerRights: string;
    viewAll: string;
    back: string;
    details: string;
    related: string;
    noResults: string;
    privacy: string;
    terms: string;
    // Form Labels
    formFirstName: string;
    formLastName: string;
    formPhone: string;
    formCompany: string;
    formEmail: string;
    formCountry: string;
    formMessage: string;
    formCaptcha: string;
    formSubmit: string;
    formSuccess: string;
    formFrequent: string; 
    
    heroCTA: string;
    techParams: string;
    rowsPerPage: string;
    page: string;
    of: string;
    thModel: string;
    thPly: string;
    thColor: string;
    thPattern: string;
    thThickness: string;
    thWeight: string;
    thForce: string;
    thMinPulley: string;
    thTemp: string;
    thConveying: string;
    thFeatures: string;
    tabAll: string;
    tabPVC: string;
    tabPU: string;
    tabPE: string;
    tabTPEE: string;
    tabSilicon: string;
    ruleTitle: string;
    ruleSubtitle: string;
    ruleThickness: string;
    rulePly: string;
    ruleColor: string;
    ruleMaterial: string;
    rulePattern: string;
    ruleSearchBtn: string;
    ruleResetBtn: string;
    patternTitle: string;
    patternName: string;
    patternCode: string;
    patternThickness: string;
    patternWidth: string;
    patternFeatures: string;
    patternApp: string;
    
    // Contact Page
    contactAddress: string;
    contactZip: string;
    contactFactory: string;
    contactFactoryZip: string;
    contactPhone: string;
    contactFax: string;
    contactEmail: string;
    contactBranchBtn: string;

    // Rules Labels (Added missing props)
    ruleCover: string;
    ruleFabricType: string;
    ruleTopSurface: string;
    ruleBottomSurface: string;
    ruleCoverAttr: string;
    ruleOtherCover: string;
    ruleOtherFabric: string;
  };
}
