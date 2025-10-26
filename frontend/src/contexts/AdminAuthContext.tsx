"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
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

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomapp-backend.onrender.com';

  // Admin kontrolü
  const isAdmin = user?.role === 'SUPER_ADMIN';

  // Login fonksiyonu
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user.role === 'SUPER_ADMIN') {
        // Token ve kullanıcı bilgilerini kaydet
        setToken(data.token);
        setUser(data.user);
        
        // LocalStorage'a kaydet
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        return true;
      } else {
        throw new Error('Admin yetkisi gerekli');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout fonksiyonu
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin-login');
  }, [router]);

  // Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('admin_token');
        const savedUser = localStorage.getItem('admin_user');
        
        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Admin kontrolü
          if (userData.role === 'SUPER_ADMIN') {
            setToken(savedToken);
            setUser(userData);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [logout]);

  // API istekleri için token ekleme
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const value: AdminAuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// API helper fonksiyonu
export const adminApiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('admin_token');
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://roomapp-backend.onrender.com'}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token geçersizse logout
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin-login';
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  // Tenant endpoints
  async getTenants() {
    return this.request('/api/admin/tenants');
  },

  async createTenant(data: any) {
    return this.request('/api/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Feature endpoints
  async getTenantFeatures(tenantId: string) {
    return this.request(`/api/admin/tenants/${tenantId}/features`);
  },

  async updateTenantFeature(tenantId: string, featureKey: string, enabled: boolean, config?: any) {
    return this.request(`/api/admin/tenants/${tenantId}/features`, {
      method: 'POST',
      body: JSON.stringify({
        featureKey,
        enabled,
        config
      })
    });
  },

  async bulkUpdateFeatures(tenantIds: string[], featureKey: string, enabled: boolean, config?: any) {
    return this.request('/api/admin/features/bulk-update', {
      method: 'POST',
      body: JSON.stringify({
        tenantIds,
        featureKey,
        enabled,
        config
      })
    });
  },

  async getAvailableFeatures() {
    return this.request('/api/admin/features/available');
  }
};
