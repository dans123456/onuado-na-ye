import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, X, ShieldCheck } from 'lucide-react';
import LoadingModal from './LoadingModal';

export default function ExecutiveAuthModal({ isOpen, onClose, onSuccess, currentUser }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState('onuadonaeye@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticate = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setError('Please enter the Executive Admin Gmail (onuadonaeye@gmail.com).');
      return;
    }

    if (!cleanPass) {
      setError('Please enter your Executive Admin password or Security PIN.');
      return;
    }

    const memberPin = currentUser?.pin || (currentUser?.phone_number ? currentUser.phone_number.slice(-4) : '1234');
    const isEmailValid = cleanEmail.includes('onuadonaeye@gmail') || cleanEmail === (currentUser?.email || '').toLowerCase();
    const isPassValid = 
      cleanPass === 'Executive2026!' ||
      cleanPass === 'Executive2026' ||
      cleanPass === 'Admin2026' ||
      cleanPass === memberPin ||
      cleanPass === '1234';

    if (isEmailValid && isPassValid) {
      setPassword('');
      setError('');
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 650);
    } else if (!isEmailValid) {
      setError('Invalid Executive Admin Email. Official Executive Email is onuadonaeye@gmail.com');
    } else {
      setError('Invalid Executive Password. Hint: Use Master Password (Executive2026!) or your custom Security PIN.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(217, 119, 6, 0.4)', background: 'var(--bg-card)', position: 'relative' }}>
        
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(5, 150, 105, 0.2))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '0.75rem', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            Executive Council Authentication
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Re-verify Executive Admin Gmail & Password for <strong>{currentUser?.full_name || 'Executive Officer'}</strong> to access the Executive Console.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '10px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleAuthenticate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
              Executive Admin Gmail
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="onuadonaeye@gmail.com"
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Executive Password / Security PIN
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Enter password (e.g. Executive2026!)"
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Master Password & Email Hint Badge */}
          <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.2)', fontSize: '0.78rem', color: '#d97706', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <Sparkles size={14} /> Executive Admin Credentials:
            </div>
            <div>• Gmail: <strong>onuadonaeye@gmail.com</strong></div>
            <div>• Password: <strong>Executive2026!</strong> (or your PIN)</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 2, padding: '0.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #d97706, #059669)', border: 'none' }}
            >
              Authenticate & Open Console <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <LoadingModal 
          isOpen={isLoading}
          title="Unlocking Executive Console..."
          subtitle="Verifying Security Clearance & Financial Ledgers..."
          type="admin"
        />

      </div>
    </div>
  );
}
