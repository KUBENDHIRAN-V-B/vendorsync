// Simple script to test environment variables
console.log('=== Environment Variables Test ===');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL ? '✅ Set' : '❌ Missing');

console.log('\n=== Actual Values ===');
console.log('API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...');
console.log('AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);