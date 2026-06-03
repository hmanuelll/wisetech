"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-hot-toast';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, compareList } = useShop();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('wisetech_session='));
    if (session) {
      try {
        const userData = JSON.parse(decodeURIComponent(session.split('=')[1]));
        setUser(userData);
      } catch(e) {}
    }

    const handleLogoutEvent = () => setShowLogoutModal(true);
    window.addEventListener('wisetech-logout', handleLogoutEvent);
    return () => window.removeEventListener('wisetech-logout', handleLogoutEvent);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      setShowLogoutModal(false);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch(e) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <header>
        <div className="container nav-container">
          <Link href="/" className="logo">
            <span className="wise">WISE</span><span className="tech">-TECH</span>
          </Link>
          
          <nav className="nav-links">
            <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link href="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}>Catalog</Link>
            <Link href="/compare" className={`nav-link ${isActive('/compare') ? 'active' : ''}`}>⚖️ Compare ({compareList.length})</Link>
            
            {user ? (
              <>
                <Link href="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>My Account</Link>
                {user.role === 'ADMIN' && <Link href="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>}
              </>
            ) : (
              <Link href="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Log In</Link>
            )}

            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>

          <form onSubmit={handleSearch} className="search-bar">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>
      </header>

      {/* Floating Cart Button - fixed to top right, moves with screen */}
      <Link href="/cart" className="floating-cart" title="Shopping Cart">
        <span className="floating-cart-icon">🛒</span>
        {cartCount > 0 && <span className="floating-cart-badge">{cartCount}</span>}
      </Link>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Confirm Logout</h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1.5rem', background: '#ef4444' }}>Yes, Log Out</button>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border-radius: 20px;
          padding: 0.2rem 1rem;
          margin-left: 2rem;
          flex-grow: 0;
          width: 250px;
          border: 1px solid var(--border-color);
        }
        .search-bar input {
          border: none;
          background: transparent;
          padding: 0.5rem;
          width: 100%;
          outline: none;
          font-family: var(--font-primary);
          color: var(--text-primary);
        }
        .search-bar button {
          background: transparent;
          border: none;
          font-size: 1.2rem;
        }
        .theme-toggle {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          padding: 0;
        }
        .nav-link {
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          background: var(--bg-secondary);
        }
        .nav-link.active {
          background: var(--color-blue);
          color: #fff !important;
          font-weight: 700;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-box {
          background: var(--bg-primary);
          padding: 2rem;
          border-radius: 15px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          border: 1px solid var(--border-color);
        }
      `}</style>

      <style jsx global>{`
        .floating-cart {
          position: fixed;
          top: 8rem;
          right: 2rem;
          width: 55px;
          height: 55px;
          background: var(--color-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(15, 58, 112, 0.4);
          z-index: 99;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
        }
        .floating-cart:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(15, 58, 112, 0.5);
        }
        .floating-cart-icon {
          font-size: 1.5rem;
        }
        .floating-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 800;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}

// Export a hook for child components to trigger the logout modal
export function useLogout() {
  return () => {
    // Dispatch a custom event that Header listens to
    window.dispatchEvent(new CustomEvent('wisetech-logout'));
  };
}
