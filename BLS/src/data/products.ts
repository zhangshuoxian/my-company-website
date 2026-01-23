import { CategoryItem, PatternSpec } from '../types';

// Moved IMAGES definition to local to avoid circular dependency with constants.ts
const LOCAL_IMAGES = {
  logo: "/assets/logo.png",
  slide1: "/assets/home/slide1.jpg", 
  slide2: "/assets/home/slide2.jpg", 
  slide3: "/assets/home/slide3.jpg", 
  slide4: "/assets/home/slide4.jpg",
  productionLine: "/assets/home/ProductionLine.jpg",
  loom: "/assets/home/loom.jpg",
  patent: "/assets/home/patent.jpg",
  capacity: "/assets/home/assmble.jpg", 
  area: "/assets/home/Surface area.jpg",
  building: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
  cat1: "https://images.unsplash.com/photo-1625246333195-58197bd47d72?auto=format&fit=crop&q=80&w=600",
  cat2: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
  cat3: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
  cat4: "https://images.unsplash.com/photo-1542060748-10c287222651?auto=format&fit=crop&q=80&w=600",
  patternPlaceholder: "/assets/pattern_placeholder.jpg"
};

export const PATTERNS_DATA: PatternSpec[] = [
  { name: '哑光', code: '0', thickness: '0 0mm', width: '3500mm', features: '表面不粘', application: '通用' },
  { name: '钻石', code: '1', thickness: '0.6mm', width: '3000mm', features: '表面不粘', application: '物流，食品加工' },
  { name: '粗布纹', code: '2', thickness: '0.3mm', width: '2000mm', features: '表面不粘', application: '通用' },
  { name: '高摩擦 (草型)', code: '3', thickness: '1.6mm', width: '2000mm', features: '高摩擦，倾斜输送', application: '物流，航空' },
  { name: '高摩擦 (草型)', code: '3', thickness: '2.4mm', width: '3000mm', features: '高摩擦，倾斜输送', application: '物流，航空' },
  { name: '小圆点', code: '4', thickness: '0.6mm', width: '2200mm', features: '倾斜输送', application: '大理石加工' },
  { name: '粗质地', code: '5', thickness: '1.6mm', width: '-mm', features: '高摩擦，倾斜输送', application: '物流，跑步机' },
  { name: '锯齿', code: '6', thickness: '1.5mm', width: '2000mm', features: '倾斜输送', application: '海鲜加工，家禽肉' },
  { name: '高尔夫', code: '7', thickness: '0.8mm', width: '2000mm', features: '低摩擦', application: '物流，跑步机' },
  { name: '西格林高尔夫', code: '7', thickness: '0.8mm', width: '3000mm', features: '低摩擦', application: '物流，跑步机' },
  { name: '细圆台', code: '8', thickness: '1.3mm', width: '-mm', features: '易清洁，倾斜输送', application: '烟草' },
  { name: '波浪形高摩擦', code: '9', thickness: '2.4mm', width: '3000mm', features: '高摩擦，倾斜输送', application: '物流，航空' },
  { name: '大人字形', code: '10', thickness: '3mm', width: '-mm', features: '倾斜输送', application: '农业' },
  { name: '小月牙形', code: '11', thickness: '2.2mm', width: '2000mm', features: '倾斜输送', application: '海鲜加工，家禽肉' },
  { name: '中摩擦', code: '12', thickness: '1.0mm', width: '-mm', features: '中摩擦，倾斜输送', application: '物流，跑步机' },
  { name: '菱形格', code: '13', thickness: '3.8mm', width: '2200mm', features: '-', application: '木材加工' },
  { name: '鱼骨纹', code: '14', thickness: '1.8mm', width: '2200mm', features: '-', application: '海鲜加工，木材' },
  { name: '小高尔夫', code: '15', thickness: '0.2mm', width: '2000mm', features: '低摩擦', application: '大理石加工' },
  { name: '横鱼骨纹', code: '16', thickness: '2.7mm', width: '-mm', features: '纵横向摩擦', application: '鱼加工，玻璃' },
  { name: '浅钻石', code: '17', thickness: '0.25mm', width: '2000mm', features: '低摩擦', application: '跑步机' },
  { name: '细直条', code: '19', thickness: '0.7mm', width: '2000mm', features: '易清洁，倾斜输送', application: '物流，航空' },
  { name: '草皮纹', code: '20', thickness: '0.2mm', width: '-mm', features: '-', application: '跑步机' },
  { name: '大方格', code: '22', thickness: '4.0mm', width: '-mm', features: '-', application: '机场' },
  { name: '凸齿', code: '23', thickness: '5.0mm', width: '2200mm', features: '-', application: '大理石加工' },
  { name: '格子', code: '24', thickness: '0.5mm', width: '3000mm', features: '中摩擦，倾斜输送', application: '纺织，物流，航空' },
  { name: '网眼', code: '25', thickness: '0.35mm', width: '3000mm', features: '低摩擦', application: '大理石加工' },
  { name: '细布纹', code: '26', thickness: '0.1mm', width: '2100mm', features: '表面不粘', application: '通用' },
  { name: '人字形', code: '27', thickness: '1.8mm', width: '3000mm', features: '倾斜输送', application: '烟草' },
  { name: '横圆台', code: '28', thickness: '3.0mm', width: '2200mm', features: '-', application: '木材加工' },
  { name: '小菱形格', code: '29', thickness: '3.0mm', width: '-mm', features: '-', application: '通用' },
  { name: '粗砂型', code: '31', thickness: '0.2mm', width: '2000mm', features: '中摩擦，表面不粘', application: '物流，跑步机' },
  { name: '横条', code: '32', thickness: '2.0mm', width: '2200mm', features: '同步输送', application: '-' },
  { name: '粗哑光', code: '33', thickness: '0.1mm', width: '3500mm', features: '表面不粘', application: '通用' },
  { name: '双向凸齿', code: '34', thickness: '5.0mm', width: '2200mm', features: '-', application: '大理石加工' },
  { name: '小颗粒', code: '35', thickness: '1.2mm', width: '-mm', features: '-', application: '洗衣，面包' },
  { name: '小圆锥', code: '36', thickness: '1.4mm', width: '-mm', features: '-', application: '海鲜加工，家禽肉' },
  { name: '小圆台', code: '37', thickness: '3.7mm', width: '-mm', features: '-', application: '农业' },
  { name: '三角形', code: '38', thickness: '1.0mm', width: '-mm', features: '-', application: '食品，烟草' },
  { name: '小浅钻石', code: '39', thickness: '0.2mm', width: '-mm', features: '-', application: '巧克力，面包' },
  { name: '凸状菱形格', code: '40', thickness: '0.1mm', width: '-mm', features: '-', application: '巧克力' },
  { name: '细哑光', code: '42', thickness: '-mm', width: '3500mm', features: '-', application: '通用' },
  { name: '菱形格 (12mm)', code: '43', thickness: '4.5mm', width: '2000mm', features: '高摩擦', application: '木材加工' },
  { name: '小米粒', code: '44', thickness: '0.3mm', width: '-mm', features: '-', application: '海鲜加工，食品' },
  { name: '高摩擦布纹', code: '45', thickness: '3.2mm', width: '-mm', features: '高摩擦，倾斜输送', application: '-' },
  { name: '横台', code: '46', thickness: '2.0mm', width: '-mm', features: '-', application: '通用' },
  { name: '中摩擦布纹', code: '48', thickness: '0.8mm', width: '-mm', features: '-', application: '-' },
  { name: '小三棱', code: '49', thickness: '0.6mm', width: '2200mm', features: '-', application: '大理石加工' },
  { name: '方格草带', code: '50', thickness: '3.0mm', width: '2000mm', features: '-', application: '-' },
  { name: '细钻石', code: '51', thickness: '0.2mm', width: '-mm', features: '-', application: '-' },
  { name: '颗粒纹', code: '52', thickness: '1.1mm', width: '-mm', features: '-', application: '-' },
  { name: '小网眼', code: '53', thickness: '0.3mm', width: '2000mm', features: '低摩擦', application: '巧克力' },
  { name: '小网眼 (浅)', code: '53', thickness: '0.3mm', width: '2000mm', features: '低摩擦', application: '巧克力' },
  { name: '小网眼 (深)', code: '53', thickness: '0.6mm', width: '2000mm', features: '低摩擦', application: '巧克力' },
  { name: '波浪高摩擦颗粒', code: '54', thickness: '1.2mm', width: '2100mm', features: '-', application: '-' },
  { name: '浅高尔夫', code: '56', thickness: '0.2mm', width: '-mm', features: '-', application: '跑步机' },
  { name: '小锯齿', code: '57', thickness: '0.6mm', width: '-mm', features: '-', application: '-' },
  { name: '乱纹', code: '60', thickness: '0.2mm', width: '2000mm', features: '中摩擦', application: '跑步机' },
  { name: '小鱼骨纹', code: '61', thickness: '2.5mm', width: '-mm', features: '-', application: '-' },
  { name: '横条纹', code: '71', thickness: '3.5mm', width: '2000mm', features: '-', application: '食品' },
  { name: '大圆台', code: 'C', thickness: '2.8mm', width: '2200mm', features: '易清洁，倾斜输送', application: '烟草' },
  { name: '长圆台', code: 'T', thickness: '2.5mm', width: '-mm', features: '易清洁，倾斜输送', application: '烟草' },
  { name: '三角纹', code: 'V', thickness: '3.4mm', width: '2000mm', features: '倾斜输送', application: '食品加工' },
  { name: '人字纹跑步机布', code: '4830 A218E', thickness: '0.5mm', width: '-mm', features: '抗静电，低噪音', application: '跑步机' },
];

