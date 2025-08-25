'use client';

import { useState } from 'react';
import { useCart } from '../lib/cart-context';
import { useFirebaseAuth } from '../lib/firebase-auth-context';
import { createOrder } from '../lib/firebase-orders';

export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useFirebaseAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    setIsCheckingOut(true);
    try {
      // For demo - create order without payment
      const orderItems = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      if (user) {
        // Try Firebase order creation - use demo vendor ID for demo
        const demoVendorId = 'vendor-demo-001'; // Match the demo vendor ID
        const result = await createOrder({
          vendor_id: demoVendorId,
          items: orderItems,
          delivery_address: deliveryAddress,
          delivery_instructions: deliveryInstructions
        }, user.id);

        if (result.success) {
          // Store order locally for demo
          const demoOrder = {
            id: 'ORD' + Date.now(),
            vendor_id: demoVendorId,
            customer_id: user.id,
            items: orderItems,
            total_amount: total,
            status: 'pending',
            delivery_address: deliveryAddress,
            delivery_instructions: deliveryInstructions,
            created_at: new Date().toISOString()
          };
          
          const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
          existingOrders.unshift(demoOrder);
          localStorage.setItem('demo_orders', JSON.stringify(existingOrders));
          
          clearCart();
          alert('🎉 Order placed successfully! No payment required for demo.');
          onClose();
        } else {
          // Fallback for demo
          const demoOrder = {
            id: 'ORD' + Date.now(),
            vendor_id: demoVendorId,
            customer_id: user?.id || 'demo-customer',
            items: orderItems,
            total_amount: total,
            status: 'pending',
            delivery_address: deliveryAddress,
            delivery_instructions: deliveryInstructions,
            created_at: new Date().toISOString()
          };
          
          const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
          existingOrders.unshift(demoOrder);
          localStorage.setItem('demo_orders', JSON.stringify(existingOrders));
          
          clearCart();
          alert('🎉 Demo order placed successfully! (Firebase not connected)');
          onClose();
        }
      } else {
        // Demo mode without user
        const demoOrder = {
          id: 'ORD' + Date.now(),
          vendor_id: 'vendor-demo-001',
          customer_id: 'demo-customer',
          items: orderItems,
          total_amount: total,
          status: 'pending',
          delivery_address: deliveryAddress,
          delivery_instructions: deliveryInstructions,
          created_at: new Date().toISOString()
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
        existingOrders.unshift(demoOrder);
        localStorage.setItem('demo_orders', JSON.stringify(existingOrders));
        
        clearCart();
        alert('🎉 Demo order placed successfully! Total: ₹' + total);
        onClose();
      }
    } catch (error) {
      // Fallback for demo
      const demoOrder = {
        id: 'ORD' + Date.now(),
        vendor_id: 'vendor-demo-001',
        customer_id: user?.id || 'demo-customer',
        items: orderItems,
        total_amount: total,
        status: 'pending',
        delivery_address: deliveryAddress,
        delivery_instructions: deliveryInstructions,
        created_at: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      existingOrders.unshift(demoOrder);
      localStorage.setItem('demo_orders', JSON.stringify(existingOrders));
      
      clearCart();
      alert('🎉 Demo order placed successfully! Total: ₹' + total);
      onClose();
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.vendor_name}</p>
                      <p className="text-sm font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total: ₹{total}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full border rounded-lg p-2"
                      rows={3}
                      placeholder="Enter your delivery address (required for demo)"
                    />
                    {!deliveryAddress && (
                      <button
                        type="button"
                        onClick={() => setDeliveryAddress('Demo Address, Mumbai, 400001')}
                        className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Use Demo Address
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Delivery Instructions</label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="w-full border rounded-lg p-2"
                      placeholder="Optional instructions"
                    />
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
                  >
                    {isCheckingOut ? 'Placing Order...' : '🎉 Place Order (No Payment Required)'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}