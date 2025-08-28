'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, Filter, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories: Category[] = [
      { id: '1', name: 'Coffee' },
      { id: '2', name: 'Tea' },
      { id: '3', name: 'Pastries' },
      { id: '4', name: 'Sandwiches' }
    ];

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Espresso',
        description: 'Rich and bold espresso shot',
        price: 2.50,
        image: '/api/placeholder/300/200',
        category: { id: '1', name: 'Coffee' }
      },
      {
        id: '2',
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        price: 4.25,
        image: '/api/placeholder/300/200',
        category: { id: '1', name: 'Coffee' }
      },
      {
        id: '3',
        name: 'Latte',
        description: 'Smooth espresso with steamed milk',
        price: 4.75,
        image: '/api/placeholder/300/200',
        category: { id: '1', name: 'Coffee' }
      },
      {
        id: '4',
        name: 'Green Tea',
        description: 'Fresh organic green tea',
        price: 3.00,
        image: '/api/placeholder/300/200',
        category: { id: '2', name: 'Tea' }
      },
      {
        id: '5',
        name: 'Croissant',
        description: 'Buttery, flaky French croissant',
        price: 3.50,
        image: '/api/placeholder/300/200',
        category: { id: '3', name: 'Pastries' }
      },
      {
        id: '6',
        name: 'Club Sandwich',
        description: 'Triple-decker with turkey, bacon, and fresh vegetables',
        price: 8.95,
        image: '/api/placeholder/300/200',
        category: { id: '4', name: 'Sandwiches' }
      }
    ];

    setCategories(mockCategories);
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, count]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price * count : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-amber-600">
              Local Café
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/cart"
                className="relative bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted selection of premium coffee, teas, and delicious food items.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-lg font-bold text-amber-600">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                    {product.category.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {cart[product.id] > 0 && (
                      <>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                          {cart[product.id]}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No items found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">
              {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in cart
            </div>
            <div className="text-lg font-bold text-gray-900 mb-3">
              Total: ${getTotalPrice().toFixed(2)}
            </div>
            <Link
              href="/cart"
              className="block w-full bg-amber-600 text-white text-center py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;