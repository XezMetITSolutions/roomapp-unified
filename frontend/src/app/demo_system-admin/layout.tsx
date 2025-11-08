"use client";

import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Building2, Users, Settings, LogOut, Menu, X, BarChart3, Crown, Sparkles, Bell, CreditCard, Headphones, Rocket, TrendingUp } from 'lucide-react';
import { useState } from 'react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading, isAdmin } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin-login');
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const mainMenu = [
    { name: 'Dashboard', href: '/system-admin', icon: BarChart3 },
    { name: 'İşletme Yönetimi', href: '/system-admin/tenants', icon: Building2 },
    { name: 'Plan Yönetimi', href: '/system-admin/plans', icon: Crown },
    { name: 'Özellik Yönetimi', href: '/system-admin/features', icon: Sparkles },
    { name: 'Bildirimler', href: '/system-admin/notifications', icon: Bell },
  ];

  const reportsMenu = [
    { name: 'Abonelik Yönetimi', href: '/system-admin/subscriptions', icon: CreditCard },
    { name: 'Destek Talepleri', href: '/system-admin/support', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-bold text-gray-900">roomxqr</span>
                <p className="text-xs text-gray-600">Süper Yönetici</p>
              </div>
                </div>
            <nav className="mt-5 px-2 space-y-1">
              <div className="mb-4">
                <div className="flex items-center mb-2 px-2">
                  <Rocket className="h-3 w-3 text-gray-500 mr-2" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">ANA MENÜ</span>
                </div>
                {mainMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center mb-2 px-2">
                  <TrendingUp className="h-3 w-3 text-gray-500 mr-2" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">RAPORLAR & ANALİTİK</span>
                </div>
                {reportsMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
                </div>
              </div>
            </div>
            
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 border-r border-purple-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Branding */}
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-bold text-purple-200">roomxqr</span>
                <p className="text-xs text-purple-300">Süper Yönetici</p>
              </div>
            </div>

            {/* ANA MENÜ */}
            <div className="px-4 mb-4">
              <div className="flex items-center mb-3">
                <Rocket className="h-3 w-3 text-gray-400 mr-2" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ANA MENÜ</span>
              </div>
              <nav className="space-y-1">
                {mainMenu.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-gray-300 hover:bg-purple-800/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* RAPORLAR & ANALİTİK */}
            <div className="px-4 mt-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-3 w-3 text-gray-400 mr-2" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">RAPORLAR & ANALİTİK</span>
              </div>
              <nav className="space-y-1">
                {reportsMenu.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-gray-300 hover:bg-purple-800/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-purple-800 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-auto flex items-center text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
            <button
              type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
              </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}