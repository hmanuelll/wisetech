"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Welcome back, ${data.user.name}!`);
        // Use a short delay before redirect
        setTimeout(() => {
          if (data.user.role === 'ADMIN') {
            localStorage.setItem('wisetech_admin', 'true');
            window.location.href = '/admin';
          } else {
            window.location.href = '/catalog';
          }
        }, 1000);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: '5rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ color: 'var(--text-heading)', marginBottom: '2rem', textAlign: 'center' }}>Login</h1>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Don't have an account? <Link href="/register" style={{ color: 'var(--color-blue)', fontWeight: 'bold' }}>Register</Link></p>
        </div>
      </div>
    </div>
  );
}
