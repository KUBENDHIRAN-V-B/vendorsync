'use client';

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Order {
  id: string;
  customer_id: string;
  vendor_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  delivery_address: string;
  delivery_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateOrderData {
  vendor_id: string;
  items: OrderItem[];
  delivery_address: string;
  delivery_instructions?: string;
}

export async function getOrders(userId: string, userRole: string): Promise<Order[]> {
  try {
    let q;
    
    if (userRole === 'vendor') {
      q = query(
        collection(db, 'orders'),
        where('vendor_id', '==', userId),
        orderBy('created_at', 'desc')
      );
    } else if (userRole === 'customer') {
      q = query(
        collection(db, 'orders'),
        where('customer_id', '==', userId),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'orders'),
        orderBy('created_at', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Order, 'id'>;
      if (data) {
        orders.push({
          id: doc.id,
          ...data
        });
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function createOrder(orderData: CreateOrderData, customerId: string): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.total, 0);

    const docRef = await addDoc(collection(db, 'orders'), {
      customer_id: customerId,
      vendor_id: orderData.vendor_id,
      status: 'pending',
      total_amount: totalAmount,
      items: orderData.items,
      delivery_address: orderData.delivery_address,
      delivery_instructions: orderData.delivery_instructions,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const order: Order = {
      id: docRef.id,
      customer_id: customerId,
      vendor_id: orderData.vendor_id,
      status: 'pending',
      total_amount: totalAmount,
      items: orderData.items,
      delivery_address: orderData.delivery_address,
      delivery_instructions: orderData.delivery_instructions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { success: true, order };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; error?: string }> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      const data = orderDoc.data();
      if (data) {
        return {
          id: orderDoc.id,
          ...data
        } as Order;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}