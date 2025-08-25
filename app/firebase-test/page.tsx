'use client';

import { useState, useEffect } from 'react';
import { auth, db, realtimeDb } from '../../lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, set, get, push } from 'firebase/database';
import { seedDemoData, createTestData } from '../../lib/demo-data';

export default function FirebaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const testFirebaseConnection = async () => {
    try {
      addTestResult('🔥 Starting Firebase connection test...');

      // Test 1: Firebase Auth
      addTestResult('1. Testing Firebase Auth...');
      if (auth) {
        addTestResult('✅ Firebase Auth initialized successfully');
      } else {
        addTestResult('❌ Firebase Auth initialization failed');
      }

      // Test 2: Firestore Database
      addTestResult('2. Testing Firestore Database...');
      if (db) {
        addTestResult('✅ Firestore initialized successfully');
      } else {
        addTestResult('❌ Firestore initialization failed');
        return;
      }

      // Test 3: Write to Firestore
      addTestResult('3. Testing Firestore write operation...');
      try {
        const testDoc = await addDoc(collection(db, 'test'), {
          message: 'Firebase connection test',
          timestamp: serverTimestamp(),
          testId: Math.random().toString(36).substr(2, 9)
        });
        addTestResult(`✅ Successfully wrote test document: ${testDoc.id}`);
      } catch (error: any) {
        addTestResult(`❌ Firestore write failed: ${error.message}`);
      }

      // Test 4: Read from Firestore
      addTestResult('4. Testing Firestore read operation...');
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        addTestResult(`✅ Successfully read ${querySnapshot.size} documents from test collection`);
      } catch (error: any) {
        addTestResult(`❌ Firestore read failed: ${error.message}`);
      }

      // Test 5: Realtime Database
      addTestResult('5. Testing Realtime Database...');
      if (realtimeDb) {
        addTestResult('✅ Realtime Database initialized successfully');
        
        // Test write to Realtime Database
        try {
          const testRef = ref(realtimeDb, 'test/' + Date.now());
          await set(testRef, {
            message: 'Realtime DB test',
            timestamp: Date.now(),
            testId: Math.random().toString(36).substr(2, 9)
          });
          addTestResult('✅ Successfully wrote to Realtime Database');
        } catch (error: any) {
          addTestResult(`❌ Realtime Database write failed: ${error.message}`);
        }

        // Test read from Realtime Database
        try {
          const testRef = ref(realtimeDb, 'test');
          const snapshot = await get(testRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const count = Object.keys(data).length;
            addTestResult(`✅ Successfully read ${count} items from Realtime Database`);
          } else {
            addTestResult('✅ Realtime Database read successful (no data)');
          }
        } catch (error: any) {
          addTestResult(`❌ Realtime Database read failed: ${error.message}`);
        }
      } else {
        addTestResult('❌ Realtime Database initialization failed');
      }

      // Test 6: Environment Variables
      addTestResult('6. Checking environment variables...');
      const requiredEnvVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
        'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
      ];

      let allEnvVarsPresent = true;
      requiredEnvVars.forEach(envVar => {
        if (process.env[envVar]) {
          addTestResult(`✅ ${envVar}: Set`);
        } else {
          addTestResult(`❌ ${envVar}: Missing`);
          allEnvVarsPresent = false;
        }
      });

      if (allEnvVarsPresent) {
        setConnectionStatus('✅ All Firebase tests passed!');
        addTestResult('🎉 Firebase is properly configured and working!');
      } else {
        setConnectionStatus('⚠️ Some environment variables are missing');
        addTestResult('⚠️ Please check your environment variables');
      }

    } catch (error: any) {
      setConnectionStatus('❌ Firebase connection failed');
      addTestResult(`❌ Connection test failed: ${error.message}`);
    }
  };

  const createTestVendor = async () => {
    try {
      addTestResult('📝 Creating test vendor...');
      const testVendor = await addDoc(collection(db, 'vendors'), {
        user_id: 'test-user-id',
        business_name: 'Test Street Food Cart',
        business_type: 'street_cart',
        location: {
          address: '123 Test Street',
          city: 'Test City',
          pincode: '123456'
        },
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      addTestResult(`✅ Test vendor created with ID: ${testVendor.id}`);
    } catch (error: any) {
      addTestResult(`❌ Failed to create test vendor: ${error.message}`);
    }
  };

  const seedDemo = async () => {
    addTestResult('🌱 Starting demo data seeding...');
    const result = await seedDemoData();
    if (result.success) {
      addTestResult(`✅ ${result.message}`);
      if (result.details) {
        addTestResult(`📊 Details: ${JSON.stringify(result.details, null, 2)}`);
      }
    } else {
      addTestResult(`❌ ${result.message}`);
    }
  };

  const createTest = async () => {
    addTestResult('🧪 Creating test data...');
    const result = await createTestData();
    if (result.success) {
      addTestResult(`✅ ${result.message}`);
    } else {
      addTestResult(`❌ ${result.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🔥 Firebase Connection Test
            </h1>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold text-blue-800">{connectionStatus}</p>
            </div>
          </div>

          {/* Configuration Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
              <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
              <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20)}...</p>
            </div>
          </div>

          {/* Test Results */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={testFirebaseConnection}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 mr-4"
              >
                🔄 Re-run Connection Test
              </button>
              <button
                onClick={createTestVendor}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 mr-4"
              >
                ➕ Create Test Vendor
              </button>
              <button
                onClick={seedDemo}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 mr-4"
              >
                🌱 Seed Demo Data
              </button>
              <button
                onClick={createTest}
                className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700"
              >
                🧪 Create Test Data
              </button>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Instructions</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">If tests are failing:</h3>
                <ul className="text-yellow-800 space-y-1">
                  <li>• Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                  <li>• Enable Authentication with Email/Password</li>
                  <li>• Create a Firestore database</li>
                  <li>• Add your Firebase config to <code>.env.local</code></li>
                  <li>• Restart your development server</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Set up Firestore Security Rules</li>
                  <li>• Configure authentication providers</li>
                  <li>• Test user registration and login</li>
                  <li>• Create initial data collections</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}