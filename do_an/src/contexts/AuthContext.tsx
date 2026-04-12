import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
  login: async (username: string, password: string) => {
  if (!username.trim() || !password.trim()) {
    throw new Error('Tên đăng nhập và mật khẩu là bắt buộc');
  }

  const res = await fetch('https://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Sai tài khoản hoặc mật khẩu');
  }

  const data = await res.json();

  // lưu token hoặc user thật
  localStorage.setItem('token', data.token || 'real-token');
  setIsAuthenticated(true);
},
register: async (username: string, password: string) => {
  if (!username.trim() || !password.trim()) {
    throw new Error('Tên đăng nhập và mật khẩu là bắt buộc');
  }

  const res = await fetch('https://localhost:5001/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Đăng ký thất bại');
  }
},
      logout: () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
