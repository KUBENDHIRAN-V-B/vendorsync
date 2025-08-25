'use client';

import { useState } from 'react';
import { CreateWholesaleOrderData, WholesaleOrderItem } from '../lib/firebase-wholesale-orders';

interface WholesaleProduct {
  id: string;
  name: string;
  category: string;
  minQuantity: string;
  price: number;
  unit: string;
  supplier: string;
}

interface WholesaleOrderFormProps {
  product: WholesaleProduct;
  onSubmit: (orderData: CreateWholesaleOrderData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function WholesaleOrderForm({ product, onSubmit, onCancel, isLoading }: WholesaleOrderFormProps) {
  const [quantity, setQuantity] = useState(50);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    if (quantity < 50) {
      alert('Minimum order quantity is 50 units for wholesale orders');
      return;
    }

    const orderItem: WholesaleOrderItem = {
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit: product.unit,
      price: product.price,
      total: quantity * product.price
    };

    const orderData: CreateWholesaleOrderData = {
      wholesaler_id: 'wholesaler-demo-001', // Demo wholesaler ID
      items: [orderItem],
      delivery_address: deliveryAddress,
      delivery_instructions: deliveryInstructions
    };

    onSubmit(orderData);
  };

  const totalAmount = quantity * product.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order from Wholesaler</h2>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">Supplier: {product.supplier}</p>
          <p className="text-sm text-gray-600">Price: ₹{product.price} {product.unit}</p>
          <p className="text-sm text-gray-600">Min Order: {product.minQuantity}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Min: 50 units)
            </label>
            <input
              type="number"
              min="50"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 50)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Wholesale orders require minimum 50 units</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Enter your business address for delivery"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={2}
              placeholder="Any special delivery instructions"
            />
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-green-600">₹{totalAmount}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}