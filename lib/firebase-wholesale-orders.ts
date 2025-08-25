'use client';

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface WholesaleOrder {
  id: string;
  vendor_id: string;
  wholesaler_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: WholesaleOrderItem[];
  delivery_address: string;
  delivery_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface WholesaleOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface CreateWholesaleOrderData {
  wholesaler_id: string;
  items: WholesaleOrderItem[];
  delivery_address: string;
  delivery_instructions?: string;
}

export async function getWholesaleOrders(userId: string, userRole: string): Promise<WholesaleOrder[]> {
  try {
    let q;
    
    if (userRole === 'wholesaler') {
      q = query(
        collection(db, 'wholesale_orders'),
        where('wholesaler_id', '==', userId),
        orderBy('created_at', 'desc')
      );
    } else if (userRole === 'vendor') {
      q = query(
        collection(db, 'wholesale_orders'),
        where('vendor_id', '==', userId),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'wholesale_orders'),
        orderBy('created_at', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const orders: WholesaleOrder[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<WholesaleOrder, 'id'>;
      if (data) {
        orders.push({
          id: doc.id,
          ...data
        });
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching wholesale orders:', error);
    return [];
  }
}

export async function createWholesaleOrder(orderData: CreateWholesaleOrderData, vendorId: string): Promise<{ success: boolean; order?: WholesaleOrder; error?: string }> {
  try {
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.total, 0);

    const docRef = await addDoc(collection(db, 'wholesale_orders'), {
      vendor_id: vendorId,
      wholesaler_id: orderData.wholesaler_id,
      status: 'pending',
      total_amount: totalAmount,
      items: orderData.items,
      delivery_address: orderData.delivery_address,
      delivery_instructions: orderData.delivery_instructions,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const order: WholesaleOrder = {
      id: docRef.id,
      vendor_id: vendorId,
      wholesaler_id: orderData.wholesaler_id,
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
    console.error('Error creating wholesale order:', error);
    return { success: false, error: error.message };
  }
}

export async function updateWholesaleOrderStatus(orderId: string, status: WholesaleOrder['status']): Promise<{ success: boolean; error?: string }> {
  try {
    const orderRef = doc(db, 'wholesale_orders', orderId);
    await updateDoc(orderRef, {
      status,
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating wholesale order status:', error);
    return { success: false, error: error.message };
  }
}