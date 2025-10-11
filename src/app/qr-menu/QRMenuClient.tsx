'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, Share2, RefreshCw } from 'lucide-react';

export default function QRMenuClient() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Simulate QR code generation
      const mockQRUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://your-hotel-menu.com';
      setQrCodeUrl(mockQRUrl);
    } catch (error) {
      console.error('QR kod oluşturulurken hata:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'hotel-menu-qr.png';
      link.click();
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        await navigator.share({
          title: 'Otel Menü QR Kodu',
          text: 'Otel menümüzü görüntülemek için bu QR kodu tarayın',
          url: qrCodeUrl,
        });
      } catch (error) {
        console.error('Paylaşım hatası:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(qrCodeUrl);
      alert('QR kod URL\'si panoya kopyalandı!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Menü Yönetimi</h1>
          <p className="text-gray-600">Müşterileriniz için QR menü kodunu oluşturun ve paylaşın</p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Menü QR Kodu</h2>
            
            <div className="flex justify-center mb-6">
              {isGenerating ? (
                <div className="flex items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">QR kod oluşturuluyor...</p>
                  </div>
                </div>
              ) : qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Menü QR Kodu"
                  className="w-48 h-48 border border-gray-200 rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={generateQRCode}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Yeniden Oluştur
              </button>
              
              {qrCodeUrl && (
                <>
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    İndir
                  </button>
                  
                  <button
                    onClick={shareQRCode}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Nasıl Kullanılır?</h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                1
              </div>
              <p>QR kodu oluşturun ve indirin</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                2
              </div>
              <p>QR kodu masalara veya uygun yerlere yerleştirin</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                3
              </div>
              <p>Müşteriler QR kodu tarayarak menünüze erişebilir</p>
            </div>
          </div>
        </div>

        {/* Menu Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menü Önizlemesi</h3>
          <div className="text-center text-gray-500">
            <p>QR kod tarandığında görüntülenecek menü sayfası:</p>
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm">https://your-hotel-menu.com/menu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
