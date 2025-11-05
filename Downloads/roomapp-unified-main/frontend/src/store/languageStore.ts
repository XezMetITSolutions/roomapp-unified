import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export interface Translations {
  [key: string]: string;
}

// Dil tanımları
export const languages: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' },
];

// Çeviri metinleri
export const translations: Record<string, Translations> = {
  tr: {
    // Menü başlıkları
    'menu.title': 'Oda Servisi Menüsü',
    'menu.back': 'Geri',
    'menu.search': 'Arama...',
    'menu.categories': 'Kategoriler',
    'menu.items': 'Ürünler',
    
    // Kategoriler
    'category.all': 'Tümü',
    'category.breakfast': 'Kahvaltı',
    'category.main': 'Ana Yemekler',
    'category.appetizer': 'Mezeler',
    'category.dessert': 'Tatlılar',
    'category.beverage': 'İçecekler',
    'category.snack': 'Atıştırmalıklar',
    'menu.subcategories': 'Alt Kategoriler',
    
    // Alt Kategoriler
    'subcategory.classic': 'Klasik',
    'subcategory.meat': 'Et',
    'subcategory.fish': 'Balık',
    'subcategory.hot': 'Sıcak',
    'subcategory.juice': 'Meyve Suyu',
    
    // Ürün bilgileri
    'product.price': '₺',
    'product.preparation': 'Hazırlık',
    'product.minutes': 'dk',
    'product.rating': 'Puan',
    'product.allergens': 'Alerjenler',
    'product.add_to_cart': 'Sepete Ekle',
    'product.quantity': 'Adet',
    'product.total': 'Toplam',
    'product.show_details': 'Detay',
    'product.show_less': 'Daha az göster',
    
    // Sepet
    'cart.title': 'Sepetim',
    'cart.empty': 'Sepetiniz boş',
    'cart.remove': 'Kaldır',
    'cart.checkout': 'Sipariş Ver',
    'cart.add_products': 'Ürün eklemek için menüden seçim yapın',
    
    // Anket/Değerlendirme
    'survey.title': 'Bizi Değerlendirin',
    'survey.cleanliness': 'Temizlik',
    'survey.service': 'Oda Servisi',
    'survey.staff': 'Personel',
    'survey.overall': 'Genel Memnuniyet',
    'survey.comment': 'Yorum (İsteğe Bağlı)',
    'survey.comment_placeholder': 'Deneyiminizi bizimle paylaşın...',
    'survey.submit': 'İşletmeye Gönderin',
    'survey.google_review': 'Google\'da Değerlendirin',
    'survey.thank_you': 'Teşekkürler!',
    'survey.submitted': 'Değerlendirmeniz başarıyla gönderildi.',
    
    // Bildirimler
    'notifications.housekeeping_title': 'Temizlik Talebi',
    'notifications.housekeeping_message': 'Oda temizliği talebiniz resepsiyona iletildi. En kısa sürede yanıtlanacaktır.',
    'notifications.housekeeping_description': 'Oda temizliği talep edildi',
    'notifications.maintenance_title': 'Teknik Arıza',
    'notifications.maintenance_message': 'Teknik arıza talebiniz resepsiyona iletildi. Acil durumlar için personelimiz yolda.',
    'notifications.maintenance_description': 'Teknik arıza bildirimi',
    'notifications.survey_title': 'Değerlendirme',
    'notifications.survey_thank_you': 'Yorumunuz için teşekkür ederiz! Geri bildiriminiz bizim için çok değerli.',
    'notifications.general_request_title': 'Genel Talep',
    
    // Genel
    'general.loading': 'Yükleniyor...',
    'general.error': 'Bir hata oluştu',
    'general.success': 'Başarılı',
    'general.cancel': 'İptal',
    'general.confirm': 'Onayla',
    'general.save': 'Kaydet',
    'general.edit': 'Düzenle',
    'general.delete': 'Sil',
    'general.no_products': 'Ürün Bulunamadı',
    'general.no_search_results': 'Arama kriterlerinize uygun ürün bulunamadı.',
    'general.no_category_products': 'Bu kategoride ürün bulunmuyor.',
    
    // Oda Arayüzü
    'room.welcome': 'Hoş Geldiniz',
    'room.services': 'Hizmetler',
    'room.room_service': 'Oda Servisi',
    'room.housekeeping': 'Temizlik',
    'room.maintenance': 'Bakım',
    'room.concierge': 'Concierge',
    'room.wifi': 'WiFi',
    'room.menu': 'Menü',
    'room.survey': 'Anket',
    'room.social_media': 'Sosyal Medya',
    'room.follow_us': 'Bizi Takip Edin',
    'room.quick_select': 'Hızlı seçim',
    'room.request_details': 'İstek Detayı',
    'room.quantity': 'Miktar',
    'room.send_request': 'İsteği Gönder',
    
    // Hızlı seçim öğeleri
    'quick.towel': 'Havlu',
    'quick.slippers': 'Terlik',
    'quick.toothpaste': 'Diş Macunu',
    'quick.pillow': 'Yastık',
    'quick.blanket': 'Battaniye',
    'quick.shampoo': 'Şampuan',
    'quick.soap': 'Sabun',
    'quick.water': 'Su',
  },
  
  en: {
    // Menu titles
    'menu.title': 'Room Service Menu',
    'menu.back': 'Back',
    'menu.search': 'Search...',
    'menu.categories': 'Categories',
    'menu.items': 'Items',
    
    // Categories
    'category.all': 'All',
    'category.breakfast': 'Breakfast',
    'category.main': 'Main Dishes',
    'category.appetizer': 'Appetizers',
    'category.dessert': 'Desserts',
    'category.beverage': 'Beverages',
    'category.snack': 'Snacks',
    'menu.subcategories': 'Subcategories',
    
    // Subcategories
    'subcategory.classic': 'Classic',
    'subcategory.meat': 'Meat',
    'subcategory.fish': 'Fish',
    'subcategory.hot': 'Hot',
    'subcategory.juice': 'Juice',
    
    // Product info
    'product.price': '$',
    'product.preparation': 'Prep',
    'product.minutes': 'min',
    'product.rating': 'Rating',
    'product.allergens': 'Allergens',
    'product.add_to_cart': 'Add to Cart',
    'product.quantity': 'Quantity',
    'product.total': 'Total',
    'product.show_details': 'Details',
    'product.show_less': 'Show Less',
    
    // Cart
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.remove': 'Remove',
    'cart.checkout': 'Checkout',
    'cart.add_products': 'Select items from the menu to add to cart',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.success': 'Success',
    'general.cancel': 'Cancel',
    'general.confirm': 'Confirm',
    'general.save': 'Save',
    'general.edit': 'Edit',
    'general.delete': 'Delete',
    'general.no_products': 'No Products Found',
    'general.no_search_results': 'No products found matching your search criteria.',
    'general.no_category_products': 'No products available in this category.',
    
    // Room Interface
    'room.welcome': 'Welcome',
    'room.services': 'Services',
    'room.room_service': 'Room Service',
    'room.housekeeping': 'Housekeeping',
    'room.maintenance': 'Maintenance',
    'room.concierge': 'Concierge',
    'room.wifi': 'WiFi',
    'room.menu': 'Menu',
    'room.survey': 'Survey',
    'room.social_media': 'Social Media',
    'room.follow_us': 'Follow Us',
    'room.quick_select': 'Quick Select',
    'room.request_details': 'Request Details',
    'room.quantity': 'Quantity',
    'room.send_request': 'Send Request',
    
    // Quick select items
    'quick.towel': 'Towel',
    'quick.slippers': 'Slippers',
    'quick.toothpaste': 'Toothpaste',
    'quick.pillow': 'Pillow',
    'quick.blanket': 'Blanket',
    'quick.shampoo': 'Shampoo',
    'quick.soap': 'Soap',
    'quick.water': 'Water',
    
    // Survey/Evaluation
    'survey.title': 'Rate Us',
    'survey.cleanliness': 'Cleanliness',
    'survey.service': 'Room Service',
    'survey.staff': 'Staff',
    'survey.overall': 'Overall Satisfaction',
    'survey.comment': 'Comment (Optional)',
    'survey.comment_placeholder': 'Share your experience with us...',
    'survey.submit': 'Submit to Business',
    'survey.google_review': 'Review on Google',
    'survey.thank_you': 'Thank You!',
    'survey.submitted': 'Your evaluation has been submitted successfully.',
    
    // Notifications
    'notifications.housekeeping_title': 'Housekeeping Request',
    'notifications.housekeeping_message': 'Your housekeeping request has been sent to reception. You will receive a response shortly.',
    'notifications.housekeeping_description': 'Housekeeping requested',
    'notifications.maintenance_title': 'Technical Issue',
    'notifications.maintenance_message': 'Your technical issue request has been sent to reception. Our staff is on the way for emergencies.',
    'notifications.maintenance_description': 'Technical issue reported',
    'notifications.survey_title': 'Evaluation',
    'notifications.survey_thank_you': 'Thank you for your comment! Your feedback is very valuable to us.',
    'notifications.general_request_title': 'General Request',
  },
  
  ru: {
    // Заголовки меню
    'menu.title': 'Меню Обслуживания',
    'menu.back': 'Назад',
    'menu.search': 'Поиск...',
    'menu.categories': 'Категории',
    'menu.items': 'Блюда',
    
    // Категории
    'category.all': 'Все',
    'category.breakfast': 'Завтрак',
    'category.main': 'Основные Блюда',
    'category.appetizer': 'Закуски',
    'category.dessert': 'Десерты',
    'category.beverage': 'Напитки',
    'category.snack': 'Закуски',
    'menu.subcategories': 'Подкатегории',
    
    // Подкатегории
    'subcategory.classic': 'Классические',
    'subcategory.meat': 'Мясные',
    'subcategory.fish': 'Рыбные',
    'subcategory.hot': 'Горячие',
    'subcategory.juice': 'Соки',
    
    // Информация о продукте
    'product.price': '₽',
    'product.preparation': 'Готовка',
    'product.minutes': 'мин',
    'product.rating': 'Рейтинг',
    'product.allergens': 'Аллергены',
    'product.add_to_cart': 'В Корзину',
    'product.quantity': 'Количество',
    'product.total': 'Итого',
    'product.show_details': 'Подробности',
    'product.show_less': 'Скрыть',
    
    // Корзина
    'cart.title': 'Моя Корзина',
    'cart.empty': 'Ваша корзина пуста',
    'cart.remove': 'Удалить',
    'cart.checkout': 'Оформить',
    'cart.add_products': 'Выберите блюда из меню для добавления в корзину',
    
    // Общее
    'general.loading': 'Загрузка...',
    'general.error': 'Произошла ошибка',
    'general.success': 'Успешно',
    'general.cancel': 'Отмена',
    'general.confirm': 'Подтвердить',
    'general.save': 'Сохранить',
    'general.edit': 'Редактировать',
    'general.delete': 'Удалить',
    'general.no_products': 'Товары не найдены',
    'general.no_search_results': 'По вашему запросу товары не найдены.',
    'general.no_category_products': 'В этой категории нет товаров.',
    
    // Интерфейс Номера
    'room.welcome': 'Добро пожаловать',
    'room.services': 'Услуги',
    'room.room_service': 'Обслуживание в номере',
    'room.housekeeping': 'Уборка',
    'room.maintenance': 'Техническое обслуживание',
    'room.concierge': 'Консьерж',
    'room.wifi': 'WiFi',
    'room.menu': 'Меню',
    'room.survey': 'Опрос',
    'room.social_media': 'Социальные сети',
    'room.follow_us': 'Подписывайтесь на нас',
    'room.quick_select': 'Быстрый выбор',
    'room.request_details': 'Детали запроса',
    'room.quantity': 'Количество',
    'room.send_request': 'Отправить запрос',
    
    // Быстрый выбор
    'quick.towel': 'Полотенце',
    'quick.slippers': 'Тапочки',
    'quick.toothpaste': 'Зубная паста',
    'quick.pillow': 'Подушка',
    'quick.blanket': 'Одеяло',
    'quick.shampoo': 'Шампунь',
    'quick.soap': 'Мыло',
    'quick.water': 'Вода',
    
    // Опрос/Оценка
    'survey.title': 'Оцените нас',
    'survey.cleanliness': 'Чистота',
    'survey.service': 'Обслуживание в номере',
    'survey.staff': 'Персонал',
    'survey.overall': 'Общее удовлетворение',
    'survey.comment': 'Комментарий (необязательно)',
    'survey.comment_placeholder': 'Поделитесь своим опытом с нами...',
    'survey.submit': 'Отправить в отель',
    'survey.google_review': 'Оценить в Google',
    'survey.thank_you': 'Спасибо!',
    'survey.submitted': 'Ваша оценка успешно отправлена.',
    
    // Уведомления
    'notifications.housekeeping_title': 'Запрос на уборку',
    'notifications.housekeeping_message': 'Ваш запрос на уборку передан на ресепшн. Вам ответят в ближайшее время.',
    'notifications.housekeeping_description': 'Запрошена уборка',
    'notifications.maintenance_title': 'Техническая проблема',
    'notifications.maintenance_message': 'Ваш запрос о технической проблеме передан на ресепшн. Наш персонал в пути для экстренных случаев.',
    'notifications.maintenance_description': 'Сообщена техническая проблема',
    'notifications.survey_title': 'Оценка',
    'notifications.survey_thank_you': 'Спасибо за ваш комментарий! Ваш отзыв очень ценен для нас.',
    'notifications.general_request_title': 'Общий запрос',
  },
  
  ar: {
    // عناوين القائمة
    'menu.title': 'قائمة خدمة الغرف',
    'menu.back': 'رجوع',
    'menu.search': 'بحث...',
    'menu.categories': 'الفئات',
    'menu.items': 'العناصر',
    
    // الفئات
    'category.all': 'الكل',
    'category.breakfast': 'الإفطار',
    'category.main': 'الأطباق الرئيسية',
    'category.appetizer': 'المقبلات',
    'category.dessert': 'الحلويات',
    'category.beverage': 'المشروبات',
    'category.snack': 'الوجبات الخفيفة',
    'menu.subcategories': 'الفئات الفرعية',
    
    // الفئات الفرعية
    'subcategory.classic': 'كلاسيكي',
    'subcategory.meat': 'لحوم',
    'subcategory.fish': 'أسماك',
    'subcategory.hot': 'ساخن',
    'subcategory.juice': 'عصائر',
    
    // معلومات المنتج
    'product.price': 'ريال',
    'product.preparation': 'التحضير',
    'product.minutes': 'دقيقة',
    'product.rating': 'التقييم',
    'product.allergens': 'مسببات الحساسية',
    'product.add_to_cart': 'أضف للسلة',
    'product.quantity': 'الكمية',
    'product.total': 'المجموع',
    'product.show_details': 'التفاصيل',
    'product.show_less': 'عرض أقل',
    
    // السلة
    'cart.title': 'سلتي',
    'cart.empty': 'سلتك فارغة',
    'cart.remove': 'إزالة',
    'cart.checkout': 'الدفع',
    'cart.add_products': 'اختر العناصر من القائمة لإضافتها إلى السلة',
    
    // عام
    'general.loading': 'جاري التحميل...',
    'general.error': 'حدث خطأ',
    'general.success': 'نجح',
    'general.cancel': 'إلغاء',
    'general.confirm': 'تأكيد',
    'general.save': 'حفظ',
    'general.edit': 'تعديل',
    'general.delete': 'حذف',
    'general.no_products': 'لم يتم العثور على منتجات',
    'general.no_search_results': 'لم يتم العثور على منتجات تطابق معايير البحث الخاصة بك.',
    'general.no_category_products': 'لا توجد منتجات متاحة في هذه الفئة.',
    
    // واجهة الغرفة
    'room.welcome': 'مرحباً',
    'room.services': 'الخدمات',
    'room.room_service': 'خدمة الغرف',
    'room.housekeeping': 'التنظيف',
    'room.maintenance': 'الصيانة',
    'room.concierge': 'الكونسيرج',
    'room.wifi': 'واي فاي',
    'room.menu': 'القائمة',
    'room.survey': 'الاستطلاع',
    'room.social_media': 'وسائل التواصل الاجتماعي',
    'room.follow_us': 'تابعونا',
    'room.quick_select': 'اختيار سريع',
    'room.request_details': 'تفاصيل الطلب',
    'room.quantity': 'الكمية',
    'room.send_request': 'إرسال الطلب',
    
    // الاختيار السريع
    'quick.towel': 'منشفة',
    'quick.slippers': 'نعال',
    'quick.toothpaste': 'معجون أسنان',
    'quick.pillow': 'وسادة',
    'quick.blanket': 'بطانية',
    'quick.shampoo': 'شامبو',
    'quick.soap': 'صابون',
    'quick.water': 'ماء',
    
    // الاستطلاع/التقييم
    'survey.title': 'قيمنا',
    'survey.cleanliness': 'النظافة',
    'survey.service': 'خدمة الغرف',
    'survey.staff': 'الموظفون',
    'survey.overall': 'الرضا العام',
    'survey.comment': 'تعليق (اختياري)',
    'survey.comment_placeholder': 'شاركنا تجربتك...',
    'survey.submit': 'إرسال للفندق',
    'survey.google_review': 'تقييم على جوجل',
    'survey.thank_you': 'شكراً لك!',
    'survey.submitted': 'تم إرسال تقييمك بنجاح.',
    
    // الإشعارات
    'notifications.housekeeping_title': 'طلب التنظيف',
    'notifications.housekeeping_message': 'تم إرسال طلب التنظيف إلى الاستقبال. ستحصل على رد قريباً.',
    'notifications.housekeeping_description': 'طلب التنظيف',
    'notifications.maintenance_title': 'مشكلة تقنية',
    'notifications.maintenance_message': 'تم إرسال طلب المشكلة التقنية إلى الاستقبال. موظفونا في الطريق للحالات الطارئة.',
    'notifications.maintenance_description': 'تم الإبلاغ عن مشكلة تقنية',
    'notifications.survey_title': 'التقييم',
    'notifications.survey_thank_you': 'شكراً لك على تعليقك! ملاحظاتك ثمينة جداً بالنسبة لنا.',
    'notifications.general_request_title': 'طلب عام',
  },
  
  de: {
    // Menü-Titel
    'menu.title': 'Zimmerservice-Menü',
    'menu.back': 'Zurück',
    'menu.search': 'Suchen...',
    'menu.categories': 'Kategorien',
    'menu.items': 'Gerichte',
    
    // Kategorien
    'category.all': 'Alle',
    'category.breakfast': 'Frühstück',
    'category.main': 'Hauptgerichte',
    'category.appetizer': 'Vorspeisen',
    'category.dessert': 'Desserts',
    'category.beverage': 'Getränke',
    'category.snack': 'Snacks',
    'menu.subcategories': 'Unterkategorien',
    
    // Unterkategorien
    'subcategory.classic': 'Klassisch',
    'subcategory.meat': 'Fleisch',
    'subcategory.fish': 'Fisch',
    'subcategory.hot': 'Heiß',
    'subcategory.juice': 'Saft',
    
    // Produktinformationen
    'product.price': '€',
    'product.preparation': 'Zubereitung',
    'product.minutes': 'Min',
    'product.rating': 'Bewertung',
    'product.allergens': 'Allergene',
    'product.add_to_cart': 'In den Warenkorb',
    'product.quantity': 'Menge',
    'product.total': 'Gesamt',
    
    // Warenkorb
    'cart.title': 'Mein Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.remove': 'Entfernen',
    'cart.checkout': 'Zur Kasse',
    
    // Allgemein
    'general.loading': 'Wird geladen...',
    'general.error': 'Ein Fehler ist aufgetreten',
    'general.success': 'Erfolgreich',
    'general.cancel': 'Abbrechen',
    'general.confirm': 'Bestätigen',
    'general.save': 'Speichern',
    'general.edit': 'Bearbeiten',
    'general.delete': 'Löschen',
    'general.no_products': 'Keine Produkte gefunden',
    'general.no_search_results': 'Keine Produkte gefunden, die Ihren Suchkriterien entsprechen.',
    'general.no_category_products': 'Keine Produkte in dieser Kategorie verfügbar.',
    
    // Zimmer-Interface
    'room.welcome': 'Willkommen',
    'room.services': 'Dienstleistungen',
    'room.room_service': 'Zimmerservice',
    'room.housekeeping': 'Hausreinigung',
    'room.maintenance': 'Wartung',
    'room.concierge': 'Concierge',
    'room.wifi': 'WiFi',
    'room.menu': 'Menü',
    'room.survey': 'Umfrage',
    'room.social_media': 'Soziale Medien',
    'room.follow_us': 'Folgen Sie uns',
    'room.quick_select': 'Schnellauswahl',
    'room.request_details': 'Anfrage-Details',
    'room.quantity': 'Anzahl',
    'room.send_request': 'Anfrage senden',
    
    // Schnellauswahl
    'quick.towel': 'Handtuch',
    'quick.slippers': 'Hausschuhe',
    'quick.toothpaste': 'Zahnpasta',
    'quick.pillow': 'Kissen',
    'quick.blanket': 'Decke',
    'quick.shampoo': 'Shampoo',
    'quick.soap': 'Seife',
    'quick.water': 'Wasser',
    
    // Umfrage/Bewertung
    'survey.title': 'Bewerten Sie uns',
    'survey.cleanliness': 'Sauberkeit',
    'survey.service': 'Zimmerservice',
    'survey.staff': 'Personal',
    'survey.overall': 'Gesamtzufriedenheit',
    'survey.comment': 'Kommentar (optional)',
    'survey.comment_placeholder': 'Teilen Sie Ihre Erfahrung mit uns...',
    'survey.submit': 'An Hotel senden',
    'survey.google_review': 'Bei Google bewerten',
    'survey.thank_you': 'Vielen Dank!',
    'survey.submitted': 'Ihre Bewertung wurde erfolgreich gesendet.',
    
    // Benachrichtigungen
    'notifications.housekeeping_title': 'Zimmerservice-Anfrage',
    'notifications.housekeeping_message': 'Ihre Zimmerservice-Anfrage wurde an die Rezeption gesendet. Sie erhalten bald eine Antwort.',
    'notifications.housekeeping_description': 'Zimmerservice angefordert',
    'notifications.maintenance_title': 'Technisches Problem',
    'notifications.maintenance_message': 'Ihre Anfrage zu einem technischen Problem wurde an die Rezeption gesendet. Unser Personal ist für Notfälle unterwegs.',
    'notifications.maintenance_description': 'Technisches Problem gemeldet',
    'notifications.survey_title': 'Bewertung',
    'notifications.survey_thank_you': 'Vielen Dank für Ihren Kommentar! Ihr Feedback ist sehr wertvoll für uns.',
    'notifications.general_request_title': 'Allgemeine Anfrage',
  },
  
  fr: {
    // Titres de menu
    'menu.title': 'Menu Service Chambre',
    'menu.back': 'Retour',
    'menu.search': 'Recherche...',
    'menu.categories': 'Catégories',
    'menu.items': 'Articles',
    
    // Catégories
    'category.all': 'Tous',
    'category.breakfast': 'Petit-déjeuner',
    'category.main': 'Plats Principaux',
    'category.appetizer': 'Entrées',
    'category.dessert': 'Desserts',
    'category.beverage': 'Boissons',
    'category.snack': 'Collations',
    'menu.subcategories': 'Sous-catégories',
    
    // Sous-catégories
    'subcategory.classic': 'Classique',
    'subcategory.meat': 'Viande',
    'subcategory.fish': 'Poisson',
    'subcategory.hot': 'Chaud',
    'subcategory.juice': 'Jus',
    
    // Informations produit
    'product.price': '€',
    'product.preparation': 'Préparation',
    'product.minutes': 'min',
    'product.rating': 'Note',
    'product.allergens': 'Allergènes',
    'product.add_to_cart': 'Ajouter au Panier',
    'product.quantity': 'Quantité',
    'product.total': 'Total',
    'product.show_details': 'Détails',
    'product.show_less': 'Afficher Moins',
    
    // Panier
    'cart.title': 'Mon Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.remove': 'Supprimer',
    'cart.checkout': 'Commander',
    'cart.add_products': 'Sélectionnez des articles du menu pour les ajouter au panier',
    
    // Général
    'general.loading': 'Chargement...',
    'general.error': 'Une erreur s\'est produite',
    'general.success': 'Succès',
    'general.cancel': 'Annuler',
    'general.confirm': 'Confirmer',
    'general.save': 'Enregistrer',
    'general.edit': 'Modifier',
    'general.delete': 'Supprimer',
    'general.no_products': 'Aucun Produit Trouvé',
    'general.no_search_results': 'Aucun produit trouvé correspondant à vos critères de recherche.',
    'general.no_category_products': 'Aucun produit disponible dans cette catégorie.',
    
    // Interface Chambre
    'room.welcome': 'Bienvenue',
    'room.services': 'Services',
    'room.room_service': 'Service Chambre',
    'room.housekeeping': 'Ménage',
    'room.maintenance': 'Maintenance',
    'room.concierge': 'Concierge',
    'room.wifi': 'WiFi',
    'room.menu': 'Menu',
    'room.survey': 'Enquête',
    'room.social_media': 'Réseaux Sociaux',
    'room.follow_us': 'Suivez-nous',
    'room.quick_select': 'Sélection Rapide',
    'room.request_details': 'Détails de la Demande',
    'room.quantity': 'Quantité',
    'room.send_request': 'Envoyer la Demande',
    
    // Sélection rapide
    'quick.towel': 'Serviette',
    'quick.slippers': 'Pantoufles',
    'quick.toothpaste': 'Dentifrice',
    'quick.pillow': 'Oreiller',
    'quick.blanket': 'Couverture',
    'quick.shampoo': 'Shampoing',
    'quick.soap': 'Savon',
    'quick.water': 'Eau',
    
    // Enquête/Évaluation
    'survey.title': 'Évaluez-nous',
    'survey.cleanliness': 'Propreté',
    'survey.service': 'Service Chambre',
    'survey.staff': 'Personnel',
    'survey.overall': 'Satisfaction Globale',
    'survey.comment': 'Commentaire (Optionnel)',
    'survey.comment_placeholder': 'Partagez votre expérience avec nous...',
    'survey.submit': 'Soumettre à l\'Hôtel',
    'survey.google_review': 'Évaluer sur Google',
    'survey.thank_you': 'Merci!',
    'survey.submitted': 'Votre évaluation a été soumise avec succès.',
    
    // Notifications
    'notifications.housekeeping_title': 'Demande de Ménage',
    'notifications.housekeeping_message': 'Votre demande de ménage a été envoyée à la réception. Vous recevrez une réponse sous peu.',
    'notifications.housekeeping_description': 'Ménage demandé',
    'notifications.maintenance_title': 'Problème Technique',
    'notifications.maintenance_message': 'Votre demande de problème technique a été envoyée à la réception. Notre personnel est en route pour les urgences.',
    'notifications.maintenance_description': 'Problème technique signalé',
    'notifications.survey_title': 'Évaluation',
    'notifications.survey_thank_you': 'Merci pour votre commentaire! Votre retour est très précieux pour nous.',
    'notifications.general_request_title': 'Demande Générale',
  },
  
  es: {
    // Títulos de menú
    'menu.title': 'Menú Servicio Habitación',
    'menu.back': 'Atrás',
    'menu.search': 'Buscar...',
    'menu.categories': 'Categorías',
    'menu.items': 'Artículos',
    
    // Categorías
    'category.all': 'Todos',
    'category.breakfast': 'Desayuno',
    'category.main': 'Platos Principales',
    'category.appetizer': 'Entrantes',
    'category.dessert': 'Postres',
    'category.beverage': 'Bebidas',
    'category.snack': 'Aperitivos',
    'menu.subcategories': 'Subcategorías',
    
    // Subcategorías
    'subcategory.classic': 'Clásico',
    'subcategory.meat': 'Carne',
    'subcategory.fish': 'Pescado',
    'subcategory.hot': 'Caliente',
    'subcategory.juice': 'Jugo',
    
    // Información del producto
    'product.price': '€',
    'product.preparation': 'Preparación',
    'product.minutes': 'min',
    'product.rating': 'Calificación',
    'product.allergens': 'Alérgenos',
    'product.add_to_cart': 'Añadir al Carrito',
    'product.quantity': 'Cantidad',
    'product.total': 'Total',
    'product.show_details': 'Detalles',
    'product.show_less': 'Mostrar Menos',
    
    // Carrito
    'cart.title': 'Mi Carrito',
    'cart.empty': 'Tu carrito está vacío',
    'cart.remove': 'Eliminar',
    'cart.checkout': 'Pedir',
    'cart.add_products': 'Selecciona artículos del menú para añadir al carrito',
    
    // General
    'general.loading': 'Cargando...',
    'general.error': 'Ocurrió un error',
    'general.success': 'Éxito',
    'general.cancel': 'Cancelar',
    'general.confirm': 'Confirmar',
    'general.save': 'Guardar',
    'general.edit': 'Editar',
    'general.delete': 'Eliminar',
    'general.no_products': 'No se Encontraron Productos',
    'general.no_search_results': 'No se encontraron productos que coincidan con tus criterios de búsqueda.',
    'general.no_category_products': 'No hay productos disponibles en esta categoría.',
    
    // Interfaz Habitación
    'room.welcome': 'Bienvenido',
    'room.services': 'Servicios',
    'room.room_service': 'Servicio Habitación',
    'room.housekeeping': 'Limpieza',
    'room.maintenance': 'Mantenimiento',
    'room.concierge': 'Conserjería',
    'room.wifi': 'WiFi',
    'room.menu': 'Menú',
    'room.survey': 'Encuesta',
    'room.social_media': 'Redes Sociales',
    'room.follow_us': 'Síguenos',
    'room.quick_select': 'Selección Rápida',
    'room.request_details': 'Detalles de la Solicitud',
    'room.quantity': 'Cantidad',
    'room.send_request': 'Enviar Solicitud',
    
    // Selección rápida
    'quick.towel': 'Toalla',
    'quick.slippers': 'Pantuflas',
    'quick.toothpaste': 'Pasta Dental',
    'quick.pillow': 'Almohada',
    'quick.blanket': 'Manta',
    'quick.shampoo': 'Champú',
    'quick.soap': 'Jabón',
    'quick.water': 'Agua',
    
    // Encuesta/Evaluación
    'survey.title': 'Evalúanos',
    'survey.cleanliness': 'Limpieza',
    'survey.service': 'Servicio Habitación',
    'survey.staff': 'Personal',
    'survey.overall': 'Satisfacción General',
    'survey.comment': 'Comentario (Opcional)',
    'survey.comment_placeholder': 'Comparte tu experiencia con nosotros...',
    'survey.submit': 'Enviar al Hotel',
    'survey.google_review': 'Evaluar en Google',
    'survey.thank_you': '¡Gracias!',
    'survey.submitted': 'Tu evaluación ha sido enviada exitosamente.',
    
    // Notificaciones
    'notifications.housekeeping_title': 'Solicitud de Limpieza',
    'notifications.housekeeping_message': 'Tu solicitud de limpieza ha sido enviada a recepción. Recibirás una respuesta pronto.',
    'notifications.housekeeping_description': 'Limpieza solicitada',
    'notifications.maintenance_title': 'Problema Técnico',
    'notifications.maintenance_message': 'Tu solicitud de problema técnico ha sido enviada a recepción. Nuestro personal está en camino para emergencias.',
    'notifications.maintenance_description': 'Problema técnico reportado',
    'notifications.survey_title': 'Evaluación',
    'notifications.survey_thank_you': '¡Gracias por tu comentario! Tu retroalimentación es muy valiosa para nosotros.',
    'notifications.general_request_title': 'Solicitud General',
  },
  
  it: {
    // Titoli menu
    'menu.title': 'Menu Servizio Camera',
    'menu.back': 'Indietro',
    'menu.search': 'Cerca...',
    'menu.categories': 'Categorie',
    'menu.items': 'Articoli',
    
    // Categorie
    'category.all': 'Tutti',
    'category.breakfast': 'Colazione',
    'category.main': 'Piatti Principali',
    'category.appetizer': 'Antipasti',
    'category.dessert': 'Dolci',
    'category.beverage': 'Bevande',
    'category.snack': 'Snack',
    'menu.subcategories': 'Sottocategorie',
    
    // Sottocategorie
    'subcategory.classic': 'Classico',
    'subcategory.meat': 'Carne',
    'subcategory.fish': 'Pesce',
    'subcategory.hot': 'Caldo',
    'subcategory.juice': 'Succo',
    
    // Informazioni prodotto
    'product.price': '€',
    'product.preparation': 'Preparazione',
    'product.minutes': 'min',
    'product.rating': 'Valutazione',
    'product.allergens': 'Allergeni',
    'product.add_to_cart': 'Aggiungi al Carrello',
    'product.quantity': 'Quantità',
    'product.total': 'Totale',
    'product.show_details': 'Dettagli',
    'product.show_less': 'Mostra Meno',
    
    // Carrello
    'cart.title': 'Il Mio Carrello',
    'cart.empty': 'Il tuo carrello è vuoto',
    'cart.remove': 'Rimuovi',
    'cart.checkout': 'Ordina',
    'cart.add_products': 'Seleziona articoli dal menu per aggiungere al carrello',
    
    // Generale
    'general.loading': 'Caricamento...',
    'general.error': 'Si è verificato un errore',
    'general.success': 'Successo',
    'general.cancel': 'Annulla',
    'general.confirm': 'Conferma',
    'general.save': 'Salva',
    'general.edit': 'Modifica',
    'general.delete': 'Elimina',
    'general.no_products': 'Nessun Prodotto Trovato',
    'general.no_search_results': 'Nessun prodotto trovato che corrisponda ai tuoi criteri di ricerca.',
    'general.no_category_products': 'Nessun prodotto disponibile in questa categoria.',
    
    // Interfaccia Camera
    'room.welcome': 'Benvenuto',
    'room.services': 'Servizi',
    'room.room_service': 'Servizio Camera',
    'room.housekeeping': 'Pulizia',
    'room.maintenance': 'Manutenzione',
    'room.concierge': 'Concierge',
    'room.wifi': 'WiFi',
    'room.menu': 'Menu',
    'room.survey': 'Sondaggio',
    'room.social_media': 'Social Media',
    'room.follow_us': 'Seguici',
    'room.quick_select': 'Selezione Rapida',
    'room.request_details': 'Dettagli Richiesta',
    'room.quantity': 'Quantità',
    'room.send_request': 'Invia Richiesta',
    
    // Selezione rapida
    'quick.towel': 'Asciugamano',
    'quick.slippers': 'Pantalofole',
    'quick.toothpaste': 'Dentifricio',
    'quick.pillow': 'Cuscino',
    'quick.blanket': 'Coperta',
    'quick.shampoo': 'Shampoo',
    'quick.soap': 'Sapone',
    'quick.water': 'Acqua',
    
    // Sondaggio/Valutazione
    'survey.title': 'Valutaci',
    'survey.cleanliness': 'Pulizia',
    'survey.service': 'Servizio Camera',
    'survey.staff': 'Personale',
    'survey.overall': 'Soddisfazione Generale',
    'survey.comment': 'Commento (Opzionale)',
    'survey.comment_placeholder': 'Condividi la tua esperienza con noi...',
    'survey.submit': 'Invia all\'Hotel',
    'survey.google_review': 'Valuta su Google',
    'survey.thank_you': 'Grazie!',
    'survey.submitted': 'La tua valutazione è stata inviata con successo.',
    
    // Notifiche
    'notifications.housekeeping_title': 'Richiesta Pulizia',
    'notifications.housekeeping_message': 'La tua richiesta di pulizia è stata inviata alla reception. Riceverai una risposta a breve.',
    'notifications.housekeeping_description': 'Pulizia richiesta',
    'notifications.maintenance_title': 'Problema Tecnico',
    'notifications.maintenance_message': 'La tua richiesta di problema tecnico è stata inviata alla reception. Il nostro personale è in viaggio per le emergenze.',
    'notifications.maintenance_description': 'Problema tecnico segnalato',
    'notifications.survey_title': 'Valutazione',
    'notifications.survey_thank_you': 'Grazie per il tuo commento! Il tuo feedback è molto prezioso per noi.',
    'notifications.general_request_title': 'Richiesta Generale',
  },
  
  zh: {
    // 菜单标题
    'menu.title': '客房服务菜单',
    'menu.back': '返回',
    'menu.search': '搜索...',
    'menu.categories': '分类',
    'menu.items': '项目',
    
    // 分类
    'category.all': '全部',
    'category.breakfast': '早餐',
    'category.main': '主菜',
    'category.appetizer': '开胃菜',
    'category.dessert': '甜点',
    'category.beverage': '饮料',
    'category.snack': '小吃',
    'menu.subcategories': '子分类',
    
    // 子分类
    'subcategory.classic': '经典',
    'subcategory.meat': '肉类',
    'subcategory.fish': '鱼类',
    'subcategory.hot': '热饮',
    'subcategory.juice': '果汁',
    
    // 产品信息
    'product.price': '¥',
    'product.preparation': '准备',
    'product.minutes': '分钟',
    'product.rating': '评分',
    'product.allergens': '过敏原',
    'product.add_to_cart': '加入购物车',
    'product.quantity': '数量',
    'product.total': '总计',
    'product.show_details': '详情',
    'product.show_less': '显示更少',
    
    // 购物车
    'cart.title': '我的购物车',
    'cart.empty': '您的购物车是空的',
    'cart.remove': '移除',
    'cart.checkout': '结账',
    'cart.add_products': '从菜单中选择项目添加到购物车',
    
    // 一般
    'general.loading': '加载中...',
    'general.error': '发生错误',
    'general.success': '成功',
    'general.cancel': '取消',
    'general.confirm': '确认',
    'general.save': '保存',
    'general.edit': '编辑',
    'general.delete': '删除',
    'general.no_products': '未找到产品',
    'general.no_search_results': '没有找到符合您搜索条件的产品。',
    'general.no_category_products': '此类别中没有可用产品。',
    
    // 房间界面
    'room.welcome': '欢迎',
    'room.services': '服务',
    'room.room_service': '客房服务',
    'room.housekeeping': '清洁',
    'room.maintenance': '维护',
    'room.concierge': '礼宾',
    'room.wifi': 'WiFi',
    'room.menu': '菜单',
    'room.survey': '调查',
    'room.social_media': '社交媒体',
    'room.follow_us': '关注我们',
    'room.quick_select': '快速选择',
    'room.request_details': '请求详情',
    'room.quantity': '数量',
    'room.send_request': '发送请求',
    
    // 快速选择
    'quick.towel': '毛巾',
    'quick.slippers': '拖鞋',
    'quick.toothpaste': '牙膏',
    'quick.pillow': '枕头',
    'quick.blanket': '毯子',
    'quick.shampoo': '洗发水',
    'quick.soap': '肥皂',
    'quick.water': '水',
    
    // 调查/评估
    'survey.title': '评价我们',
    'survey.cleanliness': '清洁度',
    'survey.service': '客房服务',
    'survey.staff': '员工',
    'survey.overall': '整体满意度',
    'survey.comment': '评论（可选）',
    'survey.comment_placeholder': '与我们分享您的体验...',
    'survey.submit': '提交给酒店',
    'survey.google_review': '在Google上评价',
    'survey.thank_you': '谢谢！',
    'survey.submitted': '您的评价已成功提交。',
    
    // 通知
    'notifications.housekeeping_title': '清洁请求',
    'notifications.housekeeping_message': '您的清洁请求已发送到前台。您将很快收到回复。',
    'notifications.housekeeping_description': '请求清洁',
    'notifications.maintenance_title': '技术问题',
    'notifications.maintenance_message': '您的技术问题请求已发送到前台。我们的员工正在路上处理紧急情况。',
    'notifications.maintenance_description': '报告技术问题',
    'notifications.survey_title': '评估',
    'notifications.survey_thank_you': '感谢您的评论！您的反馈对我们非常宝贵。',
    'notifications.general_request_title': '一般请求',
  },
};

interface LanguageStore {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  getTranslation: (key: string) => string;
  getCurrentLanguage: () => Language;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'tr',
      
      setLanguage: (language: string) => {
        set({ currentLanguage: language });
      },
      
      getTranslation: (key: string) => {
        const { currentLanguage } = get();
        const langTranslations = translations[currentLanguage];
        return langTranslations?.[key] || key;
      },
      
      getCurrentLanguage: () => {
        const { currentLanguage } = get();
        return languages.find(lang => lang.code === currentLanguage) || languages[0];
      },
    }),
    {
      name: 'language-store',
      skipHydration: false, // Hydration'ı etkinleştir
    }
  )
);