export const CODE_RULES = {
  materials: [
    { code: 'P', label: 'PVC' },
    { code: 'U', label: 'PU' },
    { code: 'E', label: 'PE' },
    { code: 'H', label: 'Hytrel' },
    { code: 'S', label: 'Silicon' },
  ],
  plies: [
    { code: '1', label: '1 Ply' },
    { code: '2', label: '2 Ply' },
    { code: '3', label: '3 Ply' },
    { code: '4', label: '4 Ply' }
  ],
  colors: [
    { code: '0', label: 'Green' },
    { code: '1', label: 'White' },
    { code: '2', label: 'Black' },
    { code: '3', label: 'Grey' },
    { code: '7', label: 'Dark Green' },
    { code: '6', label: 'Blue' },
    { code: '4', label: 'Red' },
  ]
};

export const INDUSTRIES_CN: CategoryItem[] = [
  { id: 'logistics', title: '物流航空', description: '机场、快递、仓储输送解决方案', image: LOCAL_IMAGES.cat1, type: 'industry' },
  { id: 'food', title: '食品加工', description: '烘焙、肉类、果蔬加工输送带', image: LOCAL_IMAGES.cat2, type: 'industry' },
  { id: 'tobacco', title: '烟草行业', description: '烟叶处理、卷烟生产输送', image: LOCAL_IMAGES.cat3, type: 'industry' },
  { id: 'stone', title: '石材&陶瓷', description: '大理石、陶瓷抛光输送', image: LOCAL_IMAGES.cat4, type: 'industry' },
  { id: 'wood', title: '木材加工', description: '人造板与家具生产输送', image: LOCAL_IMAGES.cat1, type: 'industry' },
  { id: 'textile', title: '印花纺织', description: '导带与印花机专用带', image: LOCAL_IMAGES.cat4, type: 'industry' },
  { id: 'electronics', title: '数码电子', description: '精密电子制造输送', image: LOCAL_IMAGES.cat1, type: 'industry' },
  { id: 'sports', title: '跑步机', description: '家用与商用跑步机带', image: LOCAL_IMAGES.cat3, type: 'industry' },
  { id: 'energy', title: '能源', description: '光伏与锂电池生产输送', image: LOCAL_IMAGES.cat1, type: 'industry' },
];

