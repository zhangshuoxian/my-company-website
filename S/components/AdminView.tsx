
import React, { useState } from 'react';
import { Users, Tag, Package, Plus, Shield, CheckSquare, Trash2, Edit, ChevronRight, X, Lock, Save, Key } from 'lucide-react';
import { User, Category, InventoryItem, ViewType } from '../types';

interface AdminViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  currentUser: User;
}

const AdminView: React.FC<AdminViewProps> = ({ users, setUsers, categories, setCategories, inventory, setInventory, currentUser }) => {
  const [tab, setTab] = useState<'users' | 'categories' | 'products' | 'security'>('users');
  
  // States for Modals
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  
  // Security State
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  const allPermissions: { id: ViewType; label: string }[] = [
    { id: 'dashboard', label: '控制台' },
    { id: 'inventory', label: '实时库存' },
    { id: 'dynamic-inventory', label: '动态库存' },
    { id: 'inbound', label: '入库' },
    { id: 'outbound', label: '出库' },
    { id: 'history', label: '历史记录' },
    { id: 'ai-assistant', label: 'AI助手' },
    { id: 'admin', label: '后台管理' },
  ];

  // User CRUD
  const handleTogglePermission = (userId: string, perm: ViewType) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const hasPerm = u.permissions.includes(perm);
        return { ...u, permissions: hasPerm ? u.permissions.filter(p => p !== perm) : [...u.permissions, perm] };
      }
      return u;
    }));
  };

  const handleAddUser = () => {
    const name = prompt("输入新账户真实姓名:");
    const username = prompt("输入登录账户名:");
    if (name && username) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name,
        username,
        password: '123456',
        role: 'staff',
        permissions: ['dashboard', 'inventory']
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const resetStaffPassword = (userId: string) => {
    const newP = prompt("请输入该子账号的新密码:");
    if (newP) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newP } : u));
      alert("密码已重置");
    }
  };

  // Category CRUD
  const handleEditCategory = (cat: Category) => setEditingCat(cat);
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      setCategories(prev => {
        if (!editingCat.parentId) {
          return prev.map(c => c.id === editingCat.id ? editingCat : c);
        } else {
          return prev.map(c => {
            if (c.id === editingCat.parentId) {
              return { ...c, children: c.children?.map(sub => sub.id === editingCat.id ? editingCat : sub) };
            }
            return c;
          });
        }
      });
      setEditingCat(null);
    }
  };

  // Product CRUD
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setInventory(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    }
  };

  const handleAddProduct = () => {
    const name = prompt("物料名称:");
    const sku = prompt("SKU代码:");
    if (name && sku) {
      const newItem: InventoryItem = {
        id: `p-${Date.now()}`,
        sku,
        name,
        category: '未分类',
        categoryId: '',
        quantity: 0,
        unit: '个',
        minThreshold: 10,
        lastUpdated: new Date().toLocaleDateString(),
        location: '待分配',
        manufacturer: '通用厂家'
      };
      setInventory(prev => [...prev, newItem]);
    }
  };

  // Password Change Logic
  const handleUpdateAdminPwd = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = users.find(u => u.username === currentUser.username);
    if (admin && admin.password === oldPwd) {
      setUsers(prev => prev.map(u => u.username === currentUser.username ? { ...u, password: newPwd } : u));
      alert("密码修改成功！");
      setOldPwd('');
      setNewPwd('');
    } else {
      alert("原密码输入错误");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex bg-white p-2 rounded-3xl shadow-sm border border-slate-100 w-fit overflow-x-auto max-w-full">
        <button onClick={() => setTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${tab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Users size={16} /> 账号授权
        </button>
        <button onClick={() => setTab('categories')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${tab === 'categories' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Tag size={16} /> 品类定义
        </button>
        <button onClick={() => setTab('products')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${tab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Package size={16} /> 物料主数据
        </button>
        <button onClick={() => setTab('security')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${tab === 'security' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Lock size={16} /> 安全设置
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 min-h-[500px]">
        {tab === 'users' && (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">子账号权限管理</h3>
                <p className="text-sm text-slate-400 mt-1">管理系统成员访问模块的权限</p>
              </div>
              <button onClick={handleAddUser} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-lg">新增账号</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {users.map(user => (
                <div key={user.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800">{user.name} ({user.username})</h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-blue-100 text-blue-600`}>{user.role}</span>
                      </div>
                    </div>
                    {user.role !== 'admin' && (
                      <div className="flex gap-2">
                        <button onClick={() => resetStaffPassword(user.id)} className="px-4 py-2 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-200">重置密码</button>
                        <button onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={18}/></button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allPermissions.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => handleTogglePermission(user.id, p.id)}
                        disabled={user.role === 'admin'}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${user.permissions.includes(p.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400'}`}
                      >
                        <CheckSquare size={14}/> {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="space-y-8 animate-in slide-in-from-left-4">
             <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800">库存分类体系</h3>
               <button onClick={() => {
                 const name = prompt("新分类名称:");
                 if(name) setCategories(prev => [...prev, { id: `cat-${Date.now()}`, name, children: [] }]);
               }} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black">创建一级分类</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map(cat => (
                  <div key={cat.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-800 uppercase flex items-center gap-2">
                        <ChevronRight className="text-blue-600" size={18}/> {cat.name}
                      </h4>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingCat(cat)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                        <button onClick={() => setCategories(prev => prev.filter(c => c.id !== cat.id))} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {cat.children?.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm group">
                           <span className="text-xs font-bold text-slate-600">{sub.name}</span>
                           <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setEditingCat({...sub, parentId: cat.id})} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit size={14}/></button>
                             <button onClick={() => {
                               setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, children: c.children?.filter(s => s.id !== sub.id) } : c));
                             }} className="p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={14}/></button>
                           </div>
                        </div>
                      ))}
                      <button onClick={() => {
                        const name = prompt("子分类名称:");
                        if(name) setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, children: [...(c.children || []), { id: `sub-${Date.now()}`, name }] } : c));
                      }} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">添加二级分类</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="space-y-8 animate-in slide-in-from-left-4">
             <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800">库存物料主数据</h3>
               <button onClick={handleAddProduct} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black">定义新物料</button>
             </div>
             <div className="overflow-x-auto rounded-3xl border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">名称 & SKU</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">绑定分类</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">默认厂家</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">管理</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inventory.map(item => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800">{item.name}</p>
                           <p className="text-[10px] font-mono font-black text-slate-400">{item.sku}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-bold text-blue-600">{item.category}</td>
                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-600">{item.manufacturer}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => setEditingProduct(item)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                           <button onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="max-w-md space-y-8 animate-in slide-in-from-left-4">
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">管理员安全设置</h3>
             <form onSubmit={handleUpdateAdminPwd} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">验证旧密码</label>
                   <input 
                    type="password" 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={oldPwd}
                    onChange={e => setOldPwd(e.target.value)}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">设定新密码</label>
                   <input 
                    type="password" 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                   />
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                  <Key size={18}/> 更新访问凭证
                </button>
             </form>
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                 <h4 className="font-black text-sm uppercase">重命名分类</h4>
                 <button onClick={() => setEditingCat(null)}><X size={18}/></button>
              </div>
              <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
                 <input 
                   autoFocus
                   type="text" 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                   value={editingCat.name}
                   onChange={e => setEditingCat({...editingCat, name: e.target.value})}
                 />
                 <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">确认修改</button>
              </form>
           </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                 <h4 className="font-black text-sm uppercase tracking-widest">编辑物料核心数据</h4>
                 <button onClick={() => setEditingProduct(null)}><X size={20}/></button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-8 grid grid-cols-2 gap-6">
                 <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">物料名称</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">品类绑定</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={editingProduct.categoryId} onChange={e => {
                      const cid = e.target.value;
                      let cname = '未分类';
                      categories.forEach(p => {
                        if(p.id === cid) cname = p.name;
                        p.children?.forEach(s => { if(s.id === cid) cname = s.name; });
                      });
                      setEditingProduct({...editingProduct, categoryId: cid, category: cname});
                    }}>
                      <option value="">选择分类</option>
                      {categories.map(c => (
                        <optgroup label={c.name} key={c.id}>
                           <option value={c.id}>{c.name} (一级)</option>
                           {c.children?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">默认厂家</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={editingProduct.manufacturer} onChange={e => setEditingProduct({...editingProduct, manufacturer: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">计量单位</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={editingProduct.unit} onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">报警阈值</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={editingProduct.minThreshold} onChange={e => setEditingProduct({...editingProduct, minThreshold: Number(e.target.value)})}/>
                 </div>
                 <button type="submit" className="col-span-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase shadow-xl shadow-blue-200 mt-4 flex items-center justify-center gap-2">
                   <Save size={18}/> 确认保存主数据
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
