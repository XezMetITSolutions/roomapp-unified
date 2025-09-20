'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHotelStore } from '@/store/hotelStore';
import { QrCode, ArrowLeft, Download, Eye, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode.react';
import { generateRoomQRCode } from '@/lib/qrGenerator';

export default function QRGeneratorPage() {
  const router = useRouter();
  const { rooms } = useHotelStore();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [copiedRoom, setCopiedRoom] = useState<string>('');

  const handleCopyQRUrl = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      const qrUrl = generateRoomQRCode(room);
      navigator.clipboard.writeText(qrUrl);
      setCopiedRoom(roomId);
      setTimeout(() => setCopiedRoom(''), 2000);
    }
  };

  const handleDownloadQR = (roomId: string) => {
    const canvas = document.getElementById(`qr-${roomId}`) as HTMLCanvasElement;
    if (canvas) {
      const room = rooms.find(r => r.id === roomId);
      const link = document.createElement('a');
      link.download = `room-${room?.number}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handlePreviewRoom = (roomId: string) => {
    window.open(`/guest/${roomId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
                <p className="text-gray-600">Generate and manage QR codes for hotel rooms</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{rooms.length} rooms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">How to use QR codes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Each room has a unique QR code that guests can scan</li>
            <li>• QR codes link directly to the guest interface for that specific room</li>
            <li>• Print and place QR codes in rooms for easy guest access</li>
            <li>• Guests can access hotel info, room service, and make requests via QR codes</li>
          </ul>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const qrUrl = generateRoomQRCode(room);
            
            return (
              <div key={room.id} className="hotel-card p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Room {room.number}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {room.type} • Floor {room.floor}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                    room.status === 'vacant' ? 'bg-green-100 text-green-800' :
                    room.status === 'cleaning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {room.status.toUpperCase()}
                  </span>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <QRCode
                      id={`qr-${room.id}`}
                      value={qrUrl}
                      size={120}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>

                {/* Guest Info */}
                {room.guestName && (
                  <div className="text-center mb-4 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Current Guest</p>
                    <p className="font-medium text-gray-900">{room.guestName}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handlePreviewRoom(room.id)}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-hotel-navy text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopyQRUrl(room.id)}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      {copiedRoom === room.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDownloadQR(room.id)}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-hotel-gold text-hotel-navy rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* QR URL Display */}
                <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
                  <p className="text-gray-600 mb-1">QR URL:</p>
                  <p className="font-mono text-gray-800 break-all">{qrUrl}</p>
                </div>
              </div>
            );
          })}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600">Add rooms to the system to generate QR codes.</p>
          </div>
        )}

        {/* Bulk Actions */}
        {rooms.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  rooms.forEach(room => {
                    const qrUrl = generateRoomQRCode(room);
                    console.log(`Room ${room.number}: ${qrUrl}`);
                  });
                  alert('All QR URLs have been logged to the console');
                }}
                className="hotel-button text-sm"
              >
                Export All URLs
              </button>
              
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    let printContent = `
                      <html>
                        <head>
                          <title>Hotel Room QR Codes</title>
                          <style>
                            body { font-family: Arial, sans-serif; }
                            .room-qr { 
                              display: inline-block; 
                              margin: 20px; 
                              text-align: center; 
                              page-break-inside: avoid;
                              border: 1px solid #ddd;
                              padding: 20px;
                              border-radius: 8px;
                            }
                            .room-title { 
                              font-size: 18px; 
                              font-weight: bold; 
                              margin-bottom: 10px; 
                            }
                            @media print {
                              .room-qr { margin: 10px; }
                            }
                          </style>
                        </head>
                        <body>
                          <h1>Hotel Room QR Codes</h1>
                    `;
                    
                    rooms.forEach(room => {
                      const canvas = document.getElementById(`qr-${room.id}`) as HTMLCanvasElement;
                      if (canvas) {
                        const qrDataUrl = canvas.toDataURL();
                        printContent += `
                          <div class="room-qr">
                            <div class="room-title">Room ${room.number}</div>
                            <img src="${qrDataUrl}" alt="QR Code for Room ${room.number}" />
                            <div style="font-size: 12px; margin-top: 10px; color: #666;">
                              ${room.type.charAt(0).toUpperCase() + room.type.slice(1)} • Floor ${room.floor}
                            </div>
                          </div>
                        `;
                      }
                    });
                    
                    printContent += '</body></html>';
                    printWindow.document.write(printContent);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
                className="hotel-button-gold text-sm"
              >
                Print All QR Codes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
