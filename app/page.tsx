'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const features = [
    {
      icon: '🏪',
      title: 'Vendor Management',
      description: 'Complete business management for street food vendors with inventory, orders, and analytics.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🏢',
      title: 'Wholesaler Network',
      description: 'Connect with suppliers, manage inventory, and streamline your supply chain operations.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: '👥',
      title: 'Customer Experience',
      description: 'Discover nearby vendors, order delicious food, and track deliveries in real-time.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: '����',
      title: 'Real-time Analytics',
      description: 'Powered by Firebase with live data synchronization and comprehensive business insights.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Street Food Vendor',
      image: '👨‍🍳',
      quote: 'VendorSync transformed my small cart business. Now I can manage orders, track inventory, and connect with customers easily!'
    },
    {
      name: 'Priya Sharma',
      role: 'Food Enthusiast',
      image: '👩',
      quote: 'I love discovering new street food vendors nearby. The app makes ordering so convenient and the food is always fresh!'
    },
    {
      name: 'Mumbai Spices Co.',
      role: 'Wholesaler',
      image: '🏢',
      quote: 'Our wholesale business has grown 300% since joining VendorSync. The vendor network is incredible!'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🚀</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                VendorSync
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/vendor-login" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all text-sm">
                🏪 Vendor
              </Link>
              <Link href="/wholesaler-login" className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all text-sm">
                🏢 Wholesaler
              </Link>
              <Link href="/customer-login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm">
                👥 Customer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                VendorSync
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionizing street food business with Firebase-powered real-time management, 
              connecting vendors, wholesalers, and customers in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/demo" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-xl border-2 border-white/20 animate-pulse">
                🚀 LIVE DEMO - Try Now!
              </Link>
              <Link href="/vendor-login" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg">
                🏪 Start as Vendor
              </Link>
              <Link href="/wholesaler-login" className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all shadow-lg">
                🏢 Join as Wholesaler
              </Link>
              <Link href="/customer-login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg">
                👥 Join as Customer
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce">🍛</div>
        <div className="absolute top-40 right-20 text-4xl animate-pulse">🚚</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-1000">📱</div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage and grow your food business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How VendorSync Works</h2>
            <p className="text-xl text-gray-600">Simple steps to transform your food business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6">
                1️⃣
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600">Create your account as a vendor, wholesaler, or customer. Firebase authentication ensures secure access.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6">
                2️⃣
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600">Build your network. Vendors connect with wholesalers, customers discover nearby food options.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6">
                3️⃣
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Grow</h3>
              <p className="text-gray-600">Manage orders, track analytics, and scale your business with real-time insights and automation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Real stories from our growing community</p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-orange-100 to-green-100 rounded-3xl p-8 md:p-12">
              <div className="text-center">
                <div className="text-6xl mb-6">{testimonials[currentSlide].image}</div>
                <blockquote className="text-xl md:text-2xl text-gray-800 mb-6 italic">
                  "{testimonials[currentSlide].quote}"
                </blockquote>
                <div className="font-bold text-lg text-gray-900">{testimonials[currentSlide].name}</div>
                <div className="text-gray-600">{testimonials[currentSlide].role}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powered by Modern Technology</h2>
            <p className="text-xl text-gray-300">Built with the latest and most reliable technologies</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-bold">Firebase</h3>
              <p className="text-gray-400 text-sm">Real-time Database & Auth</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="font-bold">Next.js</h3>
              <p className="text-gray-400 text-sm">React Framework</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-bold">Tailwind CSS</h3>
              <p className="text-gray-400 text-sm">Modern Styling</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold">TypeScript</h3>
              <p className="text-gray-400 text-sm">Type Safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Food Business?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of vendors, wholesalers, and customers already using VendorSync
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" className="bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg">
              🚀 Try Live Demo
            </Link>
            <Link href="/vendor-login" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all">
              🏪 Start as Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold">VendorSync</span>
              </div>
              <p className="text-gray-400">Revolutionizing street food business with modern technology.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/login" className="hover:text-white transition-colors">Business Login</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Manage Products</Link></li>
                <li><Link href="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/customer/login" className="hover:text-white transition-colors">Customer Login</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Find Vendors</Link></li>
                <li><Link href="/customer" className="hover:text-white transition-colors">My Orders</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">For Wholesalers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/wholesaler-login" className="hover:text-white transition-colors">Wholesaler Login</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Live Demo</Link></li>
                <li><a href="https://github.com" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VendorSync. Built with Firebase, Next.js, and ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}