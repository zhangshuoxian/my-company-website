
import React, { useState } from 'react';
import { Package, ArrowDownLeft, ArrowUpRight, AlertCircle, Clock, X } from 'lucide-react';
import { InventoryItem, Transaction, TransactionType, ViewType } from '../types';

interface DashboardViewProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  lowStockItems: InventoryItem[];
  onNavigate: (view: ViewType) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ inventory, transactions, lowStockItems, onNavigate }) => {
  const [activeStat, setActiveStat] = useState<string | null>(null);

  const stats = [
    { id: 'total', label: '总库存种类', value: inventory.length, icon: <Package />, color: 'blue' },
    { id: 'in', label: '今日入库', value: transactions.filter(t => t.type === TransactionType.INBOUND).length, icon: <ArrowDownLeft />, color: 'emerald' },
    { id: 'out', label: '今日出库', value: transactions.filter(t => t.type === TransactionType.OUTBOUND).length, icon: <ArrowUpRight />, color: 'orange' },
    { id: 'alert', label: '库存预警', value: lowStockItems.length, icon: <AlertCircle />, color: 'rose' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Floating Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <button 
            key={stat.id}
            onClick={() => setActiveStat(activeStat === stat.id ? null : stat.id)}
            className={`group relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-xl hover:-translate-y-1 ${activeStat === stat.id ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : ''}`}
          >
            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 transition-colors group-hover:bg-${stat.color}-600 group-hover:text-white`}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 leading-none">{stat.value}</h3>
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 group-hover:text-slate-500 uppercase tracking-tighter">Click to expand</div>
          </button>
        ))}
      </div>

      {/* Stat Detail Overlay (Floating Panel) */}
      {activeStat && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
          <button onClick={() => setActiveStat(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
          
          <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             {stats.find(s => s.id === activeStat)?.label} 实时详情
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
            {activeStat === 'total' && inventory.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-slate-500 mt-1">{item.sku} • {item.manufacturer}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">库存: {item.quantity} {item.unit}</span>
                  <span className="text-[10px] text-slate-400">{item.location}</span>
                </div>
              </div>
            ))}
            {activeStat === 'in' && transactions.filter(t => t.type === TransactionType.INBOUND).map(t => (
              <div key={t.id} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="font-bold text-emerald-900 text-sm truncate">{t.itemName}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-bold text-emerald-600">+{t.quantity}</span>
                  <span className="text-[10px] text-slate-400">{t.timestamp}</span>
                </div>
              </div>
            ))}
            {activeStat === 'alert' && lowStockItems.map(item => (
              <div key={item.id} className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="font-bold text-rose-900 text-sm truncate">{item.name}</p>
                <p className="text-xs text-rose-600 mt-1">剩余: {item.quantity} / 阈值: {item.minThreshold}</p>
                <button 
                  onClick={() => onNavigate('inbound')}
                  className="mt-3 w-full py-2 bg-rose-600 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest"
                >
                  立即补货
                </button>
              </div>
            ))}
            {activeStat === 'out' && transactions.filter(t => t.type === TransactionType.OUTBOUND).map(t => (
              <div key={t.id} className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="font-bold text-orange-900 text-sm truncate">{t.itemName}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-bold text-orange-600">-{t.quantity}</span>
                  <span className="text-[10px] text-slate-400">{t.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Activity and AI summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              最近库房动态
            </h3>
            <button onClick={() => onNavigate('history')} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">全库历史明细</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 6).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${t.type === TransactionType.INBOUND ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    {t.type === TransactionType.INBOUND ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.itemName}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.manufacturer} • {t.operator}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black font-mono ${t.type === TransactionType.INBOUND ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {t.type === TransactionType.INBOUND ? '+' : '-'}{t.quantity}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.timestamp.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">仓库状态摘要</h3>
              <p className="text-xs text-slate-400">最后更新: 刚刚</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">库存利用率</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black">78.5%</span>
                <span className="text-emerald-400 text-xs font-bold">+2.4% ↑</span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[78.5%] rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-400 mb-1">活跃 SKU</p>
                <p className="text-xl font-bold">{inventory.length}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-400 mb-1">待出库</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('ai-assistant')} className="mt-8 w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
            AI 智能分析报告
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
