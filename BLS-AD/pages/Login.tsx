import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock, Mail, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, registerSubAccount, verifyEmailCode } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true); // 切换登录/注册
  const [formData, setFormData] = useState({ account: '', password: '', confirmPass: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 模拟验证码发送状态
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- 登录逻辑 ---
        const res = await login(formData.account, formData.password);
        if (res.success) {
          navigate('/admin');
        } else {
          setError(res.msg);
        }
      } else {
        // --- 注册逻辑 ---
        if (formData.password !== formData.confirmPass) {
          setError('两次密码输入不一致');
          setLoading(false); return;
        }
        // 校验验证码
        if (!verifyEmailCode(formData.account, formData.code)) {
          setError('验证码错误 (测试请输入 888888)');
          setLoading(false); return;
        }
        
        const success = await registerSubAccount(formData.account, formData.password);
        if (success) {
          alert('申请已提交！请等待管理员审核。');
          setIsLogin(true); // 回到登录页
        } else {
          setError('该邮箱已被注册');
        }
      }
    } catch (err) {
      setError('系统错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const sendCode = () => {
    if(!formData.account.includes('@')) { setError('请输入正确的邮箱'); return; }
    setCodeSent(true);
    alert(`验证码已发送至 ${formData.account}\n(模拟环境：验证码为 888888)`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white">
        
        {/* 头部 */}
        <div className="bg-brand-blue p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-20 transform rotate-12 scale-150"></div>
          <div className="relative z-10">
            <ShieldCheck size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-black uppercase tracking-widest">
              {isLogin ? 'BLS Admin Portal' : 'Apply Sub-Account'}
            </h2>
            <p className="text-blue-100 text-xs font-bold mt-2">
              {isLogin ? 'Secure Access System' : 'Employee Registration'}
            </p>
          </div>
        </div>

        {/* 表单 */}
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 账号/邮箱 */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 pl-2">
                {isLogin ? 'Account / Email' : 'Email Address'}
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 focus:border-brand-blue outline-none transition-all"
                  value={formData.account}
                  onChange={e => setFormData({...formData, account: e.target.value})}
                  placeholder={isLogin ? "Username or Email" : "company@email.com"}
                />
              </div>
            </div>

            {/* 注册时的验证码 */}
            {!isLogin && (
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 focus:border-brand-blue outline-none"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    placeholder="Verify Code"
                  />
                </div>
                <button type="button" onClick={sendCode} disabled={codeSent} className="bg-blue-50 text-brand-blue font-black text-xs px-4 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50">
                  {codeSent ? '已发送' : '获取验证码'}
                </button>
              </div>
            )}

            {/* 密码 */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 pl-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 focus:border-brand-blue outline-none transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* 注册确认密码 */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 pl-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 focus:border-brand-blue outline-none transition-all"
                    value={formData.confirmPass}
                    onChange={e => setFormData({...formData, confirmPass: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold flex items-center animate-pulse">
                <AlertTriangle size={16} className="mr-2" /> {error}
              </div>
            )}

            <button disabled={loading} className="w-full bg-brand-blue text-white py-4 rounded-xl font-black text-sm shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center">
              {loading ? 'Processing...' : (isLogin ? 'Login System' : 'Submit Application')} <ArrowRight size={18} className="ml-2"/>
            </button>

          </form>

          <div className="mt-8 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs font-bold text-gray-400 hover:text-brand-blue transition-colors underline decoration-2 underline-offset-4">
              {isLogin ? '申请子账号 (Apply Sub-Account)' : '返回登录 (Back to Login)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;