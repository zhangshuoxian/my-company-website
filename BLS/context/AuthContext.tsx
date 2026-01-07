import React, { createContext, useContext, useState, useEffect } from 'react';
// 👇 确保这里引入了 UserStatus 和 UserRole
import { UserAccount, LoginLog, UserStatus, UserRole } from '../types';

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

const hashPassword = async (str: string) => {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const getMockIP = () => {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('bls_users');
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    }
    const session = sessionStorage.getItem('bls_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  const saveUsers = (users: UserAccount[]) => {
    setAllUsers(users);
    localStorage.setItem('bls_users', JSON.stringify(users));
  };

  const login = async (account: string, pass: string): Promise<{ success: boolean; msg: string }> => {
    const ip = getMockIP();
    const time = new Date().toLocaleString();

    if (account === SUPER_ADMIN_USER) {
      if (pass === SUPER_ADMIN_PASS) {
        const adminUser: UserAccount = {
          id: 'super_admin', email: SUPER_ADMIN_USER, passwordHash: 'protected', 
          role: 'super_admin', status: 'active', failedAttempts: 0, logs: [], applyDate: '-'
        };
        setCurrentUser(adminUser);
        sessionStorage.setItem('bls_session', JSON.stringify(adminUser));
        return { success: true, msg: '管理员登录成功' };
      } else {
        return { success: false, msg: '管理员密码错误' };
      }
    }

    const users = [...allUsers];
    const userIndex = users.findIndex(u => u.email === account);

    if (userIndex === -1) {
      return { success: false, msg: '账号不存在或未申请' };
    }

    const user = users[userIndex];

    if (user.status === 'pending') return { success: false, msg: '账号审核中，请联系管理员' };
    if (user.status === 'locked') return { success: false, msg: '账号已锁定，请联系管理员' };

    const inputHash = await hashPassword(pass);
    if (inputHash === user.passwordHash) {
      user.failedAttempts = 0;
      user.logs.unshift({ date: time, ip, success: true });
      saveUsers(users);
      setCurrentUser(user);
      sessionStorage.setItem('bls_session', JSON.stringify(user));
      return { success: true, msg: '登录成功' };
    } else {
      user.failedAttempts += 1;
      user.logs.unshift({ date: time, ip, success: false });
      if (user.failedAttempts >= 5) {
        user.status = 'locked';
        saveUsers(users);
        return { success: false, msg: '密码错误5次，账号已锁定！' };
      }
      saveUsers(users);
      return { success: false, msg: `密码错误！剩余尝试次数：${5 - user.failedAttempts}` };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('bls_session');
  };

  const registerSubAccount = async (email: string, pass: string): Promise<boolean> => {
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
    saveUsers([...allUsers, newUser]);
    return true;
  };

  const verifyEmailCode = (email: string, code: string) => {
    return code === '888888';
  };

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