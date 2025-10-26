'use client';

import { useRouter } from 'next/navigation';
import { useHotelStore } from '@/store/hotelStore';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { useState } from 'react';
import { Language } from '@/types';
import { translate } from '@/lib/translations';
import AnnouncementBanner from '@/components/AnnouncementBanner';

export default function GuestDemo() {
  const router = useRouter();
  const { rooms } = useHotelStore();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');

  const occupiedRooms = rooms.filter(room => room.status === 'occupied');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{translate('guest_demo_title', currentLanguage)}</h1>
                <p className="text-gray-600">{translate('guest_demo_desc', currentLanguage)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Duyurular */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Aktif Duyurular</h3>
          <AnnouncementBanner />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">{translate('guest_demo_instructions_title', currentLanguage)}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {translate('guest_demo_instruction_1', currentLanguage)}</li>
            <li>• {translate('guest_demo_instruction_2', currentLanguage)}</li>
            <li>• {translate('guest_demo_instruction_3', currentLanguage)}</li>
            <li>• {translate('guest_demo_instruction_4', currentLanguage)}</li>
          </ul>
        </div>

        {/* Room Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occupiedRooms.map((room) => (
            <div key={room.id} className="hotel-card p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {translate('room', currentLanguage)} {room.number}
                </h3>
                <p className="text-sm text-gray-600 capitalize mb-2">
                  {room.type} • {translate('floor', currentLanguage)} {room.floor}
                </p>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {translate('occupied', currentLanguage)}
                </span>
              </div>

              {room.guestName && (
                <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{translate('current_guest', currentLanguage)}</p>
                  <p className="font-medium text-gray-900">{room.guestName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {translate('checkout_time', currentLanguage)}: {room.checkOut ? new Date(room.checkOut).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              )}

              <button
                onClick={() => window.open(`/guest/${room.id}`, '_blank')}
                className="w-full hotel-button text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {translate('open_guest_interface', currentLanguage)}
              </button>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  {translate('opens_in_new_tab', currentLanguage)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {occupiedRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{translate('no_occupied_rooms', currentLanguage)}</h3>
            <p className="text-gray-600">{translate('no_occupied_rooms_desc', currentLanguage)}</p>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{translate('guest_interface_features', currentLanguage)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-hotel-navy rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🌍</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{translate('multi_language_support', currentLanguage)}</h4>
              <p className="text-sm text-gray-600">
                {translate('multi_language_support_desc', currentLanguage)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-hotel-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-hotel-navy text-xl">🍽️</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{translate('room_service_ordering', currentLanguage)}</h4>
              <p className="text-sm text-gray-600">
                {translate('room_service_ordering_desc', currentLanguage)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-hotel-sage rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🛎️</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{translate('quick_requests', currentLanguage)}</h4>
              <p className="text-sm text-gray-600">
                {translate('quick_requests_desc', currentLanguage)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
