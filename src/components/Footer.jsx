import React from 'react';

export default function Footer({ setActivePage, currentUser, setCurrentUser, onLogout }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        localStorage.removeItem('ony_current_user');
        sessionStorage.removeItem('ony_current_user');
        sessionStorage.removeItem('ony_admin_auth');
        localStorage.removeItem('ony_active_page');
      } catch (e) {
        console.error(e);
      }
      if (setCurrentUser) setCurrentUser(null);
      if (setActivePage) setActivePage('home');
    }
  };

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: '2.5rem', padding: '1.25rem 1rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div 
          onClick={() => setActivePage && setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
          title="Return to Home"
        >
          <img src="/logo.png" alt="Logo" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-600)' }}>
            ONUADO NA EYE MENS' FELLOWSHIP
          </span>
        </div>

        {/* Dynamic Context-Aware Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
          <button onClick={() => setActivePage('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Home</button>
          <button onClick={() => setActivePage('about')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>About Us</button>
          <button onClick={() => setActivePage('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Contact Us</button>

          {currentUser ? (
            <>
              <button 
                onClick={() => setActivePage('dashboard')} 
                style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontWeight: 800 }}
              >
                My Member Portal
              </button>
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => setActivePage('admin')} 
                  style={{ background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontWeight: 800 }}
                >
                  Executive Console
                </button>
              )}
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 700 }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => setActivePage('login')} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 800 }}>
              Member Sign-In
            </button>
          )}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} ONUADO NA EYE MENS' FELLOWSHIP. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}


