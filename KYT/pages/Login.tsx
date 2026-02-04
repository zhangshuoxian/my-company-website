import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';

// 安全配置常量
const ADMIN_USER = 'KYTAdmin';
const ADMIN_PASS = 'KYTKYT123';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 24 * 60 * 60 * 1000; // 24小时 (毫秒)

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useAppContext();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    checkLockStatus();
  }, []);

  // 检查是否被锁定
  const checkLockStatus = () => {
    const securityData = JSON.parse(localStorage.getItem('admin_security') || '{"attempts": 0, "lockUntil": 0}');
    const now = Date.now();

    if (securityData.lockUntil > now) {
      setIsLocked(true);
      const waitHours = Math.ceil((securityData.lockUntil - now) / (1000 * 60 * 60));
      setError(`安全警告：尝试次数过多，账户已锁定。请在 ${waitHours} 小时后重试。`);
      return true;
    } else if (securityData.lockUntil !== 0 && securityData.lockUntil <= now) {
      // 锁定时间已过，重置
      localStorage.setItem('admin_security', JSON.stringify({ attempts: 0, lockUntil: 0 }));
      setIsLocked(false);
      setError('');
    }
    return false;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkLockStatus()) return;

    // 读取当前安全状态
    const securityData = JSON.parse(localStorage.getItem('admin_security') || '{"attempts": 0, "lockUntil": 0}');

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // 登录成功
      localStorage.setItem('is_admin_logged_in', 'true');
      // 重置尝试次数
      localStorage.setItem('admin_security', JSON.stringify({ attempts: 0, lockUntil: 0 }));
      navigate('/admin');
    } else {
      // 登录失败
      const newAttempts = securityData.attempts + 1;
      let newLockUntil = 0;
      let errorMsg = `账号或密码错误。剩余尝试次数：${MAX_ATTEMPTS - newAttempts}`;

      if (newAttempts >= MAX_ATTEMPTS) {
        newLockUntil = Date.now() + LOCKOUT_TIME;
        errorMsg = '错误次数已达上限，系统已锁定 24 小时。';
        setIsLocked(true);
      }

      localStorage.setItem('admin_security', JSON.stringify({ 
        attempts: newAttempts, 
        lockUntil: newLockUntil 
      }));
      
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">安全管理后台</h2>
          <p className="text-blue-100 text-sm mt-2">Security Administration</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">管理员账号</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isLocked}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                placeholder="请输入账号"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">安全密码</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLocked}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                placeholder="请输入密码"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLocked}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isLocked ? '系统已锁定' : '立即登录'}
          </button>
        </form>
        <div className="bg-gray-50 p-4 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-blue-600 font-bold">返回首页</button>
        </div>
      </div>
    </div>
  );
};