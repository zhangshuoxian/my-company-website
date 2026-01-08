
export interface IndustryDetailSource {
  id: string;
  descriptionCN: string;
  descriptionEN: string;
  productModels: string[];
  commonPatterns?: string[];
}

// Common Product Models List (Based on Food Processing) for initialization
const FOOD_MODELS = [
  '18P22-27', '20P25-14A', '20P25-24/1', '20P25-24N', '30P22-11', 
  '30P25-25N', '30P25-25X', '50P22-16/3A', '8U12-14BA', '15U22-24A', 
  '50P22-26/11A', '48P22-26/6A', '20P25-84N FDA', '30P21-21N FDA', 
  '12U22-24/0A', '15U12-24/1A', '14U23-17B', '60P31-29/0H FDA', '60P31-29/0H'
];

export const INDUSTRY_DETAILS: Record<string, IndustryDetailSource> = {
  'logistics': {
    id: 'logistics',
    descriptionCN: "物流行业广泛应用于快递分拣线、机场行李输送。物流行业输送带，要求非常高，所用是一种新型高强度输送带，具有自重轻、弹性好、伸长率小、使用寿命长等特点，其中有平面型，防滑型输送带，具有防静电、耐腐蚀、耐切割、阻燃，在高速运转下输送带不打滑，噪音要低，并且耐高摩擦。",
    descriptionEN: "The logistics industry is widely used in express sorting lines and airport baggage conveying. Logistics conveyor belts have very high requirements. A new type of high-strength conveyor belt is used, which features light weight, good elasticity, low elongation, and long service life. Types include flat and anti-slip conveyor belts, which are anti-static, corrosion-resistant, cut-resistant, and flame-retardant. The belt does not slip under high-speed operation, has low noise, and is resistant to high friction.",
    productModels: [
      '20P21-34/0', '20P25-14/1A', '20P25-44/18ZA', '30P22-16/19A', 
      '30P25-15A', '30P25-35/0A', '31P22-36/19D', '40P32-14A', 
      '40P32-74/0D', '50P22-16/3A', '50P22-16/9A', '53P22-36/9D', 
      '40PV33-27C', '30PVK100', '38PVK125', '40PVK130', '40P33-27G' 
    ],
    // Matte(0), Grass/HighGrip(3), LargeSquare(22), Diamond(1)
    commonPatterns: ['0', '3', '22', '1']
  },
  'food': {
    id: 'food',
    descriptionCN: "食品加工类输送带选用优质的高强度聚酯织物作为带芯，面层用进口PU材料，带体表面具有防粘、耐油、耐酸碱、耐低温、防霉抗菌等特点，产品符合食品卫生标准，可与食品直接接触，无毒无味。",
    descriptionEN: "Food processing conveyor belts use high-quality high-strength polyester fabric as the core, and the surface layer uses imported PU material. The belt surface features anti-sticking, oil resistance, acid and alkali resistance, low temperature resistance, anti-mildew and antibacterial properties. The products meet food hygiene standards, can directly contact food, and are non-toxic and odorless.",
    productModels: FOOD_MODELS,
    commonPatterns: ['0', '1', '11', '4', '6']
  },
  'tobacco': {
    id: 'tobacco',
    descriptionCN: "针对烟草行业，博顺带业研发出了具备无毒、无味、耐油、抗拉伸性强等特点的产品。这些特性使得输送带在烟草加工和运输过程中，不会对烟草品质产生不良影响，能够安全地与烟草接触，并且在长期使用中可以承受一定的拉力，保持良好的工作状态，满足烟草行业对于输送带的特殊要求。",
    descriptionEN: "For the tobacco industry, Boshun Belting has developed products with non-toxic, odorless, oil-resistant, and strong tensile strength characteristics. These features ensure that the conveyor belt does not adversely affect tobacco quality during processing and transportation, can safely contact tobacco, withstand certain tension during long-term use, maintain good working conditions, and meet the special requirements of the tobacco industry.",
    productModels: FOOD_MODELS, 
    commonPatterns: ['8', '27', '38', 'C', 'T']
  },
  'stone': {
    id: 'stone',
    descriptionCN: "博顺带业是石材和陶瓷行业输送带的卓越制造商。在石材和陶瓷行业输送带制造领域占据领先地位。作为我们的核心产品，我们的输送带具备耐切割、耐磨损、高平整度以及高断裂强度等突出特点。产品拥有众多不同的表面花纹可供客户选择。我们与世界各地的众多陶瓷和大理石设备制造商展开深度合作，在合作中共同提升生产质量与协作能力。",
    descriptionEN: "Boshun Belting is a premier manufacturer of conveyor belts for the stone and ceramic industries. We hold a leading position in this sector. Our core products feature cut resistance, wear resistance, high flatness, and high breaking strength. A wide variety of surface patterns are available. We collaborate deeply with ceramic and marble equipment manufacturers worldwide to improve production quality and efficiency.",
    productModels: [
      '70P39-28/15', '70P39-76/4', '70P39-76/25', '90P32-36/13', '90P39-78/15', 
      '90P49-76', '90P49-76/4', '90P49-76/25', '90P49-86/49', '110P39-76/23', 
      '110P39-76/34', '115P39-76/23', '120P42-74/0H', '125P49-76/23', 
      '125P49-76/34', '130P49-76/23', '130P49-76/34', '40P33-27G', '130P49-86/34', '50P32-76/4'
    ],
    commonPatterns: ['4', '15', '23', '25', '34', '49']
  },
  'wood': {
    id: 'wood',
    descriptionCN: "木材加工输送带广泛用于人造板（高、中密度板、纤维板、刨花板等）生产线及木工机械砂光机上。产品特点：抗拉力强、耐磨、平整度要求高。",
    descriptionEN: "Wood processing conveyor belts are widely used in artificial board (MDF, HDF, fiberboard, particleboard, etc.) production lines and woodworking sanders. Product features: strong tensile strength, wear resistance, and high flatness requirements.",
    productModels: FOOD_MODELS,
    commonPatterns: ['13', '14', '28', '43']
  },
  'textile': {
    id: 'textile',
    descriptionCN: "博顺带业采用精密工艺，将传送带厚度公差控制在 ±0.02mm，特别适用于纺织品及印刷品运输。产品特性包括：低伸长率确保形态稳定，高精度尺寸保障运输精准度，运行时低噪音，表面防静电处理，边缘切割整齐，整体轻便灵活易安装。",
    descriptionEN: "Boshun Belting uses precision technology to control conveyor belt thickness tolerance within ±0.02mm, making it especially suitable for textile and printing transport. Features include: low elongation for stable shape, high dimensional accuracy for precise transport, low noise operation, anti-static surface, clean cut edges, and overall lightweight flexibility for easy installation.",
    productModels: FOOD_MODELS,
    commonPatterns: ['24', '0', '1', '26']
  },
  'electronics': {
    id: 'electronics',
    descriptionCN: "博顺带业研发抗静电 PVC 输送带，专为电子行业设计。采用低伸长率基材，结合高耐磨表层，确保运输中元件形态稳定；表面平滑处理减少摩擦损伤；抗静电特性规避静电危害。",
    descriptionEN: "Boshun Belting has developed anti-static PVC conveyor belts specifically for the electronics industry. Using low-elongation substrates combined with high wear-resistant surface layers ensures component stability during transport; smooth surface treatment reduces friction damage; anti-static properties prevent electrostatic hazards.",
    productModels: FOOD_MODELS,
    commonPatterns: ['0', '1', '24']
  },
  'sports': {
    id: 'sports',
    descriptionCN: "博顺传送带在健身行业的跑步机上有着广泛的应用。其表面花纹多样，可供客户自由选择。同时，我们郑重承诺，传送带质量稳定可靠、精度高，具备抗静电的优良性能，运行时产生的噪音极低，而且使用寿命长久。",
    descriptionEN: "Boshun conveyor belts are widely used in treadmills within the fitness industry. Diverse surface patterns are available for customers to choose from. We solemnly promise stable and reliable quality, high precision, excellent anti-static performance, extremely low noise during operation, and long service life.",
    productModels: FOOD_MODELS,
    commonPatterns: ['5', '7', '12', '17', '20', '31', '56', '60', '4830 A218E']
  },
  'energy': {
    id: 'energy',
    descriptionCN: "光伏与锂电池生产输送带，要求耐磨、耐切割、防静电。博顺带业提供高效稳定的输送解决方案，确保电池片和组件在生产过程中的安全传输。",
    descriptionEN: "PV and Lithium battery production conveyor belts require wear resistance, cut resistance, and anti-static properties. Boshun Belting provides efficient and stable conveying solutions to ensure the safe transport of cells and modules during production.",
    productModels: FOOD_MODELS,
    commonPatterns: ['0', '1', '24']
  }
};
