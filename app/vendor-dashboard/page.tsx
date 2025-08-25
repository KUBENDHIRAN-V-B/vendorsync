'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProducts, createProduct, updateProduct, deleteProduct, toggleProductAvailability, Product, CreateProductData } from '../../lib/firebase-products';
import { getOrders, updateOrderStatus, Order } from '../../lib/firebase-orders';
import { createWholesaleOrder, getWholesaleOrders, CreateWholesaleOrderData, WholesaleOrder } from '../../lib/firebase-wholesale-orders';
import ProductForm from '../../components/ProductForm';
import WholesaleOrderForm from '../../components/WholesaleOrderForm';

// Demo data for vendor
const vendorProducts = [
  { id: '1', name: 'Vada Pav', price: 25, category: 'Street Food', stock: 50, orders: 156, rating: 4.8 },
  { id: '2', name: 'Pav Bhaji', price: 60, category: 'Street Food', stock: 30, orders: 203, rating: 4.9 },
  { id: '3', name: 'Masala Dosa', price: 45, category: 'South Indian', stock: 25, orders: 89, rating: 4.7 },
  { id: '4', name: 'Samosa', price: 15, category: 'Snacks', stock: 80, orders: 234, rating: 4.6 },
  { id: '5', name: 'Masala Chai', price: 10, category: 'Beverages', stock: 100, orders: 567, rating: 4.9 }
];

const customerOrders = [
  { id: 'ORD001', customer: 'Rahul Sharma', items: ['2x Vada Pav', '1x Chai'], total: 60, status: 'preparing', time: '2 mins ago' },
  { id: 'ORD002', customer: 'Priya Patel', items: ['1x Pav Bhaji'], total: 60, status: 'ready', time: '5 mins ago' },
  { id: 'ORD003', customer: 'Amit Kumar', items: ['3x Samosa'], total: 45, status: 'delivered', time: '15 mins ago' }
];

const wholesaleSupplies = [
  { id: 'WS001', supplier: 'Mumbai Spices Co.', name: 'Potatoes', category: 'Vegetables', minQuantity: '50 kg', price: 30, unit: 'per kg', status: 'available' },
  { id: 'WS002', supplier: 'Fresh Farms Ltd.', name: 'Onions', category: 'Vegetables', minQuantity: '25 kg', price: 30, unit: 'per kg', status: 'available' },
  { id: 'WS003', supplier: 'Grain Masters', name: 'Bread Pav', category: 'Bakery', minQuantity: '200 pieces', price: 2, unit: 'per piece', status: 'available' },
  { id: 'WS004', supplier: 'Spice Kingdom', name: 'Mixed Spices', category: 'Spices', minQuantity: '5 kg', price: 400, unit: 'per kg', status: 'available' }
];

