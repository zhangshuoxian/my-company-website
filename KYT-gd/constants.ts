
import { SiteData } from './types';

export const INITIAL_DATA: SiteData = {
  companyName: { zh: '新材料饲料科技有限公司', en: 'New Material Feed Tech Co., Ltd.' },
  logo: 'https://picsum.photos/id/101/200/60',
  copyright: { zh: '© 2024 新材料饲料科技有限公司 版权所有', en: '© 2024 New Material Feed Tech Co., Ltd. All rights reserved.' },
  followUs: {
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FeedTech',
    text: { zh: '关注官方微信', en: 'Follow our WeChat' }
  },
  heroSlides: [
    { id: '1', image: 'https://picsum.photos/id/10/1920/800', title: { zh: '创新生物饲料', en: 'Innovative Bio-feed' }, desc: { zh: '引领绿色畜牧新时代', en: 'Leading the New Era of Green Animal Husbandry' } },
    { id: '2', image: 'https://picsum.photos/id/20/1920/800', title: { zh: '科技赋能农业', en: 'Tech Empowers Agriculture' }, desc: { zh: '为全球养殖提供更优解', en: 'Providing Better Solutions for Global Farming' } },
    { id: '3', image: 'https://picsum.photos/id/30/1920/800', title: { zh: '品质源于实验', en: 'Quality From Experiment' }, desc: { zh: '每一克饲料都经过严苛检测', en: 'Every gram of feed is rigorously tested' } },
  ],
  labSection: {
    title: { zh: '欢迎来到我们的实验室', en: 'Welcome to Our Laboratory' },
    desc: { zh: '我们致力于研发最尖端的生物饲料，利用纳米技术与微生物工程提升畜禽消化率。', en: 'We are committed to developing cutting-edge bio-feed, using nanotechnology and microbial engineering to enhance digestion in livestock.' },
    image: 'https://picsum.photos/id/40/600/400',
    stats: [
      { value: '50+', label: { zh: '科研专利', en: 'R&D Patents' } },
      { value: '200k+', label: { zh: '年产吨数', en: 'Annual Tons' } }
    ]
  },
  whyChooseUs: {
    title: { zh: '为什么选择我们', en: 'Why Choose Us' },
    centerImage: 'https://picsum.photos/id/50/400/400',
    points: [
      { title: { zh: '领先技术', en: 'Leading Tech' }, desc: { zh: '拥有多项专利核心技术', en: 'Patented core technologies' } },
      { title: { zh: '天然健康', en: 'Natural Health' }, desc: { zh: '无抗生素，绿色安全', en: 'No antibiotics, green and safe' } },
      { title: { zh: '极高转化率', en: 'High Conversion' }, desc: { zh: '显著降低料肉比', en: 'Significantly reduce FCR' } },
      { title: { zh: '全球供应', en: 'Global Supply' }, desc: { zh: '覆盖全球50个国家', en: 'Covering 50 countries worldwide' } },
    ],
  },
  aboutTabs: {
    image: 'https://picsum.photos/id/60/800/600',
    tabs: [
      { title: { zh: '核心优势', en: 'Core Advantages' }, content: { zh: '我们在分子水平上优化营养成分。', en: 'We optimize nutrients at the molecular level.' } },
      { title: { zh: '生产工艺', en: 'Production Process' }, content: { zh: '采用低温冷榨与瞬间膨化技术。', en: 'Using low-temp cold pressing and instant extrusion.' } },
      { title: { zh: '服务保障', en: 'Service Support' }, content: { zh: '24小时技术团队在线解答。', en: '24/7 technical team for online support.' } },
    ]
  },
  history: {
    bgImage: 'https://picsum.photos/id/70/1920/1080',
    title: { zh: '发展历程', en: 'History' },
    events: [
      { id: 'ev1', year: '2015', content: { zh: '公司在上海成立，专注研发。', en: 'Founded in Shanghai, focusing on R&D.' } },
      { id: 'ev2', year: '2018', content: { zh: '首个万吨级工厂投入使用。', en: 'First 10,000-ton factory operational.' } },
      { id: 'ev3', year: '2021', content: { zh: '荣获国家高新技术企业认证。', en: 'Awarded National High-tech Enterprise.' } },
      { id: 'ev4', year: '2024', content: { zh: '扩展至全球市场。', en: 'Expanding into the global market.' } },
    ]
  },
  honors: [
    { id: 'h1', name: { zh: '质量体系认证', en: 'Quality System Cert' }, image: 'https://picsum.photos/id/80/300/400' },
    { id: 'h2', name: { zh: '科技进步奖', en: 'Tech Progress Award' }, image: 'https://picsum.photos/id/81/300/400' },
    { id: 'h3', name: { zh: '绿色产品证书', en: 'Green Product Cert' }, image: 'https://picsum.photos/id/82/300/400' },
    { id: 'h4', name: { zh: '发明专利', en: 'Invention Patent' }, image: 'https://picsum.photos/id/83/300/400' },
    { id: 'h5', name: { zh: '年度优秀供应商', en: 'Supplier of Year' }, image: 'https://picsum.photos/id/84/300/400' },
  ],
  products: Array.from({ length: 20 }, (_, i) => ({
    id: `p${i + 1}`,
    name: { zh: `优质新材料饲料 ${i + 1}`, en: `Premium Material Feed ${i + 1}` },
    image: `https://picsum.photos/id/${100 + i}/600/600`,
    images: [`https://picsum.photos/id/${100 + i}/600/600`, `https://picsum.photos/id/${101 + i}/600/600`],
    desc: { zh: '利用最新生物技术合成的高营养饲料。', en: 'High-nutrition feed synthesized using biotech.' },
    features: [
      { id: 'f1', title: { zh: '产品功能', en: 'Function' }, content: { zh: '增强吸收', en: 'Enhance absorption' } },
      { id: 'f2', title: { zh: '工艺特点', en: 'Process' }, content: { zh: '超微粉碎', en: 'Ultrafine grinding' } },
      { id: 'f3', title: { zh: '产品特点', en: 'Features' }, content: { zh: '营养均衡', en: 'Balanced nutrition' } }
    ],
    // --- 新增默认数据 ---
    standards: [
      { name: { zh: '硫酸铜含量', en: 'CuSO4·5H2O' }, value: '≥98.5%' },
      { name: { zh: '重金属 (Pb)', en: 'Heavy Metal (Pb)' }, value: '≤10ppm' },
      { name: { zh: '干燥失重', en: 'Loss on Drying' }, value: '≤1.0%' },
    ],
    standardsDesc: { 
      zh: '本产品严格执行国家饲料卫生标准，通过ISO9001质量体系认证，确保每一批次产品安全、高效、可追溯。', 
      en: 'Strictly follows national feed hygiene standards, ISO9001 certified, ensuring safety and traceability.' 
    },
    detailBlocks: [
      {
        id: 'b1',
        title: { zh: '先进的生产工艺', en: 'Advanced Production' },
        content: { zh: '采用国际领先的低温冷榨技术，最大程度保留原料活性营养成分。', en: 'Using leading low-temp cold pressing technology to retain nutrients.' },
        image: 'https://picsum.photos/id/200/800/600'
      },
      {
        id: 'b2',
        title: { zh: '严格的质检流程', en: 'Strict QC Process' },
        content: { zh: '从原料入库到成品出厂，经过18道严苛检测工序。', en: '18 strict inspection processes from raw material to finished product.' },
        image: 'https://picsum.photos/id/201/800/600'
      }
    ]
  })),
  news: Array.from({ length: 15 }, (_, i) => ({
    id: `n${i + 1}`,
    title: { zh: `公司重大新闻报道 ${i + 1}`, en: `Major Corporate News ${i + 1}` },
    date: '2024-05-20',
    image: `https://picsum.photos/id/${150 + i}/800/500`,
    summary: { zh: '今日我司在生物饲料领域取得了突破性进展，发布了第二代益生菌复合制剂。', en: 'Today, our company made breakthrough progress in bio-feed and released the 2nd Gen probiotic compound.' },
    content: { zh: '详细的新闻内容展示。包括研究背景、实验数据以及市场预期等。', en: 'Detailed news content. Includes background, experimental data, and market expectations.' },
  })),
  contact: {
    address: { zh: '上海市徐汇区科技产业园123号', en: 'No. 123 Tech Industrial Park, Xuhui, Shanghai' },
    phone: { zh: '400-123-4567', en: '+86 400-123-4567' },
    email: { zh: 'info@feedtech.com', en: 'info@feedtech.com' },
    fax: { zh: '021-65432100', en: '+86 021-65432100' },
    mapUrl: 'https://maps.google.com/maps?q=shanghai&t=&z=13&ie=UTF8&iwloc=&output=embed',
  }
};
