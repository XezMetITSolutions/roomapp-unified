"use client";
import { QrCode } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroBlue() {
  const router = useRouter();
  return (
    <section className="w-full min-h-[400px] md:min-h-[600px] bg-white flex flex-col md:flex-row items-center justify-between py-12 md:py-28 px-4 md:px-16">
      {/* Sol BloK */}
      <div className="w-full md:w-1/2 max-w-xl">
        <span className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs md:text-lg mb-6 md:mb-10 shadow-sm border border-blue-100">
          <QrCode className="w-4 h-4 md:w-6 md:h-6 text-blue-500" /> QR Kodlu Otel Deneyimi
        </span>
        <h1 className="text-2xl md:text-[2.8rem] lg:text-6xl font-black text-slate-900 mb-2 leading-[1.07] tracking-tight">
          Otelinizde Dijital Dönüşüm:
        </h1>
        {/* Başlık altı kısa sistem avantajı info */}
        <div className="mb-2 md:mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 font-medium text-xs md:text-base rounded px-3 md:px-4 py-1.5 md:py-2 mb-2">
            Mevcut sisteminizi değiştirmeden hemen kullanmaya başlayın.
          </span>
        </div>
        <div className="text-2xl md:text-[2.3rem] lg:text-5xl font-black mb-6 md:mb-8 leading-[1.07] tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">QR ile Anında Hizmet</span>
        </div>
        <p className="text-base md:text-xl text-slate-600 mb-6 md:mb-8 max-w-xl font-medium">
          Oda QR menü ile hızlı sipariş, anlık deneyim ve 
          <span className="text-blue-700 font-bold"> %40 gelir artışı</span>. Türkiye'nin yeni jenerasyon otel çözümü.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-5 mb-4">
          <button
            onClick={() => router.push("/guest/demo")}
            className="w-full sm:w-auto px-6 md:px-7 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-xl font-bold bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 justify-center"
          >
            Canlı QR Demo <span className="ml-1 text-xl md:text-2xl">→</span>
          </button>
          <a
            href="#packages"
            className="mt-2 sm:mt-0 text-lg text-slate-600 underline font-medium hover:text-blue-700"
          >
            fiyatları incele
          </a>
        </div>
      </div>
      {/* Sağda büyük QR ve glow */}
      <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
        <div className="relative">
          <div className="w-[200px] h-[200px] md:w-[340px] md:h-[340px] lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-green-200 shadow-2xl flex items-center justify-center">
            <QrCode className="w-24 h-24 md:w-40 md:h-40 lg:w-56 lg:h-56 text-white drop-shadow-xl" />
          </div>
          <div className="absolute -inset-3 md:-inset-5 z-[-1] rounded-full bg-black/10 blur-2xl md:blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
