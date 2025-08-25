'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '../../lib/firebase-auth-context';

// Demo Orders Data
const demoOrders = [
  {
    id: 'ORD001',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 43210',
    items: [
      { product_name: 'Vada Pav', quantity: 2, price: 25, total: 50 },
      { product_name: 'Masala Chai', quantity: 1, price: 10, total: 10 }
    ],
    total_amount: 60,
    status: 'preparing' as const,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    delivery_address: 'Shop 15, FC Road, Pune - 411005',
    delivery_instructions: 'Call when you arrive',
    payment_method: 'Cash on Delivery',
    estimated_time: '5-8 mins'
  },
  {
    id: 'ORD002',
    customer_name: 'Priya Patel',
    customer_phone: '+91 87654 32109',
    items: [
      { product_name: 'Pav Bhaji', quantity: 1, price: 60, total: 60 },
      { product_name: 'Masala Dosa', quantity: 1, price: 45, total: 45 }
    ],
    total_amount: 105,
    status: 'ready' as const,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    delivery_address: 'Flat 302, Sunrise Apartments, Koregaon Park, Pune',
    delivery_instructions: 'Ring the bell twice',
    payment_method: 'UPI',
    estimated_time: '2-3 mins'
  },
  {
    id: 'ORD003',
    customer_name: 'Amit Kumar',
    customer_phone: '+91 76543 21098',
    items: [
      { product_name: 'Samosa', quantity: 3, price: 15, total: 45 },
      { product_name: 'Masala Chai', quantity: 2, price: 10, total: 20 }
    ],
    total_amount: 65,
    status: 'delivered' as const,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    delivery_address: 'Office Block A, Hinjewadi IT Park, Pune',
    delivery_instructions: 'Security gate entry required',
    payment_method: 'Card',
    estimated_time: 'Delivered'
  },
  {
    id: 'ORD004',
    customer_name: 'Sneha Singh',
    customer_phone: '+91 65432 10987',
    items: [
      { product_name: 'Chole Bhature', quantity: 1, price: 70, total: 70 }
    ],
    total_amount: 70,
    status: 'pending' as const,
    created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 min ago
    delivery_address: 'House 25, Baner Road, Pune - 411045',
    delivery_instructions: 'Please call before delivery',
    payment_method: 'Cash on Delivery',
    estimated_time: '12-18 mins'
  },
  {
    id: 'ORD005',
    customer_name: 'Vikram Joshi',
    customer_phone: '+91 54321 09876',
    items: [
      { product_name: 'Masala Dosa', quantity: 2, price: 45, total: 90 },
      { product_name: 'Masala Chai', quantity: 1, price: 10, total: 10 }
    ],
    total_amount: 100,
    status: 'preparing' as const,
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 mins ago
    delivery_address: 'Apartment 12B, Viman Nagar, Pune',
    delivery_instructions: 'Leave at door if no answer',
    payment_method: 'UPI',
    estimated_time: '5-7 mins'
  },
  {
    id: 'ORD006',
    customer_name: 'Anita Desai',
    customer_phone: '+91 43210 98765',
    items: [
      { product_name: 'Pani Puri', quantity: 1, price: 20, total: 20 },
      { product_name: 'Samosa', quantity: 2, price: 15, total: 30 }
    ],
    total_amount: 50,
    status: 'confirmed' as const,
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
    delivery_address: 'Shop 8, MG Road, Pune - 411001',
    delivery_instructions: 'Near the bus stop',
    payment_method: 'Cash on Delivery',
    estimated_time: '8-12 mins'
  }
];

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  delivery_address: string;
  delivery_instructions?: string;
  payment_method: string;
  estimated_time: string;
}

export default function OrdersPage() {
  const { user, isLoading } = useSupabaseAuth();
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '🍽️';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusOptions = (currentStatus: Order['status']) => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['delivered'],
      delivered: [],
      cancelled: []
    };
    return statusFlow[currentStatus] || [];
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0)
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
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                📋 Orders
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all your orders in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <span className="text-xl">📋</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-xl">⏳</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-xl">👨‍🍳</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-xl font-bold text-orange-600">{orderStats.preparing}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">🍽️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-xl font-bold text-green-600">{orderStats.ready}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-blue-600">{orderStats.delivered}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-xl">💰</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-purple-600">₹{orderStats.revenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by customer name, phone, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{getStatusIcon(order.status)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">#{order.id}</h3>
                    <p className="text-gray-600">{order.customer_name} • {order.customer_phone}</p>
                    <p className="text-sm text-gray-500">{getTimeAgo(order.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-2xl font-bold text-orange-600 mt-2">₹{order.total_amount}</p>
                  <p className="text-sm text-gray-500">{order.payment_method}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Items Ordered:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{item.product_name}</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.total}</p>
                        <p className="text-sm text-gray-500">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📍 Delivery Address:</h4>
                  <p className="text-gray-600">{order.delivery_address}</p>
                  {order.delivery_instructions && (
                    <p className="text-gray-500 text-sm mt-1">
                      💬 {order.delivery_instructions}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">⏱️ Estimated Time:</h4>
                  <p className="text-gray-600">{order.estimated_time}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {getStatusOptions(order.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(order.id, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === 'cancelled'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : status === 'confirmed'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : status === 'preparing'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : status === 'ready'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : status === 'delivered'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {status === 'confirmed' && '✅ Confirm Order'}
                    {status === 'preparing' && '👨‍🍳 Start Preparing'}
                    {status === 'ready' && '🍽️ Mark Ready'}
                    {status === 'delivered' && '✅ Mark Delivered'}
                    {status === 'cancelled' && '❌ Cancel Order'}
                  </button>
                ))}
                <button
                  onClick={() => window.open(`tel:${order.customer_phone}`, '_self')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  📞 Call Customer
                </button>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg mb-2">No orders found</p>
              <p className="text-gray-400">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Orders will appear here when customers place them'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}