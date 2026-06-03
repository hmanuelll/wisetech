"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useLogout } from '@/components/Header';

export default function ProfilePage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const triggerLogout = useLogout();

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('wisetech_session='));
    if (session) {
      try {
        const userData = JSON.parse(decodeURIComponent(session.split('=')[1]));
        setUser(userData);
      } catch(e) {}
    }
    setLoading(false);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading...</div>;

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2>You are not logged in</h2>
        <p style={{ margin: '1rem 0 2rem' }}>Please log in to view your account.</p>
        <Link href="/login" className="btn">Log In</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      {/* User Greeting Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--color-blue), var(--color-light-blue))',
        borderRadius: '20px',
        padding: '2.5rem',
        color: '#fff',
        marginBottom: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>Welcome back, {user.name}!</h1>
          <p style={{ opacity: 0.8 }}>{user.email}</p>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.25rem' }}>Role: {user.role}</p>
        </div>
        <button 
          onClick={triggerLogout}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '0.75rem 1.5rem', 
            borderRadius: '10px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
        >
          Log Out
        </button>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Link href="/cart" style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: '15px', 
          padding: '2rem', 
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
          <h3>My Cart</h3>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>View items in your cart</p>
        </Link>
        <Link href="/catalog" style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: '15px', 
          padding: '2rem', 
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💻</div>
          <h3>Browse Catalog</h3>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Explore our laptops</p>
        </Link>
        <Link href="/compare" style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: '15px', 
          padding: '2rem', 
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
          <h3>Compare</h3>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Compare laptop specs</p>
        </Link>
      </div>

      {/* Wishlist Section */}
      <h2 style={{ marginBottom: '1.5rem' }}>My Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '15px', textAlign: 'center' }}>
          <p>No items in your wishlist yet.</p>
          <Link href="/catalog" style={{ color: 'var(--color-active-link)', fontWeight: 'bold' }}>Browse the catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map(item => (
            <div key={item.id} className="product-card" style={{ textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>💻</div>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                <div style={{ color: 'var(--color-amount)', fontWeight: 'bold' }}>K{Number(item.price).toLocaleString()}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button className="btn" onClick={() => addToCart(item)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Add to Cart</button>
                  <button onClick={() => toggleWishlist(item)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '50px', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
