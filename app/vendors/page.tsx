'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load mock vendors
    loadMockVendors();
  }, [router]);

  const loadMockVendors = () => {
    const mockVendors = [
      {
        id: 'V001',
        name: 'Delhi Street Delights',
        owner: 'Rajesh Kumar',
        type: 'Street Cart',
        cuisine: ['Street Food', 'North Indian'],
        location: {
          city: 'New Delhi',
          area: 'Connaught Place',
          coordinates: [77.2090, 28.6139]
        },
        contact: {
          phone: '+91 98765 43210',
          email: 'rajesh@delhistreet.com'
        },
        rating: 4.2,
        reviews: 156,
        orders: {
          total: 45,
          completed: 42,
          value: 125000
        },
        status: 'active',
        joinDate: '2023-06-15',
        specialties: ['Vada Pav', 'Pav Bhaji', 'Masala Chai'],
        operatingHours: '8:00 AM - 10:00 PM'
      },
      {
        id: 'V002',
        name: 'Mumbai Chaat Corner',
        owner: 'Priya Sharma',
        type: 'Food Stall',
        cuisine: ['Street Food', 'Maharashtrian'],
        location: {
          city: 'Mumbai',
          area: 'Juhu Beach',
          coordinates: [72.8777, 19.0760]
        },
        contact: {
          phone: '+91 98765 43211',
          email: 'priya@mumbaichaat.com'
        },
        rating: 4.5,
        reviews: 203,
        orders: {
          total: 62,
          completed: 58,
          value: 185000
        },
        status: 'active',
        joinDate: '2023-04-20',
        specialties: ['Bhel Puri', 'Sev Puri', 'Dahi Puri'],
        operatingHours: '4:00 PM - 11:00 PM'
      },
      {
        id: 'V003',
        name: 'Kolkata Street Food',
        owner: 'Amit Ghosh',
        type: 'Food Truck',
        cuisine: ['Bengali', 'Street Food'],
        location: {
          city: 'Kolkata',
          area: 'Park Street',
          coordinates: [88.3639, 22.5726]
        },
        contact: {
          phone: '+91 98765 43212',
          email: 'amit@kolkatastreet.com'
        },
        rating: 4.0,
        reviews: 89,
        orders: {
          total: 28,
          completed: 26,
          value: 95000
        },
        status: 'active',
        joinDate: '2023-08-10',
        specialties: ['Puchka', 'Kathi Roll', 'Fish Fry'],
        operatingHours: '6:00 PM - 12:00 AM'
      },
      {
        id: 'V004',
        name: 'Chennai Tiffin Center',
        owner: 'Lakshmi Raman',
        type: 'Restaurant',
        cuisine: ['South Indian', 'Tamil'],
        location: {
          city: 'Chennai',
          area: 'T. Nagar',
          coordinates: [80.2707, 13.0827]
        },
        contact: {
          phone: '+91 98765 43213',
          email: 'lakshmi@chennaitiffin.com'
        },
        rating: 4.3,
        reviews: 134,
        orders: {
          total: 38,
          completed: 35,
          value: 142000
        },
        status: 'active',
        joinDate: '2023-05-30',
        specialties: ['Idli', 'Dosa', 'Sambar'],
        operatingHours: '6:00 AM - 10:00 PM'
      },
      {
        id: 'V005',
        name: 'Hyderabad Biryani Hub',
        owner: 'Mohammed Ali',
        type: 'Food Stall',
        cuisine: ['Hyderabadi', 'Mughlai'],
        location: {
          city: 'Hyderabad',
          area: 'Charminar',
          coordinates: [78.4867, 17.3850]
        },
        contact: {
          phone: '+91 98765 43214',
          email: 'ali@hyderabadbiryani.com'
        },
        rating: 4.7,
        reviews: 267,
        orders: {
          total: 73,
          completed: 70,
          value: 285000
        },
        status: 'active',
        joinDate: '2023-03-12',
        specialties: ['Chicken Biryani', 'Mutton Biryani', 'Haleem'],
        operatingHours: '11:00 AM - 11:00 PM'
      },
      {
        id: 'V006',
        name: 'Pune Misal House',
        owner: 'Suresh Patil',
        type: 'Street Cart',
        cuisine: ['Maharashtrian', 'Street Food'],
        location: {
          city: 'Pune',
          area: 'FC Road',
          coordinates: [73.8567, 18.5204]
        },
        contact: {
          phone: '+91 98765 43215',
          email: 'suresh@punemisal.com'
        },
        rating: 3.9,
        reviews: 76,
        orders: {
          total: 22,
          completed: 20,
          value: 68000
        },
        status: 'inactive',
        joinDate: '2023-09-05',
        specialties: ['Misal Pav', 'Vada Pav', 'Poha'],
        operatingHours: '7:00 AM - 2:00 PM'
      }
    ];
    
    setVendors(mockVendors);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.cuisine.some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = filterCity === 'all' || vendor.location.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const cities = Array.from(new Set(vendors.map(v => v.location.city)));

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#16a34a' : '#dc2626';
  };

  const getStatusBg = (status: string) => {
    return status === 'active' ? '#dcfce7' : '#fee2e2';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ←
            </button>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              🏪 Vendor Network
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {filteredVendors.length} vendors found
            </span>
          </div>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Vendors</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{vendors.length}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Vendors</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
              {vendors.filter(v => v.status === 'active').length}
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Orders</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {vendors.reduce((sum, v) => sum + v.orders.total, 0)}
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              ₹{(vendors.reduce((sum, v) => sum + v.orders.value, 0) / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Search Vendors
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, owner, or cuisine..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Filter by City
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} style={{ 
              background: 'white', 
              borderRadius: '8px', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: vendor.status === 'active' ? '1px solid #e5e7eb' : '1px solid #fecaca'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {vendor.name}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Owner: {vendor.owner}
                  </p>
                </div>
                <span style={{ 
                  background: getStatusBg(vendor.status),
                  color: getStatusColor(vendor.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {vendor.status}
                </span>
              </div>

              {/* Details */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Type:</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{vendor.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Location:</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{vendor.location.area}, {vendor.location.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Rating:</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    {vendor.rating}⭐ ({vendor.reviews} reviews)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Orders:</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    {vendor.orders.completed}/{vendor.orders.total}
                  </span>
                </div>
              </div>

              {/* Cuisine Tags */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {vendor.cuisine.map((cuisine: string, index: number) => (
                    <span key={index} style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Specialties:
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.4' }}>
                  {vendor.specialties.join(', ')}
                </p>
              </div>

              {/* Contact & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>Phone:</span>
                  <a href={`tel:${vendor.contact.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                    {vendor.contact.phone}
                  </a>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    📞 Contact
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    📊 View Details
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    style={{
                      flex: 1,
                      background: '#16a34a',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    🤝 Partner
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1rem' }}>
              No vendors found
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              Try adjusting your search terms or filters to find vendors.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCity('all');
              }}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}