import pool from '@/lib/db';
import Link from 'next/link';

export default async function Home() {
  let featuredProducts = [];
  try {
    const [rows] = await pool.query('SELECT * FROM products LIMIT 3');
    featuredProducts = rows;
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container hero-content animate-fade-in-up">
          <span className="hero-tagline">Smart solutions, better future</span>
          <h1>
            Experience the Best in <span className="highlight">Computing</span>
          </h1>
          <p>
            Upgrade your life with the latest technology. From high-performance laptops to custom desktop workstations, WISE-TECH has you covered.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link href="/catalog" className="btn">Explore Products</Link>
            <Link href="/register" className="btn" style={{ background: '#f5f7fa', color: '#0b2f5c' }}>Register Account</Link>
            <Link href="/login" className="btn" style={{ background: 'transparent', border: '2px solid #0b2f5c', color: '#0b2f5c' }}>Login</Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="section container">
        <h2 className="section-title">Featured Laptops</h2>
        <div className="products-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-icon">💻</div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description.substring(0, 80)}...</p>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-amount)', marginBottom: '1rem' }}>
                  K{Number(product.price).toLocaleString()}
                </div>
                <Link href={`/product/${product.id}`} className="btn" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center', width: '100%'}}>No products found in the database. Did you import the SQL file?</p>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="location-section">
        <div className="container">
          <h2 className="section-title">Find Us</h2>
          <div className="location-content animate-fade-in-up">
            <span className="location-icon">📍</span>
            <div>
              <strong>Codrington House Room 8</strong><br/>
              Nkwazi Road, Lusaka, Lusaka, Zambia, 10101
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
