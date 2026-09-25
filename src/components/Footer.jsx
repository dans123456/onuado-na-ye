import React from 'react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: '2.5rem', padding: '1.25rem 1rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-600)' }}>
            ONUADO NA EYE MENS' FELLOWSHIP
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <button onClick={() => setActivePage('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Home</button>
          <button onClick={() => setActivePage('about')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>About Us</button>
          <button onClick={() => setActivePage('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Contact Us</button>
          <button onClick={() => setActivePage('login')} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 700 }}>Member Sign-In</button>
        </div>

        {/* Copyright */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} ONUADO NA EYE MENS' FELLOWSHIP. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
