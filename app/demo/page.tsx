'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('vendor');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Demo Data
  const demoProducts = [
    { id: 1, name: 'Vada Pav', price: 25, category: 'Street Food', stock: 50, image: '🥪', rating: 4.8, orders: 156 },
    { id: 2, name: 'Pav Bhaji', price: 60, category: 'Street Food', stock: 30, image: '🍛', rating: 4.9, orders: 203 },
    { id: 3, name: 'Dosa', price: 45, category: 'South Indian', stock: 25, image: '🥞', rating: 4.7, orders: 89 },
    { id: 4, name: 'Samosa', price: 15, category: 'Snacks', stock: 80, image: '🥟', rating: 4.6, orders: 234 },
    { id: 5, name: 'Chole Bhature', price: 70, category: 'North Indian', stock: 20, image: '🍽️', rating: 4.8, orders: 145 },
    { id: 6, name: 'Masala Chai', price: 10, category: 'Beverages', stock: 100, image: '☕', rating: 4.9, orders: 567 }
  ];

  const demoOrders = [
    { id: 'ORD001', customer: 'Rahul Sharma', items: ['2x Vada Pav', '1x Chai'], total: 60, status: 'preparing', time: '2 mins ago', phone: '+91 98765 43210' },
    { id: 'ORD002', customer: 'Priya Patel', items: ['1x Pav Bhaji', '1x Dosa'], total: 105, status: 'ready', time: '5 mins ago', phone: '+91 87654 32109' },
    { id: 'ORD003', customer: 'Amit Kumar', items: ['3x Samosa', '2x Chai'], total: 65, status: 'delivered', time: '15 mins ago', phone: '+91 76543 21098' },
    { id: 'ORD004', customer: 'Sneha Singh', items: ['1x Chole Bhature'], total: 70, status: 'pending', time: '1 min ago', phone: '+91 65432 10987' },
    { id: 'ORD005', customer: 'Vikram Joshi', items: ['2x Dosa', '1x Chai'], total: 100, status: 'preparing', time: '8 mins ago', phone: '+91 54321 09876' }
  ];

  const demoCustomers = [
    { id: 1, name: 'Rajesh Kumar', orders: 45, spent: 2250, lastOrder: '2 hours ago', rating: 4.8, phone: '+91 98765 43210' },
    { id: 2, name: 'Priya Sharma', orders: 32, spent: 1680, lastOrder: '1 day ago', rating: 4.9, phone: '+91 87654 32109' },
    { id: 3, name: 'Amit Patel', orders: 28, spent: 1540, lastOrder: '3 hours ago', rating: 4.7, phone: '+91 76543 21098' },
    { id: 4, name: 'Sneha Singh', orders: 51, spent: 2805, lastOrder: '30 mins ago', rating: 4.9, phone: '+91 65432 10987' }
  ];

  const demoAnalytics = {
    todayRevenue: 4250,
    todayOrders: 67,
    avgOrderValue: 63,
    topProduct: 'Masala Chai',
    peakHour: '12:00 PM - 1:00 PM',
    customerSatisfaction: 4.8
  };

  const demoInventory = [
    { item: 'Potatoes', quantity: 25, unit: 'kg', reorderLevel: 10, supplier: 'Fresh Farms Co.', lastRestocked: '2 days ago' },
    { item: 'Onions', quantity: 15, unit: 'kg', reorderLevel: 8, supplier: 'Green Valley', lastRestocked: '1 day ago' },
    { item: 'Tomatoes', quantity: 8, unit: 'kg', reorderLevel: 12, supplier: 'Farm Fresh Ltd.', lastRestocked: '3 days ago' },
    { item: 'Bread Pav', quantity: 200, unit: 'pieces', reorderLevel: 50, supplier: 'City Bakery', lastRestocked: '6 hours ago' },
    { item: 'Tea Leaves', quantity: 5, unit: 'kg', reorderLevel: 2, supplier: 'Chai Masters', lastRestocked: '1 week ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                🎯 LIVE DEMO
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString()}
              </div>
              <Link href="/" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'vendor', name: 'Vendor Dashboard', icon: '🏪' },
              { id: 'customer', name: 'Customer View', icon: '👥' },
              { id: 'analytics', name: 'Analytics', icon: '📊' },
              { id: 'inventory', name: 'Inventory', icon: '📦' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vendor Dashboard */}
        {activeTab === 'vendor' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rajesh's Street Cart</h1>
                <p className="text-gray-600">Managing your street food business • Demo Account</p>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                🟢 Online & Taking Orders
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{demoAnalytics.todayRevenue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Orders Today</p>
                    <p className="text-2xl font-bold text-gray-900">{demoAnalytics.todayOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{demoAnalytics.avgOrderValue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{demoAnalytics.customerSatisfaction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {demoOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">#{order.id}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{order.customer} • {order.phone}</p>
                        <p className="text-sm text-gray-500">{order.items.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total}</p>
                        <p className="text-sm text-gray-500">{order.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Management */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Menu Items</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {demoProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{product.image}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.stock > 20 ? 'bg-green-100 text-green-800' : 
                        product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} left
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-sm text-gray-400">({product.orders})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer View */}
        {activeTab === 'customer' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Street Food Near You</h1>
              <p className="text-gray-600">Discover amazing local vendors • Customer Demo</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search for food, vendors, or location..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                    <option>All Categories</option>
                    <option>Street Food</option>
                    <option>South Indian</option>
                    <option>North Indian</option>
                    <option>Beverages</option>
                  </select>
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Nearby Vendors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                  <span className="text-6xl">🏪</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Rajesh's Street Cart</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Open</span>
                  </div>
                  <p className="text-gray-600 mb-3">Authentic Mumbai Street Food</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>⭐ 4.8 (234 reviews)</span>
                    <span>📍 0.2 km away</span>
                    <span>⏱️ 15-20 min</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Vada Pav</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Pav Bhaji</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Chai</span>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    View Menu & Order
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-6xl">🍛</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Dosa Corner</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Open</span>
                  </div>
                  <p className="text-gray-600 mb-3">South Indian Specialties</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>⭐ 4.7 (189 reviews)</span>
                    <span>📍 0.5 km away</span>
                    <span>⏱️ 20-25 min</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Masala Dosa</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Idli</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Sambar</span>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    View Menu & Order
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <span className="text-6xl">🥟</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Snack Master</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Busy</span>
                  </div>
                  <p className="text-gray-600 mb-3">Fresh Snacks & Sweets</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>⭐ 4.6 (156 reviews)</span>
                    <span>📍 0.8 km away</span>
                    <span>⏱️ 25-30 min</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Samosa</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Kachori</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Jalebi</span>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    View Menu & Order
                  </button>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { id: 'ORD101', vendor: 'Rajesh\'s Street Cart', items: '2x Vada Pav, 1x Chai', total: 60, date: 'Today, 2:30 PM', status: 'Delivered' },
                  { id: 'ORD102', vendor: 'Dosa Corner', items: '1x Masala Dosa, 1x Filter Coffee', total: 85, date: 'Yesterday, 7:45 PM', status: 'Delivered' },
                  { id: 'ORD103', vendor: 'Snack Master', items: '3x Samosa, 1x Sweet Lassi', total: 75, date: '2 days ago, 4:15 PM', status: 'Delivered' }
                ].map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">#{order.id}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{order.vendor}</p>
                        <p className="text-sm text-gray-500">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
              <p className="text-gray-600">Insights to grow your business • Demo Data</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">₹1,24,500</p>
                    <p className="text-sm text-green-600">↗️ +12.5% from last month</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">1,847</p>
                    <p className="text-sm text-green-600">↗️ +8.3% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Customers</p>
                    <p className="text-3xl font-bold text-gray-900">234</p>
                    <p className="text-sm text-green-600">↗��� +15.2% from last month</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                    <p className="text-3xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-green-600">↗️ +0.2 from last month</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 bg-gradient-to-t from-orange-100 to-orange-50 rounded-lg flex items-end justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-600">Revenue growing steadily</p>
                    <p className="text-sm text-gray-500">Peak hours: 12 PM - 2 PM, 7 PM - 9 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Items</h3>
                <div className="space-y-4">
                  {demoProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{product.image}</span>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{product.price}</p>
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Top Customers</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {demoCustomers.map((customer) => (
                  <div key={customer.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{customer.orders} orders</p>
                        <p className="text-sm text-gray-500">₹{customer.spent} spent</p>
                        <div className="flex items-center justify-end mt-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-gray-600 ml-1">{customer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600">Track your ingredients and supplies • Demo Data</p>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <h3 className="font-medium text-yellow-800">Low Stock Alert</h3>
                  <p className="text-yellow-700">3 items are running low and need restocking soon.</p>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Current Inventory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demoInventory.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.item}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{item.quantity} {item.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{item.reorderLevel} {item.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{item.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{item.lastRestocked}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.quantity <= item.reorderLevel 
                              ? 'bg-red-100 text-red-800' 
                              : item.quantity <= item.reorderLevel * 1.5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.quantity <= item.reorderLevel 
                              ? 'Reorder Now' 
                              : item.quantity <= item.reorderLevel * 1.5
                              ? 'Low Stock'
                              : 'In Stock'
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Item</h3>
                  <p className="text-gray-600 mb-4">Add new ingredients to your inventory</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add Item
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚚</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Restock Items</h3>
                  <p className="text-gray-600 mb-4">Order supplies from your suppliers</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Place Order
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Report</h3>
                  <p className="text-gray-600 mb-4">View detailed consumption analytics</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}