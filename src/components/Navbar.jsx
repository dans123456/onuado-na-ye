import React, { useState } from 'react';
import { Shield, User, LogOut, Sun, Moon, Menu, X, Wallet, HeartHandshake } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, setCurrentUser, isDarkMode, setIsDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  return (
    <nav className="glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNav('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #059669, #d97706)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontWeight: 'bold', 
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
          }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #059669, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ONUADO NA YE
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>
              FELLOWSHIP PORTAL
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '1.5rem', alignItems: 'center', md: 'flex' }} className="desktop-links">
          <button 
            onClick={() => handleNav('home')}
            style={{ background: 'none', border: 'none', color: activePage === 'home' ? 'var(--primary-600)' : 'var(--text-main)', fontWeight: activePage === 'home' ? 700 : 500, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Home
          </button>
          <button 
            onClick={() => handleNav('about')}
            style={{ background: 'none', border: 'none', color: activePage === 'about' ? 'var(--primary-600)' : 'var(--text-main)', fontWeight: activePage === 'about' ? 700 : 500, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            About Us
          </button>
          <button 
            onClick={() => handleNav('contact')}
            style={{ background: 'none', border: 'none', color: activePage === 'contact' ? 'var(--primary-600)' : 'var(--text-main)', fontWeight: activePage === 'contact' ? 700 : 500, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Contact & MoMo
          </button>
          
          {currentUser && (
            <button 
              onClick={() => handleNav('dashboard')}
              style={{ background: 'none', border: 'none', color: activePage === 'dashboard' ? 'var(--primary-600)' : 'var(--text-main)', fontWeight: activePage === 'dashboard' ? 700 : 500, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <User size={16} /> Member Dashboard
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => handleNav('admin')}
              style={{ background: 'none', border: 'none', color: activePage === 'admin' ? 'var(--accent-600)' : 'var(--text-main)', fontWeight: activePage === 'admin' ? 700 : 500, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Shield size={16} /> Admin Portal
            </button>
          )}
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle theme"
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#047857" />}
          </button>

          {/* User Auth State */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.full_name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentUser.role === 'admin' ? 'Administrator' : 'Fellowship Member'}
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}>
                <LogOut size={16} /> <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <button onClick={() => handleNav('login')} className="btn btn-primary" style={{ padding: '0.5rem 1.1rem' }}>
              <User size={16} /> Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary mobile-toggle"
            style={{ padding: '0.45rem', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-card)' }}>
          <button onClick={() => handleNav('home')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Home</button>
          <button onClick={() => handleNav('about')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>About Us</button>
          <button onClick={() => handleNav('contact')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Contact & MoMo Info</button>
          {currentUser && (
            <button onClick={() => handleNav('dashboard')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <User size={16} /> Member Dashboard
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button onClick={() => handleNav('admin')} className="btn btn-accent" style={{ justifyContent: 'flex-start' }}>
              <Shield size={16} /> Admin Portal
            </button>
          )}
        </div>
      )}

      {/* Styling tweaks for responsive design */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mobile-toggle { display: inline-flex !important; }
          .logout-text { display: none; }
        }
      `}</style>
    </nav>
  );
}
