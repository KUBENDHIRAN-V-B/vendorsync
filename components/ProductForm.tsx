'use client';

import { useState } from 'react';
import { CreateProductData, Product } from '../lib/firebase-products';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'Street Food',
    stock_quantity: product?.stock_quantity || 0,
    image_url: product?.image_url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = [
    'Street Food',
    'South Indian',
    'North Indian',
    'Chaat',
    'Beverages',
    'Snacks',
    'Desserts'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg p-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full border rounded-lg p-2"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-lg p-2"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                className="w-full border rounded-lg p-2"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-300"
              >
                {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}