export const INDUSTRIES_EN: CategoryItem[] = [
  { id: 'logistics', title: 'Logistics', description: 'Airport, express, warehousing solutions', image: LOCAL_IMAGES.cat1, type: 'industry' },
  { id: 'food', title: 'Food Processing', description: 'Bakery, meat, fruit & veg processing', image: LOCAL_IMAGES.cat2, type: 'industry' },
  { id: 'tobacco', title: 'Tobacco Industry', description: 'Tobacco leaf processing, cigarette production', image: LOCAL_IMAGES.cat3, type: 'industry' },
  { id: 'stone', title: 'Stone Processing', description: 'Marble, ceramic polishing', image: LOCAL_IMAGES.cat4, type: 'industry' },
  { id: 'wood', title: 'Wood Processing', description: 'Wood board and furniture production', image: LOCAL_IMAGES.cat1, type: 'industry' },
  { id: 'textile', title: 'Textile', description: 'Printing blankets and belts', image: LOCAL_IMAGES.cat4, type: 'industry' },
  { id: 'electronics', title: 'Electronics', description: 'Precision electronics conveying', image: LOCAL_IMAGES.cat1, type: 'industry' },
  { id: 'sports', title: 'Treadmill', description: 'Home and commercial treadmill belts', image: LOCAL_IMAGES.cat3, type: 'industry' },
  { id: 'energy', title: 'Energy', description: 'PV and Lithium battery conveying', image: LOCAL_IMAGES.cat1, type: 'industry' },
];

