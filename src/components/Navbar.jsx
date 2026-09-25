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

  const copyMoMoNumber = (textToCopy = '0530486443') => {
    navigator.clipboard.writeText(textToCopy);
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
      <div style={{ background: 'linear-gradient(90deg, #064e3b, #059669, #d97706)', color: '#ffffff', fontSize: '0.78rem', padding: '0.35rem 1rem', textAlign: 'center', fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'nowrap', overflow: 'hidden' }}>
        <span>✨ Welcome to <strong>ONUADO NA EYE MENS' FELLOWSHIP</strong></span>
        <span className="top-ticker-subtitle" style={{ opacity: 0.7 }}>•</span>
        <span className="top-ticker-subtitle"><em>"Brotherly Love & Solidarity in Action"</em></span>
        <span className="top-ticker-subtitle" style={{ opacity: 0.7 }}>•</span>
        <span className="top-ticker-subtitle" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>10+ Branches</span>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           {/* Brand / Logo */}
        <div 
          onClick={() => handleNav(currentUser ? 'dashboard' : 'home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <img 
            src="/logo.png" 
            alt="ONUADO NA EYE MENS' FELLOWSHIP Logo" 
            style={{ 
              width: '46px', 
              height: '46px', 
              objectFit: 'contain', 
              borderRadius: '10px',
              filter: 'drop-shadow(0 2px 6px rgba(5, 150, 105, 0.3))'
            }} 
          />
          <div>
            <div className="brand-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #059669, #064e3b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              ONUADO NA EYE
            </div>
            <div className="brand-subtitle" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              MENS' FELLOWSHIP {currentUser ? 'PORTAL' : 'OFFICIAL'}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }} className="desktop-links">
          {!currentUser ? (
            <>
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
                Contact Us
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNav('dashboard')}
                className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <User size={16} /> My Member Portal
              </button>

              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => handleNav('admin')}
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(5, 150, 105, 0.15))', 
                    border: '1px solid rgba(217, 119, 6, 0.4)', 
                    color: '#d97706', 
                    padding: '0.45rem 0.85rem', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    fontSize: '0.82rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Shield size={15} color="#d97706" /> Executive Console
                </button>
              )}
            </>
          )}
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          
          {/* Quick MoMo Pay Trigger Button */}
          <button 
            onClick={() => setShowMoMoModal(true)}
            className="btn btn-accent momo-desktop-btn"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
          >
            <Wallet size={15} /> <span>Pay Dues MoMo</span>
          </button>

          {/* Dark / Light Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle color theme"
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#047857" />}
          </button>

          {/* User Auth Controls */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              
              {/* Executive Quick Portal Switcher Button for Mobile & Desktop */}
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => handleNav(activePage === 'admin' ? 'dashboard' : 'admin')}
                  className="btn btn-secondary nav-admin-switch-btn"
                  title={activePage === 'admin' ? "Switch to My Member Portal" : "Switch to Executive Admin Console"}
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', border: activePage === 'admin' ? '1px solid rgba(5, 150, 105, 0.4)' : '1px solid rgba(217, 119, 6, 0.4)' }}
                >
                  {activePage === 'admin' ? (
                    <> <User size={15} color="#059669" /> <span className="admin-switch-text" style={{ color: '#059669' }}>My Member Portal</span> </>
                  ) : (
                    <> <Shield size={15} color="#d97706" /> <span className="admin-switch-text" style={{ color: '#d97706' }}>Executive Console</span> </>
                  )}
                </button>
              )}

              {/* Avatar Pill Button (Click to go to My Member Portal) */}
              <div 
                onClick={() => handleNav('dashboard')}
                title="Go to My Personal Member Portal"
                style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #059669, #d97706)', color: '#fff', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '2px solid #059669', cursor: 'pointer', flexShrink: 0 }}
              >
                {currentUser.profile_picture ? (
                  <img src={currentUser.profile_picture} alt={currentUser.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getInitials(currentUser.full_name)
                )}
                <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: currentUser.status === 'ACTIVE' ? '#10b981' : '#f59e0b', border: '2px solid #fff' }}></span>
              </div>

              <div style={{ textAlign: 'left', display: 'none', cursor: 'pointer' }} onClick={() => handleNav('dashboard')} className="user-text">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{currentUser.full_name}</div>
                <div style={{ fontSize: '0.7rem', color: currentUser.role === 'admin' ? '#d97706' : 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {currentUser.role === 'admin' ? '⭐ Executive Officer' : `✓ ${currentUser.status || 'ACTIVE'}`}
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}>
                <LogOut size={15} /> <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => handleNav('login')} className="btn btn-primary nav-signin-btn" style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)', whiteSpace: 'nowrap' }}>
                <User size={16} /> <span className="signin-text">Member Sign In</span>
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
          {!currentUser ? (
            <>
              <button onClick={() => handleNav('home')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Home</button>
              <button onClick={() => handleNav('about')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>About Us</button>
              <button onClick={() => handleNav('contact')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Contact Us</button>
              <button onClick={() => handleNav('login')} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <User size={16} /> Member Sign In
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('dashboard')} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <User size={16} /> My Member Portal
              </button>
              {currentUser.role === 'admin' && (
                <button onClick={() => handleNav('admin')} className="btn btn-accent" style={{ justifyContent: 'flex-start' }}>
                  <Shield size={16} /> Executive Admin Console
                </button>
              )}
              <button onClick={() => setShowMoMoModal(true)} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Wallet size={16} /> Pay Dues MoMo
              </button>
            </>
          )}
        </div>
      )}


      {/* MoMo & Bank Quick Pay Modal */}
      {showMoMoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '490px', width: '100%', padding: '2rem', borderRadius: '18px', background: isDarkMode ? '#0f172a' : '#ffffff', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={20} color="#d97706" /> Fellowship Payment Channels
              </h3>
              <button onClick={() => setShowMoMoModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Official Account Name Pill */}
            <div style={{ padding: '0.5rem 0.85rem', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '8px', border: '1px solid rgba(5, 150, 105, 0.25)', fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>
              Account Name: ONUADO NA EYE MENS' FELLOWSHIP
            </div>

            {/* MoMo Number & Merchant Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(5, 150, 105, 0.08))', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>MTN MoMo Number</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#d97706', margin: '0.2rem 0' }}>
                  0530486443
                </div>
                <button 
                  onClick={() => copyMoMoNumber('0530486443')} 
                  className="btn btn-secondary" 
                  style={{ marginTop: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
                >
                  {copiedMoMo ? <CheckCircle2 size={12} color="#059669" /> : <Copy size={12} />} {copiedMoMo ? 'Copied!' : 'Copy MoMo'}
                </button>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(5, 150, 105, 0.08))', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Merchant Pay Code</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#3b82f6', margin: '0.2rem 0' }}>
                  293658
                </div>
                <button 
                  onClick={() => copyMoMoNumber('293658')} 
                  className="btn btn-secondary" 
                  style={{ marginTop: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
                >
                  <Copy size={12} /> Copy Merchant ID
                </button>
              </div>
            </div>

            {/* Fidelity Bank Card */}
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>🏦 Official Bank Account</span>
                <span className="badge badge-admin" style={{ fontSize: '0.68rem' }}>FIDELITY BANK</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                Bank Name: <strong>Fidelity Bank Ghana</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Official Email: <strong>onuadonaeye@gmail.com</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              <strong>Instructions:</strong> Dial <code>*170#</code> -&gt; <em>Pay Merchant (Option 2)</em> using Merchant Code <strong>293658</strong>, or send to MoMo <strong>0530486443</strong> / <strong>Fidelity Bank</strong> with your <strong>Member ID / Name</strong> in the reference!
            </div>

            <button onClick={() => setShowMoMoModal(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', fontWeight: 700 }}>
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
        @media (min-width: 900px) {
          .desktop-links { display: flex !important; }
          .user-text { display: block !important; }
        }
        @media (max-width: 899px) {
          .mobile-toggle { display: inline-flex !important; }
          .logout-text { display: none; }
        }
        @media (max-width: 640px) {
          .momo-desktop-btn { display: none !important; }
          .top-ticker-subtitle { display: none !important; }
        }
        @media (max-width: 580px) {
          .signin-text { display: none !important; }
          .nav-signin-btn { padding: 0.45rem 0.65rem !important; }
          .admin-switch-text { display: none !important; }
          .nav-admin-switch-btn { padding: 0.45rem 0.6rem !important; }
        }
        @media (max-width: 480px) {
          .brand-subtitle { display: none !important; }
          .brand-title { font-size: 1.05rem !important; }
        }
      `}</style>
    </nav>
  );
}

