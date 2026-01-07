
import { SiteContent, CategoryItem, NewsItem, ContactInfo, CompanyStat, HeroSlide, NavItem, IndustryDetailData, HistoryEvent, CertificateItem, DownloadItem, AboutPageData, Branch, SocialItem, CustomPageData } from './types';
import { TECH_SPECS } from './data/techSpecs';
import { PRODUCTS_CN, PRODUCTS_EN, INDUSTRIES_CN, INDUSTRIES_EN, PATTERNS_DATA, CODE_RULES } from './data/products';
import { INDUSTRY_DETAILS } from './data/industryData';

export { TECH_SPECS, PRODUCTS_CN, PRODUCTS_EN, INDUSTRIES_CN, INDUSTRIES_EN, PATTERNS_DATA, CODE_RULES };

// --- DATA TRANSLATIONS ---
export const DATA_TRANSLATIONS: Record<string, string> = {
    // Ply
    '一层': '1 Ply',
    '两层': '2 Ply',
    '三层': '3 Ply',
    '四层': '4 Ply',
    
    // Colors
    '绿色': 'Green',
    '白色': 'White',
    '黑色': 'Black',
    '蓝色': 'Blue',
    '灰色': 'Grey',
    '墨绿色': 'Dark Green',
    '红色': 'Red',
    '透明': 'Transparent',
    '米黄色': 'Beige',
    '橙色': 'Orange',
    '棕色': 'Brown',

    // Patterns / Features / Applications
    '哑光': 'Matte',
    '光滑': 'Glossy',
    '钻石': 'Diamond',
    '织物': 'Fabric',
    '粗布纹': 'Rough Fabric',
    '高摩擦 (草型)': 'High Grip (Grass)',
    '小圆点': 'Small Dot',
    '粗质地': 'Rough Texture',
    '锯齿': 'Sawtooth',
    '高尔夫': 'Golf',
    '西格林高尔夫': 'Siegling Golf',
    '细圆台': 'Fine Cone',
    '波浪形高摩擦': 'Wavy High Grip',
    '大人字形': 'Big Herringbone',
    '小月牙形': 'Small Crescent',
    '中摩擦': 'Medium Friction',
    '菱形格': 'Diamond Grid',
    '鱼骨纹': 'Fishbone',
    '横鱼骨纹': 'Lateral Fishbone',
    '浅钻石': 'Shallow Diamond',
    '细直条': 'Fine Stripe',
    '草皮纹': 'Grass',
    '大方格': 'Large Square',
    '凸齿': 'Convex Tooth',
    '格子': 'Grid',
    '网眼': 'Mesh',
    '细布纹': 'Fine Fabric',
    '人字形': 'Herringbone',
    '横圆台': 'Lateral Cone',
    '小菱形格': 'Small Diamond Grid',
    '粗砂型': 'Rough Sand',
    '横条': 'Lateral Stripe',
    '粗哑光': 'Rough Matte',
    '双向凸齿': 'Bi-direct. Tooth',
    '小颗粒': 'Small Granule',
    '小圆锥': 'Small Cone',
    '小圆台': 'Small Cone (Flat)',
    '三角形': 'Triangle',
    '小浅钻石': 'Small Shallow Diamond',
    '凸状菱形格': 'Convex Diamond',
    '细哑光': 'Fine Matte',
    '菱形格 (12mm)': 'Diamond Grid (12mm)',
    '小米粒': 'Rice Grain',
    '高摩擦布纹': 'High Grip Fabric',
    '横台': 'Lateral Flat',
    '中摩擦布纹': 'Med Grip Fabric',
    '小三棱': 'Small Tri-Prism',
    '方格草带': 'Square Grass',
    '细钻石': 'Fine Diamond',
    '颗粒纹': 'Granule',
    '小网眼': 'Small Mesh',
    '小网眼 (浅)': 'Small Mesh (Shallow)',
    '小网眼 (深)': 'Small Mesh (Deep)',
    '波浪高摩擦颗粒': 'Wavy High Grip Granule',
    '浅高尔夫': 'Shallow Golf',
    '小锯齿': 'Small Sawtooth',
    '乱纹': 'Random Pattern',
    '小鱼骨纹': 'Small Fishbone',
    '横条纹': 'Lateral Stripe',
    '大圆台': 'Large Cone',
    '长圆台': 'Long Cone',
    '三角纹': 'Triangle Pattern',
    '人字纹跑步机布': 'Herringbone Treadmill Cloth',
    '光': 'Glossy', 
    '小高尔夫': 'Small Golf',
    
    // Complex Combinations
    '光滑/光': 'Glossy/Glossy',
    '光滑/织物': 'Glossy/Fabric',
    '哑光/织物': 'Matte/Fabric',
    '钻石/织物': 'Diamond/Fabric',
    '光滑/钻石': 'Glossy/Diamond',
    '光滑/光滑': 'Glossy/Glossy',
    '织物/织物': 'Fabric/Fabric',
    '织物/光滑': 'Fabric/Glossy',
    '小圆点/织物': 'Small Dot/Fabric',
    '网眼/织物': 'Mesh/Fabric',
    '格子/织物': 'Grid/Fabric',
    '细直条/织物': 'Fine Stripe/Fabric',
    '高摩擦(草型)/织物': 'High Grip (Grass)/Fabric',
    '哑光/钻石': 'Matte/Diamond',
    '光滑/哑光': 'Glossy/Matte',
    '高尔夫/高尔夫': 'Golf/Golf',
    '高尔夫/织物': 'Golf/Fabric',
    '粗砂型/织物': 'Rough Sand/Fabric',
    '小高尔夫/小高尔夫': 'Small Golf/Small Golf',
    '光滑/小高尔夫': 'Glossy/Small Golf',
    '菱形格(12mm)/织物': 'Diamond Grid(12mm)/Fabric',
    '小月牙形/织物': 'Small Crescent/Fabric',
    '锯齿形/织物': 'Sawtooth/Fabric',
    '鱼条纹/织物': 'Fish Stripe/Fabric',
    '人字形/织物': 'Herringbone/Fabric',
    '凸齿/织物': 'Convex Tooth/Fabric',
    '双向凸齿/织物': 'Bi-direct. Tooth/Fabric',

    // Features
    '表面不粘': 'Non-stick surface',
    '通用': 'General purpose',
    '高摩擦': 'High friction',
    '倾斜输送': 'Inclined conveying',
    '高摩擦，倾斜输送': 'High grip, Inclined',
    '低摩擦': 'Low friction',
    '易清洁，倾斜输送': 'Easy clean, Inclined',
    '中摩擦，倾斜输送': 'Medium friction, Inclined',
    '纵横向摩擦': 'Long./Lat. friction',
    '同步输送': 'Synchronous conveying',
    '中摩擦，表面不粘': 'Medium friction, Non-stick',
    '抗静电，低噪音': 'Antistatic, Low noise',
    '抗静电': 'Antistatic',
    '表面平滑': 'Smooth surface',

    // Applications
    '物流，食品加工': 'Logistics, Food',
    '物流，航空': 'Logistics, Airport',
    '大理石加工': 'Marble processing',
    '物流，跑步机': 'Logistics, Treadmill',
    '海鲜加工，家禽肉': 'Seafood, Poultry',
    '烟草': 'Tobacco',
    '农业': 'Agriculture',
    '木材加工': 'Wood processing',
    '海鲜加工，木材': 'Seafood, Wood',
    '鱼加工，玻璃': 'Fish, Glass',
    '跑步机': 'Treadmill',
    '机场': 'Airport',
    '纺织，物流，航空': 'Textile, Logistics',
    '巧克力，面包': 'Chocolate, Bakery',
    '巧克力': 'Chocolate',
    '洗衣，面包': 'Laundry, Bakery',
    '食品，烟草': 'Food, Tobacco',
    '海鲜加工，食品': 'Seafood, Food',
    '食品': 'Food',
    '食品加工': 'Food Processing',
    '玻璃': 'Glass'
};

