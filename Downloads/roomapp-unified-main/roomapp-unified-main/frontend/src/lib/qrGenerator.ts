// QR Code Generator
export interface QRGeneratorOptions {
  text: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export class QRGenerator {
  static generateQRCode(options: QRGeneratorOptions): string {
    // Mock QR code generation
    const { text, size = 200, color = '#000000', backgroundColor = '#ffffff' } = options;
    
    // In a real implementation, you would use a QR code library like 'qrcode'
    // For now, return a placeholder data URL
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="${color}" font-size="14">
          QR: ${text}
        </text>
      </svg>
    `)}`;
  }

  static generateRoomQR(roomId: string): string {
    return this.generateQRCode({
      text: `room-${roomId}`,
      size: 200,
    });
  }

  // Yeni: Müşteri adını içeren dinamik QR kod
  static generateGuestRoomQR(roomId: string, guestName?: string): string {
    const qrText = guestName 
      ? `room-${roomId}-${guestName.replace(/\s+/g, '-').toLowerCase()}`
      : `room-${roomId}`;
    
    return this.generateQRCode({
      text: qrText,
      size: 200,
    });
  }

  static generateMenuQR(menuId: string): string {
    return this.generateQRCode({
      text: `menu-${menuId}`,
      size: 200,
    });
  }

  static generateRoomQRCode(roomId: string): string {
    return this.generateRoomQR(roomId);
  }

  // Yeni: Müşteri adını içeren QR kod için
  static generateRoomQRCodeWithGuest(roomId: string, guestName?: string): string {
    return this.generateGuestRoomQR(roomId, guestName);
  }
}

// Export for compatibility
export const qrGenerator = QRGenerator;

// Export individual functions
export const generateRoomQRCode = QRGenerator.generateRoomQRCode;
export const generateRoomQR = QRGenerator.generateRoomQR;
export const generateMenuQR = QRGenerator.generateMenuQR;