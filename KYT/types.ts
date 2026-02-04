export type Language = 'zh' | 'en';

export interface ContentItem {
  zh: string;
  en: string;
}

export interface NavLink {
  key: string;
  title: ContentItem;
  path: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: ContentItem;
  desc: ContentItem;
}

export interface ProductFeature {
  id: string;
  title: ContentItem;
  content: ContentItem;
}

// --- 新增：通用自定义表格数据结构 ---
export interface TableColumn {
  id: string;
  label: ContentItem; // 列头名 (双语)
}
export interface TableRow {
  id: string;
  cells: ContentItem[]; // 每一行的数据 (双语数组，顺序对应 columns)
}
export interface CustomTableData {
  columns: TableColumn[];
  rows: TableRow[];
}
// -----------------------------------

// 旧的质量标准接口 (保留以兼容旧数据)
export interface ProductStandard {
  name: ContentItem;
  value: string;
}

// --- 修改：深度详情板块 (支持图文 或 表格) ---
export interface ProductDetailBlock {
  id: string;
  type?: 'text_image' | 'table'; // 新增：类型选择
  
  // 类型A: 图文模式数据
  title?: ContentItem;
  content?: ContentItem;
  image?: string;
  
  // 类型B: 表格模式数据
  tableData?: CustomTableData;
}

// 1. 新增：产品系列类型
export interface ProductSeries {
  id: string;
  name: { zh: string; en: string };
}

// --- 修改：更新后的产品接口 ---
export interface Product {
  id: string;
  name: ContentItem;
  // ✨✨✨ 新增：存放这个产品属于哪些系列的 ID (数组，因为可以属于多个)
  seriesIds?: string[];
  image: string;
  images: string[];
  desc: ContentItem;
  features: ProductFeature[];
  
  // 质量标准部分
  standardsType?: 'simple' | 'custom_table' | 'image'; // 模式: 简单两列 | 自定义多列 | 图片
  standards?: ProductStandard[];       // 旧: 简单两列数据
  standardsTable?: CustomTableData;    // 新: 自定义多列表格数据
  standardsImage?: string;             // 新: 图片数据
  standardsDesc?: ContentItem;
  
  // 深度详情
  detailBlocks?: ProductDetailBlock[];
}

export interface NewsItem {
  id: string;
  title: ContentItem;
  date: string;
  image: string;
  summary: ContentItem;
  content: ContentItem;
}

export interface HistoryEvent {
  id: string;
  year: string;
  content: ContentItem;
}

export interface Honor {
  id: string;
  name: ContentItem;
  image: string;
}

export interface UserMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  content: string;
  ip: string;
  date: string;
}

export interface SiteData {
  companyName: ContentItem;
  logo: string;
  copyright: ContentItem;

  // ✨✨✨ 新增 1: 浏览器标题后缀 (例如: "广东康以泰...")
  siteTitleSuffix: { zh: string; en: string };

  // ✨✨✨ 新增 2: 默认语言设置 ('zh' 或 'en')
  defaultLang: 'zh' | 'en';
  
  // ✨✨✨ 新增：关于我们页面的顶部轮播图 ✨✨✨
  aboutSlides: { id: string; image: string }[];
  followUs: {
    qrCode: string;
    text: ContentItem;
  };
  // ✨ 新增：公司简称 (专门给手机看)
  companyNameShort?: { zh: string; en: string };
  
  // ✨✨✨ 新增：加载页面的欢迎语
  loadingText: { zh: string; en: string };
  
  heroSlides: HeroSlide[];
  labSection: {
    title: ContentItem;
    desc: ContentItem;
    image: string;
    stats: { value: string; label: ContentItem }[];
  };
  whyChooseUs: {
    title: ContentItem;
    centerImage: string;
    points: { title: ContentItem; desc: ContentItem }[];
  };
  aboutTabs: {
    image: string;
    tabs: { title: ContentItem; content: ContentItem }[];
  };
  history: {
    bgImage: string;
    title: ContentItem;
    events: HistoryEvent[];
  };
  honors: Honor[];
  // ✨✨✨ 新增：全站的系列列表
  productSeries: ProductSeries[];
  products: Product[];
  news: NewsItem[];
  contact: {
    address: ContentItem;
    phone: ContentItem;
    email: ContentItem;
    fax: ContentItem;
    mapUrl: string;
  };
}