// --- CODE DEFINITIONS FOR RULES ---
export const CODE_DEFINITIONS = {
    coverMaterial: [
        { code: 'P', cn: '聚氨乙烯 PVC', en: 'PVC' },
        { code: 'U', cn: '聚氨酯 PU', en: 'PU' },
        { code: 'E', cn: '聚乙烯 PE', en: 'PE' },
        { code: 'T', cn: '热塑性聚酯弹性体 TPEE', en: 'TPEE' },
        { code: 'S', cn: '硅胶 Silicon', en: 'Silicon' }
    ],
    fabricType: [
        { code: '0', cn: '聚酯纺丝，重型结构', en: 'Polyester spun, heavy construction' },
        { code: '1', cn: '聚酯，柔性', en: 'Polyester, flexible' },
        { code: '2', cn: '聚酯，横向稳定', en: 'Polyester, lateral stability' },
        { code: '3', cn: '聚酯/棉', en: 'Polyester/Cotton' },
        { code: '4', cn: '聚酯纺丝', en: 'Polyester spun' },
        { code: '5', cn: '聚酯，横向稳定，轻型结构', en: 'Polyester, lateral stability, light' },
        { code: '7', cn: '棉', en: 'Cotton' },
        { code: '8', cn: '聚酯，横向稳定，重型结构', en: 'Polyester, lateral stability, heavy' },
        { code: '9', cn: '聚酯，柔性，重型结构', en: 'Polyester, flexible, heavy' },
        { code: 'M', cn: '聚酯毡', en: 'Polyester felt' },
    ],
    color: [
        { code: '0', cn: '透明', en: 'Transparent' },
        { code: '1', cn: '绿色', en: 'Green' },
        { code: '2', cn: '白色', en: 'White' },
        { code: '3', cn: '黑色', en: 'Black' },
        { code: '4', cn: '灰色', en: 'Grey' },
        { code: '5', cn: '红色', en: 'Red' },
        { code: '6', cn: '棕色', en: 'Beige/Brown' }, 
        { code: '7', cn: '墨绿色', en: 'Dark Green/Petrol' },
        { code: '8', cn: '蓝色', en: 'Blue' },
        { code: '9', cn: '橙色', en: 'Orange' },
    ],
    coverAttr: [
        { code: '1', cn: '*/钻石花纹', en: '*/Diamond' },
        { code: '2', cn: '**/钻石花纹', en: '**/Diamond' },
        { code: '3', cn: '***/钻石花纹', en: '***/Diamond' },
        { code: '4', cn: '*/织物', en: '*/Fabric' },
        { code: '5', cn: '**/织物', en: '**/Fabric' },
        { code: '6', cn: '***/织物', en: '***/Fabric' },
        { code: '7', cn: '织物/织物', en: 'Fabric/Fabric' },
        { code: '8', cn: '**/*', en: '**/*' },
        { code: '9', cn: '***/*', en: '***/*' },
        { code: '0', cn: '*/*', en: '*/*' },
    ],
    otherCoverAttr: [
        { code: 'B', cn: '覆盖层厚度小于0.5毫米', en: 'Thinner cover (<0.5mm)' },
        { code: 'H', cn: '覆盖厚度大于1.0毫米', en: 'Thicker cover (>1.0mm)' },
        { code: 'Y', cn: '覆盖物硬度>shoreA80', en: 'Hardened cover (>shoreA80)' },
        { code: 'R', cn: '预盖物硬度<shoreA60', en: 'Softened cover (<shoreA60)' },
        { code: 'N', cn: '附油和附骝肪', en: 'Oil and fat resistant' },
        { code: 'X', cn: '橡胶', en: 'Rubber' },
        { code: 'Z', cn: '阻燃PVC盖板', en: 'Flame retardant PVC' },
        { code: '21', cn: '防静电盖板', en: 'Antistatic cover' },
        { code: 'FDA', cn: '食品级', en: 'FDA Food grade' },
        { code: 'NS', cn: '不粘', en: 'Non-sticky' },
        { code: 'AM', cn: '抗菌', en: 'Anti-microbial' },
        { code: 'W', cn: '耐高温', en: 'High temp env.' },
        { code: 'L', cn: '耐寒性', en: 'Cold resistant' },
        { code: 'ET', cn: '醚类TPU', en: 'Ether TPU' },
        { code: 'HC', cn: '高导电性', en: 'High conductivity' },
    ],
    otherFabricAttr: [
        { code: 'A', cn: '带导电丝', en: 'Antistatic fabric' },
        { code: 'D', cn: '低噪音', en: 'Low noise fabric' },
        { code: '1', cn: '浸渍织物', en: 'Impregnated fabric' }, 
        { code: 'I', cn: '浸渍织物', en: 'Impregnated fabric' }, 
        { code: 'G', cn: '横向硬度加强型织物', en: 'Extra latitudinal rigid' },
        { code: 'S', cn: '刮涂PVC胶的织物', en: 'Coated PVC fabric' }, 
        { code: 'FL', cn: '无毛边织物', en: 'Frayless fabric' },
        { code: 'K', cn: '凯夫拉织物', en: 'Kevlar fabric' },
        { code: 'DS', cn: '低收缩', en: 'Low shrinkage' },
        { code: 'WAX', cn: '浸蜡', en: 'Wax impregnation' },
    ]
};

