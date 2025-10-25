'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { ApiService } from '@/services/api';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  addNotification: (type: 'success' | 'info' | 'warning', title: string, message: string, playSound?: boolean, autoClose?: boolean, duration?: number) => void;
  removeNotification: (id: string) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children, roomId }: { children: React.ReactNode; roomId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [processedNotificationIds, setProcessedNotificationIds] = useState<Set<string>>(new Set());

  // Bildirim sesi çalma
  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Ses çalınamadı:', error);
    }
  }, []);

  // Bildirim ekleme fonksiyonu
  const addNotification = useCallback((type: 'success' | 'info' | 'warning', title: string, message: string, playSound: boolean = true, autoClose: boolean = false, duration: number = 5000) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Max 5 bildirim
    
    // Ses çal (hoş geldiniz bildirimi hariç)
    if (playSound && !title.includes('Hoş Geldiniz')) {
      playNotificationSound();
    }
    
    // Otomatik kapanma
    if (autoClose) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, duration);
    }
  }, [playNotificationSound]);

  // Bildirim kapatma
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Resepsiyon yanıtlarını dinle
  useEffect(() => {
    if (!roomId) return; // roomId yoksa bildirim sistemi çalışmasın
    
    const fullRoomId = roomId;
    
    const checkForNewNotifications = () => {
      const guestNotifications = ApiService.getGuestNotifications(fullRoomId);
      
      guestNotifications.forEach(notification => {
        // Bu bildirim daha önce işlendi mi kontrol et
        if (!notification.read && !processedNotificationIds.has(notification.id)) {
          // Aynı mesajın zaten gösterilip gösterilmediğini kontrol et
          const isDuplicate = notifications.some(existing => 
            existing.message === notification.message && 
            existing.title === 'Resepsiyon Yanıtı'
          );
          
          if (!isDuplicate) {
            console.log('Global notification adding:', notification);
            addNotification('info', 'Resepsiyon Yanıtı', notification.message, true, true, 5000); // Ses çal, 5 saniye
            
            // Bu bildirimi işlendi olarak işaretle
            setProcessedNotificationIds(prev => new Set(Array.from(prev).concat(notification.id)));
          }
          
          // Bildirimi okundu olarak işaretle
          ApiService.markGuestNotificationAsRead(fullRoomId, notification.id);
        }
      });
    };
    
    // İlk kontrol
    checkForNewNotifications();
    
    // Her 1 saniyede bir kontrol et
    const interval = setInterval(checkForNewNotifications, 1000);
    
    return () => clearInterval(interval);
  }, [roomId, addNotification, processedNotificationIds, notifications]);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
      {children}
      
      {/* Global Bildirim Sistemi */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`w-full bg-white rounded-xl shadow-2xl border-l-4 p-4 sm:p-5 transform transition-all duration-500 ${
              notification.type === 'success' ? 'border-green-500 bg-green-50' :
              notification.type === 'info' ? 'border-blue-500 bg-blue-50' :
              'border-yellow-500 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaBell className={`w-4 h-4 ${
                    notification.type === 'success' ? 'text-green-600' :
                    notification.type === 'info' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`} />
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{notification.title}</h4>
                </div>
                <p className="text-gray-700 text-sm sm:text-base mt-1 leading-relaxed font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🕐</span>
                  {notification.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 hover:bg-gray-200 rounded-full"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
