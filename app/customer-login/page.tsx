'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerLogin() {
  const router = useRouter();

  const handleDemoLogin = () => {
    // Set demo user data in localStorage
    const demoCustomer = {
      id: 'customer-demo-001',
      name: 'Priya Sharma',
      email: 'demo.customer@vendorsync.com',
      role: 'customer',
      phone: '+91 76543 21098',
      isVerified: true,
      location: 'Koregaon Park, Pune',
      preferences: {
        cuisine: ['Street Food', 'South Indian', 'North Indian'],
        spiceLevel: 'Medium',
        dietaryRestrictions: []
      }
    };
    
    localStorage.setItem('vendorsync_user', JSON.stringify(demoCustomer));
    localStorage.setItem('vendorsync_user_type', 'customer');
    
    // Redirect to customer dashboard
    router.push('/customer-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">👥</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Customer Portal</h2>
          <p className="text-lg text-gray-600">
            Discover amazing street food near you
          </p>
        </div>

        {/* Demo Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">🎯 Demo Access</h3>
            <p className="text-gray-600">
              Experience the customer app with sample vendors
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
            >
              🚀 Enter as Demo Customer
            </button>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Demo Features Include:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Browse nearby street food vendors</li>
                <li>✅ View detailed menus & ratings</li>
                <li>✅ Place orders & track delivery</li>
                <li>✅ Order history & favorites</li>
                <li>✅ Real-time order updates</li>
                <li>✅ Rate & review vendors</li>
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
              href="/wholesaler-login" 
              className="text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              🏢 Wholesaler Portal
            </Link>
          </div>
          
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors block"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Customer Benefits */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Why Customers Love VendorSync? 🌟
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="text-blue-500 mr-3 text-lg">🍛</span>
              <span>Discover authentic street food nearby</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-3 text-lg">⭐</span>
              <span>Read reviews & ratings from locals</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-3 text-lg">🚚</span>
              <span>Fast delivery & real-time tracking</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-3 text-lg">💳</span>
              <span>Multiple payment options</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-3 text-lg">🎯</span>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}