'use client';

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url?: string;
}

export async function getProducts(vendorId?: string, category?: string): Promise<Product[]> {
  try {
    let q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
    
    if (vendorId) {
      q = query(collection(db, 'products'), where('vendor_id', '==', vendorId), orderBy('created_at', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    let products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Product, 'id'>;
      if (data) {
        products.push({
          id: doc.id,
          ...data
        });
      }
    });

    if (category && category !== 'All Categories') {
      products = products.filter(p => p.category === category);
    }

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createProduct(productData: CreateProductData, vendorId: string): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      vendor_id: vendorId,
      ...productData,
      is_available: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const product: Product = {
      id: docRef.id,
      vendor_id: vendorId,
      ...productData,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { success: true, product };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(productId: string, updates: Partial<CreateProductData>): Promise<{ success: boolean; error?: string }> {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleProductAvailability(productId: string, isAvailable: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      is_available: isAvailable,
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling product availability:', error);
    return { success: false, error: error.message };
  }
}