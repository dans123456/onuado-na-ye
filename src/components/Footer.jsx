import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: '3.5rem', padding: '1.75rem 1.25rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Brand & Quick Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/logo.png" alt="Onuado Na Ye Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-600)', lineHeight: 1.1 }}>
                ONUADO NA YE
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                FELLOWSHIP PORTAL
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActivePage('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Home</button>
            <button onClick={() => setActivePage('about')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>About Us</button>
            <button onClick={() => setActivePage('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Contact Us</button>
            <button onClick={() => setActivePage('login')} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>Member Sign-In</button>
          </div>

        </div>

        {/* Copyright & Security Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>&copy; {new Date().getFullYear()} Onuado Na Ye Fellowship. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontWeight: 600 }}>
              <ShieldCheck size={14} /> Encrypted Supabase Database
            </span>
            <span>•</span>
            <button 
              onClick={() => setActivePage('login')} 
              style={{ background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <ShieldCheck size={14} /> Executive Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
