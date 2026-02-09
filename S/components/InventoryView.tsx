
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronRight, Package, Edit2, X, Check, Calendar, Activity, Loader2, Sparkles, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { InventoryItem, Category, Transaction, TransactionType } from '../types';
import { analyzeProductHealth } from '../services/geminiService';

interface InventoryViewProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  categories: Category[];
  onUpdateItem: (item: InventoryItem) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ inventory, transactions, categories, onUpdateItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState<string>('全部');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('全部');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  // Detail Modal States
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [detailDateRange, setDetailDateRange] = useState<'week' | 'month' | 'all'>('week');
  const [detailTypeFilter, setDetailTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [aiJudgement, setAiJudgement] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const parentCategories = ['全部', ...categories.map(c => c.name)];
  const currentParentObj = categories.find(c => c.name === selectedParentCat);
  const subCategories = currentParentObj ? ['全部', ...currentParentObj.children?.map(c => c.name) || []] : ['全部'];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedParentCat !== '全部') {
      const parent = categories.find(c => c.name === selectedParentCat);
      const childIds = parent?.children?.map(c => c.id) || [];
      const parentMatches = parent ? (item.categoryId === parent.id || childIds.includes(item.categoryId)) : false;
      matchesCategory = parentMatches;
      
      if (selectedSubCat !== '全部') {
        const sub = parent?.children?.find(c => c.name === selectedSubCat);
        matchesCategory = item.categoryId === sub?.id;
      }
    }

    return matchesSearch && matchesCategory;
  });

  // Calculate Yesterday's Date String consistently with the app's format
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Get filtered history for the detail modal
  const itemHistory = useMemo(() => {
    if (!detailItem) return [];
    
    let history = transactions.filter(t => t.itemId === detailItem.id);
    
    // Time filter
    const now = new Date();
    if (detailDateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      history = history.filter(t => new Date(t.timestamp) >= weekAgo);
    } else if (detailDateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      history = history.filter(t => new Date(t.timestamp) >= monthAgo);
    }
    
    // Type filter
    if (detailTypeFilter !== 'ALL') {
      history = history.filter(t => t.type === detailTypeFilter);
    }
    
    return history;
  }, [detailItem, transactions, detailDateRange, detailTypeFilter]);

  // AI Judgement Effect
  useEffect(() => {
    if (detailItem) {
      handleProductAIAnalysis();
    } else {
      setAiJudgement(null);
    }
  }, [detailItem, detailDateRange]);

  const handleProductAIAnalysis = async () => {
    if (!detailItem) return;
    setIsAnalyzing(true);
    const result = await analyzeProductHealth(detailItem, itemHistory);
    setAiJudgement(result);
    setIsAnalyzing(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="搜索物料、SKU、厂家..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {parentCategories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedParentCat(cat); setSelectedSubCat('全部'); }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedParentCat === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {selectedParentCat !== '全部' && (
              <div className="flex bg-slate-100/60 p-1.5 rounded-2xl animate-in fade-in zoom-in-95">
                {subCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedSubCat(cat)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSubCat === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">物料明细 & 厂家</th>
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">分类</th>
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">当前库存</th>
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">昨日入库</th>
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">昨日出库</th>
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">状态</th>
                <th className="px-8 py-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">管理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const isLow = item.quantity <= item.minThreshold;
                
                // Calculate yesterday's stats
                const yIn = transactions
                  .filter(t => t.itemId === item.id && t.type === TransactionType.INBOUND && t.timestamp.startsWith(yesterdayStr))
                  .reduce((acc, curr) => acc + curr.quantity, 0);
                const yOut = transactions
                  .filter(t => t.itemId === item.id && t.type === TransactionType.OUTBOUND && t.timestamp.startsWith(yesterdayStr))
                  .reduce((acc, curr) => acc + curr.quantity, 0);

                return (
                  <tr 
                    key={item.id} 
                    onClick={() => setDetailItem(item)}
                    className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLow ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                          <Package size={22} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{item.sku}</span>
                            <span className="text-[10px] text-blue-600 font-bold uppercase">{item.manufacturer}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col">
                        <span className={`text-lg font-black font-mono leading-none ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-bold text-emerald-600 font-mono">
                        {yIn > 0 ? `+${yIn}` : '0'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-bold text-orange-600 font-mono">
                        {yOut > 0 ? `-${yOut}` : '0'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isLow ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-tight">{isLow ? '库存不足' : '供应正常'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                     <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{detailItem.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{detailItem.sku} • {detailItem.manufacturer}</p>
                  </div>
               </div>
               <button onClick={() => setDetailItem(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
               {/* Summary Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">当前库存</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">{detailItem.quantity}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase">{detailItem.unit}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-6">
                     <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                        <Sparkles size={24} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                          AI 智能备货建议
                          {isAnalyzing && <Loader2 size={12} className="animate-spin" />}
                        </p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                           {isAnalyzing ? "正在结合近期趋势深度分析中..." : aiJudgement || "暂无数据支持分析"}
                        </p>
                     </div>
                  </div>
               </div>

               {/* History Section */}
               <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-blue-500" />
                        出入库明细记录
                     </h4>
                     <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
                        <select 
                           value={detailDateRange} 
                           onChange={(e) => setDetailDateRange(e.target.value as any)}
                           className="bg-transparent text-[10px] font-bold px-3 py-1 outline-none border-r border-slate-200"
                        >
                           <option value="week">最近一周</option>
                           <option value="month">最近一月</option>
                           <option value="all">全部记录</option>
                        </select>
                        <select 
                           value={detailTypeFilter} 
                           onChange={(e) => setDetailTypeFilter(e.target.value as any)}
                           className="bg-transparent text-[10px] font-bold px-3 py-1 outline-none"
                        >
                           <option value="ALL">全部类型</option>
                           <option value={TransactionType.INBOUND}>仅入库</option>
                           <option value={TransactionType.OUTBOUND}>仅出库</option>
                        </select>
                     </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white">
                     <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 sticky top-0">
                              <tr>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作时间</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">业务类型</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">数量变动</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">经办人员</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {itemHistory.length > 0 ? itemHistory.map(t => (
                                 <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{t.timestamp}</td>
                                    <td className="px-6 py-4 text-center">
                                       <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${
                                          t.type === TransactionType.INBOUND 
                                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                             : 'bg-orange-50 text-orange-600 border-orange-100'
                                       }`}>
                                          {t.type === TransactionType.INBOUND ? '入库' : '出库'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black font-mono">
                                       <div className="flex items-center justify-center gap-1">
                                          {t.type === TransactionType.INBOUND ? <ArrowDownLeft size={14} className="text-emerald-500" /> : <ArrowUpRight size={14} className="text-orange-500" />}
                                          <span className={t.type === TransactionType.INBOUND ? 'text-emerald-600' : 'text-orange-600'}>
                                             {t.type === TransactionType.INBOUND ? '+' : '-'}{t.quantity}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">{t.operator}</td>
                                 </tr>
                              )) : (
                                 <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-300 italic text-sm">
                                       所选时段内暂无该产品的操作记录
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
               <button 
                  onClick={() => setDetailItem(null)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm"
               >
                  关闭查看
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Existing) */}
      {editingItem && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="text-xl font-bold tracking-tight">编辑物料：{editingItem.name}</h3>
               <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">库存单位</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                     value={editingItem.unit}
                     onChange={e => setEditingItem({...editingItem, unit: e.target.value})}
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">起订阈值</label>
                   <input 
                     type="number" 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                     value={editingItem.minThreshold}
                     onChange={e => setEditingItem({...editingItem, minThreshold: Number(e.target.value)})}
                   />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">厂家信息</label>
                 <input 
                   type="text" 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                   value={editingItem.manufacturer}
                   onChange={e => setEditingItem({...editingItem, manufacturer: e.target.value})}
                 />
               </div>
               <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                 <Check size={18} /> 保存修改
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
