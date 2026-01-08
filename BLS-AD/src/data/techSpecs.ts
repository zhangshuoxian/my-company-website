
import { TechSpec } from '../types';

const COLORS = {
  Green: '#009944',
  White: '#F5F5F5',
  Blue: '#0055AA',
  Black: '#1A1A1A',
  Grey: '#808080',
  DarkGreen: '#004d25',
  AppleGreen: '#8DB600',
  Teal: '#008080',
  Red: '#CC0000',
  BlueGreen: '#006666',
  Transparent: '#E0E0E0',
  Beige: '#F5F5DC',
  Orange: '#FFA500'
};

const BASE_SPECS: TechSpec[] = [
  { id: '1', model: '20P21-34/0', materialType: 'PVC', ply: '两层', color: '绿色', colorHex: COLORS.Green, pattern: '哑光', totalThickness: '2', coatingThickness: '0.5', weight: '2.2', force1pct: '10', minPulley: '30', workingTemp: '-30/80', conveying: { plate: true, roller: true, trough: false }, features: {} },
  { id: '2', model: '10P12-14A', materialType: 'PVC', ply: '一层', color: '白色', colorHex: COLORS.White, pattern: '光滑/光', totalThickness: '1', coatingThickness: '0.5', weight: '1.2', force1pct: '4', minPulley: '10', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: true }, features: { foodGrade: true } },
  { id: '3', model: '10P12-84A', materialType: 'PVC', ply: '一层', color: '蓝色', colorHex: COLORS.Blue, pattern: '光滑', totalThickness: '1', coatingThickness: '0.5', weight: '1.2', force1pct: '4', minPulley: '10', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: true }, features: { foodGrade: true, antibacterial: true } },
  { id: '4', model: '18P22-27', materialType: 'PVC', ply: '两层', color: '白色', colorHex: COLORS.White, pattern: '织物', totalThickness: '1.8', coatingThickness: '-', weight: '1.7', force1pct: '8', minPulley: '40', workingTemp: '-40/80', conveying: { plate: true, roller: true, trough: false }, features: {} },
  { id: '5', model: '18P22-27A', materialType: 'PVC', ply: '两层', color: '白色', colorHex: COLORS.White, pattern: '织物/织物', totalThickness: '1.8', coatingThickness: '-', weight: '2.2', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { foodGrade: true } },
  { id: '6', model: '20P25-14A', materialType: 'PVC', ply: '两层', color: '绿色', colorHex: COLORS.Green, pattern: '光滑/织物', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '30', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: true }, features: {} },
  { id: '7', model: '20P25-14/1A', materialType: 'PVC', ply: '两层', color: '绿色', colorHex: COLORS.Green, pattern: '钻石', totalThickness: '2', coatingThickness: '1', weight: '2.3', force1pct: '8', minPulley: '30', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: true }, features: {} },
  { id: '8', model: '20P25-14/21A', materialType: 'PVC', ply: '两层', color: '绿色', colorHex: COLORS.Green, pattern: '光滑/光滑', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true, oilResistant: true } },
  { id: '9', model: '20P25-24', materialType: 'PVC', ply: '两层', color: '白色', colorHex: COLORS.White, pattern: '光滑/织物', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '30', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: true }, features: {} },
  { id: '10', model: '20P25-24/1', materialType: 'PVC', ply: '两层', color: '白色', colorHex: COLORS.White, pattern: '钻石', totalThickness: '2', coatingThickness: '1', weight: '2.4', force1pct: '6', minPulley: '20', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: true }, features: {} },
  { id: '11', model: '20P25-24W', materialType: 'PVC', ply: '两层', color: '白色', colorHex: COLORS.White, pattern: '哑光', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-10/80', conveying: { plate: true, roller: true, trough: false }, features: { foodGrade: true, oilResistant: true } },
  { id: '12', model: '20P25-34/0A', materialType: 'PVC', ply: '两层', color: '黑色', colorHex: COLORS.Black, pattern: '哑光/织物', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '30', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true } },
  { id: '13', model: '20P25-34/0(21)', materialType: 'PVC', ply: '两层', color: '黑色', colorHex: COLORS.Black, pattern: '哑光', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true, flameRetardant: true } },
  { id: '14', model: '20P25-44/18ZA', materialType: 'PVC', ply: '两层', color: '灰色', colorHex: COLORS.Grey, pattern: '钻石', totalThickness: '2', coatingThickness: '0.5', weight: '2.3', force1pct: '6', minPulley: '20', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { lowNoise: true } },
  { id: '15', model: '20P25-74A', materialType: 'PVC', ply: '两层', color: '墨绿色', colorHex: COLORS.DarkGreen, pattern: '光滑', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: {} },
  { id: '16', model: '20P25-74/0A', materialType: 'PVC', ply: '两层', color: '墨绿色', colorHex: COLORS.DarkGreen, pattern: '哑光', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: {} },
  { id: '17', model: '20P25-74/0(21)', materialType: 'PVC', ply: '两层', color: '墨绿色', colorHex: COLORS.DarkGreen, pattern: '哑光', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true, lowNoise: true } },
  { id: '18', model: '20P25-74/0BYA', materialType: 'PVC', ply: '两层', color: '墨绿色', colorHex: COLORS.DarkGreen, pattern: '哑光/织物', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/80', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true } },
  { id: '19', model: '21P25-14A', materialType: 'PVC', ply: '两层', color: '绿色', colorHex: COLORS.Green, pattern: '光滑', totalThickness: '2.1', coatingThickness: '0.6', weight: '2.5', force1pct: '8', minPulley: '40', workingTemp: '0-100', conveying: { plate: true, roller: true, trough: false }, features: {} },
  { id: '20', model: '30P22-16/19A', materialType: 'PVC', ply: '三层', color: '绿色', colorHex: COLORS.Green, pattern: '细直条', totalThickness: '3', coatingThickness: '1.5', weight: '3.4', force1pct: '10', minPulley: '60', workingTemp: '-20/60', conveying: { plate: true, roller: true, trough: false }, features: {} },
  { id: '71', model: 's20/1', materialType: 'TPEE', ply: '两层', color: '黑色', colorHex: COLORS.Black, pattern: '钻石', totalThickness: '2', coatingThickness: '0.5', weight: '2.3', force1pct: '8', minPulley: '40', workingTemp: '-15/60', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true, turning: true, lowTemp: true } },
  { id: '72', model: 's20/17', materialType: 'TPEE', ply: '两层', color: '黑色', colorHex: COLORS.Black, pattern: '浅钻石', totalThickness: '2', coatingThickness: '0.5', weight: '2.3', force1pct: '8', minPulley: '40', workingTemp: '-15/60', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true } },
  { id: '73', model: 's20/20', materialType: 'TPEE', ply: '两层', color: '黑色', colorHex: COLORS.Black, pattern: '草皮纹', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/60', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true } },
  { id: '74', model: 's20/31', materialType: 'TPEE', ply: '两层', color: '黑色', colorHex: COLORS.Black, pattern: '粗砂型', totalThickness: '2', coatingThickness: '0.5', weight: '2.4', force1pct: '8', minPulley: '40', workingTemp: '-15/60', conveying: { plate: true, roller: true, trough: false }, features: { antistatic: true } },
];

// Helper to clone TPEE data to other categories
const tpeeData = BASE_SPECS.filter(i => i.materialType === 'TPEE');

const createCopies = (source: TechSpec[], newType: string, idPrefix: string) => {
    return source.map((item, index) => ({
        ...item,
        id: `${idPrefix}_${index}`,
        materialType: newType,
        model: item.model.replace('s20', newType.substring(0,2) + '20') // Simple rename
    }));
};

const puCopies = createCopies(tpeeData, 'PU', 'pu_copy');
const siliconeCopies = createCopies(tpeeData, 'Silicone', 'si_copy');
const treadmillCopies = createCopies(tpeeData, 'Treadmill', 'tm_copy');

export const TECH_SPECS: TechSpec[] = [
    ...BASE_SPECS,
    ...puCopies,
    ...siliconeCopies,
    ...treadmillCopies
];
