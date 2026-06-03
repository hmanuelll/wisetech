"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';

export default function ProductActions({ product }) {
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList } = useShop();

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const isCompared = compareList.some(item => item.id === product.id);

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button 
        className="btn" 
        onClick={() => addToCart(product)}
        disabled={product.stock === 0}
        style={{ 
          opacity: product.stock === 0 ? 0.5 : 1, 
          cursor: product.stock === 0 ? 'not-allowed' : 'pointer' 
        }}
      >
        {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
      </button>

      <button 
        className="btn" 
        onClick={() => toggleWishlist(product)}
        style={{ 
          background: isWishlisted ? '#fef2f2' : '#fff',
          color: isWishlisted ? '#ef4444' : '#333',
          border: `1px solid ${isWishlisted ? '#ef4444' : '#ccc'}`,
          boxShadow: 'none'
        }}
      >
        {isWishlisted ? '❤️ Saved' : '🤍 Save for Later'}
      </button>

      <button 
        className="btn" 
        onClick={() => toggleCompare(product)}
        style={{ 
          background: isCompared ? '#eff6ff' : '#fff',
          color: isCompared ? '#3b82f6' : '#333',
          border: `1px solid ${isCompared ? '#3b82f6' : '#ccc'}`,
          boxShadow: 'none'
        }}
      >
        {isCompared ? '✓ Added to Compare' : '⚖️ Compare'}
      </button>
    </div>
  );
}
