# VendorSync

VendorSync is a comprehensive web application built with Next.js that facilitates seamless interactions between vendors, wholesalers, and customers. The platform streamlines product management, order processing, and user authentication with real-time capabilities.

## 🌟 Key Features

- **Multi-User System**
  - Role-based authentication (Vendors, Wholesalers, Customers)
  - Secure Firebase authentication
  - Personalized dashboards for each user type

- **Product Management**
  - Real-time inventory updates
  - Product catalog with images
  - Wholesale pricing system
  - Category management

- **Order Processing**
  - Shopping cart with local storage backup
  - Wholesale order management
  - Minimum order quantity handling
  - Real-time order tracking

- **Technology Stack**
  - Next.js for frontend
  - Firebase for backend services
  - Tailwind CSS for styling
  - TypeScript for type safety

## 🌐 Live Demo

Visit our live demo at (https://vendorsync-umber.vercel.app/)

## 💻 Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KUBENDHIRAN-V-B/vendorsync.git
   cd vendorsync
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ✅ Production Features & Capabilities

- **Real-time Data Integration**
  - Firebase Realtime Database integration
  - Real-time updates across all clients
  - Automatic data synchronization

- **Responsive Design**
  - Mobile-first approach
  - Tailwind CSS responsive classes
  - Cross-browser compatibility

- **Security & Authentication**
  - Role-based access control
  - Secure Firebase authentication
  - Protected API routes

- **Order Management**
  - Complete order lifecycle tracking
  - Wholesale order minimum limits
  - Order history and analytics

- **Reliability & Performance**
  - Local storage fallback for demo
  - Error boundary implementation
  - Loading state management
  - SEO optimization
  - Performance-optimized build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Contact

Kubendhiran V B - [GitHub Profile](https://github.com/KUBENDHIRAN-V-B)

Project Link: [https://github.com/KUBENDHIRAN-V-B/vendorsync](https://github.com/KUBENDHIRAN-V-B/vendorsync)
