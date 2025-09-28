'use client';

import { useState, useEffect } from 'react';
import { useHotelStore } from '@/store/hotelStore';
import { packages, sampleBusiness, sampleRooms, sampleGuests, sampleStaff } from '@/lib/sampleData';
import { translate } from '@/lib/translations';
import { Language, Package, Business, Room, Guest, Staff } from '@/types';
import { 
  Settings, 
  Users, 
  QrCode, 
  CreditCard, 
  Building, 
  Package as PackageIcon,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Download
} from 'lucide-react';

export default function BusinessPanel() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'rooms' | 'qr' | 'subscription'>('overview');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  const { 
    business, 
    setBusiness, 
    updateBusiness, 
    packages: storePackages, 
    setPackages,
    rooms,
    guests,
    staff
  } = useHotelStore();

  useEffect(() => {
    // Initialize data
    if (!business) {
      setBusiness(sampleBusiness);
    }
    if (storePackages.length === 0) {
      setPackages(packages);
    }
  }, [business, setBusiness, storePackages, setPackages]);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    if (business) {
      updateBusiness({
        package: pkg,
        subscription: {
          ...business.subscription,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          status: 'active'
        }
      });
    }
    setShowPackageModal(false);
  };

  const generateQRCode = (room: Room) => {
    // QR kod oluşturma mantığı burada olacak
    console.log(`QR kod oluşturuluyor: Oda ${room.number}`);
  };

  const assignRoomToGuest = (guest: Guest, room: Room) => {
    // Oda atama mantığı burada olacak
    console.log(`Misafir ${guest.name} oda ${room.number}'a atandı`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-hotel-navy rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {translate('business_panel_title', currentLanguage)}
                </h1>
                <p className="text-gray-600">
                  {translate('business_panel_desc', currentLanguage)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: Building },
              { id: 'customers', label: 'Müşteriler', icon: Users },
              { id: 'rooms', label: 'Odalar', icon: QrCode },
              { id: 'qr', label: 'QR Yönetimi', icon: QrCode },
              { id: 'subscription', label: 'Abonelik', icon: CreditCard }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-hotel-gold text-hotel-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Business Info */}
            <div className="hotel-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">İşletme Bilgileri</h2>
              {business && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700">İşletme Adı</h3>
                    <p className="text-gray-900">{business.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">İşletme Türü</h3>
                    <p className="text-gray-900 capitalize">{business.type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Mevcut Paket</h3>
                    <div className="flex items-center space-x-2">
                      <PackageIcon className="w-4 h-4 text-hotel-gold" />
                      <span className="text-gray-900">{business.package.name}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Abonelik Durumu</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      business.subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {translate(business.subscription.status, currentLanguage)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="hotel-card p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{guests.length}</h3>
                <p className="text-gray-600">Aktif Misafir</p>
              </div>
              <div className="hotel-card p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{rooms.length}</h3>
                <p className="text-gray-600">Toplam Oda</p>
              </div>
              <div className="hotel-card p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{staff.length}</h3>
                <p className="text-gray-600">Personel</p>
              </div>
              <div className="hotel-card p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {business?.package.price}₺
                </h3>
                <p className="text-gray-600">Aylık Paket</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Müşteri Yönetimi</h2>
              <button className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Müşteri Ekle</span>
              </button>
            </div>
            
            <div className="hotel-card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Misafir
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giriş Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çıkış Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                          <div className="text-sm text-gray-500">{guest.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.roomId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.checkIn instanceof Date ? guest.checkIn.toLocaleDateString('tr-TR') : new Date(guest.checkIn).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.checkOut instanceof Date ? guest.checkOut.toLocaleDateString('tr-TR') : new Date(guest.checkOut).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-hotel-gold hover:text-yellow-600 mr-3">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Oda Yönetimi</h2>
              <button className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Oda Ekle</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="hotel-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Oda {room.number}</h3>
                      <p className="text-sm text-gray-600">{room.floor}. Kat - {room.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'occupied' 
                        ? 'bg-red-100 text-red-800' 
                        : room.status === 'vacant'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status === 'occupied' ? 'DOLU' : 
                       room.status === 'vacant' ? 'BOŞ' : 
                       room.status === 'maintenance' ? 'BAKIM' : 'TEMİZLİK'}
                    </span>
                  </div>
                  
                  {room.guestName && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Misafir:</p>
                      <p className="font-medium text-gray-900">{room.guestName}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => generateQRCode(room)}
                      className="flex-1 bg-hotel-navy text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR Oluştur</span>
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">QR Kod Yönetimi</h2>
            
            <div className="hotel-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Toplu QR Oluşturma</h3>
                  <p className="text-gray-600 mb-4">
                    Tüm odalar için QR kodları oluşturun ve indirin.
                  </p>
                  <button className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Tüm QR Kodları İndir</span>
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Ayarları</h3>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">QR Boyutu</span>
                      <select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>256x256</option>
                        <option>512x512</option>
                        <option>1024x1024</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Format</span>
                      <select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>PNG</option>
                        <option>SVG</option>
                        <option>PDF</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Abonelik Yönetimi</h2>
            
            {business && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Package */}
                <div className="hotel-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Paket</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paket:</span>
                      <span className="font-medium">{business.package.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aylık Fiyat:</span>
                      <span className="font-medium">{business.package.price}₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        business.subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {translate(business.subscription.status, currentLanguage)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bitiş Tarihi:</span>
                      <span className="font-medium">
                        {business.subscription.endDate.toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Available Packages */}
                <div className="hotel-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Paketler</h3>
                  <div className="space-y-4">
                    {packages.map((pkg: any) => (
                      <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                          <span className="text-lg font-bold text-hotel-gold">{pkg.price}₺/ay</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {pkg.maxRooms === -1 ? 'Sınırsız' : pkg.maxRooms} oda, {pkg.maxStaff === -1 ? 'sınırsız' : pkg.maxStaff} personel
                        </p>
                        <button 
                          onClick={() => handlePackageSelect(pkg)}
                          className="w-full bg-hotel-navy text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                        >
                          {pkg.id === business.package.id ? 'Mevcut Paket' : 'Paketi Seç'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Package Selection Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paket Seçin</h3>
            <div className="space-y-4">
              {packages.map((pkg: any) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                    <span className="text-lg font-bold text-hotel-gold">{pkg.price}₺/ay</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.features.slice(0, 3).map((feature: any, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handlePackageSelect(pkg)}
                    className="w-full mt-3 bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Bu Paketi Seç
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowPackageModal(false)}
              className="w-full mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
