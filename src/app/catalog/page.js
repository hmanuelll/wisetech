"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [sort, setSort] = useState('');

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) setSearch(params.get('search'));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (brand) params.append('brand', brand);
      if (ram) params.append('ram', ram);
      if (storage) params.append('storage', storage);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, brand, ram, storage, sort]);

  return (
    <div className="container" style={{ padding: '3rem 2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Sidebar Filters */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-heading)' }}>Filters</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Search</label>
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Brand</label>
            <select 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="">All Brands</option>
              <option value="HP">HP</option>
              <option value="Lenovo">Lenovo</option>
              <option value="Dell">Dell</option>
              <option value="ASUS">ASUS</option>
              <option value="Acer">Acer</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>RAM</label>
            <select 
              value={ram} 
              onChange={(e) => setRam(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="">Any RAM</option>
              <option value="4GB">4GB</option>
              <option value="8GB">8GB</option>
              <option value="16GB">16GB</option>
              <option value="32GB">32GB</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Storage</label>
            <select 
              value={storage} 
              onChange={(e) => setStorage(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="">Any Storage</option>
              <option value="128GB">128GB SSD</option>
              <option value="256GB">256GB SSD</option>
              <option value="512GB">512GB SSD</option>
              <option value="1TB">1TB SSD</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sort By</label>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button 
            className="btn" 
            onClick={() => { setSearch(''); setBrand(''); setRam(''); setStorage(''); setSort(''); }}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', background: '#e0e0e0', color: '#333' }}
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Product Grid */}
      <div style={{ flexGrow: 1, minWidth: '300px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-heading)' }}>Product Catalog</h2>
          <span>{products.length} Laptops Found</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading products...</div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-icon">💻</div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description.substring(0, 60)}...</p>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-amount)', marginBottom: '1rem' }}>
                  K{Number(product.price).toLocaleString()}
                </div>
                <Link href={`/product/${product.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', borderRadius: '15px' }}>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>

    </div>
  );
}