export const COMPANY_NAME = "Guangdong Boshun Belting Co., Ltd.";
export const COMPANY_NAME_CN = "广东博顺带业有限公司";

export const COMPANY_LOGO_URL = "/assets/logo.png"; 

export const IMAGES = {
  logo: COMPANY_LOGO_URL,
  slide1: "/assets/home/slide1.jpg", 
  slide2: "/assets/home/slide2.jpg", 
  slide3: "/assets/home/slide3.jpg", 
  slide4: "/assets/home/slide4.jpg",
  productionLine: "/assets/home/production-line.jpg",
  loom: "/assets/home/loom.jpg",
  patent: "/assets/home/patent.jpg", 
  capacity: "/assets/home/assemble.jpg",
  area: "/assets/home/surface-area.jpg",
  building: "/assets/home/surface-area.jpg",
  cat1: "/assets/logistics.jpg",
  cat2: "/assets/agriculture.jpg",
  cat3: "/assets/home/slide3.jpg", 
  cat4: "/assets/home/loom.jpg",
  patternPlaceholder: "/assets/home/slide1.jpg",
  certPlaceholder: "/assets/home/patent.jpg",
  qrPlaceholder: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" 
};


// --- HERO SLIDES ---
const HERO_SLIDES_CN: HeroSlide[] = [
  { image: IMAGES.slide1, title: '自动化的革新者·博力顺轻型输送带', subtitle: 'Leading the future of automation' },
  { image: IMAGES.slide2, title: '十六条输送带生产线', subtitle: 'Advanced manufacturing capability' },
  { image: IMAGES.slide3, title: '十四条输送带生产线', subtitle: 'High precision production' },
  { image: IMAGES.slide4, title: '四十七条PU同步带生产线', subtitle: 'Specialized timing belt solutions' },
];

const HERO_SLIDES_EN: HeroSlide[] = [
  { image: IMAGES.slide1, title: 'Innovator of Automation · Boshun Light Conveyor Belt', subtitle: 'Leading the future of automation' },
  { image: IMAGES.slide2, title: '16 Conveyor Belt Production Lines', subtitle: 'Advanced manufacturing capability' },
  { image: IMAGES.slide3, title: '14 Conveyor Belt Production Lines', subtitle: 'High precision production' },
  { image: IMAGES.slide4, title: '47 PU Timing Belt Production Lines', subtitle: 'Specialized timing belt solutions' },
];


