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

  static generateMenuQR(menuId: string): string {
    return this.generateQRCode({
      text: `menu-${menuId}`,
      size: 200,
    });
  }
}

// Export for compatibility
export const qrGenerator = QRGenerator;