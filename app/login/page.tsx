'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '../../lib/firebase-auth-context';

export default function BusinessLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'vendor' | 'wholesaler' | 'customer'>('vendor');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signUp, signIn, isLoading } = useSupabaseAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (isRegister) {
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!phone.trim()) newErrors.phone = 'Phone number is required';
      if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      if (isRegister) {
        const result = await signUp({ 
          email, 
          password, 
          name, 
          phone, 
          role 
        });
        
        if (!result.error) {
          router.push('/dashboard');
        } else {
          setErrors({ general: result.error.message || 'Registration failed' });
        }
      } else {
        const result = await signIn(email, password);
        
        if (!result.error) {
          router.push('/dashboard');
        } else {
          setErrors({ general: result.error.message || 'Login failed' });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🏪</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isRegister ? 'Create Business Account' : 'Business Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegister 
              ? 'Join VendorSync and grow your business'
              : 'Sign in to your VendorSync business account'
            }
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="vendor"
                checked={role === 'vendor'}
                onChange={(e) => setRole(e.target.value as 'vendor' | 'wholesaler')}
                className="mr-2 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Vendor</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="wholesaler"
                checked={role === 'wholesaler'}
                onChange={(e) => setRole(e.target.value as 'vendor' | 'wholesaler')}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Wholesaler</span>
            </label>
          </div>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Enter your ${role === 'vendor' ? 'business' : 'company'} name`}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
              </>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
                id="email"
              type="email"
              required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
              <div className="relative">
            <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
              required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
          </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium ${
              role === 'vendor' 
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Please wait...
              </span>
            ) : (
              isRegister ? 'Create Account' : 'Sign In'
            )}
          </button>

          {/* Demo Access */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold text-purple-900 mb-2">🎯 E-Cell Competition Demo</h4>
              <p className="text-purple-700 text-sm">Experience VendorSync without creating an account</p>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/demo"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-center font-semibold shadow-lg"
              >
                🚀 Launch Interactive Demo
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/products"
                  className="bg-orange-100 text-orange-800 py-2 px-3 rounded-lg hover:bg-orange-200 transition-colors text-center text-sm font-medium"
                >
                  📦 View Products
                </Link>
                <Link 
                  href="/orders"
                  className="bg-blue-100 text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-center text-sm font-medium"
                >
                  📋 View Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 text-center">Demo Business Accounts</h4>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-orange-500 pl-3">
                <div className="font-medium text-orange-700">Vendor Account</div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-mono text-gray-800">demo.vendor@vendorsync.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-mono text-gray-800">demo123</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Includes: Menu with 10 items, order management, analytics</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-3">
                <div className="font-medium text-green-700">Wholesaler Account</div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-mono text-gray-800">demo.wholesaler@vendorsync.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-mono text-gray-800">demo123</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Includes: Product catalog, inventory management, supplier network</p>
              </div>
            </div>
          </div>

          {/* Toggle Register/Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrors({});
                setPassword('');
              }}
              className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : 'Need an account? Create one'}
            </button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Other portals:</p>
          <div className="flex justify-center space-x-6">
            <a href="/customer/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Customer Portal
            </a>
            <a href="/" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
              Home
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Why Choose VendorSync? ✨</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {role === 'vendor' ? 'Manage your street food business' : 'Supply ingredients to vendors'}
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              IoT integration and smart analytics
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Real-time inventory management
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              AI-powered business insights
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}