const NEWS_CN: NewsItem[] = [
  { id: '1', title: '博顺带业参加2024年上海PTC展会', date: '2024-11-05', summary: '展示最新研发的节能型输送带产品，获得广泛关注。', content: '详细内容...', image: IMAGES.slide1 },
  { id: '2', title: '新工厂二期工程正式投产', date: '2024-08-15', summary: '产能提升50%，进一步缩短交货周期。', content: '详细内容...', image: IMAGES.building },
  { id: '3', title: '通过ISO9001质量体系复审', date: '2024-05-20', summary: '持续致力于提供高质量的产品和服务。', content: '详细内容...', image: IMAGES.slide3 },
  { id: '4', title: '2024年员工技能大赛圆满落幕', date: '2024-04-10', summary: '提升员工专业技能，弘扬工匠精神。', content: '详细内容...', image: IMAGES.productionLine },
  { id: '5', title: '博顺带业荣获“高新技术企业”称号', date: '2024-01-15', summary: '这是对我们技术创新能力的肯定。', content: '详细内容...', image: IMAGES.patent },
  { id: '6', title: '关于春节放假的通知', date: '2024-01-01', summary: '祝全体员工和客户新春快乐。', content: '详细内容...', image: IMAGES.logo },
];

const NEWS_EN: NewsItem[] = [
  { id: '1', title: 'Boshun Attends PTC Shanghai 2024', date: '2024-11-05', summary: 'Showcasing the latest energy-saving conveyor belts.', content: '...', image: IMAGES.slide1 },
  { id: '2', title: 'Phase II Factory Officially Operational', date: '2024-08-15', summary: 'Capacity increased by 50%, shortening delivery times.', content: '...', image: IMAGES.building },
  { id: '3', title: 'ISO9001 Quality System Renewal', date: '2024-05-20', summary: 'Committed to high quality products and services.', content: '...', image: IMAGES.slide3 },
  { id: '4', title: '2024 Employee Skills Competition', date: '2024-04-10', summary: 'Improving professional skills and craftsmanship.', content: '...', image: IMAGES.productionLine },
  { id: '5', title: 'Boshun Awarded "High-Tech Enterprise"', date: '2024-01-15', summary: 'Affirmation of our innovation capabilities.', content: '...', image: IMAGES.patent },
  { id: '6', title: 'Spring Festival Holiday Notice', date: '2024-01-01', summary: 'Happy Chinese New Year to all.', content: '...', image: IMAGES.logo },
];

const STATS_CN: CompanyStat[] = [
  { label: '成立时间', value: '2000' },
  { label: '生产线', value: '30+' },
  { label: '年产能 (万平米)', value: '500+' },
  { label: '出口国家', value: '50+' },
  { label: '员工人数', value: '200+' }
];

const STATS_EN: CompanyStat[] = [
  { label: 'Founded', value: '2000' },
  { label: 'Production Lines', value: '30+' },
  { label: 'Capacity (10k sqm)', value: '500+' },
  { label: 'Export Countries', value: '50+' },
  { label: 'Employees', value: '200+' }
];

// Updated Contact Data
const CONTACT_CN: ContactInfo = { 
  companyName: COMPANY_NAME_CN,
  image: IMAGES.building,
  address: '广东省佛山市三水区白坭镇工业大道88号', 
  zip: '528100',
  factoryAddress: '广东省佛山市三水区白坭镇科技工业园',
  factoryZip: '528100',
  phone: '+86 757 1234 5678', 
  fax: '+86 757 1234 5679',
  email: 'sales@boshun.com'
};

const CONTACT_EN: ContactInfo = { 
  companyName: COMPANY_NAME,
  image: IMAGES.building,
  address: 'No. 88, Industrial Avenue, Baini Town, Sanshui District, Foshan, Guangdong', 
  zip: '528100',
  factoryAddress: 'Technology Industrial Park, Baini Town, Sanshui District, Foshan',
  factoryZip: '528100',
  phone: '+86 757 1234 5678', 
  fax: '+86 757 1234 5679',
  email: 'sales@boshun.com'
};

// 5 Dummy Branches
const BRANCHES_CN: Branch[] = [
  { id: 'b1', name: '上海分公司', image: IMAGES.cat1, address: '上海市松江区新桥镇', zip: '201612', phone: '021-12345678', fax: '021-12345679', email: 'shanghai@boshun.com' },
  { id: 'b2', name: '苏州分公司', image: IMAGES.cat2, address: '苏州市工业园区星湖街', zip: '215000', phone: '0512-12345678', fax: '0512-12345679', email: 'suzhou@boshun.com' },
  { id: 'b3', name: '青岛分公司', image: IMAGES.cat3, address: '青岛市城阳区长城路', zip: '266000', phone: '0532-12345678', fax: '0532-12345679', email: 'qingdao@boshun.com' },
  { id: 'b4', name: '天津分公司', image: IMAGES.cat4, address: '天津市武清区京津公路', zip: '301700', phone: '022-12345678', fax: '022-12345679', email: 'tianjin@boshun.com' },
  { id: 'b5', name: '福建分公司', image: IMAGES.building, address: '福建省晋江市陈埭镇', zip: '362200', phone: '0595-12345678', fax: '0595-12345679', email: 'fujian@boshun.com' },
];

