# Deploy to Existing Website

## 🚀 Build Production Files

```bash
cd client
npm run build
```

## 📁 Upload Files

Upload these folders to your web server:

### **Static Files (Upload to root)**
```
.next/static/ → /vendorsync/_next/static/
public/ → /vendorsync/
```

### **Server Files (If Node.js hosting)**
```
.next/ → /vendorsync/.next/
package.json → /vendorsync/package.json
```

## 🔧 Server Configuration

### **Apache (.htaccess)**
```apache
RewriteEngine On
RewriteBase /vendorsync/

# Handle Next.js routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /vendorsync/index.html [L]

# Handle API routes
RewriteRule ^api/(.*)$ /vendorsync/api/$1 [L]
```

### **Nginx**
```nginx
location /vendorsync/ {
    try_files $uri $uri/ /vendorsync/index.html;
}
```

## 🌐 Static Export (Recommended)

For static hosting, export the app:

```bash
npm run build
npm run export
```

Then upload `out/` folder contents to `/vendorsync/` on your server.

## 📋 Environment Variables

Set these on your server:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDgnT6Ijyj3dOsSlDHLB_4c0HRUDzWxjUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vendorsync-870ae.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vendorsync-870ae
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vendorsync-870ae.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=465255780285
NEXT_PUBLIC_FIREBASE_APP_ID=1:465255780285:web:4e6cfe1af7de21fb068cd4
```

## 🔗 Access URLs

After deployment:
- Homepage: `yoursite.com/vendorsync/`
- Demo: `yoursite.com/vendorsync/demo`
- Vendor Login: `yoursite.com/vendorsync/vendor-login`