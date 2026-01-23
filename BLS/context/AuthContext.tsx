import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserStatus, UserRole } from '../types';

// 超级管理员配置
const SUPER_ADMIN_USER = 'BLSAdmin0';
const SUPER_ADMIN_PASS = 'BLS..001122';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; msg: string }>;
  logout: () => void;
  registerSubAccount: (email: string, pass: string) => Promise<boolean>;
  verifyEmailCode: (email: string, code: string) => boolean;
  allUsers: UserAccount[];
  approveUser: (id: string) => void;
  unlockUser: (id: string) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🟢 修复点：使用简易加密，防止“系统错误”崩溃
const hashPassword = async (str: string) => {
  // 简单的 Base64 模拟加密，确保任何浏览器都能运行
  return btoa(unescape(encodeURIComponent(str + '_bls_secure')));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);

  // 1. 初始化
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('bls_users');
      if (storedUsers) setAllUsers(JSON.parse(storedUsers));
      
      const session = sessionStorage.getItem('bls_session');
      if (session) setCurrentUser(JSON.parse(session));
    } catch (e) {
      console.error("加载数据失败", e);
    }
  }, []);

  // 2. 保存工具
  const saveUsers = (users: UserAccount[]) => {
    setAllUsers(users);
    localStorage.setItem('bls_users', JSON.stringify(users));
  };

  // 3. 登录
  const login = async (account: string, pass: string): Promise<{ success: boolean; msg: string }> => {
    // 超管
    if (account === SUPER_ADMIN_USER) {
      if (pass === SUPER_ADMIN_PASS) {
        const adminUser: UserAccount = {
          id: 'super_admin', email: SUPER_ADMIN_USER, passwordHash: 'ADMIN', 
          role: 'super_admin', status: 'active', failedAttempts: 0, logs: [], applyDate: '-'
        };
        setCurrentUser(adminUser);
        sessionStorage.setItem('bls_session', JSON.stringify(adminUser));
        return { success: true, msg: '管理员登录成功' };
      }
      return { success: false, msg: '管理员密码错误' };
    }

    // 普通用户
    const users = [...allUsers];
    const user = users.find(u => u.email === account);
    
    if (!user) return { success: false, msg: '账号不存在' };
    if (user.status === 'pending') return { success: false, msg: '账号待审核' };
    if (user.status === 'locked') return { success: false, msg: '账号已锁定' };

    const inputHash = await hashPassword(pass);
    if (inputHash === user.passwordHash) {
      user.failedAttempts = 0;
      user.logs.unshift({ date: new Date().toLocaleString(), ip: '127.0.0.1', success: true });
      saveUsers(users);
      setCurrentUser(user);
      sessionStorage.setItem('bls_session', JSON.stringify(user));
      return { success: true, msg: '登录成功' };
    } else {
      user.failedAttempts += 1;
      if (user.failedAttempts >= 5) user.status = 'locked';
      saveUsers(users);
      return { success: false, msg: '密码错误' };
    }
  };

  // 4. 退出
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('bls_session');
  };

  // 5. 🟢 修复点：确保注册不报错
  const registerSubAccount = async (email: string, pass: string): Promise<boolean> => {
    try {
      if (allUsers.find(u => u.email === email)) return false;
      
      const passHash = await hashPassword(pass);
      const newUser: UserAccount = {
        id: `u_${Date.now()}`,
        email,
        passwordHash: passHash,
        role: 'sub_admin',
        status: 'pending',
        failedAttempts: 0,
        logs: [],
        applyDate: new Date().toLocaleString()
      };
      
      // 这里的 log 可以帮你确认代码是否执行到了
      console.log("正在保存新用户:", newUser);
      
      const newUsersList = [...allUsers, newUser];
      saveUsers(newUsersList);
      return true;
    } catch (e) {
      console.error("注册过程出错:", e);
      return false;
    }
  };

  const verifyEmailCode = (email: string, code: string) => code === '888888';

  const approveUser = (id: string) => {
    const updated = allUsers.map(u => u.id === id ? { ...u, status: 'active' as UserStatus } : u);
    saveUsers(updated);
  };

  const unlockUser = (id: string) => {
    const updated = allUsers.map(u => u.id === id ? { ...u, status: 'active' as UserStatus, failedAttempts: 0 } : u);
    saveUsers(updated);
  };

  const deleteUser = (id: string) => {
    const updated = allUsers.filter(u => u.id !== id);
    saveUsers(updated);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, isAdmin: currentUser?.role === 'super_admin', 
      login, logout, registerSubAccount, verifyEmailCode,
      allUsers, approveUser, unlockUser, deleteUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};