const BRANCHES_EN: Branch[] = [
  { id: 'b1', name: 'Shanghai Branch', image: IMAGES.cat1, address: 'Xinqiao Town, Songjiang District, Shanghai', zip: '201612', phone: '021-12345678', fax: '021-12345679', email: 'shanghai@boshun.com' },
  { id: 'b2', name: 'Suzhou Branch', image: IMAGES.cat2, address: 'Xinghu Street, SIP, Suzhou', zip: '215000', phone: '0512-12345678', fax: '0512-12345679', email: 'suzhou@boshun.com' },
  { id: 'b3', name: 'Qingdao Branch', image: IMAGES.cat3, address: 'Changcheng Road, Chengyang, Qingdao', zip: '266000', phone: '0532-12345678', fax: '0532-12345679', email: 'qingdao@boshun.com' },
  { id: 'b4', name: 'Tianjin Branch', image: IMAGES.cat4, address: 'Jingjin Road, Wuqing, Tianjin', zip: '301700', phone: '022-12345678', fax: '022-12345679', email: 'tianjin@boshun.com' },
  { id: 'b5', name: 'Fujian Branch', image: IMAGES.building, address: 'Chendai Town, Jinjiang, Fujian', zip: '362200', phone: '0595-12345678', fax: '0595-12345679', email: 'fujian@boshun.com' },
];

const ABOUT_SECTIONS_CN: CategoryItem[] = [
  { id: 'profile', title: '公司简介', description: '了解博顺带业', image: IMAGES.building, type: 'about' },
  { id: 'history', title: '公司历程', description: '发展足迹', image: IMAGES.slide1, type: 'about' },
  { id: 'culture', title: '公司文化', description: '核心价值观', image: IMAGES.logo, type: 'about' },
  { id: 'strategy', title: '绿色发展战略', description: '可持续未来', image: IMAGES.slide2, type: 'about' },
  { id: 'ip', title: '知识产权', description: '专利与证书', image: IMAGES.patent, type: 'about' },
  { id: 'downloads', title: '下载', description: '产品手册', image: IMAGES.cat4, type: 'about' },
];

const ABOUT_SECTIONS_EN: CategoryItem[] = [
  { id: 'profile', title: 'Company Profile', description: 'About Boshun', image: IMAGES.building, type: 'about' },
  { id: 'history', title: 'History', description: 'Our Journey', image: IMAGES.slide1, type: 'about' },
  { id: 'culture', title: 'Culture', description: 'Core Values', image: IMAGES.logo, type: 'about' },
  { id: 'strategy', title: 'Green Strategy', description: 'Sustainable Future', image: IMAGES.slide2, type: 'about' },
  { id: 'ip', title: 'Intellectual Property', description: 'Patents & Certs', image: IMAGES.patent, type: 'about' },
  { id: 'downloads', title: 'Downloads', description: 'Catalogs', image: IMAGES.cat4, type: 'about' },
];

// Replaced INTROS with copies of ABOUT items as requested
const INTROS_CN: CategoryItem[] = ABOUT_SECTIONS_CN.map(item => ({ ...item, type: 'intro' }));
const INTROS_EN: CategoryItem[] = ABOUT_SECTIONS_EN.map(item => ({ ...item, type: 'intro' }));

const ABOUT_PAGES_CN: Record<string, AboutPageData> = {
  'profile': { 
    id: 'profile', 
    content: '广东博顺带业有限公司是PVC/PU等输送带产品专业生产加工的公司，拥有完整、科学的质量管理体系。多年的经营，公司的诚信、实力和产品质量已获得业界的认可。', 
    images: [IMAGES.building] 
  },
  'culture': { 
    id: 'culture', 
    content: `企业愿景：成为全球最具有竞争力的轻型输送带企业。
    
企业使命：带动行业的创新、发展，为客户创造最大价值，与员工共同发展。

核心价值：为顾客、员工和商业伙伴创造前所未有的价值和机会。

经营理念：诚信、创新、服务、共赢。

用人理念：以人为本，以德为重，德才兼备。

工作作风：精益求精，勇于创新，敢于挑战。

营销口号：自动化的革新者，博力顺轻型输送带。`, 
    images: [IMAGES.slide3] 
  },
  'strategy': { 
    id: 'strategy', 
    content: `绿色发展是以效率、和谐、持续为目标的经济增长和社会发展方式。博顺带业作为输送带行业的先驱，坚持可持续发展的原则，率先完成绿色环境管理系统，能够有效切实地平衡人与自然，生产与环境之间的协调，走出一条无污染绿色发展之路。

为了保护环境，我们不断分析和改善我们的生产，实现更大的能源节约，减少废物排放。通过我们先进的制造工艺，让每一个博顺带业生产的单位消除有害物质。

在我们企业成长的过程中，我们不断意识到我们的社会和生态环境责任。遵循可持续性原则是我们的坚定立场，节约能源，延长产品使用寿命，减少维护，创造一个友好的环境。

愿大家通过与博顺带业的商业合作，与博顺带业联盟，一起为绿色发展做出巨大贡献。`, 
    images: [IMAGES.slide2] 
  },
};

