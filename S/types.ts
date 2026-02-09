
export enum TransactionType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  ADJUSTMENT = 'ADJUSTMENT'
}

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  name: string;
  password?: string; // For mock login persistence
  role: UserRole;
  permissions: ViewType[];
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string; 
  categoryId: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
  location: string;
  manufacturer: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  quantity: number;
  operator: string;
  timestamp: string;
  manufacturer: string;
  note?: string;
}

export type ViewType = 
  | 'dashboard' 
  | 'inventory' 
  | 'dynamic-inventory'
  | 'inbound' 
  | 'outbound' 
  | 'history' 
  | 'ai-assistant' 
  | 'admin';
