'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hotel, QrCode, Settings, CheckCircle, Star, Play, Shield, Globe, Smartphone, CreditCard, Zap, ChevronDown, ChevronUp, Camera, Image, Users, TrendingUp, Clock, DollarSign, Heart, MessageCircle, BarChart3, Award, Target, Sparkles, ArrowRight, CheckCircle2, XCircle, Lightbulb, Megaphone, ThumbsUp, Share2, Instagram, Facebook, Twitter } from 'lucide-react';
import { Language } from '@/types';
import { translate } from '@/lib/translations';
import HeroBlue from './hero-blue';

export default function HomePage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [accordionOpen, setAccordionOpen] = useState<{[key: string]: number | null}>({ 'yillik': null, '6aylik': null, 'sube': null });

  useEffect(() => {
    // Tüm elementleri hemen görünür yap - animasyonları kaldır
    const elements = document.querySelectorAll('[data-scroll]');
    elements.forEach((el) => {
      setVisibleElements(prev => new Set(prev).add(el.id));
    });
    
    // Tüm bölümleri zorla görünür yap
    setTimeout(() => {
      const allElements = [
        'features-header', 'how-it-works-header', 'ai-enhancement-header',
        'benefits-header', 'social-header', 'ai-process', 'ai-demo',
        'social-process', 'social-demo'
      ];
      allElements.forEach(id => {
        setVisibleElements(prev => new Set(prev).add(id));
      });
    }, 100);
  }, []);

  const features = [
    { icon: QrCode, title: 'QR Kod Sistemi', description: 'Her oda için özel QR kod ile misafirler anında menüye erişir', color: 'text-blue-600' },
    { icon: Globe, title: '9 Dil Desteği', description: 'AI destekli çeviri ile uluslararası misafirler için mükemmel deneyim', color: 'text-green-600' },
    { icon: Camera, title: 'AI Görsel İyileştirme', description: 'Telefon çekimlerini profesyonel menü fotoğraflarına dönüştürün', color: 'text-purple-600' },
    { icon: Zap, title: 'Gerçek Zamanlı', description: 'Anlık bildirimler ve güncellemeler ile hızlı hizmet', color: 'text-yellow-600' },
    { icon: CreditCard, title: 'Entegre Ödeme', description: 'Güvenli ödeme sistemi ile oda servisi kolayca', color: 'text-indigo-600' },
    { icon: Smartphone, title: 'Mobil Uyumlu', description: 'Tüm cihazlarda mükemmel çalışan responsive tasarım', color: 'text-pink-600' },
    { icon: Megaphone, title: 'Duyuru Sistemi', description: 'Misafirlere özel kampanyalar ve duyurular gönderin', color: 'text-orange-600' },
    { icon: BarChart3, title: 'Detaylı Analitik', description: 'Satış raporları ve müşteri davranış analizleri', color: 'text-cyan-600' },
    { icon: Shield, title: 'Güvenli Sistem', description: 'Endüstri standardında güvenlik ve veri koruması', color: 'text-red-600' }
  ];

  const packages = [
    { 
      id: '6aylik', 
      name: '6 Aylık Paket', 
      price: 430,
      originalPrice: 470,
      period: 'oda/ay', 
      description: 'En popüler seçenek! Orta vadeli taahhüt ile ideal fiyat/performans.',
      features: [
        { name: 'Sınırsız QR Kod Üretimi', desc: 'Her oda için özel QR menü sistemi. Sınırsız kod oluşturun.' },
        { name: 'Çoklu Dil Desteği (9 Dil)', desc: 'Türkçe, İngilizce, Almanca, Fransızca, Rusça, Arapça, Çince, Japonca, İspanyolca.' },
        { name: 'AI Görsel İyileştirme', desc: 'Telefon fotoğraflarını profesyonel menü görsellerine dönüştürün.' },
        { name: 'Detaylı Satış Raporları', desc: 'Günlük, haftalık, aylık satış analizi ve trend raporları.' },
        { name: 'Mutfak & Resepsiyon Paneli', desc: 'Siparişleri takip edin, misafir taleplerini yönetin.' },
        { name: 'Duyuru & Anket Sistemi', desc: 'Misafirlere özel kampanyalar ve memnuniyet anketleri.' },
        { name: '7/24 Müşteri Desteği', desc: 'Canlı destek, WhatsApp ve telefon desteği.' },
        { name: 'Otomatik Sistem Güncellemeleri', desc: 'Yeni özellikler otomatik olarak eklenir.' },
        { name: 'Sosyal Medya Entegrasyonu', desc: 'Memnun müşterileri sosyal medya hesaplarınıza yönlendirin.' },
        { name: 'Güvenli Ödeme Sistemi', desc: 'SSL şifreleme ile güvenli ödeme altyapısı.' }
      ],
      tag: 'En Popüler',
      color: 'border-amber-300 bg-amber-50',
      popular: false, 
      savings: '8% İndirim'
    },
    { 
      id: 'yillik', 
      name: '1 Yıllık Paket', 
      price: 390, 
      originalPrice: 470,
      period: 'oda/ay', 
      description: 'Uzun vadeli taahhüt ile maksimum tasarruf! En avantajlı seçenek.',
      features: [
        { name: 'Sınırsız QR Kod Üretimi', desc: 'Her oda için özel QR menü sistemi. Sınırsız kod oluşturun.' },
        { name: 'Çoklu Dil Desteği (9 Dil)', desc: 'Türkçe, İngilizce, Almanca, Fransızca, Rusça, Arapça, Çince, Japonca, İspanyolca.' },
        { name: 'AI Görsel İyileştirme', desc: 'Telefon fotoğraflarını profesyonel menü görsellerine dönüştürün.' },
        { name: 'Detaylı Satış Raporları', desc: 'Günlük, haftalık, aylık satış analizi ve trend raporları.' },
        { name: 'Mutfak & Resepsiyon Paneli', desc: 'Siparişleri takip edin, misafir taleplerini yönetin.' },
        { name: 'Duyuru & Anket Sistemi', desc: 'Misafirlere özel kampanyalar ve memnuniyet anketleri.' },
        { name: '7/24 Müşteri Desteği', desc: 'Canlı destek, WhatsApp ve telefon desteği.' },
        { name: 'Otomatik Sistem Güncellemeleri', desc: 'Yeni özellikler otomatik olarak eklenir.' },
        { name: 'Sosyal Medya Entegrasyonu', desc: 'Memnun müşterileri sosyal medya hesaplarınıza yönlendirin.' },
        { name: 'Güvenli Ödeme Sistemi', desc: 'SSL şifreleme ile güvenli ödeme altyapısı.' }
      ],
      tag: 'En Avantajlı',
      color: 'border-blue-300 bg-blue-50',
      popular: true, 
      savings: '17% İndirim'
    },
    { 
      id: 'sube',
      name: 'Çoklu Şube Paketi', 
      price: 350,
      originalPrice: 470,
      period: 'oda/ay', 
      description: 'Otel zincirleri için özel! Merkezi yönetim ve kurumsal entegrasyon.',
      features: [
        { name: 'Merkezi Şube Yönetimi', desc: 'Tüm şubelerinizi tek panelden yönetin ve kontrol edin.' },
        { name: 'Şubeler Arası Analiz', desc: 'Tüm şubelerin performansını karşılaştırın ve analiz edin.' },
        { name: 'Kurumsal API Entegrasyonu', desc: 'Mevcut sistemlerinizle (PMS, Muhasebe, CRM) entegrasyon.' },
        { name: 'Sınırsız QR Kod Üretimi', desc: 'Her oda için özel QR menü sistemi. Sınırsız kod oluşturun.' },
        { name: 'Çoklu Dil Desteği (9 Dil)', desc: 'Türkçe, İngilizce, Almanca, Fransızca, Rusça, Arapça, Çince, Japonca, İspanyolca.' },
        { name: 'AI Görsel İyileştirme', desc: 'Telefon fotoğraflarını profesyonel menü görsellerine dönüştürün.' },
        { name: 'Gelişmiş Raporlama', desc: 'Şube bazlı detaylı satış ve performans raporları.' },
        { name: 'Özel Markalama', desc: 'Her şube için özel logo ve tema özelleştirmesi.' },
        { name: 'Dedicated Müşteri Temsilcisi', desc: 'Size özel müşteri temsilcisi ve öncelikli destek.' },
        { name: 'Özel Eğitim Programı', desc: 'Personeliniz için özel eğitim ve onboarding süreci.' }
      ],
      tag: 'Kurumsal',
      color: 'border-purple-300 bg-purple-50',
      popular: false, 
      savings: '25% İndirim'
    }
  ];

  const faqs = [
    { question: 'AI görsel iyileştirme nasıl çalışır?', answer: 'Telefonunuzla çektiğiniz ürün fotoğraflarını sisteme yüklediğinizde, AI teknolojimiz otomatik olarak arka planı kaldırır, renkleri düzeltir, profesyonel gölgeler ekler ve görseli menü standartlarına uygun hale getirir. Bu işlem sadece birkaç saniye sürer.' },
    { question: 'Kurulum süreci nasıl işliyor?', answer: 'Kurulum sürecimiz çok basit! Paket seçiminizi yaptıktan sonra, teknik ekibimiz 24 saat içinde sizinle iletişime geçer. QR kodlarınızı oluşturur, sisteminizi kurar ve personelinizi eğitir. Tüm süreç 2-3 gün içinde tamamlanır.' },
    { question: 'Sosyal medya entegrasyonu nasıl çalışır?', answer: 'Misafirlerinizden memnuniyet anketleri alırız. Memnun olan misafirleri Instagram, Facebook ve Google My Business profillerinize yönlendiririz. Bu sayede organik takipçi artışı ve gerçek müşteri yorumları elde edersiniz.' },
    { question: '14 gün ücretsiz deneme süresi var mı?', answer: 'Evet! Tüm paketlerimizde 14 gün ücretsiz deneme süresi bulunmaktadır. Bu süre içinde sistemin tüm özelliklerini test edebilir, memnun kalmazsanız hiçbir ücret ödemeden iptal edebilirsiniz.' },
    { question: 'Duyuru sistemi ile ne tür kampanyalar yapabilirim?', answer: 'Misafirlerinize özel indirimler, sezonluk kampanyalar, yeni menü duyuruları, etkinlik bildirimleri ve özel fırsatlar gönderebilirsiniz. Bu sistem sayesinde satışlarınızı %40\'a kadar artırabilirsiniz.' },
    { question: 'İptal etmek istersem ne olur?', answer: 'İptal etmek istediğinizde, sadece kurulum ücreti (299₺) ödemeniz gerekir. 6 ay ve üzeri paket alan müşterilerimiz ilk ay içinde cayma hakkına sahiptir.' },
    { question: 'Teknik destek nasıl sağlanıyor?', answer: 'Premium pakette e-posta desteği, Kurumsal pakette 7/24 telefon desteği sağlıyoruz. Ayrıca canlı destek sistemi ve detaylı dokümantasyon mevcuttur.' },
    { question: 'Verilerim güvende mi?', answer: 'Kesinlikle! Tüm verileriniz SSL şifreleme ile korunur ve sadece sizin erişiminizdedir. GDPR uyumlu veri işleme politikalarımız vardır.' },
    { question: 'Mevcut sistemimle entegre olabilir mi?', answer: 'Evet! Kurumsal paketimizde API erişimi ve özel entegrasyonlar mevcuttur. Mevcut rezervasyon, muhasebe ve diğer sistemlerinizle sorunsuz entegrasyon sağlayabiliriz.' },
    { question: 'Mevcut rezervasyon, ödeme, PMS ve otel yazılımlarımı değiştirmek zorunda mıyım?', answer: 'Hayır! RoomXQR, otelinizde kullandığınız mevcut sistemlerin üzerine eklenerek, hiçbir şeyi değiştirmeden dijital deneyimi anında başlatır. Hali hazırda kullandığınız tüm yazılımlar aynı şekilde çalışır. RoomXQR sadece misafir arayüzüne ve çağrı/menü sisteminize ek dijital kanal getirir, herhangi bir mevcut sistemi bozmaz/silmez.' },
    { question: 'RoomXQR başladığında eski cihazlar/depolama/fiziksel işlemlerim çalışmaya devam eder mi?', answer: 'Tabii ki! RoomXQR, mevcut operasyonlarınız devam ederken size ek bir dijital kanal ve kolaylık sağlar. İstediğiniz kadar klasik yöntemleri paralel kullanmaya devam edebilirsiniz.' }
  ];

  const stats = [
    { number: '15+', label: 'Mutlu Otel' },
    { number: '1.5K+', label: 'Günlük Sipariş' },
    { number: '99.9%', label: 'Kesintisiz Hizmet' },
    { number: '24/7', label: 'Destek' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div id="hero">
        <HeroBlue />
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                id={`stat-${index}`}
                data-scroll
                className="text-center group"
              >
                <div className="text-3xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-xs md:text-base text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative py-16 bg-gradient-to-r from-amber-50 to-blue-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d4af37%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 font-semibold">
            <Shield className="w-5 h-5 mr-2" />
            Güvenilir ve Test Edilmiş Teknoloji
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="features-header"
            data-scroll
            className="text-center mb-8 md:mb-20"
          >
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Zap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Güçlü Özellikler
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-3 md:mb-6">Neden RoomXQR?</h2>
            <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">Modern otel yönetimi için ihtiyacınız olan tüm özellikler tek platformda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  id={`feature-${index}`}
                  data-scroll
                  className="group p-4 md:p-8 text-center rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-14 h-14 md:w-20 md:h-20 ${feature.color} bg-opacity-10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300` }>
                    <IconComponent className={`w-7 h-7 md:w-10 md:h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="how-it-works-header"
            data-scroll
            className="text-center mb-8 md:mb-20 opacity-100 translate-y-0"
          >
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Basit Süreç
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-6 tracking-tight">Nasıl Çalışır?</h2>
            <p className="text-base md:text-xl text-slate-600">3 basit adımda otelinizi dijitalleştirin</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '1', 
                title: 'Paket Seçin', 
                description: 'İhtiyacınıza uygun paketi seçin ve hemen başlayın', 
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              { 
                step: '2', 
                title: 'QR Kodlarınızı Alın', 
                description: 'Her oda için özel QR kodlarınızı oluşturun', 
                color: 'from-emerald-500 to-emerald-600',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200'
              },
              { 
                step: '3', 
                title: 'Hizmete Başlayın', 
                description: 'Misafirleriniz QR kodları tarayarak tüm ihtiyaçlarını çözebilir', 
                color: 'from-amber-500 to-amber-600',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200'
              }
            ].map((step, index) => {
              return (
                <div 
                  key={index} 
                  id={`step-${index}`}
                  data-scroll
                  className="text-center group opacity-100 translate-y-0"
                >
                  <div className={`w-24 h-24 md:w-32 md:h-32 ${step.bgColor} ${step.borderColor} border-2 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className={`w-14 h-14 md:w-20 md:h-20 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black bg-gradient-to-br ${step.color} shadow-xl`}>
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-sm md:text-lg text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Image Enhancement Section */}
      <div className="py-12 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="ai-enhancement-header"
            data-scroll
            className="text-center mb-8 md:mb-20 opacity-100 translate-y-0"
          >
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              AI Teknolojisi
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-3 md:mb-6 tracking-tight">Telefon Çekimlerinizi Profesyonel Hale Getirin</h2>
            <p className="text-sm md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">Tek tıkla telefon fotoğraflarınızı profesyonel menü görsellerine dönüştürün</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div 
              id="ai-process"
              data-scroll
              className="opacity-100 translate-x-0"
            >
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fotoğraf Çekin veya Yükleyin</h3>
                    <p className="text-slate-600">Telefonunuzla çektiğiniz ürün fotoğrafını sisteme yükleyin</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI Otomatik İyileştirme</h3>
                    <p className="text-slate-600">Arka plan kaldırma, renk düzeltme, gölge ekleme ve profesyonel görünüm</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Menünüze Ekleyin</h3>
                    <p className="text-slate-600">Profesyonel görsel otomatik olarak menünüze eklenir</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="ai-demo"
              data-scroll
              className="opacity-100 translate-x-0"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                <div className="grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-5 text-center">
                    <div className="text-sm text-slate-500 mb-2">Önce</div>
                    <div className="bg-white rounded-3xl p-0 h-84 shadow-xl overflow-hidden flex items-end justify-center">
                      <div className="relative w-full h-[320px]">
                        <img 
                          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop" 
                          alt="Telefon ile çekilmiş yemek fotoğrafı" 
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-base py-2 px-3">Telefon Çekimi</div>
                        </div>
                      </div>
                    </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-5xl lg:text-7xl font-black text-slate-300">→</span>
                  </div>
                  <div className="col-span-5 text-center">
                    <div className="text-sm text-slate-500 mb-2">Sonra</div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-0 h-84 shadow-xl overflow-hidden flex items-end justify-center">
                      <div className="relative w-full h-[320px]">
                        <img 
                          src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500&h=400&fit=crop" 
                          alt="AI ile iyileştirilmiş profesyonel yemek fotoğrafı" 
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-base py-2 px-3 font-medium">Profesyonel</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold shadow-lg">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Tek Tıkla Dönüşüm
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Fotografçı Masrafı Yok',
                description: 'Profesyonel fotoğrafçı ve tasarımcı masraflarından kurtulun',
                color: 'from-green-500 to-emerald-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
              },
              {
                icon: Clock,
                title: 'Anında Hazır',
                description: 'Fotoğraf çekim ve tasarım süreçlerini beklemeyin',
                color: 'from-blue-500 to-cyan-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              {
                icon: Target,
                title: 'Mükemmel Sonuç',
                description: 'Her fotoğraf profesyonel standartlarda işlenir',
                color: 'from-purple-500 to-pink-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index}
                  id={`ai-benefit-${index}`}
                  data-scroll
                  className={`${benefit.bgColor} ${benefit.borderColor} border rounded-3xl p-8 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 opacity-100 translate-y-0`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="benefits-header"
            data-scroll
            className="text-center mb-8 md:mb-20 opacity-100 translate-y-0"
          >
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Star className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Faydalar
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-6 tracking-tight">RoomXQR ile Ayrıcalıklar</h2>
            <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">Otel işletmenizi dönüştüren, müşteri memnuniyetini artıran kapsamlı çözümler</p>
          </div>
          
          {/* Customer Benefits */}
          <div className="mb-8 md:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Müşterilerinize Ne Sunarsınız?</h3>
              <p className="text-base md:text-lg text-slate-600">Misafirlerinizin deneyimini dönüştüren özellikler</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: '9 Dil Desteği',
                  description: 'AI çeviri ile her misafir kendi dilinde iletişim kurabilir',
                  color: 'from-blue-500 to-indigo-600',
                  bgColor: 'bg-blue-50',
                  borderColor: 'border-blue-200'
                },
                {
                  icon: Zap,
                  title: 'Anında Hizmet',
                  description: 'QR kod ile tek tıkla sipariş, rezervasyon ve hizmet talebi',
                  color: 'from-yellow-500 to-orange-600',
                  bgColor: 'bg-yellow-50',
                  borderColor: 'border-yellow-200'
                },
                {
                  icon: Heart,
                  title: 'Kişiselleştirilmiş Deneyim',
                  description: 'Her misafirin tercihleri kaydedilir ve hatırlanır',
                  color: 'from-pink-500 to-rose-600',
                  bgColor: 'bg-pink-50',
                  borderColor: 'border-pink-200'
                },
                {
                  icon: Megaphone,
                  title: 'Özel Kampanyalar',
                  description: 'Duyuru sistemi ile misafirlere özel indirimler ve fırsatlar',
                  color: 'from-purple-500 to-violet-600',
                  bgColor: 'bg-purple-50',
                  borderColor: 'border-purple-200'
                },
                {
                  icon: MessageCircle,
                  title: 'Direkt İletişim',
                  description: 'Resepsiyon beklemeden direkt ilgili birimle iletişim',
                  color: 'from-green-500 to-emerald-600',
                  bgColor: 'bg-green-50',
                  borderColor: 'border-green-200'
                },
                {
                  icon: ThumbsUp,
                  title: 'Kolay Geri Bildirim',
                  description: 'Anket sistemi ile memnuniyet ölçümü ve iyileştirme',
                  color: 'from-cyan-500 to-teal-600',
                  bgColor: 'bg-cyan-50',
                  borderColor: 'border-cyan-200'
                }
              ].map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div 
                    key={index}
                    id={`customer-benefit-${index}`}
                    data-scroll
                    className={`${benefit.bgColor} ${benefit.borderColor} border rounded-3xl p-6 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 opacity-100 translate-y-0`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Benefits */}
          <div className="mb-8 md:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Siz Ne Kazanırsınız?</h3>
              <p className="text-base md:text-lg text-slate-600">İşletmenizi büyüten ve verimliliği artıran faydalar</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: '%40 Gelir Artışı',
                  description: 'Kolay sipariş süreci ile müşteri harcamaları artar',
                  color: 'from-green-500 to-emerald-600',
                  bgColor: 'bg-green-50',
                  borderColor: 'border-green-200'
                },
                {
                  icon: Clock,
                  title: '%70 Daha Az Telefon',
                  description: 'Resepsiyon trafiği azalır, acil durumlara odaklanılır',
                  color: 'from-blue-500 to-cyan-600',
                  bgColor: 'bg-blue-50',
                  borderColor: 'border-blue-200'
                },
                {
                  icon: DollarSign,
                  title: 'Fotografçı Masrafı Yok',
                  description: 'AI ile profesyonel görseller, tasarımcı masrafı yok',
                  color: 'from-purple-500 to-pink-600',
                  bgColor: 'bg-purple-50',
                  borderColor: 'border-purple-200'
                },
                {
                  icon: BarChart3,
                  title: 'Detaylı Analitik',
                  description: 'Satış raporları ve müşteri davranış analizleri',
                  color: 'from-indigo-500 to-purple-600',
                  bgColor: 'bg-indigo-50',
                  borderColor: 'border-indigo-200'
                },
                {
                  icon: Share2,
                  title: 'Sosyal Medya Trafiği',
                  description: 'Anket sistemi ile organik takipçi ve Google yorumları',
                  color: 'from-orange-500 to-red-600',
                  bgColor: 'bg-orange-50',
                  borderColor: 'border-orange-200'
                },
                {
                  icon: Award,
                  title: 'Müşteri Memnuniyeti',
                  description: '%85 artan memnuniyet, tekrar tercih oranı yükselir',
                  color: 'from-yellow-500 to-amber-600',
                  bgColor: 'bg-yellow-50',
                  borderColor: 'border-yellow-200'
                }
              ].map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div 
                    key={index}
                    id={`business-benefit-${index}`}
                    data-scroll
                    className={`${benefit.bgColor} ${benefit.borderColor} border rounded-3xl p-6 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 opacity-100 translate-y-0`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

      {/* Social Media Integration Section */}
      <div className="py-12 md:py-24 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="social-header"
            data-scroll
            className="text-center mb-8 md:mb-20 opacity-100 translate-y-0"
          >
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Sosyal Medya Entegrasyonu
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-3 md:mb-6 tracking-tight">Organik Takipçi ve Google Yorumları</h2>
            <p className="text-sm md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">Anket sistemi ile sosyal medya hesaplarınıza organik trafik çekin</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div 
              id="social-process"
              data-scroll
              className="opacity-100 translate-x-0"
            >
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Misafir Anketleri</h3>
                    <p className="text-slate-600">Konaklama sonrası memnuniyet anketleri gönderin</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Sosyal Medya Yönlendirme</h3>
                    <p className="text-slate-600">Memnun misafirleri Instagram, Facebook ve Google'a yönlendirin</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Organik Büyüme</h3>
                    <p className="text-slate-600">Gerçek müşteri yorumları ile organik takipçi artışı</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="social-demo"
              data-scroll
              className="opacity-100 translate-x-0"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                </div>
                      <span className="font-semibold text-slate-900">Memnuniyet Anketi</span>
              </div>
                    <p className="text-slate-600 text-sm mb-4">Konaklamanız nasıldı?</p>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900">Sosyal Medya</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">Bizi takip edin ve deneyiminizi paylaşın!</p>
                    <div className="flex space-x-2">
                      <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">Instagram</div>
                      <div className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Facebook</div>
                      <div className="px-3 py-1 bg-red-500 text-white text-xs rounded-full">Google</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Instagram,
                title: 'Instagram Takipçi',
                description: 'Memnun misafirlerinizi Instagram hesabınıza yönlendirin',
                color: 'from-pink-500 to-purple-600',
                bgColor: 'bg-pink-50',
                borderColor: 'border-pink-200'
              },
              {
                icon: Facebook,
                title: 'Facebook Etkileşim',
                description: 'Facebook sayfanızda organik etkileşim artışı',
                color: 'from-blue-500 to-indigo-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              {
                icon: Award,
                title: 'Google Yorumları',
                description: 'Google My Business profilinizde 5 yıldızlı yorumlar',
                color: 'from-yellow-500 to-orange-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index}
                  id={`social-benefit-${index}`}
                  data-scroll
                  className={`${benefit.bgColor} ${benefit.borderColor} border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div id="packages" className="py-12 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-20">
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Star className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Fiyatlandırma
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-6 tracking-tight">Paketlerimiz</h2>
            <p className="text-base md:text-xl text-slate-300">İhtiyacınıza uygun paketi seçin, 14 gün ücretsiz deneyin</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`relative p-6 md:p-10 rounded-2xl md:rounded-3xl bg-white/5 border border-white/20 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-200 ${pkg.popular ? 'ring-2 ring-amber-400 scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="px-8 py-3 rounded-full text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg">
                      ⭐ En Popüler
                    </div>
                  </div>
                )}
                <div className="text-center mb-6 md:mb-10">
                  <div className="flex items-center justify-center mb-3 md:mb-4">
                    {pkg.id === 'yillik' ? (
                      <div className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-blue-500/20 text-blue-300 text-xs md:text-sm font-semibold">{pkg.tag}</div>
                    ) : pkg.id === '6aylik' ? (
                      <div className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-amber-500/20 text-amber-300 text-xs md:text-sm font-semibold">{pkg.tag}</div>
                    ) : (
                      <div className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm font-semibold">{pkg.tag}</div>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">{pkg.name}</h3>
                  <p className="text-sm md:text-base text-slate-300 mb-4 md:mb-6">{pkg.description}</p>
                  <div className="relative mb-6 md:mb-10">
                    <div className="absolute -inset-2 md:-inset-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent blur-lg"></div>
                    <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-4 md:p-6 rounded-xl border border-white/10">
                      <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-2">
                        <span className="text-4xl md:text-6xl font-black bg-gradient-to-br from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">{pkg.price}</span>
                    <div className="text-left">
                          <div className="text-amber-300 font-medium">TL</div>
                          <div className="text-slate-400 text-sm">/{pkg.period}</div>
                    </div>
                  </div>
                      
                      {pkg.price !== pkg.originalPrice && (
                        <div className="flex flex-col items-center">
                          <div className="text-lg text-slate-500 line-through mb-2">{pkg.originalPrice} TL</div>
                          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 text-emerald-300 text-sm font-bold">
                            {pkg.savings}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 text-center text-xs text-slate-400">
                        {pkg.id === 'yillik' ? '1 yıllık peşin ödeme' : pkg.id === '6aylik' ? '6 aylık peşin ödeme' : 'Çoklu şube özel fiyat'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-10">
                  {pkg.features.map((feature, index) => (
                    <div key={feature.name} className="">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-left text-slate-200 font-semibold hover:bg-white/10 transition-all duration-150 group"
                        onClick={() => setAccordionOpen((open) => ({ ...open, [pkg.id]: open[pkg.id] === index ? null : index }))}
                      >
                        <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                          <span>{feature.name}</span>
                        </div>
                        {accordionOpen[pkg.id] === index ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 transition-transform duration-100" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-100" />
                        )}
                      </button>
                      {accordionOpen[pkg.id] === index && (
                        <div className="px-4 py-3 text-sm text-slate-300 bg-slate-800/80 rounded-b-lg border-t border-slate-600">
                          {feature.desc}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/isletme')} className={`w-full py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all hover:scale-[1.02] ${pkg.popular ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 shadow-xl shadow-amber-500/25' : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 border border-slate-600'}`}>
                  {pkg.popular ? '🚀 Hemen Başla' : 'Paketi Seç'}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-300">
              <Shield className="w-6 h-6 mr-3 text-amber-400" />
              <span className="font-semibold">14 gün ücretsiz deneme • İlk ay iptal hakkı (sadece kurulum ücreti ödenir) • İhtiyacınız kadar oda, o kadar QR kod</span>
            </div>
          </div>
          
          {/* Ödeme Bilgileri */}
          <div className="mt-16 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-70"></div>
            <div className="relative p-10 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mr-4">
                  <span className="text-3xl">💳</span>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">Ödeme Bilgileri</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mr-4">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">Kurulum Ücreti</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-blue-300 mb-2">15.000 TL</div>
                    <p className="text-slate-300 text-sm">Tek seferlik ödeme</p>
                    <p className="text-slate-400 text-xs mt-2">Sistem kurulumu, QR kodların hazırlanması dahil</p>
                      </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mr-4">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">Eğitim Ücreti</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-300 mb-2">7.500 TL</div>
                    <p className="text-slate-300 text-sm">Tek seferlik ödeme</p>
                    <p className="text-slate-400 text-xs mt-2">Tüm personel için kapsamlı eğitim</p>
                </div>
              </div>
              
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mr-4">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">Minimum Ücret</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-purple-300 mb-2">15.000 TL</div>
                    <p className="text-slate-300 text-sm">Aylık minimum ödeme</p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 md:mb-4 tracking-tight">Sıkça Sorulan Sorular</h2>
            <p className="text-base md:text-xl text-gray-600">Merak ettiğiniz her şey burada</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-md">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between text-left">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-3 md:pr-4">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="mt-4 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_70%)]"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs md:text-sm font-medium mb-6 md:mb-8">
            <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Hemen Başlayın
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white mb-3 md:mb-6 tracking-tight">Otelinizi Dijitalleştirin</h2>
          <p className="text-lg md:text-2xl text-slate-300 mb-8 md:mb-12 leading-relaxed">Sadece birkaç dakikada modern otel yönetimine geçin</p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <button onClick={() => router.push('/isletme')} className="px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl text-base md:text-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-2xl shadow-amber-500/25 hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 hover:scale-105 hover:shadow-3xl">
              🚀 Ücretsiz Denemeye Başla
            </button>
            <button onClick={() => router.push('/guest/demo')} className="px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl text-base md:text-xl font-bold text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 transition-all duration-200 backdrop-blur-sm hover:scale-105">
              👀 Canlı QR Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">RoomXQR</span>
                  <span className="text-xs text-slate-400 font-medium">QR Solutions</span>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">Otel yönetimini dijitalleştiren, misafir deneyimini dönüştüren kapsamlı çözüm.</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-amber-400">Ürün</h3>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Özellikler
                </a></li>
                <li><a href="#packages" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Paketler
                </a></li>
                <li><a href="/paneller" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Demo
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  API
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-amber-400">Destek</h3>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Yardım Merkezi
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Dokümantasyon
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  İletişim
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Durum
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-amber-400">Şirket</h3>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Hakkımızda
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Kariyer
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Blog
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Basın
                </a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">© 2024 RoomXQR. Tüm hakları saklıdır.</p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-amber-400 text-sm transition-colors">Gizlilik Politikası</a>
                <a href="#" className="text-slate-400 hover:text-amber-400 text-sm transition-colors">Kullanım Şartları</a>
                <a href="#" className="text-slate-400 hover:text-amber-400 text-sm transition-colors">Çerez Politikası</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
