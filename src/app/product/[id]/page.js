import pool from '@/lib/db';
import Link from 'next/link';
import ProductActions from './ProductActions';

export default async function ProductDetails({ params }) {
  // In Next.js 15, params is a promise
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  let product = null;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (rows.length > 0) {
      product = rows[0];
      // Specs might be stringified JSON from db
      if (typeof product.specs === 'string') {
        product.specs = JSON.parse(product.specs);
      }
    }
  } catch (error) {
    console.error("Database query failed:", error);
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h1>Product Not Found</h1>
        <Link href="/catalog" className="btn" style={{ marginTop: '2rem' }}>Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Images */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ 
            background: '#f0f4f8', 
            borderRadius: '20px', 
            aspectRatio: '1', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '5rem',
            border: '2px solid #e0eaf5'
          }}>
            💻
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1, background: '#f0f4f8', aspectRatio: '1', borderRadius: '10px' }}></div>
            <div style={{ flex: 1, background: '#f0f4f8', aspectRatio: '1', borderRadius: '10px' }}></div>
            <div style={{ flex: 1, background: '#f0f4f8', aspectRatio: '1', borderRadius: '10px' }}></div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ color: 'var(--color-blue)', fontWeight: 'bold' }}>{product.brand}</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.name}</h1>
              <div style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                ⭐⭐⭐⭐⭐ <span style={{ color: '#666', fontSize: '0.9rem' }}>(Reviews coming soon)</span>
              </div>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-amount)' }}>
              K{Number(product.price).toLocaleString()}
            </h2>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '2rem' }}>
            {product.description}
          </p>

          <div style={{ marginBottom: '2rem', padding: '1rem', background: product.stock > 0 ? '#ecfdf5' : '#fef2f2', borderRadius: '10px', display: 'inline-block' }}>
            <strong style={{ color: product.stock > 0 ? '#059669' : '#dc2626' }}>
              {product.stock > 0 ? `In Stock (Only ${product.stock} left)` : 'Out of Stock'}
            </strong>
          </div>

          {/* Client component for Cart/Wishlist/Compare actions */}
          <ProductActions product={product} />

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '3rem 0' }} />

          {/* Specs */}
          <h3 style={{ marginBottom: '1.5rem' }}>Full Specifications</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold', color: '#555', width: '30%' }}>{key}</td>
                  <td style={{ padding: '1rem 0' }}>{value}</td>
                </tr>
              ))}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>Warranty</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-primary)' }}>Pre-owned - No Warranty</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>Delivery</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-primary)' }}>Fees apply based on location (calculated at checkout)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
