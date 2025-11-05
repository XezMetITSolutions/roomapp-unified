"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  Upload,
  Download,
  Menu as MenuIcon,
  Utensils,
  Languages,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { MenuTranslator } from '@/components/MenuTranslator';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  allergens: string[];
  calories?: number;
  preparationTime?: number; // Hazırlık süresi (dakika)
  rating?: number; // İşletme tarafından belirlenen kalite puanı (1.0-5.0)
}

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Menü verileri state'i
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Toast notification state'i
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  // Confirmation modal state'i
  const [confirmModal, setConfirmModal] = useState<{show: boolean, itemId: string | null, itemName: string}>({
    show: false,
    itemId: null,
    itemName: ''
  });

  // Bulk upload state'i
  const [bulkUploadData, setBulkUploadData] = useState<{
    file: File | null;
    parsedData: any[];
    errors: string[];
    isValid: boolean;
  }>({
    file: null,
    parsedData: [],
    errors: [],
    isValid: false
  });

  const categories = ['all', 'Pizza', 'Burger', 'Salata', 'İçecek', 'Tatlı'];

  // Toast notification fonksiyonları
  const showSuccessToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const showErrorToast = (message: string) => {
    setToast({ show: true, message, type: 'error' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Menü verilerini API'den yükle
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          // API'den gelen veriyi menü yönetimi formatına çevir
          const formattedItems = data.menu.map((item: any, index: number) => ({
            id: item.id || `api-${index}`,
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category || 'Diğer',
            isAvailable: item.available !== false,
            allergens: item.allergens || [],
            calories: item.calories,
            image: item.image,
          }));
          
          // Örnek menülerle birleştir
          const defaultItems = [
            {
              id: '1',
              name: 'Margherita Pizza',
              description: 'Domates sosu, mozzarella, fesleğen',
              price: 45,
              category: 'Pizza',
              isAvailable: true,
              allergens: ['Gluten', 'Süt'],
              calories: 280,
            },
            {
              id: '2',
              name: 'Cheeseburger',
              description: 'Dana eti, cheddar peyniri, marul, domates',
              price: 35,
              category: 'Burger',
              isAvailable: true,
              allergens: ['Gluten', 'Süt', 'Yumurta'],
              calories: 520,
            },
            {
              id: '3',
              name: 'Caesar Salad',
              description: 'Marul, parmesan, kruton, caesar sos',
              price: 25,
              category: 'Salata',
              isAvailable: false,
              allergens: ['Gluten', 'Süt', 'Yumurta'],
              calories: 180,
            },
            {
              id: '4',
              name: 'Cappuccino',
              description: 'İtalyan kahvesi, buharda ısıtılmış süt',
              price: 12,
              category: 'İçecek',
              isAvailable: true,
              allergens: ['Süt'],
              calories: 80,
            },
          ];
          
          setMenuItems([...defaultItems, ...formattedItems]);
        } else {
          // API hatası durumunda varsayılan veriler
          setMenuItems([
            {
              id: '1',
              name: 'Margherita Pizza',
              description: 'Domates sosu, mozzarella, fesleğen',
              price: 45,
              category: 'Pizza',
              isAvailable: true,
              allergens: ['Gluten', 'Süt'],
              calories: 280,
            },
            {
              id: '2',
              name: 'Cheeseburger',
              description: 'Dana eti, cheddar peyniri, marul, domates',
              price: 35,
              category: 'Burger',
              isAvailable: true,
              allergens: ['Gluten', 'Süt', 'Yumurta'],
              calories: 520,
            },
          ]);
        }
      } catch (error) {
        console.error('Menü yükleme hatası:', error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = async (id: string) => {
    try {
      const item = menuItems.find(item => item.id === id);
      if (!item) return;

      const newAvailability = !item.isAvailable;
      
      // API'ye güncelleme gönder
      const response = await fetch('/api/menu/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: [{
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image || '',
            allergens: item.allergens || [],
            calories: item.calories,
            preparationTime: item.preparationTime,
            rating: item.rating,
            available: newAvailability, // Yeni availability durumu
          }]
        }),
      });

      if (response.ok) {
        // API'den başarılı yanıt gelirse local state'i güncelle
        setMenuItems(items => 
          items.map(item => 
            item.id === id ? { ...item, isAvailable: newAvailability } : item
          )
        );
        showSuccessToast(newAvailability ? 'Ürün menüde aktif edildi!' : 'Ürün menüden kaldırıldı!');
      } else {
        showErrorToast('Durum güncellenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Availability toggle hatası:', error);
      showErrorToast('Durum güncellenirken hata oluştu!');
    }
  };

  const deleteItem = (id: string) => {
    const item = menuItems.find(item => item.id === id);
    if (item) {
      setConfirmModal({
        show: true,
        itemId: id,
        itemName: item.name
      });
    }
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      try {
        const itemToDelete = menuItems.find(item => item.id === confirmModal.itemId);
        if (itemToDelete) {
          // Önce local state'den kaldır (anında UI güncellemesi için)
          setMenuItems(items => items.filter(item => item.id !== confirmModal.itemId));
          
          // Sonra API'ye silme komutu gönder
          const response = await fetch('/api/menu/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              id: confirmModal.itemId,
              name: itemToDelete.name,
              category: itemToDelete.category 
            }),
          });

          if (response.ok) {
            showSuccessToast('Ürün başarıyla silindi!');
          } else {
            // API hatası durumunda ürünü geri ekle
            setMenuItems(items => [...items, itemToDelete]);
            showErrorToast('Ürün silinirken hata oluştu!');
          }
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        showErrorToast('Ürün silinirken hata oluştu!');
      }
      
      setConfirmModal({ show: false, itemId: null, itemName: '' });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ show: false, itemId: null, itemName: '' });
  };

  const editItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const addNewItem = () => {
    setSelectedItem(null);
    setShowAddModal(true);
  };

  const saveItem = async (itemData: Partial<MenuItem>) => {
    try {
      // API'ye gönderilecek format
      const apiItem = {
        name: itemData.name || '',
        description: itemData.description || '',
        price: itemData.price || 0,
        category: itemData.category || 'Diğer',
        image: itemData.image || '',
        allergens: itemData.allergens || [],
        calories: itemData.calories,
        preparationTime: itemData.preparationTime,
        rating: itemData.rating || 4,
        isAvailable: itemData.isAvailable ?? true,
      };

      // API'ye gönder
      const response = await fetch('/api/menu/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [apiItem] }),
      });

      if (!response.ok) {
        throw new Error('API hatası');
      }

      // Başarılı olursa local state'i güncelle
      if (selectedItem) {
        // Edit existing item
        setMenuItems(items => 
          items.map(item => 
            item.id === selectedItem.id ? { ...item, ...itemData } : item
          )
        );
        setShowEditModal(false);
      } else {
        // Add new item
        const newItem: MenuItem = {
          id: Date.now().toString(),
          name: itemData.name || '',
          description: itemData.description || '',
          price: itemData.price || 0,
          category: itemData.category || 'Diğer',
          isAvailable: itemData.isAvailable ?? true,
          allergens: itemData.allergens || [],
          calories: itemData.calories,
          ...itemData
        };
        setMenuItems(items => [...items, newItem]);
        setShowAddModal(false);
      }
      setSelectedItem(null);
      
      // Başarı mesajı - Toast notification
      showSuccessToast('Ürün başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      showErrorToast('Ürün kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      isAvailable: formData.get('isAvailable') === 'on',
      allergens: (formData.get('allergens') as string)?.split(',').map(a => a.trim()) || [],
      calories: formData.get('calories') ? parseInt(formData.get('calories') as string) : undefined,
      preparationTime: formData.get('preparationTime') ? parseInt(formData.get('preparationTime') as string) : undefined,
      rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : 4.0,
    };
    saveItem(itemData);
  };

  // Toplu yükleme fonksiyonları
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
      showErrorToast('Lütfen CSV veya Excel dosyası seçin!');
      return;
    }

    setBulkUploadData(prev => ({ ...prev, file }));

    // Dosyayı oku ve parse et
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      parseFileContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const parseFileContent = (content: string, fileName: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const parsedData: any[] = [];

    // CSV başlık satırını kontrol et
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'price', 'category'];
    
    for (const header of requiredHeaders) {
      if (!headers.includes(header)) {
        errors.push(`Gerekli sütun bulunamadı: ${header}`);
      }
    }

    if (errors.length > 0) {
      setBulkUploadData(prev => ({ ...prev, errors, isValid: false }));
      return;
    }

    // Veri satırlarını parse et
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < headers.length) {
        errors.push(`Satır ${i + 1}: Eksik veri`);
        continue;
      }

      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });

      // Veri doğrulama
      if (!rowData.name || rowData.name.length < 2) {
        errors.push(`Satır ${i + 1}: Ürün adı en az 2 karakter olmalı`);
      }
      
      if (!rowData.price || isNaN(parseFloat(rowData.price))) {
        errors.push(`Satır ${i + 1}: Geçerli fiyat giriniz`);
      }

      if (!rowData.category || !categories.includes(rowData.category)) {
        errors.push(`Satır ${i + 1}: Geçerli kategori seçiniz`);
      }

      parsedData.push({
        name: rowData.name,
        description: rowData.description || '',
        price: parseFloat(rowData.price),
        category: rowData.category,
        allergens: rowData.allergens ? rowData.allergens.split(',').map((a: string) => a.trim()) : [],
        calories: rowData.calories ? parseInt(rowData.calories) : undefined,
        preparationTime: rowData.preparationtime ? parseInt(rowData.preparationtime) : 15,
        rating: rowData.rating ? parseFloat(rowData.rating) : 4.0,
        isAvailable: rowData.isavailable !== 'false'
      });
    }

    setBulkUploadData(prev => ({ 
      ...prev, 
      parsedData, 
      errors, 
      isValid: errors.length === 0 
    }));
  };

  const handleBulkSave = async () => {
    if (!bulkUploadData.isValid || bulkUploadData.parsedData.length === 0) {
      showErrorToast('Geçerli veri bulunamadı!');
      return;
    }

    try {
      setLoading(true);
      
      // API'ye gönder
      const response = await fetch('/api/menu/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: bulkUploadData.parsedData }),
      });

      if (!response.ok) {
        throw new Error('API hatası');
      }

      // Başarılı olursa local state'i güncelle
      const newItems: MenuItem[] = bulkUploadData.parsedData.map((item, index) => ({
        id: Date.now().toString() + index,
        ...item
      }));

      setMenuItems(prev => [...prev, ...newItems]);
      setShowBulkUploadModal(false);
      setBulkUploadData({ file: null, parsedData: [], errors: [], isValid: false });
      
      showSuccessToast(`${bulkUploadData.parsedData.length} ürün başarıyla yüklendi!`);
    } catch (error) {
      console.error('Toplu yükleme hatası:', error);
      showErrorToast('Ürünler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'description', 'price', 'category', 'allergens', 'calories', 'preparationtime', 'rating', 'isavailable'];
    const sampleData = [
      ['Margherita Pizza', 'Domates sosu, mozzarella, fesleğen', '45', 'Pizza', 'Gluten,Süt', '280', '20', '4.5', 'true'],
      ['Cheeseburger', 'Dana eti, cheddar peyniri, marul', '35', 'Burger', 'Gluten,Süt,Yumurta', '520', '15', '4.0', 'true']
    ];
    
    const csvContent = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'menu_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
            <p className="text-gray-600">Menü ürünlerini düzenleyin ve yönetin</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addNewItem}
              className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ürün Ekle</span>
            </button>
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Toplu Yükle</span>
            </button>
            <button
              onClick={() => setShowTranslationModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Languages className="w-5 h-5" />
              <span>Çeviri</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="hotel-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tüm Kategoriler' : category}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtrele</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hotel-card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
          <div key={item.id} className="hotel-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`p-1 rounded ${
                    item.isAvailable 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => editItem(item)}
                  className="p-1 text-hotel-gold hover:bg-yellow-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Kategori:</span>
                <span className="text-sm font-medium text-gray-900">{item.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Fiyat:</span>
                <span className="text-lg font-bold text-hotel-gold">₺{item.price}</span>
              </div>
              {item.calories && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Kalori:</span>
                  <span className="text-sm text-gray-900">{item.calories} kcal</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Kalite Puanı:</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">{item.rating || 4}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xs ${
                          star <= (item.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Durum:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.isAvailable ? 'Mevcut' : 'Mevcut Değil'}
                </span>
              </div>
            </div>

            {item.allergens.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Alerjenler:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <MenuIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Arama kriterlerinizi değiştirerek tekrar deneyin.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {showAddModal ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedItem?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Ürün adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    name="category"
                    defaultValue={selectedItem?.category || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  >
                    <option value="">Kategori seçin</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Salata">Salata</option>
                    <option value="İçecek">İçecek</option>
                    <option value="Tatlı">Tatlı</option>
                    <option value="Ana Yemek">Ana Yemek</option>
                    <option value="Çorba">Çorba</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedItem?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="Ürün açıklaması"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={selectedItem?.price || ''}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hazırlık Süresi (dk)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    defaultValue={selectedItem?.preparationTime || ''}
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="15"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kalori
                  </label>
                  <input
                    type="number"
                    name="calories"
                    defaultValue={selectedItem?.calories || ''}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Kalori"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kalite Puanı (1-5) *
                  </label>
                  <select
                    name="rating"
                    defaultValue={selectedItem?.rating || '4.0'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  >
                    <option value="1.0">1.0 ⭐ (Temel)</option>
                    <option value="1.2">1.2 ⭐ (Temel+)</option>
                    <option value="1.5">1.5 ⭐ (Temel++)</option>
                    <option value="1.7">1.7 ⭐ (Temel+++)</option>
                    <option value="2.0">2.0 ⭐⭐ (Orta)</option>
                    <option value="2.2">2.2 ⭐⭐ (Orta+)</option>
                    <option value="2.5">2.5 ⭐⭐ (Orta++)</option>
                    <option value="2.7">2.7 ⭐⭐ (Orta+++)</option>
                    <option value="3.0">3.0 ⭐⭐⭐ (İyi)</option>
                    <option value="3.2">3.2 ⭐⭐⭐ (İyi+)</option>
                    <option value="3.5">3.5 ⭐⭐⭐ (İyi++)</option>
                    <option value="3.7">3.7 ⭐⭐⭐ (İyi+++)</option>
                    <option value="4.0">4.0 ⭐⭐⭐⭐ (Çok İyi)</option>
                    <option value="4.2">4.2 ⭐⭐⭐⭐ (Çok İyi+)</option>
                    <option value="4.5">4.5 ⭐⭐⭐⭐ (Çok İyi++)</option>
                    <option value="4.7">4.7 ⭐⭐⭐⭐ (Çok İyi+++)</option>
                    <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Mükemmel)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Ürünün kalitesini müşteri memnuniyetine göre değerlendirin
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alerjenler
                  </label>
                  <input
                    type="text"
                    name="allergens"
                    defaultValue={selectedItem?.allergens?.join(', ') || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    placeholder="Gluten, Süt, Yumurta"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  defaultChecked={selectedItem?.isAvailable ?? true}
                  className="rounded border-gray-300 text-hotel-gold focus:ring-hotel-gold"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Ürün mevcut
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy"
                >
                  {showAddModal ? 'Ürün Ekle' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Responsive */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                Ürünü Sil
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                <span className="font-semibold text-gray-900">{confirmModal.itemName}</span> ürününü silmek istediğinizden emin misiniz?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Translation Modal */}
      {showTranslationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Languages className="w-6 h-6 text-blue-600" />
                  <span>Menü Çevirisi</span>
                </h2>
                <button
                  onClick={() => setShowTranslationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <MenuTranslator
                        menuItem={item}
                        onTranslated={(translated) => {
                          // Çeviriyi kaydet
                          setMenuItems(items => 
                            items.map(menuItem => 
                              menuItem.id === item.id 
                                ? { ...menuItem, ...translated }
                                : menuItem
                            )
                          );
                        }}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
                
                {menuItems.length === 0 && (
                  <div className="text-center py-12">
                    <Languages className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz menü öğesi yok</h3>
                    <p className="text-gray-600">Önce menü öğeleri ekleyin, sonra çeviri yapabilirsiniz.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  <span>Toplu Ürün Yükleme</span>
                </h2>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkUploadData({ file: null, parsedData: [], errors: [], isValid: false });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Template Download */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Şablon İndir</h3>
                      <p className="text-blue-700 text-sm">Önce şablonu indirin ve doldurun, sonra yükleyin.</p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Şablon İndir
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Dosya Seçin</h3>
                  <p className="text-gray-600 mb-4">CSV veya Excel dosyası yükleyin</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bulk-upload-file"
                  />
                  <label
                    htmlFor="bulk-upload-file"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Dosya Seç
                  </label>
                </div>

                {/* File Info */}
                {bulkUploadData.file && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileSpreadsheet className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{bulkUploadData.file.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {(bulkUploadData.file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                )}

                {/* Errors */}
                {bulkUploadData.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <h3 className="text-lg font-semibold text-red-900">Hatalar</h3>
                    </div>
                    <ul className="space-y-1">
                      {bulkUploadData.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-700">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preview */}
                {bulkUploadData.parsedData.length > 0 && bulkUploadData.isValid && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-900">
                        Önizleme ({bulkUploadData.parsedData.length} ürün)
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bulkUploadData.parsedData.slice(0, 5).map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 text-sm text-gray-900">{item.name}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{item.category}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">₺{item.price}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.isAvailable ? 'Aktif' : 'Pasif'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bulkUploadData.parsedData.length > 5 && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          ... ve {bulkUploadData.parsedData.length - 5} ürün daha
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setBulkUploadData({ file: null, parsedData: [], errors: [], isValid: false });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleBulkSave}
                    disabled={!bulkUploadData.isValid || bulkUploadData.parsedData.length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkUploadData.parsedData.length} Ürünü Yükle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification - Responsive */}
      {toast.show && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50">
          <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg flex items-center space-x-2 sm:space-x-3 transform transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
