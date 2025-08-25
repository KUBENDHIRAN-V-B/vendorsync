'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorLogin() {
  const [isDemo, setIsDemo] = useState(false);
  const router = useRouter();

  const handleDemoLogin = () => {
    // Set demo user data in localStorage
    const demoVendor = {
      id: 'vendor-demo-001',
      name: 'Rajesh\'s Street Cart',
      email: 'demo.vendor@vendorsync.com',
      role: 'vendor',
      phone: '+91 98765 43210',
      isVerified: true,
      businessType: 'street_cart',
      location: 'FC Road, Pune'
    };
    
    localStorage.setItem('vendorsync_user', JSON.stringify(demoVendor));
    localStorage.setItem('vendorsync_user_type', 'vendor');
    
    // Redirect to vendor dashboard
    router.push('/vendor-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🏪</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Vendor Portal</h2>
          <p className="text-lg text-gray-600">
            Manage your street food business with VendorSync
          </p>
        </div>

        {/* Demo Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-orange-900 mb-3">🎯 Demo Access</h3>
            <p className="text-gray-600">
              Experience the vendor dashboard with sample data
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg"
            >
              🚀 Enter as Demo Vendor
            </button>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Demo Features Include:</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>✅ Product management (10+ items)</li>
                <li>✅ Order tracking & management</li>
                <li>✅ Real-time analytics dashboard</li>
                <li>✅ Inventory management system</li>
                <li>✅ Customer communication tools</li>
                <li>✅ Wholesale supplier marketplace</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-6">
            <Link 
              href="/wholesaler-login" 
              className="text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              🏢 Wholesaler Portal
            </Link>
            <Link 
              href="/customer-login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              👥 Customer Portal
            </Link>
          </div>
          
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors block"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Business Benefits */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Why Vendors Choose VendorSync? 🌟
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">📈</span>
              <span>Increase revenue by up to 40%</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">⏰</span>
              <span>Save 2+ hours daily on order management</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">🎯</span>
              <span>Reach more customers in your area</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">📊</span>
              <span>Get insights to optimize your menu</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">🤝</span>
              <span>Connect with wholesale suppliers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}