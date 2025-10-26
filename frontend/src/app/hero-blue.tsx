"use client";
import { QrCode } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroBlue() {
  const router = useRouter();
  return (
    <section className="w-full min-h-[600px] bg-white flex flex-col md:flex-row items-center justify-between py-20 md:py-28 px-6 md:px-16">
      {/* Sol BloK */}
      <div className="w-full md:w-1/2 max-w-xl">
        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-lg mb-10 shadow-sm border border-blue-100">
          <QrCode className="w-6 h-6 text-blue-500" /> QR Kodlu Otel Deneyimi
        </span>
        <h1 className="text-[2.8rem] md:text-6xl font-black text-slate-900 mb-2 leading-[1.07] tracking-tight">
          Otelinizde Dijital Dönüşüm:
        </h1>
        {/* Başlık altı kısa sistem avantajı info */}
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 font-medium text-base rounded px-4 py-2 mb-2">
            Mevcut sisteminizi değiştirmeden hemen kullanmaya başlayın.
          </span>
        </div>
        <div className="text-[2.3rem] md:text-5xl font-black mb-8 leading-[1.07] tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">QR ile Anında Hizmet</span>
        </div>
        <p className="text-xl text-slate-600 mb-8 max-w-xl font-medium">
          Oda QR menü ile hızlı sipariş, anlık deneyim ve 
          <span className="text-blue-700 font-bold"> %40 gelir artışı</span>. Türkiye'nin yeni jenerasyon otel çözümü.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-4">
          <button
            onClick={() => router.push("/paneller")}
            className="px-7 py-4 rounded-2xl text-xl font-bold bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 min-w-[210px] justify-center"
          >
            Canlı QR Demo <span className="ml-1 text-2xl">→</span>
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
      <div className="w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0">
        <div className="relative">
          <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-green-200 shadow-2xl flex items-center justify-center">
            <QrCode className="w-40 h-40 sm:w-56 sm:h-56 text-white drop-shadow-xl" />
          </div>
          <div className="absolute -inset-5 z-[-1] rounded-full bg-black/10 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
