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
  X,
  Image as ImageIcon,
  FolderOpen,
  Tag
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
  preparationTime?: number;
  rating?: number;
  translations?: {
    [lang: string]: {
      name: string;
      description: string;
    };
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategoryInSelector, setShowAddCategoryInSelector] = useState(false);

  // Menü verileri state'i
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Toast notification state'i
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  // Confirmation modal state'i
  const [confirmModal, setConfirmModal] = useState<{show: boolean, itemId: string | null, itemName: string, type: 'item' | 'category'}>({
    show: false,
    itemId: null,
    itemName: '',
    type: 'item'
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

  // Toast notification fonksiyonları
  const showSuccessToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const showErrorToast = (message: string) => {
    setToast({ show: true, message, type: 'error' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Tenant slug'ını al
  const getTenantSlug = (): string => {
    if (typeof window === 'undefined') return 'default';
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'roomxqr' && subdomain !== 'roomxqr-backend') {
      return subdomain;
    }
    return 'default';
  };

  // Kategorileri yükle (tenant-specific, varsayılan kategoriler yok)
  const loadCategories = async () => {
    try {
      const tenantSlug = getTenantSlug();
      const storageKey = `menuCategories_${tenantSlug}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCategories(parsed);
      } else {
        // Yeni işletme için boş kategori listesi - varsayılan kategoriler yok
        setCategories([]);
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
      setCategories([]);
    }
  };

  // Demo ürünleri filtreleme fonksiyonu
  const isDemoProduct = (name: string): boolean => {
    const normalizedName = name.toLowerCase().trim();
    const demoProducts = [
      'karniyarik',
      'cheeseburger',
      'cheese burger',
      'caesar salad',
      'caesar salata'
    ];
    return demoProducts.some(demo => normalizedName === demo || normalizedName.includes(demo));
  };

  // Menü verilerini API'den yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await loadCategories();
        
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          const formattedItems = data.menu
            .filter((item: any) => !isDemoProduct(item.name)) // Demo ürünleri filtrele
            .map((item: any, index: number) => ({
              id: item.id || `api-${index}`,
              name: item.name,
              description: item.description || '',
              price: item.price,
              category: item.category || 'Diğer',
              isAvailable: item.available !== false,
              allergens: item.allergens || [],
              calories: item.calories,
              image: item.image,
              preparationTime: item.preparationTime,
              rating: item.rating,
            }));
          
          setMenuItems(formattedItems);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Menü yükleme hatası:', error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Kategori listesini güncelle (tenant-specific)
  useEffect(() => {
    const tenantSlug = getTenantSlug();
    const storageKey = `menuCategories_${tenantSlug}`;
    localStorage.setItem(storageKey, JSON.stringify(categories));
  }, [categories]);

  const filteredItems = menuItems.filter(item => {
    // Demo ürünleri filtrele
    if (isDemoProduct(item.name)) {
      return false;
    }
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Resim yükleme fonksiyonu
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showErrorToast('Lütfen geçerli bir resim dosyası seçin!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Resim boyutu 5MB\'dan küçük olmalıdır!');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Resmi base64'e çevir
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const toggleAvailability = async (id: string) => {
    try {
      const item = menuItems.find(item => item.id === id);
      if (!item) return;

      const newAvailability = !item.isAvailable;
      
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
            available: newAvailability,
          }]
        }),
      });

      if (response.ok) {
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
        itemName: item.name,
        type: 'item'
      });
    }
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      // Kategori kullanılıyor mu kontrol et
      const itemsInCategory = menuItems.filter(item => item.category === category.name);
      if (itemsInCategory.length > 0) {
        showErrorToast(`Bu kategori ${itemsInCategory.length} üründe kullanılıyor. Önce ürünleri başka kategoriye taşıyın.`);
        return;
      }
      
      setConfirmModal({
        show: true,
        itemId: id,
        itemName: category.name,
        type: 'category'
      });
    }
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      let itemToDelete: MenuItem | null = null;
      
      try {
        if (confirmModal.type === 'item') {
          itemToDelete = menuItems.find(item => item.id === confirmModal.itemId) || null;
          if (itemToDelete) {
            // Önce UI'dan kaldır (optimistic update)
            setMenuItems(items => items.filter(item => item.id !== confirmModal.itemId));
            
            // Backend'de sil
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
            };

            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/menu/delete', {
              method: 'POST',
              headers,
              body: JSON.stringify({ id: confirmModal.itemId }),
            });

            const responseData = await response.json();

            if (response.ok && responseData.success) {
              showSuccessToast('Ürün başarıyla silindi!');
            } else {
              // Hata durumunda geri ekle
              setMenuItems(items => [...items, itemToDelete!]);
              const errorMsg = responseData.error || responseData.message || 'Ürün silinirken hata oluştu!';
              showErrorToast(errorMsg);
              console.error('Silme hatası:', responseData);
            }
          } else {
            showErrorToast('Silinecek ürün bulunamadı!');
          }
        } else {
          setCategories(cats => cats.filter(cat => cat.id !== confirmModal.itemId));
          showSuccessToast('Kategori başarıyla silindi!');
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        // Hata durumunda item'ı geri ekle
        if (confirmModal.type === 'item' && itemToDelete) {
          setMenuItems(items => [...items, itemToDelete]);
        }
        showErrorToast('Silme işlemi sırasında hata oluştu! Lütfen tekrar deneyin.');
      } finally {
        setConfirmModal({ show: false, itemId: null, itemName: '', type: 'item' });
      }
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ show: false, itemId: null, itemName: '', type: 'item' });
  };

  const editItem = (item: MenuItem) => {
    setSelectedItem(item);
    setImagePreview(item.image || null);
    setImageFile(null);
    setShowEditModal(true);
  };

  const editCategory = (category: Category) => {
    setSelectedCategoryForEdit(category);
    setNewCategoryName(category.name);
    setShowAddCategoryModal(true);
  };

  const addNewItem = () => {
    setSelectedItem(null);
    setImagePreview(null);
    setImageFile(null);
    setShowAddModal(true);
  };

  const addNewCategory = () => {
    setSelectedCategoryForEdit(null);
    setNewCategoryName('');
    setShowAddCategoryModal(true);
  };

  const saveCategory = () => {
    if (!newCategoryName.trim()) {
      showErrorToast('Kategori adı boş olamaz!');
      return;
    }

    if (selectedCategoryForEdit) {
      // Kategori güncelle
      const oldName = selectedCategoryForEdit.name;
      setCategories(cats => 
        cats.map(cat => 
          cat.id === selectedCategoryForEdit.id 
            ? { ...cat, name: newCategoryName.trim() }
            : cat
        )
      );
      
      // Menü öğelerindeki kategori adını da güncelle
      setMenuItems(items =>
        items.map(item =>
          item.category === oldName
            ? { ...item, category: newCategoryName.trim() }
            : item
        )
      );
      
      showSuccessToast('Kategori başarıyla güncellendi!');
    } else {
      // Yeni kategori ekle
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
      };
      setCategories(cats => [...cats, newCategory]);
      showSuccessToast('Kategori başarıyla eklendi!');
    }
    
    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setSelectedCategoryForEdit(null);
  };

  const saveItem = async (itemData: Partial<MenuItem>) => {
    try {
      let imageUrl = itemData.image || '';
      
      // Eğer yeni resim yüklendiyse base64'e çevir
      if (imageFile) {
        imageUrl = await convertImageToBase64(imageFile);
      } else if (imagePreview && !imagePreview.startsWith('data:')) {
        // Eğer mevcut resim varsa ve base64 değilse, olduğu gibi kullan
        imageUrl = imagePreview;
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (selectedItem) {
        // Güncelleme işlemi - PUT endpoint kullan
        const apiItem = {
          name: itemData.name || '',
          description: itemData.description || '',
          price: itemData.price || 0,
          category: itemData.category || 'Diğer',
          image: imageUrl,
          allergens: itemData.allergens || [],
          calories: itemData.calories,
          isAvailable: itemData.isAvailable ?? true,
        };

        const response = await fetch(`/api/menu/${selectedItem.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(apiItem),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Güncelleme hatası');
        }

        const responseData = await response.json();
        setMenuItems(items => 
          items.map(item => 
            item.id === selectedItem.id ? { ...item, ...itemData, image: imageUrl } : item
          )
        );
        setShowEditModal(false);
      } else {
        // Yeni öğe ekleme - POST endpoint kullan
        const apiItem = {
          name: itemData.name || '',
          description: itemData.description || '',
          price: itemData.price || 0,
          category: itemData.category || 'Diğer',
          image: imageUrl,
          allergens: itemData.allergens || [],
          calories: itemData.calories,
          preparationTime: itemData.preparationTime,
          rating: itemData.rating || 4,
          isAvailable: itemData.isAvailable ?? true,
        };

        const response = await fetch('/api/menu/save', {
          method: 'POST',
          headers,
          body: JSON.stringify({ items: [apiItem] }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Kaydetme hatası');
        }

        const responseData = await response.json();
        // Backend'den dönen ID'yi kullan
        const newItem: MenuItem = {
          id: responseData.items?.[0]?.id || Date.now().toString(),
          name: itemData.name || '',
          description: itemData.description || '',
          price: itemData.price || 0,
          category: itemData.category || 'Diğer',
          isAvailable: itemData.isAvailable ?? true,
          allergens: itemData.allergens || [],
          calories: itemData.calories,
          image: imageUrl,
          preparationTime: itemData.preparationTime,
          rating: itemData.rating,
        };
        setMenuItems(items => [...items, newItem]);
        setShowAddModal(false);
      }
      setSelectedItem(null);
      setImagePreview(null);
      setImageFile(null);
      
      showSuccessToast('Ürün başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      showErrorToast('Ürün kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = selectedItem?.image || '';
    if (imageFile) {
      imageUrl = await convertImageToBase64(imageFile);
    } else if (imagePreview && imagePreview.startsWith('data:')) {
      imageUrl = imagePreview;
    }
    
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
      image: imageUrl,
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

    const categoryNames = categories.map(c => c.name);

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

      if (!rowData.name || rowData.name.length < 2) {
        errors.push(`Satır ${i + 1}: Ürün adı en az 2 karakter olmalı`);
      }
      
      if (!rowData.price || isNaN(parseFloat(rowData.price))) {
        errors.push(`Satır ${i + 1}: Geçerli fiyat giriniz`);
      }

      if (!rowData.category || !categoryNames.includes(rowData.category)) {
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
            <p className="text-gray-600">Menü ürünlerini ve kategorileri düzenleyin</p>
          </div>
          {activeTab === 'menu' && (
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
          )}
          {activeTab === 'categories' && (
            <button
              onClick={addNewCategory}
              className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Kategori Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-4 px-6 border-b-2 font-semibold text-base transition-colors ${
              activeTab === 'menu'
                ? 'border-hotel-gold text-hotel-gold bg-hotel-cream'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MenuIcon className="w-5 h-5" />
              <span>Menü</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-6 border-b-2 font-semibold text-base transition-colors ${
              activeTab === 'categories'
                ? 'border-hotel-gold text-hotel-gold bg-hotel-cream'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Kategoriler</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Menu Tab Content */}
      {activeTab === 'menu' && (
        <>
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
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                  {item.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
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

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <MenuIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Arama kriterlerinizi değiştirerek tekrar deneyin.
              </p>
            </div>
          )}
        </>
      )}

      {/* Categories Tab Content */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const itemCount = menuItems.filter(item => item.category === category.name).length;
            return (
              <div key={category.id} className="hotel-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {itemCount} ürün
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="p-1 text-hotel-gold hover:bg-yellow-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz kategori yok</h3>
              <p className="mt-1 text-sm text-gray-500">
                İlk kategorinizi eklemek için yukarıdaki "Kategori Ekle" butonuna tıklayın.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {showAddModal ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ürün Resmi *
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-40 w-40 object-cover rounded-lg border-2 border-hotel-gold shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-6 py-3 border-2 border-hotel-gold rounded-lg hover:bg-hotel-gold hover:text-white transition-colors cursor-pointer font-medium"
                    >
                      <ImageIcon className="w-5 h-5 mr-2" />
                      {imagePreview ? 'Resmi Değiştir' : 'Resim Yükle (JPG, PNG, max 5MB)'}
                    </label>
                    {!imagePreview && (
                      <p className="text-xs text-gray-500 mt-2">
                        Ürün için bir resim yükleyin. Bu resim menüde görüntülenecektir.
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={selectedItem?.category || ''}
                      required
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setShowCategorySelectModal(true);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      <option value="" disabled className="text-gray-400">──────────</option>
                      <option value="__add_new__" className="text-hotel-gold font-bold bg-hotel-cream">
                        ➕ Yeni Kategori Ekle
                      </option>
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Henüz kategori yok. Lütfen önce bir kategori ekleyin.
                      </p>
                    )}
                  </div>
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
                    <option value="4.0">4.0 ⭐⭐⭐⭐ (Çok İyi)</option>
                    <option value="4.5">4.5 ⭐⭐⭐⭐ (Çok İyi++)</option>
                    <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Mükemmel)</option>
                    <option value="3.5">3.5 ⭐⭐⭐ (İyi++)</option>
                    <option value="3.0">3.0 ⭐⭐⭐ (İyi)</option>
                    <option value="2.5">2.5 ⭐⭐ (Orta++)</option>
                    <option value="2.0">2.0 ⭐⭐ (Orta)</option>
                    <option value="1.5">1.5 ⭐ (Temel++)</option>
                    <option value="1.0">1.0 ⭐ (Temel)</option>
                  </select>
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
                    setImagePreview(null);
                    setImageFile(null);
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

      {/* Add/Edit Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedCategoryForEdit ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="Kategori adı"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryName('');
                    setSelectedCategoryForEdit(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button 
                  onClick={saveCategory}
                  className="px-4 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy"
                >
                  {selectedCategoryForEdit ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Select Modal (when adding new category from product form) */}
      {showCategorySelectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Yeni Kategori Ekle
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-transparent"
                  placeholder="Kategori adı"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategorySelectModal(false);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button 
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      const newCategory: Category = {
                        id: Date.now().toString(),
                        name: newCategoryName.trim(),
                      };
                      setCategories(cats => [...cats, newCategory]);
                      showSuccessToast('Kategori başarıyla eklendi!');
                      setShowCategorySelectModal(false);
                      setNewCategoryName('');
                      // Form'daki kategori select'ini güncelle
                      const select = document.querySelector('select[name="category"]') as HTMLSelectElement;
                      if (select) {
                        select.value = newCategory.name;
                      }
                    }
                  }}
                  className="px-4 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-navy"
                >
                  Ekle ve Seç
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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
                {confirmModal.type === 'item' ? 'Ürünü Sil' : 'Kategoriyi Sil'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                <span className="font-semibold text-gray-900">{confirmModal.itemName}</span> {confirmModal.type === 'item' ? 'ürününü' : 'kategorisini'} silmek istediğinizden emin misiniz?
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
                  <X className="w-6 h-6" />
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
                        onTranslated={async (translations) => {
                          // Menu item'ı güncelle
                          setMenuItems(items => 
                            items.map(menuItem => 
                              menuItem.id === item.id 
                                ? { ...menuItem, translations }
                                : menuItem
                            )
                          );
                          
                          // Backend'e kaydet
                          try {
                            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomxqr-backend.onrender.com';
                            const token = localStorage.getItem('token');
                            
                            let tenantSlug = 'demo';
                            if (typeof window !== 'undefined') {
                              const hostname = window.location.hostname;
                              const subdomain = hostname.split('.')[0];
                              if (subdomain && subdomain !== 'www' && subdomain !== 'roomxqr' && subdomain !== 'roomxqr-backend') {
                                tenantSlug = subdomain;
                              }
                            }
                            
                            await fetch(`${API_BASE_URL}/api/menu/${item.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                                'x-tenant': tenantSlug
                              },
                              body: JSON.stringify({
                                translations: translations
                              })
                            });
                          } catch (error) {
                            console.error('Çeviriler kaydedilirken hata:', error);
                          }
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

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50">
          <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg flex items-center space-x-2 sm:space-x-3 transform transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
