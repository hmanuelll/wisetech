"use client";
import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart } = useShop();
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', paymentMethod: 'cash', location: 'Lusaka'
  });

  useEffect(() => {
    // Check auth cookie
    const session = document.cookie.split('; ').find(row => row.startsWith('wisetech_session='));
    if (session) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-dark-blue)' }}>You must be logged in to checkout</h2>
        <p style={{ margin: '1rem 0 2rem' }}>Please sign in to your account or create a new one to complete your purchase.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" className="btn">Sign In</Link>
          <Link href="/register" className="btn" style={{ background: '#f5f7fa', color: '#333' }}>Register</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2>Nothing to checkout</h2>
        <Link href="/catalog" className="btn" style={{ marginTop: '1rem' }}>Back to Catalog</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ color: '#059669', marginBottom: '1rem' }}>Order Placed Successfully!</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
          Thank you for shopping at WISE-TECH. We will contact you at {formData.phone} shortly.
        </p>
        <Link href="/" className="btn" onClick={() => window.location.href = '/'}>
          Return Home
        </Link>
      </div>
    );
  }

  const deliveryFee = formData.location === 'Lusaka' ? 50 : formData.location === 'Kitwe' || formData.location === 'Ndola' ? 100 : 150;
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Processing order...");
    
    // In a real app, send this to the /api/orders route
    // For now, mock success
    setTimeout(() => {
      toast.dismiss();
      toast.success("Order placed successfully!");
      setSuccess(true);
      localStorage.removeItem('wisetech_cart');
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-heading)' }}>Checkout</h1>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap-reverse' }}>
        
        {/* Form */}
        <div style={{ flex: '1 1 500px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Phone Number</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Delivery Location</label>
              <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value="Lusaka">Lusaka (K50)</option>
                <option value="Kitwe">Kitwe (K100)</option>
                <option value="Ndola">Ndola (K100)</option>
                <option value="Other">Other Province (K150)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Full Delivery Address</label>
              <textarea required rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}></textarea>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Payment Method</label>
              <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value="cash">Cash on Delivery</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            <button type="submit" className="btn" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', background: '#059669' }}>
              Confirm Order (K{finalTotal.toLocaleString()})
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '15px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Order</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  K{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span>Subtotal</span>
              <span>K{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span>Delivery Fee ({formData.location})</span>
              <span>K{deliveryFee}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '2px solid var(--border-color)', paddingTop: '1rem' }}>
              <span>Total to Pay</span>
              <span style={{ color: 'var(--color-amount)' }}>K{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
