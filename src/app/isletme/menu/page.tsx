"use client";

import { useState } from 'react';
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
  Utensils
} from 'lucide-react';

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
}

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Mock data - gerçek veriler API'den gelecek
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
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
  ]);

  const categories = ['all', 'Pizza', 'Burger', 'Salata', 'İçecek', 'Tatlı'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id: string) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  const editItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const addNewItem = () => {
    setSelectedItem(null);
    setShowAddModal(true);
  };

  const saveItem = (itemData: Partial<MenuItem>) => {
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
    };
    saveItem(itemData);
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
          <button
            onClick={addNewItem}
            className="bg-hotel-gold text-white px-4 py-2 rounded-lg hover:bg-hotel-navy transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Ürün Ekle</span>
          </button>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