const ABOUT_PAGES_EN: Record<string, AboutPageData> = {
  'profile': { 
    id: 'profile', 
    content: 'Guangdong Boshun Belting Co., Ltd. is a professional manufacturer of PVC/PU conveyor belt products, possessing a complete and scientific quality management system. Over years of operation, the company\'s integrity, strength, and product quality have been recognized by the industry.', 
    images: [IMAGES.building] 
  },
  'culture': { 
    id: 'culture', 
    content: `Vision: To become the most competitive light conveyor belt enterprise globally.

Mission: To drive industry innovation and development, create maximum value for customers, and develop together with employees.

Core Values: Create unprecedented value and opportunities for customers, employees, and business partners.

Business Philosophy: Integrity, Innovation, Service, Win-Win.

HR Philosophy: People-oriented, Virtue-first, Capability and Integrity.

Work Style: Strive for excellence, Brave in innovation, Dare to challenge.

Slogan: Innovator of Automation, Boshun Light Conveyor Belt.`, 
    images: [IMAGES.slide3] 
  },
  'strategy': { 
    id: 'strategy', 
    content: `Green development is an economic growth and social development mode aiming for efficiency, harmony, and sustainability. As a pioneer in the conveyor belt industry, Boshun adheres to the principles of sustainable development and has taken the lead in completing a green environmental management system. We effectively balance the coordination between humans and nature, production and the environment, forging a path of pollution-free green development.

To protect the environment, we constantly analyze and improve our production to achieve greater energy savings and reduce waste emissions. Through our advanced manufacturing processes, we eliminate harmful substances from every unit produced by Boshun.

Throughout our growth, we remain constantly aware of our social and ecological responsibilities. Adhering to sustainability principles is our firm stance: saving energy, extending product life, reducing maintenance, and creating a friendly environment.

We invite everyone to join the Boshun alliance through business cooperation and contribute significantly to green development together.`, 
    images: [IMAGES.slide2] 
  },
};

const HISTORY_DATA: HistoryEvent[] = [
  { id: '1', year: '2016-10', title: 'ISO 9001 认证', description: '广东博顺带业有限公司通过ISO 9001质量管理体系认证', image: IMAGES.patent },
  { id: '2', year: '2016-06', title: '国际市场拓展', description: '开通阿里巴巴国际站', image: IMAGES.cat1 },
  { id: '3', year: '2012-11', title: '博顺成立', description: '广东博顺带业有限公司成立', image: IMAGES.logo },
  { id: '4', year: '2009-10', title: '普斯力成立', description: '佛山普斯力工业皮带有限公司成立', image: IMAGES.building },
  { id: '5', year: '2005-11', title: '顶顺成立', description: '广州顶顺机电设备有限公司成立', image: IMAGES.slide1 },
];

const CERTIFICATES: CertificateItem[] = [
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `cert_ex_${i}`, 
    title: `Example Certificate ${i+1}`, 
    category: i % 2 === 0 ? 'Certificate' : 'Patent', 
    image: IMAGES.patent
  }))
];

const DOWNLOADS: DownloadItem[] = [
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `dl_ex_${i}`,
    title: `Example Download File ${i+1}`,
    fileName: `file_${i+1}.pdf`,
    fileUrl: '#',
    category: i < 5 ? 'Technical' : 'Catalog'
  }))
];

const SOCIALS: SocialItem[] = [
  { id: 's1', image: IMAGES.qrPlaceholder, text: 'WeChat Official' },
  { id: 's2', image: IMAGES.qrPlaceholder, text: 'Sales Support' },
  { id: 's3', image: IMAGES.qrPlaceholder, text: 'Technical Service' },
];

const buildNavTree = (items: CategoryItem[], parentId?: string, prefix: string = '/products'): NavItem[] => {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => {
      const children = buildNavTree(items, item.id, prefix);
      let path = `${prefix}/${item.id}`;
      if (item.id === 'model-rules') path = `/products/model-rules`;
      if (item.id === 'patterns-fabrics') path = `/products/patterns-fabrics`;
      if (item.id === 'pu-timing-belts') path = `/products/pu-timing-belts`;
      if (item.id === 'round-v-belts') path = `/products/round-v-belts`;

      return {
        label: item.title,
        path: path,
        children: children.length > 0 ? children : undefined
      };
    });
};

export const generateNavItems = (industries: CategoryItem[], products: CategoryItem[], aboutSections: CategoryItem[], lang: 'CN' | 'EN'): NavItem[] => {
  const labels = lang === 'CN' ? LABELS_CN : LABELS_EN;
  return [
    { label: labels.home, path: '/' },
    { 
      label: labels.industries, 
      path: '/industry',
      children: industries.map(i => ({ label: i.title, path: `/industry/${i.id}` })) 
    },
    { 
      label: labels.products, 
      path: '/products',
      children: buildNavTree(products, undefined, '/products')
    },
    { label: labels.techParams, path: '/technical-data' },
    { label: labels.news, path: '/news' },
    // New Company Intro Section with Sub-Items
    { 
        label: labels.intro, 
        path: '/intro',
        children: aboutSections.map(s => ({ label: s.title, path: `/intro/${s.id}` })) 
    },
    { label: labels.contact, path: '/contact' },
  ];
};

// --- Custom Pages Data ---
const PU_TIMING_TABLES = [
    { title: 'HTD Series', image: IMAGES.cat3, cols: ['Type', 'P (mm)', 'H (mm)', 'Ht (mm)'], rows: [['HTD5M', '5.0', '3.7', '2.2'], ['HTD8M', '8.0', '5.6', '3.6']] },
    { title: 'Imperial Series', image: IMAGES.cat3, cols: ['Type', 'P (mm)', 'H (mm)', 'Ht (mm)'], rows: [['H', '12.7', '4.3', '2.29']] }
];

