"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function ComparePage() {
  const { compareList, toggleCompare, addToCart } = useShop();

  if (compareList.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2>No Laptops to Compare</h2>
        <p style={{ margin: '1rem 0 2rem' }}>Add some laptops to your comparison list from the catalog.</p>
        <Link href="/catalog" className="btn">Go to Catalog</Link>
      </div>
    );
  }

  // Extract all unique spec keys from the compared laptops
  const allSpecKeys = new Set();
  compareList.forEach(laptop => {
    if (laptop.specs) {
      Object.keys(laptop.specs).forEach(key => allSpecKeys.add(key));
    }
  });
  const specKeysArray = Array.from(allSpecKeys);

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-dark-blue)' }}>Compare Laptops</h1>
        <Link href="/catalog" style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}>
          Add another laptop
        </Link>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.5rem', borderBottom: '2px solid #ddd', width: '20%' }}>Feature</th>
              {compareList.map(laptop => (
                <th key={laptop.id} style={{ padding: '1.5rem', borderBottom: '2px solid #ddd', width: `${80 / compareList.length}%` }}>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleCompare(laptop)}
                      style={{ position: 'absolute', top: '-10px', right: '0', background: '#ffeded', color: '#ef4444', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
                      title="Remove from comparison"
                    >
                      ✕
                    </button>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{laptop.name}</h3>
                    <div style={{ color: 'var(--color-amount)', fontWeight: 'bold', marginBottom: '1rem' }}>
                      K{Number(laptop.price).toLocaleString()}
                    </div>
                    <button className="btn" onClick={() => addToCart(laptop)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#f9f9f9' }}>
              <td style={{ padding: '1.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Brand</td>
              {compareList.map(laptop => (
                <td key={laptop.id} style={{ padding: '1.5rem', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  {laptop.brand}
                </td>
              ))}
            </tr>
            {specKeysArray.map((specKey, index) => (
              <tr key={specKey} style={{ background: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ padding: '1.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{specKey}</td>
                {compareList.map(laptop => (
                  <td key={laptop.id} style={{ padding: '1.5rem', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {laptop.specs && laptop.specs[specKey] ? laptop.specs[specKey] : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
