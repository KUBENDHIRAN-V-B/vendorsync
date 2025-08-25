'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../lib/firebase-auth-context';
import ProfileEdit from './components/ProfileEdit';

export default function CustomerDashboard() {
  const [nearbyVendors, setNearbyVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useSupabaseAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/customer/login');
      return;
    }
    
      if (user.role !== 'customer') {
      alert('Access denied. Customer login required.');
        router.push('/customer/login');
      return;
    }

      // Fetch data from Supabase
    fetchNearbyVendors();
    fetchProducts();
    fetchOrders();
      setLoading(false);
    }
  }, [user, authLoading, router]);

  const fetchNearbyVendors = async () => {
    try {
      // This would be replaced with actual Supabase queries
      // For now, using mock data
      setNearbyVendors([
        {
          id: '1',
          business_name: 'Delhi Street Food',
          business_type: 'street_cart',
          location: { address: 'Connaught Place, Delhi' },
          ratings: { average: 4.5, count: 120 }
        },
        {
          id: '2',
          business_name: 'Mumbai Vada Pav',
          business_type: 'street_cart',
          location: { address: 'Andheri West, Mumbai' },
          ratings: { average: 4.2, count: 89 }
        }
      ]);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      // This would be replaced with actual Supabase queries
      // For now, using mock data
      setProducts([
        {
          id: '1',
          name: 'Vada Pav',
          description: 'Mumbai style vada pav with chutneys',
          price: 25,
          owner_id: '1'
        },
        {
          id: '2',
          name: 'Pav Bhaji',
          description: 'Spicy vegetable curry with soft bread',
          price: 40,
          owner_id: '1'
        },
        {
          id: '3',
          name: 'Masala Chai',
          description: 'Traditional Indian spiced tea',
          price: 15,
          owner_id: '2'
        }
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      // This would be replaced with actual Supabase queries
      // For now, using mock data
      setOrders([
        {
          id: '1',
          order_number: 'ORD001',
          items: [{ name: 'Vada Pav', quantity: 2 }],
          total_amount: 50,
          status: 'delivered',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const placeOrder = async (vendorId, productId, productName, price) => {
    try {
      // This would be replaced with actual Supabase insert
        alert('Order placed successfully!');
        fetchOrders();
      setActiveTab('orders');
    } catch (error) {
      alert('Error placing order');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleProfileUpdate = (updatedData) => {
    // This would update the user profile in Supabase
    console.log('Profile updated:', updatedData);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🍛 VendorSync</h1>
              <span className="ml-3 text-sm text-gray-500">Customer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
          </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { id: 'vendors', label: 'Vendors', icon: '🏪' },
              { id: 'products', label: 'Products', icon: '🛒' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'profile', label: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
              <p className="text-blue-100">Discover delicious food from nearby vendors and track your orders.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Nearby Vendors</p>
                    <p className="text-2xl font-bold text-gray-900">{nearbyVendors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                    <p className="text-2xl font-bold text-gray-900">150</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('vendors')}
                  className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔍 Find Vendors
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  🛒 Browse Products
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  📦 Track Orders
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  ⚙️ Settings
                </button>
          </div>
        </div>

            {/* Recent Orders Preview */}
          <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">📦 Recent Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All →
                </button>
              </div>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order, index) => (
                    <div key={order.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total_amount}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No orders yet. Start ordering from nearby vendors!</p>
              )}
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🏪 Nearby Food Vendors</h2>
            {nearbyVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyVendors.map((vendor, index) => (
                  <div key={vendor.id || index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{vendor.business_name}</h3>
                        <p className="text-sm text-gray-600">{vendor.business_type}</p>
                      </div>
                      <span className="text-2xl">🏪</span>
                    </div>
                    <p className="text-gray-600 mb-3">{vendor.location?.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                        <span className="ml-1 text-sm">{vendor.ratings?.average || 4.0}</span>
                        <span className="ml-2 text-xs text-gray-500">({vendor.ratings?.count || 0} reviews)</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Open</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      View Menu
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🏪</span>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No nearby vendors found</h3>
                <p className="text-gray-500">Enable location services or check back later for vendors in your area.</p>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">🛒 Available Products</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
          </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id || index} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                      <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                        </div>
                        <span className="text-3xl">🍽️</span>
                      </div>
                      <button
                        onClick={() => placeOrder(product.owner_id, product.id, product.name, product.price)}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🛒</span>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">
                  {searchQuery ? `No products match "${searchQuery}"` : 'No products available. Check back later.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">📦 My Orders</h2>
          {orders.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                        <tr key={order.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items?.length || 0} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ₹{order.total_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">View Details</button>
                          </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
            </div>
          ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📦</span>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4">Start ordering from nearby vendors to see your order history here.</p>
                <button 
                  onClick={() => setActiveTab('products')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Browse Products
                </button>
              </div>
          )}
        </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">👤 My Profile</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Orders:</span>
                      <span className="text-sm font-medium">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Loyalty Points:</span>
                      <span className="text-sm font-medium">150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Member Since:</span>
                      <span className="text-sm font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowProfileEdit(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
            </button>
          </div>
        </div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <ProfileEdit
            user={user}
            onClose={() => setShowProfileEdit(false)}
            onUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
}