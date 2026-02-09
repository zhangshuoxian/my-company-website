
import { InventoryItem, Transaction, TransactionType, User, Category } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', name: '系统管理员', role: 'admin', permissions: ['dashboard', 'inventory', 'dynamic-inventory', 'inbound', 'outbound', 'history', 'ai-assistant', 'admin'] },
  { id: 'u2', username: 'staff1', name: '张工', role: 'staff', permissions: ['dashboard', 'inventory', 'inbound', 'outbound', 'history'] },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: '核心硬件', children: [
    { id: 'cat1-1', name: '处理器' },
    { id: 'cat1-2', name: '显卡' },
  ]},
  { id: 'cat2', name: '存储设备', children: [
    { id: 'cat2-1', name: '内存' },
    { id: 'cat2-2', name: '硬盘' },
  ]},
  { id: 'cat3', name: '外部设备', children: [
    { id: 'cat3-1', name: '主板' },
  ]}
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'CPU-INT-I7', name: 'Intel Core i7-13700K', categoryId: 'cat1-1', category: '处理器', quantity: 45, unit: '个', minThreshold: 10, lastUpdated: '2024-05-20 14:30', location: 'A-01-05', manufacturer: '英特尔' },
  { id: '2', sku: 'GPU-NVD-4080', name: 'NVIDIA RTX 4080 16GB', categoryId: 'cat1-2', category: '显卡', quantity: 12, unit: '张', minThreshold: 5, lastUpdated: '2024-05-20 09:15', location: 'B-02-12', manufacturer: '华硕' },
  { id: '3', sku: 'RAM-COR-D5', name: 'Corsair DDR5 32GB', categoryId: 'cat2-1', category: '内存', quantity: 88, unit: '套', minThreshold: 20, lastUpdated: '2024-05-19 16:45', location: 'C-01-08', manufacturer: '海盗船' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', itemId: '1', itemName: 'Intel Core i7-13700K', type: TransactionType.INBOUND, quantity: 20, operator: '系统管理员', timestamp: '2024-05-20 14:30', manufacturer: '英特尔', note: '季度常规补货' },
];
