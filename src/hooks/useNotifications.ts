'use client';
import { useState, useEffect, useCallback } from 'react';
import { ApiService, NotificationData } from '@/services/api';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications(roomId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Bildirim kaldırma (önce tanımla, sonra kullan)
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  // Bildirim ekleme
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Max 10 bildirim
    setUnreadCount(prev => prev + 1);

    // Bildirimler artık kalıcı - otomatik kapanmıyor
  }, []);

  // Bildirim okundu olarak işaretle
  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Backend'e bildir
    try {
      await ApiService.markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);

    // Backend'e bildir
    try {
      await Promise.all(
        unreadNotifications.map(n => ApiService.markNotificationAsRead(n.id))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  // Backend'den bildirimleri yükle
  const loadNotifications = useCallback(async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const backendNotifications = await ApiService.getNotifications(roomId);
      const formattedNotifications: Notification[] = backendNotifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.timestamp),
        read: n.read,
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // İlk yükleme
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // WebSocket bağlantısı (gerçek zamanlı güncellemeler için)
  useEffect(() => {
    if (!roomId) return;

    let ws: WebSocket | null = null;
    
    try {
      ws = ApiService.connectWebSocket(roomId, (data) => {
        if (data.type === 'notification') {
          addNotification({
            type: data.notificationType,
            title: data.title,
            message: data.message,
          });
        }
      });
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId, addNotification]);

  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    loadNotifications,
  };
}
