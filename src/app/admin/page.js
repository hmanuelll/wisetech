"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', brand: '', price: '', description: '', stock: '' });

  useEffect(() => {
    // Check if logged in
    const auth = localStorage.getItem('wisetech_admin');
    if (!auth) {
      window.location.href = '/login';
    } else {
      setIsAdmin(true);
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this laptop?")) {
      try {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id })
        });
        fetchProducts(); // Refresh
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create', 
          product: { ...formData, price: Number(formData.price), stock: Number(formData.stock) } 
        })
      });
      setShowAddForm(false);
      setFormData({ name: '', brand: '', price: '', description: '', stock: '' });
      fetchProducts();
    } catch (e) {
      console.error("Failed to add", e);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out from the Admin Dashboard?")) {
      localStorage.removeItem('wisetech_admin');
      window.location.href = '/';
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-dark-blue)' }}>Admin Dashboard</h1>
        <div>
          <button className="btn" onClick={() => setShowAddForm(!showAddForm)} style={{ marginRight: '1rem', background: 'var(--color-dark-blue)' }}>
            {showAddForm ? 'Cancel' : '+ Add New Laptop'}
          </button>
          <button className="btn" onClick={handleLogout} style={{ background: '#ef4444' }}>Logout</button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ background: '#f5f7fa', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
          <h2>Add New Product</h2>
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Brand</label>
              <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Price (K)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Stock Quantity</label>
              <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Description</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px' }}></textarea>
            </div>
            <button type="submit" className="btn" style={{ gridColumn: '1 / -1', background: '#059669' }}>Save Product</button>
          </form>
        </div>
      )}

      <h2>Manage Inventory</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead style={{ background: 'var(--color-dark-blue)', color: 'white' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Brand</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{product.id}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{product.name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{product.brand}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>K{Number(product.price).toLocaleString()}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  <span style={{ color: product.stock > 0 ? '#059669' : '#ef4444', fontWeight: 'bold' }}>
                    {product.stock}
                  </span>
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <Link href={`/product/${product.id}`} style={{ color: 'var(--color-blue)', marginRight: '1rem' }}>View</Link>
                  <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
