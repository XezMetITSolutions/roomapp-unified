"use client";

import { useState, useRef } from 'react';
import { 
  Database, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  FileArchive,
  Download,
  Info,
  X,
  AlertCircle
} from 'lucide-react';
import { adminApiClient } from '@/contexts/AdminAuthContext';

export default function DatabaseRestorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'restoring' | 'success' | 'error'>('idle');
  const [restoreMessage, setRestoreMessage] = useState('');
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // PostgreSQL backup dosyası kontrolü
      if (selectedFile.name.endsWith('.dat') || 
          selectedFile.name.endsWith('.dump') || 
          selectedFile.name.endsWith('.backup') ||
          selectedFile.type === 'application/octet-stream') {
        setFile(selectedFile);
        setStatus('idle');
        setMessage('');
      } else {
        setStatus('error');
        setMessage('Geçersiz dosya formatı. PostgreSQL backup dosyası (.dat, .dump, .backup) yükleyin.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('error');
      setMessage('Lütfen bir dosya seçin');
      return;
    }

    setUploading(true);
    setStatus('uploading');
    setUploadProgress(0);
    setMessage('');

    try {
      // Dosyayı base64'e çevir
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = (e.target?.result as string).split(',')[1] || (e.target?.result as string);
          
          // adminApiClient.request zaten JSON döndürüyor
          const token = localStorage.getItem('admin_token');
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
          
          const uploadResponse = await fetch(`${API_BASE_URL}/api/admin/database/upload-backup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-tenant': 'system-admin',
            },
            body: JSON.stringify({
              backup: base64,
              filename: file.name
            }),
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json().catch(() => ({ message: 'Yükleme hatası' }));
            throw new Error(error.message || 'Yükleme hatası');
          }

          const response = await uploadResponse.json();
          setUploadedFileId(response.fileId);
          setStatus('success');
          setMessage(`Backup dosyası başarıyla yüklendi: ${file.name}`);
          setUploadProgress(100);
        } catch (error: any) {
          setStatus('error');
          setMessage(error.message || 'Yükleme sırasında bir hata oluştu');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
  };

  const handleRestore = async () => {
    if (!uploadedFileId) {
      setRestoreStatus('error');
      setRestoreMessage('Önce backup dosyasını yükleyin');
      return;
    }

    setRestoreStatus('restoring');
    setRestoreMessage('');

    try {
      const token = localStorage.getItem('admin_token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
      
      const restoreResponse = await fetch(`${API_BASE_URL}/api/admin/database/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant': 'system-admin',
        },
        body: JSON.stringify({ fileId: uploadedFileId }),
      });

      if (!restoreResponse.ok) {
        const error = await restoreResponse.json().catch(() => ({ message: 'Restore hatası' }));
        throw new Error(error.message || 'Restore hatası');
      }

      const response = await restoreResponse.json();
      setRestoreStatus('success');
      setRestoreMessage(response.message || 'Veritabanı restore işlemi başlatıldı');
    } catch (error: any) {
      setRestoreStatus('error');
      setRestoreMessage(error.message || 'Restore sırasında bir hata oluştu');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setMessage('');
    setUploadedFileId(null);
    setRestoreStatus('idle');
    setRestoreMessage('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Database className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Veritabanı Restore</h1>
        </div>
        <p className="text-gray-600">PostgreSQL backup dosyasını yükleyip veritabanını restore edin</p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Önemli Bilgiler:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Restore işlemi mevcut veritabanındaki tüm verileri değiştirebilir</li>
              <li>İşlem öncesi mevcut veritabanının yedeğini alın</li>
              <li>PostgreSQL custom format (.dat) veya SQL dump (.sql) dosyaları desteklenir</li>
              <li>Büyük dosyalar için işlem birkaç dakika sürebilir</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-gray-600" />
          Backup Dosyası Yükle
        </h2>

        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Dosyası
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <FileArchive className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Dosya seç</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".dat,.dump,.backup,.sql,.tar,.gz"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      disabled={uploading}
                    />
                  </label>
                  <p className="pl-1">veya sürükle-bırak</p>
                </div>
                <p className="text-xs text-gray-500">
                  PostgreSQL backup (.dat, .dump, .backup, .sql)
                </p>
                {file && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      Seçili dosya: <span className="font-medium">{file.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Boyut: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Yükleniyor...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{message}</p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={!file || uploading || status === 'success'}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Yükle
                </>
              )}
            </button>
            {status === 'success' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Restore Section */}
      {status === 'success' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-gray-600" />
            Veritabanını Restore Et
          </h2>

          <div className="space-y-4">
            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Uyarı!</p>
                  <p>Bu işlem mevcut veritabanındaki tüm verileri değiştirecektir. Devam etmeden önce mevcut veritabanının yedeğini aldığınızdan emin olun.</p>
                </div>
              </div>
            </div>

            {/* Restore Status */}
            {restoreStatus === 'restoring' && (
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Loader2 className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
                <p className="text-sm text-blue-800">Veritabanı restore ediliyor... Bu işlem birkaç dakika sürebilir.</p>
              </div>
            )}

            {restoreStatus === 'success' && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">{restoreMessage}</p>
              </div>
            )}

            {restoreStatus === 'error' && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">{restoreMessage}</p>
              </div>
            )}

            {/* Restore Button */}
            <button
              onClick={handleRestore}
              disabled={restoreStatus === 'restoring' || restoreStatus === 'success'}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
            >
              {restoreStatus === 'restoring' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Restore Ediliyor...
                </>
              ) : restoreStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Restore Tamamlandı
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Veritabanını Restore Et
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

