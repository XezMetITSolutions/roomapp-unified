import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Next.js config dosyasını kontrol et
    const configPath = path.join(process.cwd(), 'next.config.js');
    
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({
        success: false,
        error: 'next.config.js dosyası bulunamadı'
      }, { status: 404 });
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Config içeriğini analiz et
    const checks = {
      hasOutputStandalone: configContent.includes("output: 'standalone'"),
      hasOutputExport: configContent.includes("output: 'export'"),
      hasTrailingSlash: configContent.includes('trailingSlash: true'),
      hasImagesUnoptimized: configContent.includes('unoptimized: true'),
      hasIgnoreBuildErrors: configContent.includes('ignoreBuildErrors: true'),
      hasIgnoreDuringBuilds: configContent.includes('ignoreDuringBuilds: true'),
      hasPWA: configContent.includes('withPWA'),
      hasWebpackConfig: configContent.includes('webpack:'),
    };

    const issues = [];
    const warnings = [];

    // Kritik kontroller
    if (checks.hasOutputExport && checks.hasOutputStandalone) {
      issues.push('Hem "export" hem "standalone" output kullanılıyor');
    }

    if (checks.hasPWA) {
      warnings.push('PWA konfigürasyonu aktif - bu sorun çıkarabilir');
    }

    if (!checks.hasOutputStandalone && !checks.hasOutputExport) {
      issues.push('Output konfigürasyonu belirtilmemiş');
    }

    if (!checks.hasTrailingSlash) {
      warnings.push('trailingSlash: true eksik olabilir');
    }

    return NextResponse.json({
      success: true,
      config: {
        path: configPath,
        size: configContent.length,
        checks,
        issues,
        warnings,
        recommendations: [
          'output: "standalone" kullanın (dynamic route\'lar için)',
          'trailingSlash: true ekleyin',
          'images: { unoptimized: true } ekleyin',
          'PWA\'yı kaldırın (sorun çıkarıyorsa)'
        ]
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
