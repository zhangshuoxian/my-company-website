
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { Search, Download, Calendar, Filter, ChevronDown } from 'lucide-react';

interface HistoryViewProps {
  transactions: Transaction[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<string>('全部类型');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === '全部类型' || 
                         (filterType === '入库' && t.type === TransactionType.INBOUND) || 
                         (filterType === '出库' && t.type === TransactionType.OUTBOUND);
      const matchesSearch = t.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.operator.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || t.timestamp.startsWith(dateFilter);
      return matchesType && matchesSearch && matchesDate;
    });
  }, [transactions, filterType, searchTerm, dateFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">库房操作审计日志</h2>
          <button className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl">
            <Download size={18} />
            批量导出
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索物料、厂家..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="date"
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>全部类型</option>
              <option>入库</option>
              <option>出库</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作时间</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">业务类型</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">物料 & 厂家</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">变动数量</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">经办人员</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">备注摘要</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6 text-xs text-slate-500 font-bold">{t.timestamp}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${
                      t.type === TransactionType.INBOUND 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {t.type === TransactionType.INBOUND ? '入库' : '出库'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-800">{t.itemName}</p>
                    <p className="text-[10px] font-black text-blue-600 uppercase mt-0.5">{t.manufacturer}</p>
                  </td>
                  <td className="px-8 py-6 text-center font-black font-mono">
                    {t.type === TransactionType.INBOUND ? '+' : '-'}{t.quantity}
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-600 font-bold uppercase">{t.operator}</td>
                  <td className="px-8 py-6 text-xs text-slate-400 italic max-w-xs truncate">{t.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
