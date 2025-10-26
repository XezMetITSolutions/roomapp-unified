"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  hotel: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (pageName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Sayfa bazlı yetki kontrolü
  const hasPermission = (pageName: string): boolean => {
    return user?.permissions?.includes(pageName) || false;
  };

  // Login fonksiyonu
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock authentication - gerçek API yerine
      const mockUsers = [
        {
          email: 'admin@hotel.com',
          password: 'admin123',
          user: {
            id: '1',
            email: 'admin@hotel.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            permissions: ['dashboard', 'analytics', 'menu', 'users', 'announcements', 'qr-kod', 'notifications', 'settings', 'support'],
            tenant: {
              id: 'demo-tenant',
              name: 'Demo İşletme',
              slug: 'demo'
            },
            hotel: {
              id: 'demo-hotel',
              name: 'Demo Otel'
            }
          }
        },
        {
          email: 'manager@hotel.com',
          password: 'manager123',
          user: {
            id: '2',
            email: 'manager@hotel.com',
            firstName: 'Manager',
            lastName: 'User',
            role: 'MANAGER',
            permissions: ['dashboard', 'menu', 'announcements', 'qr-kod', 'notifications'],
            tenant: {
              id: 'demo-tenant',
              name: 'Demo İşletme',
              slug: 'demo'
            },
            hotel: {
              id: 'demo-hotel',
              name: 'Demo Otel'
            }
          }
        },
        {
          email: 'reception@hotel.com',
          password: 'reception123',
          user: {
            id: '3',
            email: 'reception@hotel.com',
            firstName: 'Reception',
            lastName: 'User',
            role: 'RECEPTION',
            permissions: ['dashboard', 'qr-kod', 'notifications'],
            tenant: {
              id: 'demo-tenant',
              name: 'Demo İşletme',
              slug: 'demo'
            },
            hotel: {
              id: 'demo-hotel',
              name: 'Demo Otel'
            }
          }
        }
      ];

      // Mock kullanıcıyı bul
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error('Geçersiz email veya şifre');
      }

      // Mock token oluştur
      const mockToken = `mock-token-${Date.now()}`;
      
      // Token ve kullanıcı bilgilerini kaydet
      setToken(mockToken);
      setUser(mockUser.user);
      
      // LocalStorage'a kaydet
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser.user));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout fonksiyonu
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  }, [router]);

  // Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_data');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Mock token kontrolü - her zaman geçerli
          if (!savedToken.startsWith('mock-token-')) {
            // Token geçersizse temizle
            logout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
