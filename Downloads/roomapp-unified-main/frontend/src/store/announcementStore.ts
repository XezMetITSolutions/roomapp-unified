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
      announcements: [
        {
          id: '1',
          title: 'Havuz Bakımı',
          content: 'Havuz bakımı nedeniyle 15-16 Ocak tarihleri arasında havuz kapalı olacaktır.',
          type: 'maintenance',
          category: 'hotel',
          isActive: true,
          startDate: '2024-01-15',
          endDate: '2024-01-16',
          createdAt: '2024-01-10',
          createdBy: 'Admin',
          priority: 'HIGH',
          translations: {
            en: {
              title: 'Pool Maintenance',
              content: 'The pool will be closed from January 15-16 due to maintenance work.'
            },
            ru: {
              title: 'Обслуживание бассейна',
              content: 'Бассейн будет закрыт с 15 по 16 января из-за работ по обслуживанию.'
            },
            ar: {
              title: 'صيانة المسبح',
              content: 'سيتم إغلاق المسبح من 15 إلى 16 يناير بسبب أعمال الصيانة.'
            },
            de: {
              title: 'Pool-Wartung',
              content: 'Der Pool wird vom 15. bis 16. Januar aufgrund von Wartungsarbeiten geschlossen.'
            }
          }
        },
        {
          id: '2',
          title: 'Yeni Menü Öğeleri',
          content: 'Yeni yemek seçenekleri menümüzde!',
          type: 'info',
          category: 'menu',
          isActive: true,
          startDate: '2024-01-01',
          createdAt: '2024-01-12',
          createdBy: 'Chef',
          priority: 'MEDIUM',
          linkUrl: '/qr-menu',
          linkText: 'İncele',
          icon: 'utensils',
          translations: {
            en: {
              title: 'New Menu Items',
              content: 'New food options in our menu!',
              linkText: 'View'
            },
            ru: {
              title: 'Новые пункты меню',
              content: 'Новые варианты еды в нашем меню!',
              linkText: 'Посмотреть'
            },
            ar: {
              title: 'عناصر القائمة الجديدة',
              content: 'خيارات طعام جديدة في قائمتنا!',
              linkText: 'عرض'
            },
            de: {
              title: 'Neue Menüpunkte',
              content: 'Neue Essensoptionen in unserem Menü!',
              linkText: 'Ansehen'
            }
          }
        },
        {
          id: '3',
          title: 'Özel İndirim',
          content: 'Hafta sonu içeceklerde %20 indirim!',
          type: 'promotion',
          category: 'menu',
          isActive: true,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          createdAt: '2024-01-07',
          createdBy: 'Manager',
          priority: 'LOW',
          linkUrl: '/qr-menu',
          linkText: 'İncele',
          icon: 'gift',
          translations: {
            en: {
              title: 'Special Discount',
              content: '20% discount on weekend drinks!',
              linkText: 'View'
            },
            ru: {
              title: 'Специальная скидка',
              content: '20% скидка на напитки в выходные!',
              linkText: 'Посмотреть'
            },
            ar: {
              title: 'خصم خاص',
              content: 'خصم 20% على المشروبات في عطلة نهاية الأسبوع!',
              linkText: 'عرض'
            },
            de: {
              title: 'Besonderer Rabatt',
              content: '20% Rabatt auf Wochenend-Getränke!',
              linkText: 'Ansehen'
            }
          }
        },
        {
          id: '4',
          title: '🏖️ Grand Beach Resort Reklamı',
          content: 'Ege Denizi\'nin en güzel koylarında lüks tatil deneyimi! Özel otel transferimiz ile ulaşım ücretsiz.',
          type: 'advertisement',
          category: 'promotion',
          isActive: true,
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          createdAt: '2024-01-15',
          createdBy: 'Marketing',
          priority: 'MEDIUM',
          linkUrl: 'https://grandbeachresort.com',
          linkText: 'Rezervasyon Yap',
        },
        {
          id: '5',
          title: '🍽️ Chef\'in Özel Menüsü',
          content: 'Şefimizin özel yemekleri! Bu hafta özel fiyatlarla.',
          type: 'promotion',
          category: 'menu',
          isActive: true,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          createdAt: '2024-01-19',
          createdBy: 'Chef',
          priority: 'HIGH',
          linkUrl: '/qr-menu',
          linkText: 'İncele',
          icon: 'crown',
          translations: {
            en: {
              title: '🍽️ Chef\'s Special Menu',
              content: 'Our chef\'s special dishes! This week with special prices.',
              linkText: 'View'
            },
            ru: {
              title: '🍽️ Особое меню шефа',
              content: 'Особые блюда нашего шефа! На этой неделе по специальным ценам.',
              linkText: 'Посмотреть'
            },
            ar: {
              title: '🍽️ قائمة الطاهي الخاصة',
              content: 'أطباق الطاهي الخاصة! هذا الأسبوع بأسعار خاصة.',
              linkText: 'عرض'
            },
            de: {
              title: '🍽️ Chef\'s Spezialmenü',
              content: 'Die Spezialgerichte unseres Küchenchefs! Diese Woche zu Sonderpreisen.',
              linkText: 'Ansehen'
            }
          }
        },
        {
          id: '6',
          title: '🥂 Happy Hour',
          content: '17:00-19:00 arası kokteyllerde %30 indirim!',
          type: 'promotion',
          category: 'menu',
          isActive: true,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          createdAt: '2024-01-18',
          createdBy: 'Bar Manager',
          priority: 'MEDIUM',
          linkUrl: '/qr-menu',
          linkText: 'Kokteyller',
          icon: 'wine',
          translations: {
            en: {
              title: '🥂 Happy Hour',
              content: '30% discount on cocktails between 17:00-19:00!',
              linkText: 'Cocktails'
            },
            ru: {
              title: '🥂 Счастливый час',
              content: '30% скидка на коктейли с 17:00 до 19:00!',
              linkText: 'Коктейли'
            },
            ar: {
              title: '🥂 ساعة سعيدة',
              content: 'خصم 30% على الكوكتيلات بين 17:00-19:00!',
              linkText: 'الكوكتيلات'
            },
            de: {
              title: '🥂 Happy Hour',
              content: '30% Rabatt auf Cocktails zwischen 17:00-19:00!',
              linkText: 'Cocktails'
            }
          }
        },
        {
          id: '7',
          title: '🌱 Sağlıklı Seçenekler',
          content: 'Vegan ve glutensiz seçenekler menümüzde!',
          type: 'info',
          category: 'menu',
          isActive: true,
          startDate: '2024-01-01',
          createdAt: '2024-01-16',
          createdBy: 'Nutritionist',
          priority: 'LOW',
          linkUrl: '/qr-menu',
          linkText: 'Sağlıklı',
          icon: 'leaf',
          translations: {
            en: {
              title: '🌱 Healthy Options',
              content: 'Vegan and gluten-free options in our menu!',
              linkText: 'Healthy'
            },
            ru: {
              title: '🌱 Здоровые варианты',
              content: 'Веганские и безглютеновые варианты в нашем меню!',
              linkText: 'Здоровые'
            },
            ar: {
              title: '🌱 خيارات صحية',
              content: 'خيارات نباتية وخالية من الغلوتين في قائمتنا!',
              linkText: 'صحي'
            },
            de: {
              title: '🌱 Gesunde Optionen',
              content: 'Vegane und glutenfreie Optionen in unserem Menü!',
              linkText: 'Gesund'
            }
          }
        },
      ],

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
