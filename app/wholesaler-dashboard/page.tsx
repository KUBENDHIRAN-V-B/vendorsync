'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getWholesaleOrders, updateWholesaleOrderStatus, WholesaleOrder } from '../../lib/firebase-wholesale-orders';

// Demo data for wholesaler
const wholesaleProducts = [
  { id: 'WP001', name: 'Potatoes', category: 'Vegetables', minQuantity: '25 kg', price: 30, unit: 'per kg', stock: 500, orders: 45 },
  { id: 'WP002', name: 'Onions', category: 'Vegetables', minQuantity: '20 kg', price: 35, unit: 'per kg', stock: 300, orders: 38 },
  { id: 'WP003', name: 'Tomatoes', category: 'Vegetables', minQuantity: '15 kg', price: 40, unit: 'per kg', stock: 200, orders: 29 },
  { id: 'WP004', name: 'Bread Pav', category: 'Bakery', minQuantity: '100 pieces', price: 2, unit: 'per piece', stock: 2000, orders: 67 },
  { id: 'WP005', name: 'Mixed Spices', category: 'Spices', minQuantity: '2 kg', price: 400, unit: 'per kg', stock: 50, orders: 23 },
  { id: 'WP006', name: 'Cooking Oil', category: 'Oil', minQuantity: '5 liters', price: 120, unit: 'per liter', stock: 100, orders: 34 }
];

const vendorOrders = [
  { id: 'VO001', vendor: 'Rajesh\'s Street Cart', items: ['50kg Potatoes', '25kg Onions'], total: 2375, status: 'pending', time: '1 hour ago' },
  { id: 'VO002', vendor: 'Mumbai Chaat Corner', items: ['200 Bread Pav', '2kg Spices'], total: 1200, status: 'confirmed', time: '3 hours ago' },
  { id: 'VO003', vendor: 'Dosa King', items: ['15kg Tomatoes', '5L Oil'], total: 1200, status: 'delivered', time: '1 day ago' }
];

export default function WholesalerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [wholesaleOrders, setWholesaleOrders] = useState<WholesaleOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('vendorsync_user');
    const userType = localStorage.getItem('vendorsync_user_type');
    
    if (!userData || userType !== 'wholesaler') {
      router.push('/wholesaler-login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load wholesaler data
    loadWholesaleOrders('wholesaler-demo-001');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vendorsync_user');
    localStorage.removeItem('vendorsync_user_type');
    router.push('/');
  };

  const loadWholesaleOrders = async (wholesalerId: string) => {
    try {
      // Load from Firebase
      const fetchedOrders = await getWholesaleOrders(wholesalerId, 'wholesaler');
      
      // Load from local storage for demo
      const demoOrders = JSON.parse(localStorage.getItem('demo_wholesale_orders') || '[]')
        .filter((order: any) => order.wholesaler_id === wholesalerId);
      
      // Combine Firebase and demo orders
      const allOrders = [...fetchedOrders, ...demoOrders];
      setWholesaleOrders(allOrders);
    } catch (error) {
      console.error('Error loading wholesale orders:', error);
      // Fallback to demo orders only
      const demoOrders = JSON.parse(localStorage.getItem('demo_wholesale_orders') || '[]')
        .filter((order: any) => order.wholesaler_id === wholesalerId);
      setWholesaleOrders(demoOrders);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: WholesaleOrder['status']) => {
    setIsLoading(true);
    try {
      const result = await updateWholesaleOrderStatus(orderId, newStatus);
      if (result.success) {
        // Update localStorage for demo
        const demoOrders = JSON.parse(localStorage.getItem('demo_wholesale_orders') || '[]');
        const updatedOrders = demoOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order
        );
        localStorage.setItem('demo_wholesale_orders', JSON.stringify(updatedOrders));
        
        await loadWholesaleOrders('wholesaler-demo-001');
      } else {
        alert('Failed to update order status: ' + result.error);
      }
    } catch (error) {
      alert('Error updating order status');
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏢</span>
                <span className="text-xl font-bold text-gray-900">VendorSync</span>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Wholesaler Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'products', name: 'Bulk Products', icon: '📦' },
              { id: 'orders', name: 'Vendor Orders', icon: '🚚' },
              { id: 'network', name: 'Vendor Network', icon: '🏪' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">Wholesaler Dashboard - Supply to street food vendors</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹2,45,000</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Orders This Month</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{wholesaleOrders.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Vendor Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {wholesaleOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">#{order.id}</p>
                        <p className="text-sm text-gray-500">{order.items.map(item => `${item.quantity} ${item.unit} ${item.product_name}`).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {wholesaleOrders.length === 0 && (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No orders received yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bulk Products (For Vendors)</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wholesaleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Category: {product.category}</p>
                    <p>Min Order: {product.minQuantity}</p>
                    <p>Price: ₹{product.price} {product.unit}</p>
                    <p>Stock: {product.stock} units</p>
                    <p>Vendor Orders: {product.orders}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700">
                      Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Vendor Orders (Large Quantities)</h2>
              <button 
                onClick={() => loadWholesaleOrders('wholesaler-demo-001')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={isLoading}
              >
                🔄 Refresh Orders
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                {wholesaleOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                        <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total_amount}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600">Items: {order.items.map(item => `${item.quantity} ${item.unit} ${item.product_name}`).join(', ')}</p>
                      <p className="text-sm text-gray-500 mt-1">Delivery: {order.delivery_address}</p>
                    </div>
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button 
                          onClick={() => handleOrderStatusUpdate(order.id, 'shipped')}
                          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                          disabled={isLoading}
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button 
                          onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          disabled={isLoading}
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Contact Vendor
                      </button>
                    </div>
                  </div>
                ))}
                {wholesaleOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders received yet. Orders will appear here when vendors place them.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vendor Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vendor Network</h2>
            <p className="text-gray-600">Street food vendors who order from your wholesale business</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Rajesh\'s Street Cart', location: 'FC Road, Pune', orders: 45, revenue: 67500, rating: 4.8 },
                { name: 'Mumbai Chaat Corner', location: 'Linking Road, Mumbai', orders: 38, revenue: 52000, rating: 4.7 },
                { name: 'Dosa King', location: 'Brigade Road, Bangalore', orders: 29, revenue: 43500, rating: 4.9 },
                { name: 'Samosa Junction', location: 'CP, New Delhi', orders: 52, revenue: 78000, rating: 4.6 },
                { name: 'Pav Bhaji Express', location: 'Juhu Beach, Mumbai', orders: 41, revenue: 61500, rating: 4.8 },
                { name: 'South Indian Delights', location: 'Koramangala, Bangalore', orders: 33, revenue: 49500, rating: 4.7 }
              ].map((vendor, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{vendor.name}</h3>
                  <p className="text-gray-600 mb-4">{vendor.location}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-medium">{vendor.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium text-green-600">₹{vendor.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1 font-medium">{vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}