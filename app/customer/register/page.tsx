'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../../lib/firebase-auth-context';

export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    pincode: '',
    preferences: {
      cuisine: [],
      spiceLevel: 'medium',
      dietaryRestrictions: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    city?: string;
    pincode?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signUp } = useSupabaseAuth();

  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Korean', 'Mediterranean', 'American', 'Fusion'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePreferenceChange = (type: string, value: string) => {
    if (type === 'cuisine') {
      const updatedCuisine = formData.preferences.cuisine.includes(value)
        ? formData.preferences.cuisine.filter(c => c !== value)
        : [...formData.preferences.cuisine, value];
      handleInputChange('preferences.cuisine', updatedCuisine);
    } else if (type === 'dietaryRestrictions') {
      const updatedDietary = formData.preferences.dietaryRestrictions.includes(value)
        ? formData.preferences.dietaryRestrictions.filter(d => d !== value)
        : [...formData.preferences.dietaryRestrictions, value];
      handleInputChange('preferences.dietaryRestrictions', updatedDietary);
    } else {
      handleInputChange(`preferences.${type}`, value);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: 'customer',
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        preferences: formData.preferences
      });

      if (error) {
        setErrors({ general: error.message || 'Registration failed' });
      } else {
        alert('Account created successfully! Please check your email to verify your account. 🎉');
        router.push('/customer/login');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🍛</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Join VendorSync</h1>
          <p className="mt-2 text-gray-600">Create your account and discover delicious food from nearby vendors</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Contact Information</h3>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your street address"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.city ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Enter your pincode"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.pincode ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Food Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🍽️ Food Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Cuisines
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <label key={cuisine} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.preferences.cuisine.includes(cuisine)}
                          onChange={() => handlePreferenceChange('cuisine', cuisine)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spice Level Preference
                  </label>
                  <div className="flex space-x-4">
                    {['mild', 'medium', 'hot', 'extra-hot'].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="spiceLevel"
                          value={level}
                          checked={formData.preferences.spiceLevel === level}
                          onChange={(e) => handlePreferenceChange('spiceLevel', e.target.value)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietaryOptions.map((dietary) => (
                      <label key={dietary} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.preferences.dietaryRestrictions.includes(dietary)}
                          onChange={() => handlePreferenceChange('dietaryRestrictions', dietary)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{dietary}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
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
                  {formData.password && (
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/customer/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Why Join VendorSync? ✨</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Personalized recommendations
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Secure payment options
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
