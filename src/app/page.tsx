'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hotel, QrCode, Settings, CheckCircle, Star, Play, Shield, Globe, Smartphone, CreditCard, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '@/types';
import { translate } from '@/lib/translations';

export default function HomePage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-scroll]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: QrCode, title: 'QR Kod Sistemi', description: 'Her oda için özel QR kod ile misafirler anında menüye erişir', color: 'text-blue-600' },
    { icon: Globe, title: '9 Dil Desteği', description: 'AI destekli çeviri ile uluslararası misafirler için mükemmel deneyim', color: 'text-green-600' },
    { icon: Zap, title: 'Gerçek Zamanlı', description: 'Anlık bildirimler ve güncellemeler ile hızlı hizmet', color: 'text-yellow-600' },
    { icon: CreditCard, title: 'Entegre Ödeme', description: 'Güvenli ödeme sistemi ile oda servisi kolayca', color: 'text-purple-600' },
    { icon: Smartphone, title: 'Mobil Uyumlu', description: 'Tüm cihazlarda mükemmel çalışan responsive tasarım', color: 'text-indigo-600' },
    { icon: Shield, title: 'Güvenli Sistem', description: 'Endüstri standardında güvenlik ve veri koruması', color: 'text-red-600' }
  ];

  const packages = [
    { id: 'premium', name: 'Premium Paket', price: 299, originalPrice: 399, period: 'ay', description: 'Küçük ve orta ölçekli oteller için ideal', features: ['50 odaya kadar','QR menü sistemi','9 dil desteği','Temel analitikler','E-posta desteği','Mutfak paneli','Resepsiyon paneli','Mobil uyumlu arayüz'], popular: false, color: 'border-blue-200 bg-blue-50' },
    { id: 'kurumsal', name: 'Kurumsal Paket', price: 599, originalPrice: 799, period: 'ay', description: 'Büyük oteller ve otel zincirleri için', features: ['Sınırsız oda','Gelişmiş QR menü sistemi','Tüm dil desteği','Gelişmiş analitikler','Özel markalama','API erişimi','Öncelikli destek','Özel entegrasyonlar','7/24 telefon desteği','Özel eğitim'], popular: true, color: 'border-gold-200 bg-gold-50' }
  ];

  const faqs = [
    { question: 'Kurulum süreci nasıl işliyor?', answer: 'Kurulum sürecimiz çok basit! Paket seçiminizi yaptıktan sonra, teknik ekibimiz 24 saat içinde sizinle iletişime geçer. QR kodlarınızı oluşturur, sisteminizi kurar ve personelinizi eğitir. Tüm süreç 2-3 gün içinde tamamlanır.' },
    { question: '14 gün ücretsiz deneme süresi var mı?', answer: 'Evet! Tüm paketlerimizde 14 gün ücretsiz deneme süresi bulunmaktadır. Bu süre içinde sistemin tüm özelliklerini test edebilir, memnun kalmazsanız hiçbir ücret ödemeden iptal edebilirsiniz.' },
    { question: 'İptal etmek istersem ne olur?', answer: 'İptal etmek istediğinizde, sadece kurulum ücreti (299₺) ödemeniz gerekir. 6 ay ve üzeri paket alan müşterilerimiz ilk ay içinde cayma hakkına sahiptir.' },
    { question: 'Teknik destek nasıl sağlanıyor?', answer: 'Premium pakette e-posta desteği, Kurumsal pakette 7/24 telefon desteği sağlıyoruz. Ayrıca canlı destek sistemi ve detaylı dokümantasyon mevcuttur.' },
    { question: 'Verilerim güvende mi?', answer: 'Kesinlikle! Tüm verileriniz SSL şifreleme ile korunur ve sadece sizin erişiminizdedir. GDPR uyumlu veri işleme politikalarımız vardır.' },
    { question: 'Mevcut sistemimle entegre olabilir mi?', answer: 'Evet! Kurumsal paketimizde API erişimi ve özel entegrasyonlar mevcuttur. Mevcut rezervasyon, muhasebe ve diğer sistemlerinizle sorunsuz entegrasyon sağlayabiliriz.' }
  ];

  const stats = [
    { number: '500+', label: 'Mutlu Otel' },
    { number: '50K+', label: 'Günlük Sipariş' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Destek' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Türkiye'nin #1 Otel Yönetim Sistemi
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Otelinizi <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Dijitalleştirin - TEST DEPLOY</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
                QR menü sistemi ile misafir deneyimini dönüştürün. Temassız hizmet, çoklu dil desteği ve gerçek zamanlı yönetim.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.open('http://localhost:3000/guest/101', '_blank')} className="px-8 py-4 rounded-xl text-lg font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-xl shadow-amber-500/25 hover:from-amber-500 hover:to-yellow-600 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] hover:shadow-2xl">
                  <Play className="w-5 h-5" />
                  <span>Demo</span>
                </button>
                <a href="#packages" className="px-8 py-4 rounded-xl text-lg font-semibold text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 transition-all text-center backdrop-blur-sm hover:scale-[1.02]">
                  Paketleri İncele
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-slate-400 text-sm">RoomApp Dashboard</div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-amber-300 font-semibold mb-2">Oda 101 - QR Menü</div>
                      <div className="text-slate-300 text-sm">Misafir: John Smith • 2 kişi</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                      <div className="text-slate-400 text-xs mb-2">QR Kod Örneği</div>
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto">
                        <div className="w-12 h-12 bg-black rounded grid grid-cols-3 gap-0.5 p-1">
                          <div className="bg-white rounded-sm"></div>
                          <div className="bg-black rounded-sm"></div>
                          <div className="bg-white rounded-sm"></div>
                          <div className="bg-black rounded-sm"></div>
                          <div className="bg-white rounded-sm"></div>
                          <div className="bg-black rounded-sm"></div>
                          <div className="bg-white rounded-sm"></div>
                          <div className="bg-black rounded-sm"></div>
                          <div className="bg-white rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-slate-400 text-xs mb-1">Siparişler</div>
                        <div className="text-white font-bold">12</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-slate-400 text-xs mb-1">Gelir</div>
                        <div className="text-white font-bold">₺2,450</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                id={`stat-${index}`}
                data-scroll
                className={`text-center group transition-all duration-1000 ${
                  visibleElements.has(`stat-${index}`) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
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
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="features-header"
            data-scroll
            className={`text-center mb-20 transition-all duration-1000 ${
              visibleElements.has('features-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Güçlü Özellikler
            </div>
            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6">Neden RoomApp?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">Modern otel yönetimi için ihtiyacınız olan tüm özellikler tek platformda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  id={`feature-${index}`}
                  data-scroll
                  className={`group p-8 text-center rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-1000 ${
                    visibleElements.has(`feature-${index}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`w-20 h-20 ${feature.color} bg-opacity-10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300` }>
                    <IconComponent className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="how-it-works-header"
            data-scroll
            className={`text-center mb-20 transition-all duration-1000 ${
              visibleElements.has('how-it-works-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium mb-6">
              <Settings className="w-4 h-4 mr-2" />
              Basit Süreç
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Nasıl Çalışır?</h2>
            <p className="text-xl text-slate-600">3 basit adımda otelinizi dijitalleştirin</p>
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
                  className={`text-center group transition-all duration-1000 ${
                    visibleElements.has(`step-${index}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`w-32 h-32 ${step.bgColor} ${step.borderColor} border-2 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className={`w-20 h-20 text-white rounded-2xl flex items-center justify-center text-4xl font-black bg-gradient-to-br ${step.color} shadow-xl`}>
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="benefits-header"
            data-scroll
            className={`text-center mb-20 transition-all duration-1000 ${
              visibleElements.has('benefits-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Faydalar
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">RoomApp ile Ayrıcalıklar</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">Otel işletmenizi dönüştüren, müşteri memnuniyetini artıran kapsamlı çözümler</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div 
              id="benefit-1"
              data-scroll
              className={`transition-all duration-1000 ${
                visibleElements.has('benefit-1') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Dil ve Aksan Farklılıklarından Kaynaklı Hatalar Artık Yok</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  AI destekli çeviri sistemi ile misafirleriniz 9 farklı dilde iletişim kurabilir. 
                  Yanlış anlaşılmalar, sipariş hataları ve iletişim sorunları tamamen ortadan kalkar.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Anlık çeviri desteği</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Kültürel hassasiyet</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />%100 doğru iletişim</li>
                </ul>
              </div>
            </div>
            
            <div 
              id="benefit-2"
              data-scroll
              className={`transition-all duration-1000 ${
                visibleElements.has('benefit-2') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Müşteri-Resepsiyon-İlgili Birim Trafiği Azalır</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  QR kod sistemi ile misafirler doğrudan ilgili birimle iletişim kurar. 
                  Resepsiyon aramaları %70 azalır, acil ihtiyaçlara daha fazla zaman ayrılır.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Direkt birim iletişimi</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />%70 daha az telefon trafiği</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Hızlı çözüm süreçleri</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Acil İhtiyaçlara Odaklanma',
                description: 'Resepsiyon artık sadece acil durumlarla ilgilenir. Günlük rutin istekler QR sistem üzerinden yönetilir.',
                color: 'from-red-500 to-pink-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
              },
              {
                icon: CreditCard,
                title: 'Gelir Artışı',
                description: 'Kolay sipariş süreci ile müşteri harcamaları %40 artar. Ek hizmetler daha kolay satılır.',
                color: 'from-green-500 to-emerald-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
              },
              {
                icon: Star,
                title: 'Müşteri Memnuniyeti',
                description: 'Hızlı ve hatasız hizmet ile müşteri memnuniyeti %85 artar. Tekrar tercih oranı yükselir.',
                color: 'from-amber-500 to-orange-600',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index}
                  id={`benefit-card-${index}`}
                  data-scroll
                  className={`${benefit.bgColor} ${benefit.borderColor} border rounded-3xl p-8 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 ${
                    visibleElements.has(`benefit-card-${index}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
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

      {/* Packages Section */}
      <div id="packages" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Fiyatlandırma
            </div>
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Paketlerimiz</h2>
            <p className="text-xl text-slate-300">İhtiyacınıza uygun paketi seçin, 14 gün ücretsiz deneyin</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`relative p-10 rounded-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 ${pkg.popular ? 'ring-2 ring-amber-400 scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="px-8 py-3 rounded-full text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg">
                      ⭐ En Popüler
                    </div>
                  </div>
                )}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center mb-4">
                    {pkg.id === 'premium' ? (
                      <div className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold">Küçük Oteller</div>
                    ) : (
                      <div className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold">Büyük Oteller</div>
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">{pkg.name}</h3>
                  <p className="text-slate-300 mb-6">{pkg.description}</p>
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <span className="text-6xl font-black text-white">{pkg.price}₺</span>
                    <div className="text-left">
                      <div className="text-slate-400">/{pkg.period}</div>
                      <div className="text-lg text-slate-500 line-through">{pkg.originalPrice}₺</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">
                    %{Math.round((1 - pkg.price / pkg.originalPrice) * 100)} İndirim
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/business')} className={`w-full py-5 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] ${pkg.popular ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 shadow-xl shadow-amber-500/25' : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 border border-slate-600'}`}>
                  {pkg.popular ? '🚀 Hemen Başla' : 'Paketi Seç'}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-300">
              <Shield className="w-6 h-6 mr-3 text-amber-400" />
              <span className="font-semibold">14 gün ücretsiz deneme • İptal edilirse sadece kurulum ücreti (299₺) • 6 ay+ paketlerde ilk ay cayma hakkı</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Sıkça Sorulan Sorular</h2>
            <p className="text-xl text-gray-600">Merak ettiğiniz her şey burada</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-md">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between text-left">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
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
      <div className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-8">
            <Zap className="w-5 h-5 mr-2" />
            Hemen Başlayın
          </div>
          <h2 className="text-6xl font-black text-white mb-6 tracking-tight">Otelinizi Dijitalleştirin</h2>
          <p className="text-2xl text-slate-300 mb-12 leading-relaxed">Sadece birkaç dakikada modern otel yönetimine geçin</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => router.push('/business')} className="px-12 py-6 rounded-2xl text-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-2xl shadow-amber-500/25 hover:from-amber-500 hover:to-yellow-600 transition-all hover:scale-105 hover:shadow-3xl">
              🚀 Ücretsiz Denemeye Başla
            </button>
            <button onClick={() => router.push('/guest/demo')} className="px-12 py-6 rounded-2xl text-xl font-bold text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 transition-all backdrop-blur-sm hover:scale-105">
              👀 Demo İncele
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_60%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Hotel className="w-7 h-7 text-slate-900" />
                </div>
                <span className="text-2xl font-black">RoomApp</span>
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
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center group">
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
              <p className="text-slate-400 text-sm">© 2024 RoomApp. Tüm hakları saklıdır.</p>
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
