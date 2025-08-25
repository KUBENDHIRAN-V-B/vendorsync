'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '../../lib/firebase-auth-context';

// Demo Products Data
const demoProducts = [
  { 
    id: '1', 
    name: 'Vada Pav', 
    description: 'Mumbai\'s iconic street food - spiced potato fritter in a bun with chutneys', 
    price: 25, 
    category: 'Street Food', 
    image_url: '🥪', 
    stock_quantity: 50, 
    is_available: true,
    rating: 4.8,
    orders_count: 156,
    prep_time: '5-8 mins'
  },
  { 
    id: '2', 
    name: 'Pav Bhaji', 
    description: 'Thick vegetable curry served with buttered bread rolls', 
    price: 60, 
    category: 'Street Food', 
    image_url: '🍛', 
    stock_quantity: 30, 
    is_available: true,
    rating: 4.9,
    orders_count: 203,
    prep_time: '8-12 mins'
  },
  { 
    id: '3', 
    name: 'Masala Dosa', 
    description: 'Crispy rice crepe filled with spiced potato curry, served with sambar and chutney', 
    price: 45, 
    category: 'South Indian', 
    image_url: '🥞', 
    stock_quantity: 25, 
    is_available: true,
    rating: 4.7,
    orders_count: 89,
    prep_time: '10-15 mins'
  },
  { 
    id: '4', 
    name: 'Samosa', 
    description: 'Crispy triangular pastry filled with spiced potatoes and peas', 
    price: 15, 
    category: 'Snacks', 
    image_url: '🥟', 
    stock_quantity: 80, 
    is_available: true,
    rating: 4.6,
    orders_count: 234,
    prep_time: '2-5 mins'
  },
  { 
    id: '5', 
    name: 'Chole Bhature', 
    description: 'Spicy chickpea curry with deep-fried bread', 
    price: 70, 
    category: 'North Indian', 
    image_url: '🍽️', 
    stock_quantity: 20, 
    is_available: true,
    rating: 4.8,
    orders_count: 145,
    prep_time: '12-18 mins'
  },
  { 
    id: '6', 
    name: 'Masala Chai', 
    description: 'Traditional Indian spiced tea with milk and aromatic spices', 
    price: 10, 
    category: 'Beverages', 
    image_url: '☕', 
    stock_quantity: 100, 
    is_available: true,
    rating: 4.9,
    orders_count: 567,
    prep_time: '3-5 mins'
  },
  { 
    id: '7', 
    name: 'Idli Sambar', 
    description: 'Steamed rice cakes served with lentil soup and coconut chutney', 
    price: 35, 
    category: 'South Indian', 
    image_url: '🍚', 
    stock_quantity: 40, 
    is_available: true,
    rating: 4.5,
    orders_count: 78,
    prep_time: '8-12 mins'
  },
  { 
    id: '8', 
    name: 'Pani Puri', 
    description: 'Crispy hollow puris filled with spiced water, tamarind chutney, and potatoes', 
    price: 20, 
    category: 'Street Food', 
    image_url: '🫧', 
    stock_quantity: 60, 
    is_available: true,
    rating: 4.7,
    orders_count: 189,
    prep_time: '5-8 mins'
  },
  { 
    id: '9', 
    name: 'Butter Chicken', 
    description: 'Creamy tomato-based chicken curry with aromatic spices', 
    price: 120, 
    category: 'North Indian', 
    image_url: '🍗', 
    stock_quantity: 15, 
    is_available: false,
    rating: 4.9,
    orders_count: 98,
    prep_time: '20-25 mins'
  },
  { 
    id: '10', 
    name: 'Fresh Lime Soda', 
    description: 'Refreshing lime juice with soda water and a pinch of salt', 
    price: 25, 
    category: 'Beverages', 
    image_url: '🥤', 
    stock_quantity: 50, 
    is_available: true,
    rating: 4.4,
    orders_count: 123,
    prep_time: '2-3 mins'
  }
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
  rating: number;
  orders_count: number;
  prep_time: string;
}

export default function ProductsPage() {
  const { user, isLoading } = useSupabaseAuth();
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_quantity: 0
  });

  const categories = ['All', ...Array.from(new Set(demoProducts.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'orders':
        return b.orders_count - a.orders_count;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, rating: p.rating, orders_count: p.orders_count, prep_time: p.prep_time }
          : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        is_available: true,
        rating: 4.0,
        orders_count: 0,
        prep_time: '5-10 mins'
      };
      setProducts([...products, newProduct]);
    }
    
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity
    });
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleToggleAvailability = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, is_available: !p.is_available } : p
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      image_url: '',
      stock_quantity: 0
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold text-gray-900">VendorSync</span>
              </Link>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                📦 Products
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/demo" className="text-purple-600 hover:text-purple-800 font-medium">
                🎯 View Demo
              </Link>
              <Link href="/dashboard" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 mt-1">Manage your menu items and track performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
                resetForm();
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
                <option value="orders">Sort by Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.is_available).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Seller</p>
                <p className="text-lg font-bold text-gray-900">
                  {products.reduce((max, p) => p.orders_count > max.orders_count ? p : max, products[0])?.name.split(' ')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    placeholder="e.g., Vada Pav"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Street Food">Street Food</option>
                    <option value="South Indian">South Indian</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  required
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="🍛 (Enter an emoji to represent your product)"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-6xl">{product.image_url}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_available ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span>{product.rating}</span>
                    <span>({product.orders_count} orders)</span>
                  </div>
                  <span>⏱️ {product.prep_time}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleToggleAvailability(product.id)}
                    className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${
                      product.is_available
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {product.is_available ? '⏸️ Disable' : '▶️ Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}