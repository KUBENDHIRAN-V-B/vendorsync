# VendorSync - Live Deployment Guide

## 🚀 Quick Deploy to Vercel

### 1. Environment Variables Setup
Set these in Vercel dashboard:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDgnT6Ijyj3dOsSlDHLB_4c0HRUDzWxjUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vendorsync-870ae.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://vendorsync-870ae-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vendorsync-870ae
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vendorsync-870ae.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=465255780285
NEXT_PUBLIC_FIREBASE_APP_ID=1:465255780285:web:4e6cfe1af7de21fb068cd4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YK6WJMNBRB
```

### 2. Deploy Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### 3. Firebase Security Rules
Update Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Live Demo URLs
- **Homepage**: https://vendorsync.vercel.app
- **Demo**: https://vendorsync.vercel.app/demo
- **Vendor Login**: https://vendorsync.vercel.app/vendor-login
- **Wholesaler Login**: https://vendorsync.vercel.app/wholesaler-login
- **Customer Login**: https://vendorsync.vercel.app/customer-login

## ✅ Production Ready Features
- Firebase integration with real-time data
- Responsive design for all devices
- Role-based authentication
- Complete order management system
- Wholesale ordering with minimum limits
- Local storage fallback for demo reliability
- Error handling and loading states
- SEO optimized
- Performance optimized build