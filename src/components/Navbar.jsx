import React, { useState } from 'react';
import { Shield, User, LogOut, Sun, Moon, Menu, X, HeartHandshake, Wallet, CheckCircle2, Copy } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, setCurrentUser, isDarkMode, setIsDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoMoModal, setShowMoMoModal] = useState(false);
  const [copiedMoMo, setCopiedMoMo] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  const copyMoMoNumber = () => {
    navigator.clipboard.writeText('0243430617');
    setCopiedMoMo(true);
    setTimeout(() => setCopiedMoMo(false), 2500);
  };

  const getInitials = (name) => {
    if (!name) return 'MB';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <nav className="glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)', background: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)', borderBottom: '1px solid var(--border-color)' }}>
      {/* Top Banner Announcement Ticker */}
      <div style={{ background: 'linear-gradient(90deg, #064e3b, #059669, #d97706)', color: '#ffffff', fontSize: '0.78rem', padding: '0.35rem 1rem', textAlign: 'center', fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <span>✨ Welcome to <strong>Onuado Na Ye Fellowship</strong></span>
        <span style={{ opacity: 0.7 }}>•</span>
        <span><em>"Brotherly Love & Solidarity in Action"</em></span>
        <span style={{ opacity: 0.7 }}>•</span>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>10+ Branches Nationwide</span>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNav('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, #059669, #064e3b, #d97706)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontWeight: 'bold', 
            fontSize: '1.25rem',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
          }}>
            <HeartHandshake size={26} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.3rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #059669, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              ONUADO NA YE
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              FELLOWSHIP PORTAL
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '1.75rem', alignItems: 'center' }} className="desktop-links">
          <button 
            onClick={() => handleNav('home')}
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNav('about')}
            className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
          >
            About Us
          </button>
          <button 
            onClick={() => handleNav('contact')}
            className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}
          >
            Contact & MoMo
          </button>
          
          {currentUser && (
            <button 
              onClick={() => handleNav('dashboard')}
              className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <User size={16} /> My Member Portal
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => handleNav('admin')}
              style={{ 
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(5, 150, 105, 0.15))', 
                border: '1px solid rgba(217, 119, 6, 0.4)', 
                color: '#d97706', 
                padding: '0.45rem 0.9rem', 
                borderRadius: '8px', 
                fontWeight: 700, 
                cursor: 'pointer', 
                fontSize: '0.85rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Shield size={15} color="#d97706" /> Executive Console
            </button>
          )}
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Quick MoMo Pay Trigger Button */}
          <button 
            onClick={() => setShowMoMoModal(true)}
            className="btn btn-accent"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Wallet size={15} /> <span>Pay Dues MoMo</span>
          </button>

          {/* Dark / Light Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle color theme"
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#047857" />}
          </button>

          {/* User Auth Controls */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #d97706)', color: '#fff', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {getInitials(currentUser.full_name)}
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #fff' }}></span>
              </div>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-text">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.full_name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentUser.role === 'admin' ? '⭐ Executive Officer' : 'Active Member'}
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                <LogOut size={15} /> <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => handleNav('login')} className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}>
                <User size={16} /> Member Sign In
              </button>
            </div>
          )}

          {/* Mobile Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary mobile-toggle"
            style={{ padding: '0.5rem', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: isDarkMode ? '#0f172a' : '#ffffff' }}>
          <button onClick={() => handleNav('home')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Home</button>
          <button onClick={() => handleNav('about')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>About Us</button>
          <button onClick={() => handleNav('contact')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Contact & MoMo Details</button>
          {currentUser ? (
            <>
              <button onClick={() => handleNav('dashboard')} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <User size={16} /> My Member Portal
              </button>
              {currentUser.role === 'admin' && (
                <button onClick={() => handleNav('admin')} className="btn btn-accent" style={{ justifyContent: 'flex-start' }}>
                  <Shield size={16} /> Executive Admin Console
                </button>
              )}
            </>
          ) : (
            <button onClick={() => handleNav('login')} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <User size={16} /> Member Sign In
            </button>
          )}
        </div>
      )}

      {/* MoMo Quick Pay Modal */}
      {showMoMoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '460px', width: '100%', padding: '2rem', borderRadius: '18px', background: isDarkMode ? '#0f172a' : '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={20} color="#d97706" /> Quick Mobile Money Payment
              </h3>
              <button onClick={() => setShowMoMoModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(5, 150, 105, 0.1))', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.3)', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>MTN Mobile Money Wallet</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', margin: '0.2rem 0', letterSpacing: '0.05em' }}>
                024 343 0617
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Account: Onuado Na Ye Fellowship</div>
              
              <button 
                onClick={copyMoMoNumber} 
                className="btn btn-secondary" 
                style={{ marginTop: '0.85rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: '#fff', color: '#000' }}
              >
                {copiedMoMo ? <CheckCircle2 size={14} color="#059669" /> : <Copy size={14} />} {copiedMoMo ? 'Copied to Clipboard!' : 'Copy MoMo Number'}
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              <strong>Instructions:</strong> Dial <code>*170#</code>, select <em>Transfer Money -&gt; MoMo User</em>, enter <strong>024 343 0617</strong>, and put your <strong>Name / Member ID</strong> in the reference! Admins will log your payment immediately.
            </div>

            <button onClick={() => setShowMoMoModal(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}>
              Got It
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-link {
          background: none;
          border: none;
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0.25rem 0.5rem;
          border-bottom: 2px solid transparent;
        }
        .nav-link:hover {
          color: var(--primary-600);
        }
        .nav-link.active {
          color: var(--primary-600);
          border-bottom-color: var(--primary-600);
          font-weight: 700;
        }
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .user-text { display: block !important; }
        }
        @media (max-width: 767px) {
          .mobile-toggle { display: inline-flex !important; }
          .logout-text { display: none; }
        }
      `}</style>
    </nav>
  );
}

