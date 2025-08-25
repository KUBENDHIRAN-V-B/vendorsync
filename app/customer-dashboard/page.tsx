'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cart-context';
import { getProducts, Product } from '../../lib/firebase-products';
import { getOrders, Order } from '../../lib/firebase-orders';
import Cart from '../../components/Cart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor_id: string;
  is_available: boolean;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: Array<{product_name: string; quantity: number}>;
  delivery_address: string;
}

// Demo data for customer
const nearbyVendors = [
  { 
    id: 'V001', 
    name: 'Rajesh\'s Street Cart', 
    cuisine: 'Mumbai Street Food', 
    distance: '0.2 km', 
    rating: 4.8, 
    reviews: 234, 
    deliveryTime: '15-20 min',
    specialties: ['Vada Pav', 'Pav Bhaji', 'Chai'],
    isOpen: true
  },
  { 
    id: 'V002', 
    name: 'Dosa Corner', 
    cuisine: 'South Indian', 
    distance: '0.5 km', 
    rating: 4.7, 
    reviews: 189, 
    deliveryTime: '20-25 min',
    specialties: ['Masala Dosa', 'Idli', 'Sambar'],
    isOpen: true
  },
  { 
    id: 'V003', 
    name: 'Chaat Master', 
    cuisine: 'North Indian Chaat', 
    distance: '0.8 km', 
    rating: 4.6, 
    reviews: 156, 
    deliveryTime: '25-30 min',
    specialties: ['Pani Puri', 'Bhel Puri', 'Aloo Tikki'],
    isOpen: false
  }
];

const customerOrders = [
  { 
    id: 'CO001', 
    vendor: 'Rajesh\'s Street Cart', 
    items: ['2x Vada Pav', '1x Chai'], 
    total: 60, 
    status: 'delivered', 
    date: 'Today, 2:30 PM',
    rating: 5
  },
  { 
    id: 'CO002', 
    vendor: 'Dosa Corner', 
    items: ['1x Masala Dosa', '1x Filter Coffee'], 
    total: 85, 
    status: 'delivered', 
    date: 'Yesterday, 7:45 PM',
    rating: 4
  },
  { 
    id: 'CO003', 
    vendor: 'Chaat Master', 
    items: ['1x Pani Puri', '1x Bhel Puri'], 
    total: 70, 
    status: 'delivered', 
    date: '2 days ago, 4:15 PM',
    rating: 5
  }
];

const favoriteItems = [
  { name: 'Vada Pav', vendor: 'Rajesh\'s Street Cart', price: 25, orders: 12 },
  { name: 'Masala Dosa', vendor: 'Dosa Corner', price: 45, orders: 8 },
  { name: 'Pav Bhaji', vendor: 'Rajesh\'s Street Cart', price: 60, orders: 6 },
  { name: 'Masala Chai', vendor: 'Rajesh\'s Street Cart', price: 10, orders: 15 }
];

const demoProducts: Product[] = [
  { id: '1', name: 'Vada Pav', description: 'Mumbai\'s iconic street food', price: 25, category: 'Street Food', vendor_id: 'V001', is_available: true },
  { id: '2', name: 'Pav Bhaji', description: 'Spicy vegetable curry with bread', price: 60, category: 'Street Food', vendor_id: 'V001', is_available: true },
  { id: '3', name: 'Masala Dosa', description: 'Crispy South Indian crepe', price: 45, category: 'South Indian', vendor_id: 'V002', is_available: true },
  { id: '4', name: 'Samosa', description: 'Crispy triangular pastry', price: 20, category: 'Snacks', vendor_id: 'V001', is_available: true },
  { id: '5', name: 'Masala Chai', description: 'Traditional spiced tea', price: 10, category: 'Beverages', vendor_id: 'V001', is_available: true },
  { id: '6', name: 'Bhel Puri', description: 'Crunchy mix with chutneys', price: 35, category: 'Chaat', vendor_id: 'V003', is_available: true }
];

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('vendorsync_user');
    const userType = localStorage.getItem('vendorsync_user_type');
    
    if (!userData || userType !== 'customer') {
      router.push('/customer-login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load products and orders
    loadProducts();
    loadOrders(parsedUser.id);
  }, [router]);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        // Use demo data if no Firebase products
        setProducts(demoProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(demoProducts);
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      const fetchedOrders = await getOrders(userId, 'customer');
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorsync_user');
    localStorage.removeItem('vendorsync_user_type');
    router.push('/');
  };

  const handleOrderFromVendor = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setActiveTab('menu');
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      vendor_id: product.vendor_id,
      vendor_name: 'Demo Vendor'
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = !selectedVendor || product.vendor_id === selectedVendor;
    return matchesCategory && matchesSearch && matchesVendor && product.is_available;
  });

  const handleReorder = (orderId: string) => {
    alert(`Reordering ${orderId} - This would add the same items to cart`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                <span className="text-2xl">👥</span>
                <span className="text-xl font-bold text-gray-900">VendorSync</span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Customer Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                🛒 Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
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
              { id: 'discover', name: 'Discover Vendors', icon: '🔍' },
              { id: 'menu', name: 'Menu', icon: '🍽️' },
              { id: 'orders', name: 'My Orders', icon: '📋' },
              { id: 'favorites', name: 'Favorites', icon: '❤️' },
              { id: 'profile', name: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
        {/* Discover Vendors Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discover Street Food Near You</h1>
              <p className="text-gray-600">Find amazing local vendors and order delicious food</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for food, vendors, or cuisine..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Categories</option>
                    <option>Street Food</option>
                    <option>South Indian</option>
                    <option>North Indian</option>
                    <option>Chaat</option>
                    <option>Beverages</option>
                    <option>Snacks</option>
                  </select>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Nearby Vendors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-6xl">🏪</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vendor.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{vendor.cuisine}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>⭐ {vendor.rating} ({vendor.reviews} reviews)</span>
                      <span>📍 {vendor.distance}</span>
                      <span>⏱️ {vendor.deliveryTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vendor.specialties.map((item, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleOrderFromVendor(vendor.id)}
                      disabled={!vendor.isOpen}
                      className={`w-full py-2 rounded-lg transition-colors ${
                        vendor.isOpen
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {vendor.isOpen ? 'View Menu & Order' : 'Currently Closed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
              <button
                onClick={() => setActiveTab('discover')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Vendors
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Category: {product.category}</p>
                    <p>Available: Yes</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                        <p className="text-gray-600">Vendor Order</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total_amount}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600">Items: {order.items.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Delivery: {order.delivery_address}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReorder(order.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Reorder
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Favorite Items</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{item.vendor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{item.price}</p>
                      <p className="text-sm text-gray-500">Ordered {item.orders} times</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Order Again
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={user.phone}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Cuisines</label>
                    <div className="flex flex-wrap gap-2">
                      {user.preferences?.cuisine?.map((cuisine: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Spice Level</label>
                    <input
                      type="text"
                      value={user.preferences?.spiceLevel || 'Medium'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={user.location}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">23</p>
                  <p className="text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">₹1,840</p>
                  <p className="text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">₹80</p>
                  <p className="text-gray-600">Avg Order Value</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">4.8</p>
                  <p className="text-gray-600">Avg Rating Given</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}