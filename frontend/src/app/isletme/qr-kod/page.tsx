"use client";

import { useState, useEffect } from 'react';
import { QrCode, Download, Printer, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode.react';
import QRCodeGenerator from 'qrcode';

export default function QRKodPage() {
  const [selectedRoom, setSelectedRoom] = useState('101');
  const [qrCodeURL, setQRCodeURL] = useState('');
  const [copied, setCopied] = useState(false);
  const [customRoom, setCustomRoom] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [baseURL, setBaseURL] = useState('');
  const [floorCount, setFloorCount] = useState(4);
  const [roomsPerFloor, setRoomsPerFloor] = useState(5);
  const [rooms, setRooms] = useState([]);
  const [customRooms, setCustomRooms] = useState([]);
  const [selectedCustomRoom, setSelectedCustomRoom] = useState('');
  
  // Otomatik oda oluşturma fonksiyonu
  const generateRooms = (floors, roomsPerFloor) => {
    const generatedRooms = [];
    for (let floor = 1; floor <= floors; floor++) {
      for (let room = 1; room <= roomsPerFloor; room++) {
        const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
        generatedRooms.push({
          number: roomNumber,
          floor: floor
        });
      }
    }
    return generatedRooms;
  };

  useEffect(() => {
    // Client-side'da baseURL'i ayarla
    setBaseURL(window.location.origin);
  }, []);

  useEffect(() => {
    // Kat ve oda sayısı değiştiğinde odaları yeniden oluştur
    const generatedRooms = generateRooms(floorCount, roomsPerFloor);
    setRooms(generatedRooms);
    
    // İlk odayı seç
    if (generatedRooms.length > 0) {
      setSelectedRoom(generatedRooms[0].number);
      setQRCodeURL(`${baseURL}/guest/${generatedRooms[0].number}`);
    }
  }, [floorCount, roomsPerFloor, baseURL]);

  const handleCopy = () => {
    const currentRoom = showCustomInput ? selectedCustomRoom : selectedRoom;
    const url = qrCodeURL || `${baseURL}/guest/${currentRoom}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustomRoom = () => {
    if (customRoom.trim() && !customRooms.find(room => room.number === customRoom.trim())) {
      const newRoom = {
        number: customRoom.trim(),
        floor: 'Özel',
        isCustom: true
      };
      setCustomRooms([...customRooms, newRoom]);
      setSelectedCustomRoom(customRoom.trim());
      setQRCodeURL(`${baseURL}/guest/${customRoom.trim()}`);
      setCustomRoom('');
    }
  };

  const handleDeleteCustomRoom = (roomNumber) => {
    setCustomRooms(customRooms.filter(room => room.number !== roomNumber));
    if (selectedCustomRoom === roomNumber) {
      setSelectedCustomRoom('');
      setQRCodeURL('');
    }
  };

  const handlePrint = async () => {
    const currentRoom = showCustomInput ? selectedCustomRoom : selectedRoom;
    const url = qrCodeURL || `${baseURL}/guest/${currentRoom}`;
    
    try {
      // QR kod PNG olarak oluştur
      const qrDataURL = await QRCodeGenerator.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      console.log('QR kod oluşturuldu:', qrDataURL.substring(0, 50) + '...');
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>QR Kod - Oda ${currentRoom}</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0;
                font-family: Arial, sans-serif;
                background: white;
              }
              .container {
                text-align: center;
                padding: 40px;
                border: 2px solid #d4af37;
                border-radius: 12px;
                background: white;
                max-width: 500px;
                width: 100%;
              }
              .qr-container {
                margin: 30px auto;
                padding: 20px;
                background: white;
                border: 3px solid #d4af37;
                border-radius: 12px;
                display: inline-block;
              }
              .qr-image {
                width: 300px;
                height: 300px;
                display: block;
                border: none;
              }
              h1 { 
                color: #1e3a8a; 
                font-size: 36px;
                margin-bottom: 20px;
                font-weight: bold;
              }
              .url-text { 
                color: #666; 
                margin-top: 20px;
                font-size: 14px;
                word-break: break-all;
                background: #f8f9fa;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid #e9ecef;
              }
              .instructions {
                margin-top: 30px;
                text-align: left;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
                padding: 20px;
                background: #f0f9ff;
                border-radius: 8px;
                border: 1px solid #bae6fd;
              }
              .instructions h3 {
                color: #1e3a8a;
                font-size: 18px;
                margin-bottom: 15px;
                font-weight: bold;
              }
              .instructions ol {
                color: #666;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
                padding-left: 20px;
              }
              .instructions li {
                margin-bottom: 8px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Oda ${currentRoom}</h1>
              <div class="qr-container">
                <img src="${qrDataURL}" alt="QR Kod - Oda ${currentRoom}" class="qr-image" onload="console.log('QR kod yüklendi')" onerror="console.error('QR kod yüklenemedi')" />
              </div>
              <div class="url-text">
                <strong>URL:</strong> ${url}
              </div>
              <div class="instructions">
                <h3>Kullanım Talimatları:</h3>
                <ol>
                  <li>Bu QR kodu oda içinde görünür bir yere yerleştirin</li>
                  <li>Misafirler QR kodu tarayarak menüye erişebilir</li>
                  <li>QR kod her zaman güncel menüyü gösterir</li>
                  <li>İnternet bağlantısı gereklidir</li>
                </ol>
              </div>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        
        // Yazdırma işlemini biraz geciktir
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
      alert('QR kod oluşturulurken hata oluştu: ' + error.message);
    }
  };

  const handleDownload = async () => {
    const currentRoom = showCustomInput ? selectedCustomRoom : selectedRoom;
    const url = qrCodeURL || `${baseURL}/guest/${currentRoom}`;
    
    try {
      // QR kod PNG olarak oluştur
      const qrDataURL = await QRCodeGenerator.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // PNG dosyası olarak indir
      const link = document.createElement('a');
      link.href = qrDataURL;
      link.download = `qr-kod-oda-${currentRoom}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('QR kod indirme hatası:', error);
      alert('QR kod indirilirken hata oluştu: ' + error.message);
    }
  };

  const handleDownloadAll = async () => {
    const roomsToDownload = showCustomInput ? customRooms : rooms;
    
    if (roomsToDownload.length === 0) {
      alert('İndirilecek oda bulunamadı!');
      return;
    }
    
    try {
      // Tüm odalar için QR kodları oluştur
      const qrPromises = roomsToDownload.map(async (room) => {
        const url = `${baseURL}/guest/${room.number}`;
        const qrDataURL = await QRCodeGenerator.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        return {
          room: room.number,
          floor: room.floor,
          url: url,
          qrDataURL: qrDataURL
        };
      });
      
      const qrData = await Promise.all(qrPromises);
      
      // HTML dosyası oluştur
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Kodlar - Tüm Odalar</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: #f8f9fa;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header h1 {
              color: #1e3a8a;
              margin-bottom: 10px;
            }
            .rooms-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
            }
            .room { 
              margin: 0; 
              padding: 20px; 
              border: 2px solid #d4af37; 
              border-radius: 12px; 
              background: white;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .room h3 { 
              color: #1e3a8a; 
              margin-bottom: 15px; 
              font-size: 18px;
            }
            .qr-code { 
              margin: 15px 0; 
            }
            .qr-image {
              width: 200px;
              height: 200px;
              border: 2px solid #d4af37;
              border-radius: 8px;
            }
            .url { 
              color: #666; 
              font-size: 12px; 
              word-break: break-all; 
              background: #f8f9fa;
              padding: 8px;
              border-radius: 4px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>QR Kodlar - ${roomsToDownload.length} Oda</h1>
            <p>Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}</p>
          </div>
          
          <div class="rooms-grid">
            ${qrData.map(room => `
              <div class="room">
                <h3>Oda ${room.room} - Kat ${room.floor}</h3>
                <div class="qr-code">
                  <img src="${room.qrDataURL}" alt="QR Kod - Oda ${room.room}" class="qr-image" />
                </div>
                <div class="url">URL: ${room.url}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>Bu QR kodlar otomatik olarak oluşturulmuştur.</p>
            <p>Her QR kod ilgili oda için özeldir.</p>
          </div>
        </body>
        </html>
      `;
      
      // HTML dosyası olarak indir
      const dataBlob = new Blob([htmlContent], { type: 'text/html' });
      const url_download = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url_download;
      link.download = `qr-kodlar-tum-odalar-${roomsToDownload.length}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url_download);
    } catch (error) {
      console.error('Toplu QR kod indirme hatası:', error);
      alert('QR kodlar indirilirken hata oluştu!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">QR Kod Oluşturucu</h1>
        <p className="text-gray-600">Her oda için özel QR kod oluşturun ve yazdırın</p>
      </div>

      {/* Main QR Generator */}
      <div className="hotel-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oda Seçimi
              </label>
              
              {/* Oda Konfigürasyonu */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">Otel Konfigürasyonu</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      Kat Sayısı
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={floorCount}
                      onChange={(e) => setFloorCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      Her Katta Oda Sayısı
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={roomsPerFloor}
                      onChange={(e) => setRoomsPerFloor(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-600">
                  <strong>Toplam:</strong> {floorCount * roomsPerFloor} oda oluşturulacak
                  <br />
                  <strong>Örnek:</strong> {floorCount} kat × {roomsPerFloor} oda = {generateRooms(floorCount, roomsPerFloor).slice(0, 3).map(r => r.number).join(', ')}...
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomRoom('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showCustomInput
                      ? 'bg-hotel-gold text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Otomatik Odalar ({rooms.length})
                </button>
                <button
                  onClick={() => setShowCustomInput(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showCustomInput
                      ? 'bg-hotel-gold text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Özel Odalar ({customRooms.length})
                </button>
              </div>

              {/* Otomatik Odalar Dropdown */}
              {!showCustomInput && (
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    setQRCodeURL(`${baseURL}/guest/${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent text-lg"
                >
                  {rooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Oda {room.number} - Kat {room.floor}
                    </option>
                  ))}
                </select>
              )}

              {/* Özel Odalar */}
              {showCustomInput && (
                <div className="space-y-4">
                  {/* Yeni Oda Ekleme */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-3">Yeni Özel Oda Ekle</h4>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customRoom}
                        onChange={(e) => setCustomRoom(e.target.value)}
                        placeholder="Örn: 201, 301, A101, Suite-1..."
                        className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveCustomRoom()}
                      />
                      <button
                        onClick={handleSaveCustomRoom}
                        disabled={!customRoom.trim()}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                      >
                        Kaydet
                      </button>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      Enter tuşuna basarak da kaydedebilirsiniz
                    </p>
                  </div>

                  {/* Kaydedilen Özel Odalar */}
                  {customRooms.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Kaydedilen Özel Odalar ({customRooms.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {customRooms.map((room) => (
                          <div
                            key={room.number}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              selectedCustomRoom === room.number
                                ? 'border-hotel-gold bg-hotel-gold text-white'
                                : 'border-gray-200 hover:border-hotel-gold hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedCustomRoom(room.number);
                              setQRCodeURL(`${baseURL}/guest/${room.number}`);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-sm">{room.number}</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCustomRoom(room.number);
                                }}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Kod URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrCodeURL || `${baseURL}/guest/${showCustomInput ? selectedCustomRoom : selectedRoom}`}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Yazdır
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                İndir
              </button>

              {showCustomInput && customRooms.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tümünü İndir ({customRooms.length})
                </button>
              )}
              {!showCustomInput && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tümünü İndir ({rooms.length})
                </button>
              )}
            </div>
          </div>

          {/* Right Side - QR Preview */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
            <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-xl">
                {qrCodeURL || `${baseURL}/guest/${showCustomInput ? selectedCustomRoom : selectedRoom}` ? (
                  <QRCode
                    value={qrCodeURL || `${baseURL}/guest/${showCustomInput ? selectedCustomRoom : selectedRoom}`}
                    size={192}
                    level="M"
                    includeMargin={true}
                    renderAs="svg"
                    className="qr-code-svg"
                  />
                ) : (
                  <QrCode className="w-48 h-48 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Oda {showCustomInput ? customRoom : selectedRoom}
              </h3>
              <p className="text-sm text-gray-600">
                QR kodu tarayarak misafirleriniz menüye erişebilir
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="hotel-card p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-3">QR Kod Kullanım Talimatları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-hotel-gold text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">1</span>
                  <span>Her oda için benzersiz QR kod oluşturulur</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-hotel-gold text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">2</span>
                  <span>Misafirler QR kodu tarayarak doğrudan oda menüsüne erişir</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-hotel-gold text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">3</span>
                  <span>QR kodu yazdırıp oda içine yerleştirebilirsiniz</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-hotel-gold text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">4</span>
                  <span>Tüm odalar için toplu QR kod oluşturabilirsiniz</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-hotel-gold text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">5</span>
                  <span>QR kodlar kalıcıdır, yeniden oluşturmanıza gerek yoktur</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-hotel-gold text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">6</span>
                  <span>Misafirler telefonları ile QR kodu okutarak sipariş verebilir</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Room Grid */}
      {!showCustomInput && rooms.length > 0 && (
        <div className="hotel-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Hızlı Oda Seçimi</h3>
            <div className="text-sm text-gray-500">
              {rooms.length} oda • {floorCount} kat • Kat başına {roomsPerFloor} oda
            </div>
          </div>
          
          {/* Kat bazında gruplandırma */}
          {Array.from({ length: floorCount }, (_, floorIndex) => {
            const floorNumber = floorIndex + 1;
            const floorRooms = rooms.filter(room => room.floor === floorNumber);
            
            return (
              <div key={floorNumber} className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {floorNumber}. Kat ({floorRooms.length} oda)
                </h4>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {floorRooms.map((room) => (
                    <button
                      key={room.number}
                      onClick={() => {
                        setSelectedRoom(room.number);
                        setQRCodeURL(`${baseURL}/guest/${room.number}`);
                      }}
                      className={`p-2 rounded-lg border-2 transition-all text-xs ${
                        selectedRoom === room.number
                          ? 'border-hotel-gold bg-hotel-gold text-white'
                          : 'border-gray-200 hover:border-hotel-gold hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold">{room.number}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