export default function VendorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>(vendorProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wholesaleOrders, setWholesaleOrders] = useState<WholesaleOrder[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderingProduct, setOrderingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('vendorsync_user');
    const userType = localStorage.getItem('vendorsync_user_type');
    
    if (!userData || userType !== 'vendor') {
      router.push('/vendor-login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load vendor data
    loadProducts(parsedUser.id);
    // Use demo vendor ID to match orders from customers
    loadOrders('vendor-demo-001');
    loadWholesaleOrders(parsedUser.id);
  }, [router]);

  const loadProducts = async (vendorId: string) => {
    try {
      const fetchedProducts = await getProducts(vendorId);
      setProducts(fetchedProducts.length > 0 ? fetchedProducts : vendorProducts.map(p => ({...p, description: 'Demo product', stock_quantity: p.stock, is_available: true})));
    } catch (error) {
      setProducts(vendorProducts.map(p => ({...p, description: 'Demo product', stock_quantity: p.stock, is_available: true})));
    }
  };

  const loadOrders = async (vendorId: string) => {
    try {
      // Load from Firebase
      const fetchedOrders = await getOrders(vendorId, 'vendor');
      
      // Load from local storage for demo
      const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]')
        .filter((order: any) => order.vendor_id === vendorId)
        .map((order: any) => ({
          ...order,
          items: order.items.map((item: any) => ({
            product_name: item.product_name,
            quantity: item.quantity
          }))
        }));
      
      // Combine Firebase and demo orders
      const allOrders = [...fetchedOrders, ...demoOrders];
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to demo orders only
      const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]')
        .filter((order: any) => order.vendor_id === vendorId)
        .map((order: any) => ({
          ...order,
          items: order.items.map((item: any) => ({
            product_name: item.product_name,
            quantity: item.quantity
          }))
        }));
      setOrders(demoOrders);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorsync_user');
    localStorage.removeItem('vendorsync_user_type');
    router.push('/');
  };

  const loadWholesaleOrders = async (vendorId: string) => {
    try {
      const fetchedOrders = await getWholesaleOrders(vendorId, 'vendor');
      
      // Load from local storage for demo
      const demoOrders = JSON.parse(localStorage.getItem('demo_wholesale_orders') || '[]')
        .filter((order: any) => order.vendor_id === vendorId);
      
      // Combine Firebase and demo orders
      const allOrders = [...fetchedOrders, ...demoOrders];
      setWholesaleOrders(allOrders);
    } catch (error) {
      console.error('Error loading wholesale orders:', error);
      // Fallback to demo orders only
      const demoOrders = JSON.parse(localStorage.getItem('demo_wholesale_orders') || '[]')
        .filter((order: any) => order.vendor_id === vendorId);
      setWholesaleOrders(demoOrders);
    }
  };

  const handleOrderSupply = (supply: any) => {
    setOrderingProduct(supply);
  };

  const handleWholesaleOrder = async (orderData: CreateWholesaleOrderData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const result = await createWholesaleOrder(orderData, user.id);
      if (result.success && result.order) {
        // Save to localStorage for demo
        const existingOrders = JSON.parse(localStorage.getItem('demo_wholesale_orders') || '[]');
        existingOrders.push(result.order);
        localStorage.setItem('demo_wholesale_orders', JSON.stringify(existingOrders));
        
        await loadWholesaleOrders(user.id);
        setOrderingProduct(null);
        alert('Wholesale order placed successfully!');
      } else {
        alert('Failed to place order: ' + result.error);
      }
    } catch (error) {
      alert('Error placing wholesale order');
    }
    setIsLoading(false);
  };

  const handleAddProduct = async (productData: CreateProductData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const result = await createProduct(productData, user.id);
      if (result.success) {
        await loadProducts(user.id);
        setShowAddProduct(false);
      } else {
        alert('Failed to add product: ' + result.error);
      }
    } catch (error) {
      alert('Error adding product');
    }
    setIsLoading(false);
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<CreateProductData>) => {
    setIsLoading(true);
    try {
      const result = await updateProduct(productId, updates);
      if (result.success) {
        await loadProducts(user.id);
        setEditingProduct(null);
      } else {
        alert('Failed to update product: ' + result.error);
      }
    } catch (error) {
      alert('Error updating product');
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsLoading(true);
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        await loadProducts(user.id);
      } else {
        alert('Failed to delete product: ' + result.error);
      }
    } catch (error) {
      alert('Error deleting product');
    }
    setIsLoading(false);
  };

  const handleToggleAvailability = async (productId: string, isAvailable: boolean) => {
    setIsLoading(true);
    try {
      const result = await toggleProductAvailability(productId, !isAvailable);
      if (result.success) {
        await loadProducts(user.id);
      } else {
        alert('Failed to toggle availability: ' + result.error);
      }
    } catch (error) {
      alert('Error toggling availability');
    }
    setIsLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        await loadOrders('vendor-demo-001');
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
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏪</span>
                <span className="text-xl font-bold text-gray-900">VendorSync</span>
              </div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Vendor Dashboard
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
              { id: 'products', name: 'My Products', icon: '🍛' },
              { id: 'orders', name: 'Customer Orders', icon: '📋' },
              { id: 'supplies', name: 'Wholesale Supplies', icon: '📦' },
              { id: 'wholesale-orders', name: 'My Wholesale Orders', icon: '🚚' }
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">Vendor Dashboard - Manage your street food business</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹4,250</p>
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
                    <p className="text-2xl font-bold text-gray-900">67</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-2xl">🍛</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Customer Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">#{order.id}</p>
                        <p className="text-sm text-gray-500">{order.items.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Products (For Customers)</h2>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                  </div>
                  <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Category: {product.category}</p>
                    <p>Stock: {product.stock_quantity} units</p>
                    <p>Status: 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleAvailability(product.id, product.is_available)}
                      className={`flex-1 py-2 rounded text-white ${
                        product.is_available ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                      disabled={isLoading}
                    >
                      {product.is_available ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                      disabled={isLoading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products added yet. Add your first product to start selling!</p>
              </div>
            )}
          </div>
        )}

        {/* Customer Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Customer Orders (Small Quantities)</h2>
              <button 
                onClick={() => loadOrders('vendor-demo-001')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={isLoading}
              >
                🔄 Refresh Orders
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                        <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'ready' ? 'bg-green-100 text-green-800' :
                          order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total_amount}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600">Items: {order.items.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}</p>
                      <p className="text-sm text-gray-500 mt-1">Delivery: {order.delivery_address}</p>
                    </div>
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                          disabled={isLoading}
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          disabled={isLoading}
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Contact Customer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders received yet. Orders will appear here when customers place them.</p>
              </div>
            )}
          </div>
        )}

        {/* Wholesale Supplies Tab */}
        {activeTab === 'supplies' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Wholesale Supplies (Large Quantities)</h2>
            <p className="text-gray-600">Order ingredients and supplies in bulk from wholesalers</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wholesaleSupplies.map((supply) => (
                <div key={supply.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{supply.item}</h3>
                      <p className="text-gray-600">{supply.supplier}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {supply.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">Category: {supply.category}</p>
                    <p className="text-gray-600">Min Order: {supply.minQuantity}</p>
                    <p className="text-2xl font-bold text-green-600">₹{supply.price} {supply.unit}</p>
                  </div>
                  <button
                    onClick={() => handleOrderSupply(supply)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Order from Wholesaler
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wholesale Orders Tab */}
        {activeTab === 'wholesale-orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Wholesale Orders</h2>
              <button 
                onClick={() => loadWholesaleOrders(user.id)}
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
                  </div>
                ))}
              </div>
            </div>

            {wholesaleOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No wholesale orders placed yet. Visit the Wholesale Supplies tab to order ingredients.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showAddProduct && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddProduct(false)}
          isLoading={isLoading}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
          onCancel={() => setEditingProduct(null)}
          isLoading={isLoading}
        />
      )}

      {/* Wholesale Order Modal */}
      {orderingProduct && (
        <WholesaleOrderForm
          product={orderingProduct}
          onSubmit={handleWholesaleOrder}
          onCancel={() => setOrderingProduct(null)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}