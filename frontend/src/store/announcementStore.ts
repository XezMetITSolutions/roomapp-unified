import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnnouncementTranslations {
  title: string;
  content: string;
  linkText?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'promotion' | 'maintenance' | 'advertisement';
  category: 'general' | 'menu' | 'hotel' | 'promotion';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  targetRooms?: string[];
  createdAt: string;
  createdBy: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  linkUrl?: string;
  linkText?: string;
  icon?: string;
  translations?: {
    [lang: string]: AnnouncementTranslations;
  };
}

interface AnnouncementStore {
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncement: (id: string) => void;
  getActiveAnnouncements: () => Announcement[];
  getAnnouncementsByRoom: (roomId: string) => Announcement[];
  getAnnouncementsByCategory: (category: 'general' | 'menu' | 'hotel' | 'promotion') => Announcement[];
}

export const useAnnouncementStore = create<AnnouncementStore>()(
  persist(
    (set, get) => ({
      announcements: [],

      addAnnouncement: (announcement) =>
        set((state) => ({
          announcements: [...state.announcements, announcement],
        })),

      updateAnnouncement: (id, updatedAnnouncement) =>
        set((state) => ({
          announcements: state.announcements.map((announcement) =>
            announcement.id === id
              ? { ...announcement, ...updatedAnnouncement }
              : announcement
          ),
        })),

      deleteAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((announcement) => announcement.id !== id),
        })),

      toggleAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.map((announcement) =>
            announcement.id === id
              ? { ...announcement, isActive: !announcement.isActive }
              : announcement
          ),
        })),

      getActiveAnnouncements: () => {
        const { announcements } = get();
        const now = new Date().toISOString().split('T')[0];
        
        return announcements.filter((announcement) => {
          if (!announcement.isActive) return false;
          
          const startDate = announcement.startDate;
          const endDate = announcement.endDate;
          
          // Başlangıç tarihi geçmiş olmalı
          if (startDate > now) return false;
          
          // Bitiş tarihi varsa ve geçmişse gösterme
          if (endDate && endDate < now) return false;
          
          return true;
        }).sort((a, b) => {
          // Öncelik sırasına göre sırala
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      },

      getAnnouncementsByRoom: (roomId) => {
        const activeAnnouncements = get().getActiveAnnouncements();
        return activeAnnouncements.filter(
          (announcement) =>
            !announcement.targetRooms ||
            announcement.targetRooms.length === 0 ||
            announcement.targetRooms.includes(roomId)
        );
      },

      getAnnouncementsByCategory: (category) => {
        const activeAnnouncements = get().getActiveAnnouncements();
        return activeAnnouncements.filter(
          (announcement) => announcement.category === category
        );
      },
    }),
    {
      name: 'announcement-store',
      version: 2,
      migrate: (persistedState: any, version) => {
        try {
          if (!persistedState || !persistedState.announcements) return persistedState;
          // Mevcutta çeviri olmayan duyurular için, aynı id'deki initial seed'den translations alanını kopyala
          const initial: any[] = (persistedState?.announcements as any[]) || [];
          const byId: Record<string, any> = {};
          initial.forEach((a) => { byId[a.id] = a; });
          const migrated = (persistedState.announcements as any[]).map((a: any) => {
            if (!a.translations && byId[a.id]?.translations) {
              return { ...a, translations: byId[a.id].translations };
            }
            return a;
          });
          return { ...persistedState, announcements: migrated };
        } catch {
          return persistedState;
        }
      }
    }
  )
);
