import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';

interface PreviewTableProps {
  data: any[][];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border text-sm bg-white">
        <thead>
          <tr>
            {data[0].map((cell, idx) => (
              <th key={idx} className="border px-2 py-1 bg-gray-100 font-semibold">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1, 11).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border px-2 py-1">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 11 && <div className="text-xs text-gray-400 mt-1">İlk 10 satır gösteriliyor...</div>}
    </div>
  );
};

const FIELD_OPTIONS = [
  { value: '', label: '--- Eşleştir ---' },
  { value: 'name', label: 'Ürün Adı (zorunlu)' },
  { value: 'price', label: 'Fiyat (zorunlu)' },
  { value: 'description', label: 'Açıklama' },
  { value: 'category', label: 'Kategori' },
  { value: 'image', label: 'Görsel' },
];

const REQUIRED_FIELDS = ['name', 'price'];

function slugify(input: string): string {
  return (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const MenuUploadPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [mapping, setMapping] = useState<string[]>([]);
  const [mappingDone, setMappingDone] = useState(false);
  const [mappedItems, setMappedItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [imagesMsg, setImagesMsg] = useState<string | null>(null);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSaveMsg(null);
    setImagesMsg(null);
    setMapping([]);
    setMappedItems([]);
    setMappingDone(false);
    setProgress(0);
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 15 * 1024 * 1024) {
      setError('Dosya çok büyük (maks 15MB).');
      return;
    }
    setFile(selected);
    setLoading(true);
    setPreviewData([]);
    try {
      const formData = new FormData();
      formData.append('file', selected);
      const res = await axios.post('/api/menu/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        }
      });
      setPreviewData(res.data?.data || []);
      setMapping(Array(res.data?.data?.[0]?.length || 0).fill(''));
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Bilinmeyen hata';
      setError(msg);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const handleMappingChange = (colIdx: number, value: string) => {
    const newMapping = [...mapping];
    newMapping[colIdx] = value;
    setMapping(newMapping);
  };

  const handleMappingSubmit = () => {
    const mappedFields = new Set(mapping);
    const missing = REQUIRED_FIELDS.filter((f) => !mappedFields.has(f));
    if (missing.length > 0) {
      setError(`Zorunlu alanlar eşleşmeli: ${missing.map(f => FIELD_OPTIONS.find(opt => opt.value === f)?.label).join(', ')}`);
      return;
    }
    setError(null);
    const result = previewData.slice(1).map((row) => {
      const obj: any = {};
      mapping.forEach((field, idx) => {
        if (field) obj[field] = row[idx];
      });
      if (obj.price && typeof obj.price === 'string') {
        const normalized = obj.price.replace(/[^0-9.,-]/g, '').replace(',', '.');
        const num = Number(normalized);
        if (!isNaN(num)) obj.price = num;
      }
      return obj;
    });
    setMappedItems(result);
    setMappingDone(true);
  };

  const handleBulkImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagesMsg(null);
    const files = e.target.files;
    if (!files || files.length === 0 || mappedItems.length === 0) return;

    const nameToIndex = new Map<string, number>();
    mappedItems.forEach((it, idx) => {
      const s = slugify(String(it.name || ''));
      if (s) nameToIndex.set(s, idx);
    });

    let matched = 0;
    const updated = [...mappedItems];
    const newBlobUrls: string[] = [];

    Array.from(files).forEach((file) => {
      const base = (file.name || '').replace(/\.[^.]+$/, '');
      const slug = slugify(base);
      const idx = nameToIndex.get(slug);
      if (idx !== undefined) {
        const url = URL.createObjectURL(file);
        newBlobUrls.push(url);
        updated[idx] = { ...updated[idx], image: url };
        matched += 1;
      }
    });

    blobUrls.forEach(url => URL.revokeObjectURL(url));
    setBlobUrls(newBlobUrls);

    setMappedItems(updated);
    setImagesMsg(`${matched} görsel eşleşti`);
  };

  const handleSave = async () => {
    if (!mappingDone || mappedItems.length === 0) return;
    try {
      setSaving(true);
      setSaveMsg(null);
      const res = await fetch('/api/menu/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: mappedItems }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSaveMsg(json?.error || 'Kaydetme hatası');
        return;
      }
      setSaveMsg(`Kaydedildi (${json.count})`);
    } catch (err: any) {
      setSaveMsg('Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4">Menü Dosyası Yükle</h2>
      <input
        type="file"
        accept=".xlsx,.xls,.csv,.xml,.pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="mb-2"
      />
      {loading && (
        <div className="w-full bg-gray-100 rounded h-2 overflow-hidden mb-2">
          <div className="bg-orange-500 h-2 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <PreviewTable data={previewData} />
      {previewData.length > 0 && mapping.length > 0 && !mappingDone && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Sütunları eşleştir:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs bg-white">
              <thead>
                <tr>
                  {previewData[0].map((header: string, idx: number) => (
                    <th key={idx} className="border px-2 py-1 bg-gray-100 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
                <tr>
                  {previewData[0].map((_: string, idx: number) => (
                    <td key={idx} className="border px-2 py-1">
                      <select
                        value={mapping[idx]}
                        onChange={e => setMapping(m => { const n=[...m]; n[idx]=e.target.value; return n; })}
                        className="border rounded px-1 py-0.5 text-xs"
                      >
                        {FIELD_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1, 4).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="border px-2 py-1">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-semibold"
            onClick={handleMappingSubmit}
          >
            Eşleştirmeyi Onayla
          </button>
        </div>
      )}
      {mappingDone && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-green-600 font-semibold">Eşleştirme tamamlandı!</div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`bg-hotel-navy text-white px-4 py-2 rounded ${saving ? 'opacity-70' : 'hover:bg-blue-800'} transition-colors`}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            {saveMsg && <span className="text-sm text-gray-600">{saveMsg}</span>}
          </div>
          <div className="pt-2 border-t">
            <div className="font-semibold mb-2">Toplu Görsel Yükle (dosya adıyla otomatik eşleştir)</div>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleBulkImagesChange} />
            {imagesMsg && <div className="text-sm text-gray-600 mt-1">{imagesMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuUploadPanel;