const CUSTOM_PAGES_CN: Record<string, CustomPageData> = {
    'pu-timing-belts': {
        id: 'pu-timing-belts',
        introText: "PU 同步带采用热塑性聚氨酯制造，具有优异的耐磨性和耐刮擦性，钢丝绳芯在高牵引载荷下提供良好的运行特性。",
        tables: PU_TIMING_TABLES
    },
    'round-v-belts': {
        id: 'round-v-belts',
        introText: "聚氨酯皮带有绿色粗糙面、红色光滑面和增强型三种规格。直径范围从2毫米到22毫米。可提供定制服务。",
        toleranceText: "圆带的公差\n直径 < 15mm: ±0.3毫米",
        tables: [
            { title: '圆皮带: 光滑/粗糙', image: IMAGES.cat2, cols: ['类型', 'D (毫米)', '预张力 (%)'], rows: [['ψ2S', '2', '400']], pretensionValue: '1.5 ~ 3' }
        ]
    }
};

const CUSTOM_PAGES_EN: Record<string, CustomPageData> = {
    'pu-timing-belts': {
        id: 'pu-timing-belts',
        introText: "PU timing belts are manufactured from thermoplastic polyurethane, featuring excellent wear and scratch resistance.",
        tables: PU_TIMING_TABLES
    },
    'round-v-belts': {
        id: 'round-v-belts',
        introText: "Polyurethane belts are available in green rough, red smooth and reinforced versions.",
        toleranceText: "Tolerances of round belts\ndiameter < 15mm: ±0.3mm",
        tables: [
            { title: 'Round belt: smooth / rough', image: IMAGES.cat2, cols: ['Type', 'D (mm)', 'Pretension (%)'], rows: [['ψ2S', '2', '400']], pretensionValue: '1.5 ~ 3' }
        ]
    }
};

// --- LABELS ---
const LABELS_CN = {
  home: '首页', about: '关于我们', contact: '联系我们', news: '新闻动态', products: '产品中心', industries: '行业应用', intro: '公司介绍',
  searchPlaceholder: '搜索产品...', readMore: '阅读更多', footerQuickLinks: '快速链接', footerIndustries: '热门行业',
  footerFollow: '关注我们', footerSubscribe: '联系订阅', footerRights: '保留所有权利。', viewAll: '查看全部',
  back: '返回', details: '详细信息', related: '相关产品', noResults: '未找到相关结果', privacy: '隐私政策', terms: '服务条款',
  
  formFirstName: '您的名字', formLastName: '您的姓氏', formPhone: '电话号码', formCompany: '公司', 
  formEmail: '邮箱', formCountry: '国家地区', formMessage: '留言', formCaptcha: '验证码',
  formSubmit: '发送信息', formSuccess: '发送成功！我们会尽快联系您。', formFrequent: '提交过于频繁，请稍后再试。',
  
  heroCTA: '探索产品', techParams: '技术参数', rowsPerPage: '每页行数:', page: '页', of: '共',
  thModel: '型号', thPly: '层数', thColor: '颜色', thPattern: '花纹', thThickness: '总厚度', thWeight: '重量',
  thForce: '1%延伸受力', thMinPulley: '最小轮径', thTemp: '温度范围', thConveying: '输送方式', thFeatures: '特性',
  tabAll: '全部', tabPVC: 'PVC', tabPU: 'PU', tabPE: 'PE', tabTPEE: 'TPEE', tabSilicon: '硅胶',
  ruleTitle: '型号规则查询', ruleSubtitle: '根据参数筛选合适的产品型号', ruleThickness: '厚度 (mm)', rulePly: '层数',
  ruleColor: '颜色', ruleMaterial: '涂层材料', rulePattern: '花纹', ruleSearchBtn: '搜索', ruleResetBtn: '重置',
  patternTitle: '花纹与面料', patternName: '名称', patternCode: '代号', patternThickness: '厚度', patternWidth: '宽度',
  patternFeatures: '特性', patternApp: '应用',

  contactAddress: '联系地址', contactZip: '邮编', contactFactory: '工厂地址', contactFactoryZip: '邮编',
  contactPhone: '电话', contactFax: '传真', contactEmail: '邮箱', contactBranchBtn: '联系我们',

  // Rules Labels (CN)
  ruleCover: '涂层材料', ruleFabricType: '织物类型', ruleTopSurface: '表面', ruleBottomSurface: '内面',
  ruleCoverAttr: '涂层属性', ruleOtherCover: '涂层其他属性', ruleOtherFabric: '织物其他属性'
};