export const PRODUCTS_CN: CategoryItem[] = [
  // 1. Conveyor Belts & Subcategories
  { id: 'conveyor-belts', title: '输送带', description: '各类材质轻型输送带', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'model-rules', parentId: 'conveyor-belts', title: '型号规则', description: '命名规则说明', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'patterns-fabrics', parentId: 'conveyor-belts', title: '图案&面料', description: '表面花纹展示', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'pvc-belts', parentId: 'conveyor-belts', title: 'PVC输送带', description: '通用型输送带', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'pu-belts', parentId: 'conveyor-belts', title: 'PU输送带', description: '食品级与耐油输送带', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'pe-belts', parentId: 'conveyor-belts', title: 'PE输送带', description: '无毒燃烧无污染', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'tpee-belts', parentId: 'conveyor-belts', title: 'TPEE输送带', description: '高弹性输送带', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'silicon-belts', parentId: 'conveyor-belts', title: 'Silicon输送带', description: '耐高温防粘输送带', image: LOCAL_IMAGES.cat1, type: 'product' },

  // 2. PU Timing Belts
  { id: 'pu-timing-belts', title: 'PU同步带', description: '高精度传动同步带', image: LOCAL_IMAGES.cat3, type: 'product' },

  // 3. Round & V-Belts
  { id: 'round-v-belts', title: 'PU圆带&三角带', description: '可接驳传动带', image: LOCAL_IMAGES.cat2, type: 'product' },

  // 4. Accessories & Tools
  { id: 'accessories', title: '配件&工具', description: '输送带加工配件', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'guides', parentId: 'accessories', title: '导条', description: '防跑偏导条', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'baffles', parentId: 'accessories', title: '挡板', description: '提升输送挡板', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'sidewalls', parentId: 'accessories', title: '裙边', description: '防撒料裙边', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'films', parentId: 'accessories', title: '膜', description: '加工辅助膜', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'molds', parentId: 'accessories', title: '硅胶磨具', description: '专用加工磨具', image: LOCAL_IMAGES.cat4, type: 'product' },
];

export const PRODUCTS_EN: CategoryItem[] = [
  // 1. Fabric Conveyor Belts
  { id: 'conveyor-belts', title: 'Conveyor Belts', description: 'Light weight conveyor belts', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'model-rules', parentId: 'conveyor-belts', title: 'Model Rules', description: 'Naming conventions', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'patterns-fabrics', parentId: 'conveyor-belts', title: 'Patterns & Fabrics', description: 'Surface patterns', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'pvc-belts', parentId: 'conveyor-belts', title: 'PVC Belts', description: 'General purpose belts', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'pu-belts', parentId: 'conveyor-belts', title: 'PU Belts', description: 'Food grade and oil resistant', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'pe-belts', parentId: 'conveyor-belts', title: 'PE Belts', description: 'Non-toxic combustion', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'tpee-belts', parentId: 'conveyor-belts', title: 'TPEE Belts', description: 'High elasticity', image: LOCAL_IMAGES.cat1, type: 'product' },
    { id: 'silicon-belts', parentId: 'conveyor-belts', title: 'Silicon Belts', description: 'High temp resistant', image: LOCAL_IMAGES.cat1, type: 'product' },

  // 2. PU Timing Belts
  { id: 'pu-timing-belts', title: 'PU Timing Belts', description: 'Precision timing belts', image: LOCAL_IMAGES.cat3, type: 'product' },

  // 3. Round & V-Belts
  { id: 'round-v-belts', title: 'PU Round & V-Belts', description: 'Joinable transmission belts', image: LOCAL_IMAGES.cat2, type: 'product' },

  // 4. Accessories
  { id: 'accessories', title: 'Accessories & Tools', description: 'Fabrication accessories', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'guides', parentId: 'accessories', title: 'Guides', description: 'Tracking guides', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'baffles', parentId: 'accessories', title: 'Cleats/Baffles', description: 'Conveying cleats', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'sidewalls', parentId: 'accessories', title: 'Sidewalls', description: 'Containment sidewalls', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'films', parentId: 'accessories', title: 'Films', description: 'Processing films', image: LOCAL_IMAGES.cat4, type: 'product' },
    { id: 'molds', parentId: 'accessories', title: 'Silicone Molds', description: 'Fabrication molds', image: LOCAL_IMAGES.cat4, type: 'product' },
];