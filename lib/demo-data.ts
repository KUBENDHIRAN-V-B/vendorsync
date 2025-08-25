'use client';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';

export interface DemoUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'customer' | 'vendor' | 'wholesaler';
  address?: string;
  city?: string;
  pincode?: string;
}

export const demoUsers: DemoUser[] = [
  {
    email: 'demo.customer@vendorsync.com',
    password: 'demo123',
    name: 'Rahul Sharma',
    phone: '9876543210',
    role: 'customer',
    address: '123 MG Road',
    city: 'Mumbai',
    pincode: '400001'
  },
  {
    email: 'demo.vendor@vendorsync.com',
    password: 'demo123',
    name: 'Mumbai Street Food',
    phone: '9876543211',
    role: 'vendor',
    address: '456 Street Food Lane',
    city: 'Mumbai',
    pincode: '400002'
  },
  {
    email: 'demo.wholesaler@vendorsync.com',
    password: 'demo123',
    name: 'Fresh Supplies Co.',
    phone: '9876543212',
    role: 'wholesaler',
    address: '789 Wholesale Market',
    city: 'Mumbai',
    pincode: '400003'
  }
];

export const demoProducts = [
  {
    name: 'Vada Pav',
    description: 'Mumbai\'s iconic street food - spiced potato fritter in a bun with chutneys',
    price: 25,
    category: 'Street Food',
    image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
    stock_quantity: 50,
    is_available: true
  },
  {
    name: 'Pav Bhaji',
    description: 'Spicy vegetable curry served with buttered bread rolls',
    price: 60,
    category: 'Street Food',
    image_url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
    stock_quantity: 30,
    is_available: true
  },
  {
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk and aromatic spices',
    price: 15,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
    stock_quantity: 100,
    is_available: true
  },
  {
    name: 'Samosa',
    description: 'Crispy triangular pastry filled with spiced potatoes and peas',
    price: 20,
    category: 'Snacks',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    stock_quantity: 40,
    is_available: true
  },
  {
    name: 'Bhel Puri',
    description: 'Crunchy mix of puffed rice, sev, vegetables and tangy chutneys',
    price: 35,
    category: 'Chaat',
    image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    stock_quantity: 25,
    is_available: true
  },
  {
    name: 'Dosa',
    description: 'Crispy South Indian crepe served with coconut chutney and sambar',
    price: 45,
    category: 'South Indian',
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
    stock_quantity: 20,
    is_available: true
  }
];

export const demoOrders = [
  {
    items: [
      {
        product_id: 'demo-product-1',
        product_name: 'Vada Pav',
        quantity: 2,
        price: 25,
        total: 50
      },
      {
        product_id: 'demo-product-3',
        product_name: 'Masala Chai',
        quantity: 1,
        price: 15,
        total: 15
      }
    ],
    total_amount: 65,
    status: 'delivered' as const,
    delivery_address: '123 MG Road, Mumbai, 400001',
    delivery_instructions: 'Call when you arrive'
  },
  {
    items: [
      {
        product_id: 'demo-product-2',
        product_name: 'Pav Bhaji',
        quantity: 1,
        price: 60,
        total: 60
      }
    ],
    total_amount: 60,
    status: 'preparing' as const,
    delivery_address: '123 MG Road, Mumbai, 400001',
    delivery_instructions: 'Ring the doorbell'
  }
];

export async function seedDemoData(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const results = {
      users: [] as any[],
      products: [] as any[],
      orders: [] as any[],
      vendors: [] as any[],
      customers: [] as any[]
    };

    // Create demo users
    for (const userData of demoUsers) {
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        const userId = userCredential.user.uid;

        // Create user profile
        const userProfile = {
          id: userId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          isVerified: true,
          address: userData.address,
          city: userData.city,
          pincode: userData.pincode,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        };

        await addDoc(collection(db, 'users'), userProfile);
        results.users.push({ email: userData.email, role: userData.role, id: userId });

        // Create role-specific profiles
        if (userData.role === 'vendor') {
          const vendorProfile = {
            user_id: userId,
            business_name: userData.name,
            business_type: 'street_cart',
            location: {
              address: userData.address,
              city: userData.city,
              pincode: userData.pincode
            },
            ratings: {
              average: 4.5,
              count: 127
            },
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          };
          const vendorDoc = await addDoc(collection(db, 'vendors'), vendorProfile);
          results.vendors.push({ id: vendorDoc.id, business_name: userData.name });

          // Create products for this vendor
          for (const productData of demoProducts) {
            const product = {
              ...productData,
              vendor_id: userId,
              created_at: serverTimestamp(),
              updated_at: serverTimestamp()
            };
            const productDoc = await addDoc(collection(db, 'products'), product);
            results.products.push({ id: productDoc.id, name: productData.name });
          }
        } else if (userData.role === 'wholesaler') {
          const wholesalerProfile = {
            user_id: userId,
            company_name: userData.name,
            business_type: 'wholesaler',
            location: {
              address: userData.address,
              city: userData.city,
              pincode: userData.pincode
            },
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          };
          await addDoc(collection(db, 'wholesalers'), wholesalerProfile);
        } else if (userData.role === 'customer') {
          const customerProfile = {
            user_id: userId,
            delivery_addresses: [{
              address: userData.address,
              city: userData.city,
              pincode: userData.pincode,
              isDefault: true
            }],
            preferences: {
              cuisine: ['Indian', 'Street Food'],
              spiceLevel: 'medium',
              dietaryRestrictions: []
            },
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          };
          const customerDoc = await addDoc(collection(db, 'customers'), customerProfile);
          results.customers.push({ id: customerDoc.id, name: userData.name });

          // Create demo orders for this customer
          const vendorUser = results.users.find(u => u.role === 'vendor');
          if (vendorUser) {
            for (const orderData of demoOrders) {
              const order = {
                customer_id: userId,
                vendor_id: vendorUser.id,
                ...orderData,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
              };
              const orderDoc = await addDoc(collection(db, 'orders'), order);
              results.orders.push({ id: orderDoc.id, total: orderData.total_amount });
            }
          }
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        } else {
          throw error;
        }
      }
    }

    return {
      success: true,
      message: `Demo data seeded successfully! Created ${results.users.length} users, ${results.products.length} products, ${results.orders.length} orders.`,
      details: results
    };

  } catch (error: any) {
    console.error('Error seeding demo data:', error);
    return {
      success: false,
      message: `Failed to seed demo data: ${error.message}`,
      details: error
    };
  }
}

export async function createTestData(): Promise<{ success: boolean; message: string }> {
  try {
    // Create a simple test document
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Test data creation',
      timestamp: serverTimestamp(),
      testId: Math.random().toString(36).substr(2, 9)
    });

    return {
      success: true,
      message: `Test document created with ID: ${testDoc.id}`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to create test data: ${error.message}`
    };
  }
}