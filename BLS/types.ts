
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
  materialType: string;
  color: string;
  pattern: string;
  colorHex?: string;
  totalThickness: string;
  coatingThickness?: string;
  ply: string;
  weight: string;
  force1pct: string;
  minPulley: string;
  workingTemp: string;
  
  // 新增：输送方式
  conveying?: {
    plate?: boolean;
    roller?: boolean;
    trough?: boolean;
  };
  
  // 新增：详细特性
  features?: {
    lateralStable?: boolean;
    nonStickCover?: boolean;
    foodGrade?: boolean;
    oilRes?: boolean;
    lowNoise?: boolean;
    flameRetardant?: boolean;
    conductivity?: boolean;
    curve?: boolean;
    fragile?: boolean;
    nonAdhesive?: boolean;
    antiMicrobial?: boolean;
  };

  ruleData?: any; // 其他规则数据
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
  // 👇👇👇【请插入以下新增代码】👇👇👇
  footerSlogan: string; // 页脚 Slogan
  pageSubtitles: {      // 各个板块的副标题
    industry: string;
    product: string;
    tech: string;
    news: string;
    about: string;
  };
  // 👆👆👆【插入结束】👆👆👆
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
  /* Fix: 增加 techCategories 属性 */
  techCategories: string[];
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

// ... (保留上面的代码)

// 3. 补充 Content 接口
export interface Content {
  // ... 你原有的 labels, nav, home 等字段 ...

  // 👇 修改建议：将 any 替换为 TechSpec
  techSpecs: TechSpec[]; 
  
  // 👇 修复错误：将 PatternItem 修改为 PatternSpec
  patterns: PatternSpec[]; 

  // 👇 新增：自定义页面数据 (PU Timing Belts 等页面用)
  customPages: Record<string, CustomPageData>;
}

// --- 用户权限系统 ---

export type UserRole = 'super_admin' | 'sub_admin';
export type UserStatus = 'pending' | 'active' | 'locked';

export interface LoginLog {
  date: string;
  ip: string; // 模拟IP
  success: boolean;
}

export interface UserAccount {
  id: string;
  email: string; // 作为账号
  passwordHash: string; // 存储加密后的密码，不是明文
  role: UserRole;
  status: UserStatus;
  failedAttempts: number; // 输错次数，到5次锁定
  logs: LoginLog[]; // 登录日志
  applyDate: string; // 申请时间
}

