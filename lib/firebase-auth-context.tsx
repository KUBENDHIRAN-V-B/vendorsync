'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'vendor' | 'wholesaler' | 'admin';
  isVerified: boolean;
  avatar?: string;
  address?: string;
  city?: string;
  pincode?: string;
  preferences?: {
    cuisine?: string[];
    spiceLevel?: string;
    dietaryRestrictions?: string[];
  };
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'customer' | 'vendor' | 'wholesaler';
  address?: string;
  city?: string;
  pincode?: string;
  preferences?: {
    cuisine?: string[];
    spiceLevel?: string;
    dietaryRestrictions?: string[];
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpHandler = async (data: SignUpData): Promise<{ error: any }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const newUser: UserProfile = {
        id: userCredential.user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isVerified: false,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        preferences: data.preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

      // Create role-specific documents
      if (data.role === 'vendor') {
        await setDoc(doc(db, 'vendors', userCredential.user.uid), {
          user_id: userCredential.user.uid,
          business_name: data.name,
          business_type: 'street_cart',
          location: data.address ? {
            address: data.address,
            city: data.city,
            pincode: data.pincode,
          } : null,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      } else if (data.role === 'wholesaler') {
        await setDoc(doc(db, 'wholesalers', userCredential.user.uid), {
          user_id: userCredential.user.uid,
          company_name: data.name,
          business_type: 'wholesaler',
          location: data.address ? {
            address: data.address,
            city: data.city,
            pincode: data.pincode,
          } : null,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      } else if (data.role === 'customer') {
        await setDoc(doc(db, 'customers', userCredential.user.uid), {
          user_id: userCredential.user.uid,
          delivery_addresses: data.address ? [{
            address: data.address,
            city: data.city,
            pincode: data.pincode,
            isDefault: true
          }] : [],
          preferences: data.preferences || {},
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      setUser(newUser);

      // Redirect based on role
      if (data.role === 'customer') {
        router.push('/customer');
      } else if (data.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (data.role === 'wholesaler') {
        router.push('/wholesaler/dashboard');
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInHandler = async (email: string, password: string): Promise<{ error: any }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(userCredential.user.uid);

      // Redirect based on role
      if (user) {
        if (user.role === 'customer') {
          router.push('/customer');
        } else if (user.role === 'vendor') {
          router.push('/vendor/dashboard');
        } else if (user.role === 'wholesaler') {
          router.push('/wholesaler/dashboard');
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOutHandler = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfileHandler = async (data: Partial<UserProfile>): Promise<{ error: any }> => {
    if (!firebaseUser) {
      return { error: new Error('No user logged in') };
    }

    try {
      const updatedData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'users', firebaseUser.uid), updatedData);
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...updatedData } : null);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (firebaseUser) {
      await fetchUserProfile(firebaseUser.uid);
    }
  };

  const value = {
    user,
    firebaseUser,
    isLoading,
    signUp: signUpHandler,
    signIn: signInHandler,
    signOut: signOutHandler,
    updateProfile: updateProfileHandler,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}

// Alias for backward compatibility
export const useSupabaseAuth = useFirebaseAuth;
export const SupabaseAuthProvider = FirebaseAuthProvider;
export const withSupabaseAuth = withFirebaseAuth;

// Higher-order component for protected routes
export function withFirebaseAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useFirebaseAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/login');
          return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) return null;
    if (allowedRoles && !allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}