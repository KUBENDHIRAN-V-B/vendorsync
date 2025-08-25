'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../../lib/firebase-auth-context';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
  const { signUp, signIn } = useSupabaseAuth();

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
        const { error } = await signUp({
          email,
          password,
          name,
          phone,
          role: 'customer'
        });

        if (error) {
          setErrors({ general: error.message || 'Registration failed' });
        } else {
          alert('Account created successfully! Please check your email to verify your account. 🎉');
          setIsRegister(false);
          setEmail('');
          setPassword('');
          setName('');
          setPhone('');
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          setErrors({ general: error.message || 'Login failed' });
        }
        // Redirect is handled by the auth context
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };



  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, color: 'gray', text: '' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: score, color: 'red', text: 'Weak' };
    if (score <= 4) return { strength: score, color: 'yellow', text: 'Fair' };
    return { strength: score, color: 'green', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🍛</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegister 
              ? 'Join VendorSync and discover delicious food from nearby vendors'
              : 'Sign in to your VendorSync account'
            }
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
              
              {/* Password Strength Indicator */}
              {isRegister && password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 w-8 rounded-full ${
                            level <= passwordStrength.strength
                              ? `bg-${passwordStrength.color}-500`
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
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

          {/* Demo Credentials */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 text-center">Demo Customer Account</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-mono text-gray-800">demo.customer@vendorsync.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Password:</span>
                <span className="font-mono text-gray-800">demo123</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Includes: Order history, delivery addresses, food preferences
            </p>
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
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : 'Need an account? Create one'}
            </button>
            
            {!isRegister && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Or{' '}
                  <a href="/customer/register" className="text-purple-600 hover:text-purple-800 font-medium">
                    create a detailed account
                  </a>
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Other portals:</p>
          <div className="flex justify-center space-x-6">
            <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Vendor Portal
            </a>
            <a href="/login" className="text-green-600 hover:text-green-800 text-sm font-medium">
              Wholesaler Portal
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Why Join VendorSync? ✨</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Discover nearby food vendors
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Order delicious street food
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Track orders in real-time
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Earn loyalty points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}