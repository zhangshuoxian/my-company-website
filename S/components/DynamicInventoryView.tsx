
import React, { useState, useMemo } from 'react';
import { Calendar, Search, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { Transaction, InventoryItem, TransactionType } from '../types';

interface DynamicInventoryViewProps {
  transactions: Transaction[];
  inventory: InventoryItem[];
}

const DynamicInventoryView: React.FC<DynamicInventoryViewProps> = ({ transactions, inventory }) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState('');

  const consolidatedData = useMemo(() => {
    const filtered = transactions.filter(t => {
      // Normalize date format from transaction (2024-05-20 14:30)
      const transDate = t.timestamp.split(' ')[0];
      const matchesDate = transDate >= startDate && transDate <= endDate;
      const matchesSearch = t.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });

    // Grouping logic: Group by Date + ItemID + Manufacturer
    const groups: Record<string, {
      id: string;
      itemName: string;
      manufacturer: string;
      date: string;
      inbound: number;
      outbound: number;
    }> = {};

    filtered.forEach(t => {
      const dateStr = t.timestamp.split(' ')[0];
      const groupKey = `${dateStr}_${t.itemId}_${t.manufacturer}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: groupKey,
          itemName: t.itemName,
          manufacturer: t.manufacturer,
          date: dateStr,
          inbound: 0,
          outbound: 0
        };
      }

      if (t.type === TransactionType.INBOUND) {
        groups[groupKey].inbound += t.quantity;
      } else if (t.type === TransactionType.OUTBOUND) {
        groups[groupKey].outbound += t.quantity;
      }
    });

    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, startDate, endDate, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-700"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <span className="text-slate-400 text-xs font-bold px-2">至</span>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-700"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="检索产品或厂家..." 
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">
          <Download size={18} />
          导出记录
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-500/20">
             <div className="relative z-10">
               <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">时段内总入库</p>
               <h4 className="text-4xl font-black">{consolidatedData.reduce((acc, curr) => acc + curr.inbound, 0)}</h4>
             </div>
             <ArrowDownLeft className="absolute -bottom-6 -right-6 text-white/10" size={160} />
          </div>
          <div className="bg-orange-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-orange-500/20">
             <div className="relative z-10">
               <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">时段内总出库</p>
               <h4 className="text-4xl font-black">{consolidatedData.reduce((acc, curr) => acc + curr.outbound, 0)}</h4>
             </div>
             <ArrowUpRight className="absolute -bottom-6 -right-6 text-white/10" size={160} />
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">产品</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">厂家 / 供应商</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">变动时间</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">入库合计</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">出库合计</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {consolidatedData.map(row => (
                   <tr key={row.id} className="hover:bg-slate-50/80 transition-all">
                     <td className="px-8 py-6 font-bold text-slate-800 text-sm">{row.itemName}</td>
                     <td className="px-8 py-6">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase">{row.manufacturer}</span>
                     </td>
                     <td className="px-8 py-6 text-center text-xs text-slate-400 font-bold">{row.date}</td>
                     <td className="px-8 py-6 text-center">
                        <span className={`text-sm font-black font-mono ${row.inbound > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                          {row.inbound > 0 ? `+${row.inbound}` : '0'}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-center">
                        <span className={`text-sm font-black font-mono ${row.outbound > 0 ? 'text-orange-600' : 'text-slate-300'}`}>
                          {row.outbound > 0 ? `-${row.outbound}` : '0'}
                        </span>
                     </td>
                   </tr>
                 ))}
                 {consolidatedData.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-8 py-20 text-center text-slate-300 italic">
                        该时段暂无变动记录
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicInventoryView;
