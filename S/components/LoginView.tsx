
import React, { useState } from 'react';
import { User, Lock, Package, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginViewProps {
  users: UserType[];
  onLogin: (user: UserType) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError('账户或密码错误（默认密码：123456）');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white p-10 space-y-8 animate-in zoom-in-95 duration-700">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-500/40 mb-6 transform -rotate-6">
              <Package size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">智流 WMS</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">企业级数字化仓储管理系统</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">账户名称</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                  placeholder="admin 或 staff1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">访问密码</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                  placeholder="默认 123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 font-bold text-center animate-bounce">{error}</p>}

            <button 
              type="submit" 
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg shadow-2xl hover:bg-blue-600 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group transform active:scale-95"
            >
              登录系统
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase">Version</p>
              <p className="text-xs font-bold text-slate-400">v2.5.0</p>
            </div>
            <div className="h-4 w-px bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase">Status</p>
              <p className="text-xs font-bold text-emerald-500 uppercase">System Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
