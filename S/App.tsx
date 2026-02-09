
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Package, ArrowDownLeft, ArrowUpRight, History, 
  Sparkles, Menu, Bell, User as UserIcon, LogOut, Settings, Timer
} from 'lucide-react';
import { InventoryItem, Transaction, ViewType, TransactionType, User, Category } from './types';
import { INITIAL_INVENTORY, INITIAL_TRANSACTIONS, INITIAL_USERS, INITIAL_CATEGORIES } from './constants';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import TransactionFormView from './components/TransactionFormView';
import HistoryView from './components/HistoryView';
import AIAssistantView from './components/AIAssistantView';
import DynamicInventoryView from './components/DynamicInventoryView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(() => INITIAL_USERS.map(u => ({ ...u, password: '123456' })));
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const lowStockItems = useMemo(() => 
    inventory.filter(item => item.quantity <= item.minThreshold),
    [inventory]
  );

  const handleTransaction = (type: TransactionType, itemId: string, qty: number, manufacturer: string, note?: string) => {
    if (!currentUser) return;
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    if (type === TransactionType.OUTBOUND && item.quantity < qty) {
      alert("库存不足！");
      return;
    }

    const newQty = type === TransactionType.INBOUND 
      ? item.quantity + qty 
      : item.quantity - qty;

    const timestamp = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      itemId,
      itemName: item.name,
      type,
      quantity: qty,
      operator: currentUser.name,
      manufacturer,
      timestamp,
      note
    };

    setInventory(prev => prev.map(i => 
      i.id === itemId ? { ...i, quantity: newQty, lastUpdated: newTransaction.timestamp } : i
    ));
    setTransactions(prev => [newTransaction, ...prev]);
    setActiveView('dashboard');
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  if (!currentUser) {
    return <LoginView users={users} onLogin={setCurrentUser} />;
  }

  const allMenuItems = [
    { id: 'dashboard', label: '控制台', icon: <LayoutDashboard size={20} /> },
    { id: 'inventory', label: '实时库存', icon: <Package size={20} /> },
    { id: 'dynamic-inventory', label: '动态库存', icon: <Timer size={20} /> },
    { id: 'inbound', label: '入库操作', icon: <ArrowDownLeft size={20} /> },
    { id: 'outbound', label: '出库操作', icon: <ArrowUpRight size={20} /> },
    { id: 'history', label: '操作历史', icon: <History size={20} /> },
    { id: 'ai-assistant', label: 'AI 智库', icon: <Sparkles size={20} /> },
    { id: 'admin', label: '后台系统', icon: <Settings size={20} />, role: 'admin' },
  ];

  const menuItems = allMenuItems.filter(item => 
    currentUser.permissions.includes(item.id as ViewType) && 
    (!item.role || item.role === currentUser.role)
  );

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Package size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">智流 WMS</span>}
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                  {currentUser.name[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{currentUser.role === 'admin' ? '系统管理员' : '仓库员'}</p>
                </div>
              </div>
              <button onClick={() => setCurrentUser(null)} className="text-slate-400 hover:text-rose-500">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
             <button onClick={() => setCurrentUser(null)} className="w-full flex justify-center p-2 text-slate-400 hover:text-rose-500"><LogOut size={20} /></button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all">
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {allMenuItems.find(m => m.id === activeView)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl relative transition-all">
              <Bell size={20} />
              {lowStockItems.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>}
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">主仓库 A 区</p>
              <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'long' })}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#F4F7FE]">
          {activeView === 'dashboard' && <DashboardView inventory={inventory} transactions={transactions} lowStockItems={lowStockItems} onNavigate={setActiveView} />}
          {activeView === 'inventory' && <InventoryView inventory={inventory} transactions={transactions} categories={categories} onUpdateItem={updateInventoryItem} />}
          {activeView === 'dynamic-inventory' && <DynamicInventoryView transactions={transactions} inventory={inventory} />}
          {activeView === 'inbound' && <TransactionFormView type={TransactionType.INBOUND} inventory={inventory} onSubmit={handleTransaction} transactions={transactions} />}
          {activeView === 'outbound' && <TransactionFormView type={TransactionType.OUTBOUND} inventory={inventory} onSubmit={handleTransaction} transactions={transactions} />}
          {activeView === 'history' && <HistoryView transactions={transactions} />}
          {activeView === 'ai-assistant' && <AIAssistantView inventory={inventory} transactions={transactions} />}
          {activeView === 'admin' && (
            <AdminView 
              users={users} 
              setUsers={setUsers} 
              categories={categories} 
              setCategories={setCategories} 
              inventory={inventory} 
              setInventory={setInventory} 
              currentUser={currentUser}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
