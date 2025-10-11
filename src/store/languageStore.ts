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
  { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
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
      skipHydration: true, // Skip hydration to prevent SSR mismatch
    }
  )
);
