"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newErrors = {};
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.phone) {
      if (formData.phone.length !== 10) {
        newErrors.phone = `Phone number must be exactly 10 digits (${formData.phone.length}/10)`;
      }
    }
    setErrors(newErrors);
  }, [formData]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Registration successful! Please log in.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: '5rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ color: 'var(--text-heading)', marginBottom: '2rem', textAlign: 'center' }}>Create Account</h1>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Phone Number</label>
            <input 
              type="tel" 
              required 
              value={formData.phone}
              maxLength={10}
              onChange={e => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                setFormData({...formData, phone: digitsOnly});
              }}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: errors.phone ? '1px solid #ef4444' : '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
            {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: errors.password ? '1px solid #ef4444' : '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
            {errors.password && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Confirm Password</label>
            <input 
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} 
            />
            {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.confirmPassword}</span>}
          </div>
          
          <button type="submit" className="btn" disabled={loading || Object.keys(errors).length > 0} style={{ width: '100%', marginTop: '1rem', opacity: loading || Object.keys(errors).length > 0 ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Already have an account? <Link href="/login" style={{ color: 'var(--color-blue)', fontWeight: 'bold' }}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
