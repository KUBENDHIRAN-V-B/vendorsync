'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WholesalerLogin() {
  const router = useRouter();

  const handleDemoLogin = () => {
    // Set demo user data in localStorage
    const demoWholesaler = {
      id: 'wholesaler-demo-001',
      name: 'Mumbai Spices & Ingredients Co.',
      email: 'demo.wholesaler@vendorsync.com',
      role: 'wholesaler',
      phone: '+91 87654 32109',
      isVerified: true,
      businessType: 'wholesale_supplier',
      location: 'Crawford Market, Mumbai'
    };
    
    localStorage.setItem('vendorsync_user', JSON.stringify(demoWholesaler));
    localStorage.setItem('vendorsync_user_type', 'wholesaler');
    
    // Redirect to wholesaler dashboard
    router.push('/wholesaler-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🏢</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Wholesaler Portal</h2>
          <p className="text-lg text-gray-600">
            Supply ingredients to street food vendors
          </p>
        </div>

        {/* Demo Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-green-900 mb-3">🎯 Demo Access</h3>
            <p className="text-gray-600">
              Experience the wholesaler dashboard with sample data
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all shadow-lg"
            >
              🚀 Enter as Demo Wholesaler
            </button>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Demo Features Include:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✅ Bulk product catalog management</li>
                <li>✅ Vendor network & orders</li>
                <li>✅ Inventory & supply chain tracking</li>
                <li>✅ Bulk pricing & quantity management</li>
                <li>✅ Delivery route optimization</li>
                <li>✅ Business analytics & insights</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-6">
            <Link 
              href="/vendor-login" 
              className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              🏪 Vendor Portal
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
            Why Wholesalers Choose VendorSync? 🌟
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">🚚</span>
              <span>Expand to 500+ street food vendors</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">📦</span>
              <span>Bulk order management system</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">💰</span>
              <span>Increase sales volume by 60%</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">📍</span>
              <span>Optimize delivery routes & costs</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3 text-lg">📊</span>
              <span>Track demand patterns & trends</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}