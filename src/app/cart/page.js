"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ margin: '1rem 0 2rem' }}>Looks like you haven't added any laptops yet.</p>
        <Link href="/catalog" className="btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-dark-blue)' }}>Shopping Cart</h1>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Cart Items */}
        <div style={{ flex: '1 1 600px' }}>
          {cart.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              padding: '1.5rem', 
              borderBottom: '1px solid #eee' 
            }}>
              <div style={{ width: '80px', height: '80px', background: '#f0f4f8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                💻
              </div>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.name}</h3>
                <div style={{ color: 'var(--color-amount)', fontWeight: 'bold' }}>K{Number(item.price).toLocaleString()}</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                >-</button>
                <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                >+</button>
              </div>

              <div style={{ fontWeight: 'bold', width: '100px', textAlign: 'right' }}>
                K{(item.price * item.quantity).toLocaleString()}
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Remove Item"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: '#f5f7fa', padding: '2rem', borderRadius: '15px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Subtotal</span>
              <span>K{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span>Delivery</span>
              <span style={{ color: '#059669' }}>Free</span>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1.5rem 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-dark-blue)' }}>K{cartTotal.toLocaleString()}</span>
            </div>

            <Link href="/checkout" className="btn" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
