
import { SiteContent } from '../types';
import { DICTIONARY } from '../constants';

const DB_NAME = 'BoshunEnterpriseDB';
const STORE_META = 'metadata';
const STORE_ASSETS = 'assets'; // 专门存储大文件 (Images/PDFs)
const DB_VERSION = 2;

export class DatabaseService {
  private static db: IDBDatabase | null = null;
  private static urlCache: Map<string, string> = new Map();

  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META);
        if (!db.objectStoreNames.contains(STORE_ASSETS)) db.createObjectStore(STORE_ASSETS);
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  // 获取元数据 (文字配置)
  static async getContent(lang: 'CN' | 'EN'): Promise<SiteContent | null> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_META], 'readonly');
      const store = transaction.objectStore(STORE_META);
      const request = store.get(`content_${lang}`);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  // 保存元数据
  static async saveContent(lang: 'CN' | 'EN', content: SiteContent): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_META], 'readwrite');
      const store = transaction.objectStore(STORE_META);
      const request = store.put(content, `content_${lang}`);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 【核心功能】保存大资产 (自动处理 Base64 转 Blob 以节省空间)
  static async saveAsset(id: string, data: string | Blob): Promise<string> {
    if (!this.db) await this.init();
    let blob: Blob;
    if (typeof data === 'string' && data.startsWith('data:')) {
      const resp = await fetch(data);
      blob = await resp.blob();
    } else {
      blob = data as Blob;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_ASSETS], 'readwrite');
      const store = transaction.objectStore(STORE_ASSETS);
      const request = store.put(blob, id);
      request.onsuccess = () => {
        // 更新缓存
        if (this.urlCache.has(id)) URL.revokeObjectURL(this.urlCache.get(id)!);
        const url = URL.createObjectURL(blob);
        this.urlCache.set(id, url);
        resolve(id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 【核心功能】获取资产的临时访问 URL
  static async getAssetURL(id: string): Promise<string | null> {
    if (!id || id.startsWith('http') || id.startsWith('/assets')) return id;
    if (this.urlCache.has(id)) return this.urlCache.get(id)!;

    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_ASSETS], 'readonly');
      const store = transaction.objectStore(STORE_ASSETS);
      const request = store.get(id);
      request.onsuccess = () => {
        if (request.result) {
          const url = URL.createObjectURL(request.result);
          this.urlCache.set(id, url);
          resolve(url);
        } else {
          resolve(null);
        }
      };
    });
  }

  static async seedInitialData(): Promise<{ CN: SiteContent; EN: SiteContent }> {
    let cn = await this.getContent('CN');
    let en = await this.getContent('EN');
    if (!cn) { cn = DICTIONARY.CN; await this.saveContent('CN', cn); }
    if (!en) { en = DICTIONARY.EN; await this.saveContent('EN', en); }
    return { CN: cn, EN: en };
  }
}