const LABELS_EN = {
  home: 'Home', about: 'About Us', contact: 'Contact Us', news: 'News', products: 'Products', industries: 'Industries', intro: 'Company Introduction',
  searchPlaceholder: 'Search products...', readMore: 'Read More', footerQuickLinks: 'Quick Links', footerIndustries: 'Industries',
  footerFollow: 'Follow Us', footerSubscribe: 'Contact', footerRights: 'All rights reserved.', viewAll: 'View All',
  back: 'Back', details: 'Details', related: 'Related Products', noResults: 'No results found', privacy: 'Privacy Policy', terms: 'Terms of Service',
  
  formFirstName: 'First Name', formLastName: 'Last Name', formPhone: 'Phone', formCompany: 'Company', 
  formEmail: 'Email', formCountry: 'Country/Region', formMessage: 'Message', formCaptcha: 'Captcha',
  formSubmit: 'Send Message', formSuccess: 'Sent successfully! We will contact you soon.', formFrequent: 'Too frequent submissions, please try later.',

  heroCTA: 'Explore Products', techParams: 'Technical Data', rowsPerPage: 'Rows per page:', page: 'Page', of: 'of',
  thModel: 'Model', thPly: 'Ply', thColor: 'Color', thPattern: 'Pattern', thThickness: 'Total Thick.', thWeight: 'Weight',
  thForce: '1% Force', thMinPulley: 'Min Pulley', thTemp: 'Temp.', thConveying: 'Conveying Mode', thFeatures: 'Features',
  tabAll: 'All', tabPVC: 'PVC', tabPU: 'PU', tabPE: 'PE', tabTPEE: 'TPEE', tabSilicon: 'Silicone',
  ruleTitle: 'Model Code Rules', ruleSubtitle: 'Filter products by technical specifications', ruleThickness: 'Thickness (mm)', rulePly: 'Ply',
  ruleColor: 'Color', ruleMaterial: 'Coating Material', rulePattern: 'Pattern', ruleSearchBtn: 'Search', ruleResetBtn: 'Reset',
  patternTitle: 'Patterns & Fabrics', patternName: 'Name', patternCode: 'Code', patternThickness: 'Thickness', patternWidth: 'Width',
  patternFeatures: 'Features', patternApp: 'Application',

  contactAddress: 'Address', contactZip: 'Zip', contactFactory: 'Factory Addr.', contactFactoryZip: 'Factory Zip',
  contactPhone: 'Phone', contactFax: 'Fax', contactEmail: 'Email', contactBranchBtn: 'Contact Us',

  // Rules Labels (EN)
  ruleCover: 'Coating Material', ruleFabricType: 'Fabric Type', ruleTopSurface: 'Top Surface', ruleBottomSurface: 'Bottom Surface',
  ruleCoverAttr: 'Cover Attr.', ruleOtherCover: 'Other Cover Attr.', ruleOtherFabric: 'Other Fabric Attr.'
};

const DETAILS_CN: Record<string, IndustryDetailData> = {};
const DETAILS_EN: Record<string, IndustryDetailData> = {};

Object.values(INDUSTRY_DETAILS).forEach((detail: any) => {
    DETAILS_CN[detail.id] = { id: detail.id, description: detail.descriptionCN, productModels: detail.productModels, commonPatterns: detail.commonPatterns };
    DETAILS_EN[detail.id] = { id: detail.id, description: detail.descriptionEN, productModels: detail.productModels, commonPatterns: detail.commonPatterns };
});

const DEFAULT_CATEGORIES = ['PVC', 'PU', 'PE', 'TPEE', 'Silicone', 'Treadmill'];

export const DICTIONARY: { [key in 'CN' | 'EN']: SiteContent } = {
  CN: {
    logo: IMAGES.logo,
    footerRights: 'Copyright © 2025 保留所有权利。',
    navItems: generateNavItems(INDUSTRIES_CN, PRODUCTS_CN, ABOUT_SECTIONS_CN, 'CN'),
    heroSlides: HERO_SLIDES_CN,
    stats: STATS_CN,
    industries: INDUSTRIES_CN,
    intros: INTROS_CN,
    industryDetails: DETAILS_CN,
    products: PRODUCTS_CN,
    customPages: CUSTOM_PAGES_CN,
    about: {
      sections: ABOUT_SECTIONS_CN,
      pages: ABOUT_PAGES_CN,
      history: HISTORY_DATA,
      certificates: CERTIFICATES,
      downloads: DOWNLOADS
    },
    news: NEWS_CN,
    contact: CONTACT_CN,
    branches: BRANCHES_CN,
    feedback: [],
    socials: SOCIALS,
    techSpecs: TECH_SPECS,
    techCategories: DEFAULT_CATEGORIES,
    patterns: PATTERNS_DATA,
    labels: LABELS_CN
  },
  EN: {
    logo: IMAGES.logo,
    footerRights: 'Copyright © 2025 All rights reserved.',
    navItems: generateNavItems(INDUSTRIES_EN, PRODUCTS_EN, ABOUT_SECTIONS_EN, 'EN'),
    heroSlides: HERO_SLIDES_EN,
    stats: STATS_EN,
    industries: INDUSTRIES_EN,
    intros: INTROS_EN,
    industryDetails: DETAILS_EN,
    products: PRODUCTS_EN,
    customPages: CUSTOM_PAGES_EN,
    about: {
      sections: ABOUT_SECTIONS_EN,
      pages: ABOUT_PAGES_EN,
      history: HISTORY_DATA,
      certificates: CERTIFICATES,
      downloads: DOWNLOADS
    },
    news: NEWS_EN,
    contact: CONTACT_EN,
    branches: BRANCHES_EN,
    feedback: [],
    socials: SOCIALS,
    techSpecs: TECH_SPECS,
    techCategories: DEFAULT_CATEGORIES,
    patterns: PATTERNS_DATA,
    labels: LABELS_EN
  }
};
