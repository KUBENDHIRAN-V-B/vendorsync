'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../lib/firebase-auth-context';
import Navigation from '../../components/Navigation';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, signOut } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">
            Manage your {user?.role} dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <strong className="text-gray-700">Email:</strong>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <strong className="text-gray-700">Role:</strong>
              <p className="text-gray-900 capitalize">{user?.role}</p>
            </div>
            <div>
              <strong className="text-gray-700">Phone:</strong>
              <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <strong className="text-gray-700">Status:</strong>
              <p className={`${user?.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a 
                href="/products" 
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                📦 Manage Products
              </a>
              <a 
                href="/orders" 
                className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                📋 View Orders
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Status
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                Your account is active and ready to use.
              </p>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✅</span>
                <span>Account Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}