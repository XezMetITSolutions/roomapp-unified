'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter, Star, Clock, Users } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  prepTime: number;
  isAvailable: boolean;
}

const MenuPage = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'appetizers', name: 'Mezeler' },
    { id: 'main-courses', name: 'Ana Yemekler' },
    { id: 'desserts', name: 'Tatlılar' },
    { id: 'beverages', name: 'İçecekler' }
  ];

  const sampleMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Çorba',
      description: 'Günün çorbası',
      price: 25,
      category: 'appetizers',
      image: '/api/placeholder/300/200',
      rating: 4.5,
      prepTime: 15,
      isAvailable: true
    },
    {
      id: '2',
      name: 'Izgara Tavuk',
      description: 'Taze baharatlarla marine edilmiş tavuk göğsü',
      price: 85,
      category: 'main-courses',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      prepTime: 25,
      isAvailable: true
    },
    {
      id: '3',
      name: 'Çikolatalı Pasta',
      description: 'Ev yapımı çikolatalı pasta',
      price: 45,
      category: 'desserts',
      image: '/api/placeholder/300/200',
      rating: 4.7,
      prepTime: 10,
      isAvailable: true
    },
    {
      id: '4',
      name: 'Türk Kahvesi',
      description: 'Geleneksel Türk kahvesi',
      price: 15,
      category: 'beverages',
      image: '/api/placeholder/300/200',
      rating: 4.6,
      prepTime: 5,
      isAvailable: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMenuItems(sampleMenuItems);
      setFilteredItems(sampleMenuItems);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, menuItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Menü</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Yemek ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-blue-600">
                    ₺{item.price}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{item.prepTime} dk</span>
                  </div>
                </div>
                <button
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                    item.isAvailable
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? 'Sipariş Ver' : 'Müsait Değil'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aradığınız yemek bulunamadı
            </h3>
            <p className="text-gray-500">
              Farklı bir arama terimi deneyin veya kategori değiştirin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;

