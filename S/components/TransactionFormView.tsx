
import React, { useState, useMemo, useEffect } from 'react';
import { InventoryItem, TransactionType, Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertTriangle, Scan, Factory, ChevronDown } from 'lucide-react';

interface TransactionFormViewProps {
  type: TransactionType;
  inventory: InventoryItem[];
  transactions: Transaction[];
  onSubmit: (type: TransactionType, itemId: string, qty: number, manufacturer: string, note?: string) => void;
}

const TransactionFormView: React.FC<TransactionFormViewProps> = ({ type, inventory, transactions, onSubmit }) => {
  const [itemId, setItemId] = useState('');
  const [qty, setQty] = useState<number>(0);
  const [manufacturer, setManufacturer] = useState('');
  const [note, setNote] = useState('');

  const selectedItem = inventory.find(i => i.id === itemId);
  const isOutbound = type === TransactionType.OUTBOUND;

  // Auto-fill manufacturer from item data when item changes
  useEffect(() => {
    if (selectedItem) {
      setManufacturer(selectedItem.manufacturer);
    }
  }, [itemId, selectedItem]);

  const knownManufacturers = useMemo(() => {
    const fromHistory = transactions.map(t => t.manufacturer);
    const fromInventory = inventory.map(i => i.manufacturer);
    return Array.from(new Set([...fromHistory, ...fromInventory])).filter(Boolean);
  }, [transactions, inventory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || qty <= 0 || !manufacturer) {
      alert("请填写完整必填项（包括物料、数量和厂家）！");
      return;
    }
    onSubmit(type, itemId, qty, manufacturer, note);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className={`p-10 ${isOutbound ? 'bg-gradient-to-br from-orange-600 to-rose-600' : 'bg-gradient-to-br from-emerald-600 to-teal-600'} text-white`}>
          <div className="flex items-center gap-6 mb-2">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-inner">
              {isOutbound ? <ArrowUpRight size={40} /> : <ArrowDownLeft size={40} />}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">{isOutbound ? '物料出库登记' : '物料入库登记'}</h2>
              <p className="text-white/70 text-sm mt-1 font-medium">厂家将优先匹配物料主数据定义的分类厂家</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">1. 选择业务物料</label>
              <div className="relative">
                <select 
                  className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none text-slate-800 font-bold"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  required
                >
                  <option value="">-- 点击选择物料 SKU --</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>{item.name} [{item.sku}]</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={18} />
              </div>
              
              {selectedItem && (
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                      <Scan size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">当前系统库存量</p>
                      <p className="text-2xl font-black text-blue-900">{selectedItem.quantity} <span className="text-sm font-bold text-blue-500/60 uppercase">{selectedItem.unit}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">库位</p>
                    <p className="text-sm font-black text-blue-900">{selectedItem.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">2. 厂家 / 供应商 (自动匹配主数据)</label>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <Factory className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    list="known-manufacturers"
                    placeholder="手动输入或自动匹配"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 font-bold"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    required
                  />
                  <datalist id="known-manufacturers">
                    {knownManufacturers.map(m => <option key={m} value={m} />)}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">3. 业务变动数量</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-4xl font-black font-mono placeholder:text-slate-200"
                  placeholder="0"
                  value={qty || ''}
                  onChange={(e) => setQty(Number(e.target.value))}
                  required
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl uppercase">{selectedItem?.unit || 'Units'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">4. 业务备注</label>
              <textarea 
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 h-24 resize-none font-medium"
                placeholder="在此录入备注..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            {isOutbound && selectedItem && qty > selectedItem.quantity && (
              <div className="mb-6 flex items-center gap-3 text-rose-600 bg-rose-50 p-5 rounded-2xl border border-rose-100">
                <AlertTriangle size={24} />
                <span className="text-sm font-black uppercase">库存不足，无法出库</span>
              </div>
            )}
            <button 
              type="submit"
              disabled={isOutbound && selectedItem && qty > selectedItem.quantity}
              className={`w-full py-6 rounded-3xl text-white text-lg font-black flex items-center justify-center gap-3 shadow-2xl transition-all ${isOutbound ? 'bg-orange-600 hover:bg-orange-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            >
              <CheckCircle2 size={24} /> 确认提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormView;
