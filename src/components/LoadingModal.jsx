import React from 'react';
import { ShieldCheck, Lock, Sparkles, CreditCard, RefreshCw } from 'lucide-react';

export default function LoadingModal({ isOpen, title = 'Loading...', subtitle = 'Processing your request...', type = 'member' }) {
  if (!isOpen) return null;

  return (
    <div className="loading-overlay">
      <div 
        className="glass-card" 
        style={{ 
          padding: '2.25rem 2rem', 
          borderRadius: '20px', 
          maxWidth: '380px', 
          width: '90%', 
          textAlign: 'center', 
          background: 'var(--bg-card)', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        {/* Animated Brand Emblem Header */}
        <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glow-spinner" style={{ position: 'absolute', inset: -5, width: '80px', height: '80px' }}></div>
          <img 
            src="/logo.png" 
            alt="Fellowship Logo" 
            style={{ width: '48px', height: '48px', objectFit: 'contain', zIndex: 2 }} 
          />
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>
            {subtitle}
          </p>
        </div>

        {/* Status Badge */}
        <div className="badge pulse-badge" style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '0.35rem 0.85rem', fontSize: '0.78rem', fontWeight: 700 }}>
          {type === 'admin' && <Lock size={13} color="#d97706" />}
          {type === 'member' && <ShieldCheck size={13} color="#059669" />}
          {type === 'payment' && <CreditCard size={13} color="#2563eb" />}
          <span style={{ marginLeft: '0.3rem' }}>
            {type === 'admin' ? 'Executive Encryption Active' : type === 'payment' ? 'Secured Gateway Connection' : 'Authenticating Member Token'}
          </span>
        </div>
      </div>
    </div>
  );
}
