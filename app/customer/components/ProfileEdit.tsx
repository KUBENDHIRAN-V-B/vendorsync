'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../../../lib/firebase-auth-context';

interface ProfileEditProps {
  user: any;
  onClose: () => void;
  onUpdate: (updatedData: any) => void;
}

export default function ProfileEdit({ user, onClose, onUpdate }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    preferences: {
      cuisine: user?.preferences?.cuisine || [],
      spiceLevel: user?.preferences?.spiceLevel || 'medium',
      dietaryRestrictions: user?.preferences?.dietaryRestrictions || []
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
    general?: string;
  }>({});
  const { updateProfile } = useSupabaseAuth();

  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Korean', 'Mediterranean', 'American', 'Fusion'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'
  ];

  useEffect(() => {
    // Load existing user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || '',
        preferences: user.preferences || {
          cuisine: [],
          spiceLevel: 'medium',
          dietaryRestrictions: []
        }
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
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
        ? formData.preferences.cuisine.filter((c: string) => c !== value)
        : [...formData.preferences.cuisine, value];
      handleInputChange('preferences.cuisine', updatedCuisine);
    } else if (type === 'dietaryRestrictions') {
      const updatedDietary = formData.preferences.dietaryRestrictions.includes(value)
        ? formData.preferences.dietaryRestrictions.filter((d: string) => d !== value)
        : [...formData.preferences.dietaryRestrictions, value];
      handleInputChange('preferences.dietaryRestrictions', updatedDietary);
    } else {
      handleInputChange(`preferences.${type}`, value);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const { error } = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        preferences: formData.preferences
      });

      if (error) {
        setErrors({ general: error.message || 'Failed to update profile' });
      } else {
        onUpdate(formData);
        onClose();
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="edit-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    id="edit-address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      id="edit-city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.city ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="edit-pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      id="edit-pincode"
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
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

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
