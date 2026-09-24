import React, { useState } from 'react';
import { User, Lock, Phone, Shield, ArrowRight, CheckCircle2, ChevronDown, KeyRound, Sparkles, Building2 } from 'lucide-react';

export default function LoginPage({ members, setCurrentUser, setActivePage }) {
  const [authMode, setAuthMode] = useState('member'); // 'member' or 'executive'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Dev Helper Drawer State
  const [showDevDrawer, setShowDevDrawer] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanInput = phoneOrEmail.trim().toLowerCase();
    
    // Match against phone, email, full name, or excel_member_id
    const found = members.find(m => 
      m.phone_number.includes(cleanInput) || 
      m.full_name.toLowerCase().includes(cleanInput) ||
      (m.excel_member_id && m.excel_member_id.toLowerCase() === cleanInput)
    );

    if (!found) {
      setError('Invalid credentials or unregistered phone number. Please verify your registered details with your Branch Executive.');
      return;
    }

    if (authMode === 'executive' && found.role !== 'admin') {
      setError(`Access Denied: ${found.full_name} is registered as a General Member. Executive Portal access is restricted to Fellowship Officers.`);
      return;
    }

    setCurrentUser(found);
    setActivePage(found.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleQuickLogin = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setCurrentUser(member);
      setActivePage(member.role === 'admin' ? 'admin' : 'dashboard');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2.5rem 1.5rem', background: 'radial-gradient(circle at top, rgba(5, 150, 105, 0.08), transparent 70%)' }}>
      
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Portal Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="Onuado Na Ye Logo" 
            style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 1rem auto', filter: 'drop-shadow(0 4px 12px rgba(5, 150, 105, 0.4))' }} 
          />

          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.4rem', background: 'linear-gradient(135deg, #059669, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Onuado Na Ye Fellowship
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Official Member & Financial Solidarity Portal
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="glass-card" style={{ padding: '0.35rem', borderRadius: '14px', display: 'flex', marginBottom: '1.5rem', background: 'var(--bg-card-hover)' }}>
          <button 
            type="button"
            onClick={() => { setAuthMode('member'); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '0.65rem 1rem', 
              borderRadius: '10px', 
              border: 'none', 
              fontWeight: 700, 
              fontSize: '0.88rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              background: authMode === 'member' ? 'var(--primary-600)' : 'transparent',
              color: authMode === 'member' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: authMode === 'member' ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none'
            }}
          >
            <User size={16} /> General Member
          </button>
          
          <button 
            type="button"
            onClick={() => { setAuthMode('executive'); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '0.65rem 1rem', 
              borderRadius: '10px', 
              border: 'none', 
              fontWeight: 700, 
              fontSize: '0.88rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              background: authMode === 'executive' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
              color: authMode === 'executive' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: authMode === 'executive' ? '0 4px 12px rgba(217, 119, 6, 0.3)' : 'none'
            }}
          >
            <Shield size={16} /> Executive Officer
          </button>
        </div>

        {/* Login Form Box */}
        <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '18px', border: authMode === 'executive' ? '1px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--border-color)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)' }}>
          
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: authMode === 'executive' ? '#d97706' : 'var(--primary-600)' }}>
              {authMode === 'executive' ? (
                <> <Shield size={20} /> Executive Portal Sign-In </>
              ) : (
                <> <Lock size={20} /> Member Portal Sign-In </>
              )}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {authMode === 'executive' 
                ? 'Authorized access for Branch Chairmen, Secretaries & Treasurers.'
                : 'Enter your registered phone number or Member ID (e.g., ONY-001) to view your dues & welfare ledgers.'}
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.12)', borderLeft: '4px solid #ef4444', color: '#dc2626', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                {authMode === 'executive' ? 'Officer Phone or Member ID' : 'Registered Phone Number / Member ID'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  placeholder={authMode === 'executive' ? "e.g. 0243430617 or ONY-001" : "e.g. 0244991855 or ONY-002"}
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem', borderRadius: '10px' }}
                  value={phoneOrEmail} 
                  onChange={(e) => setPhoneOrEmail(e.target.value)} 
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Security Password / PIN</label>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>🔑 Enter ANY password (e.g. 1234)</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="Enter any password (e.g. 1234)"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem', borderRadius: '10px' }}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <KeyRound size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn ${authMode === 'executive' ? 'btn-accent' : 'btn-primary'}`} 
              style={{ padding: '0.85rem', fontSize: '0.98rem', fontWeight: 700, borderRadius: '10px', marginTop: '0.5rem', boxShadow: authMode === 'executive' ? '0 4px 14px rgba(217, 119, 6, 0.3)' : '0 4px 14px rgba(5, 150, 105, 0.3)' }}
            >
              Sign In to {authMode === 'executive' ? 'Executive Portal' : 'Member Ledger'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Need registration assistance? Contact your Branch Secretary or call <strong>0244123456</strong>.
          </div>
        </div>

        {/* Collapsible Development Demo Switcher (Discreet & Isolated) */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => setShowDevDrawer(!showDevDrawer)}
            style={{ background: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', padding: '0.4rem 0.85rem', borderRadius: '20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Sparkles size={14} color="#d97706" />
            <span>Developer Account Quick-Switcher</span>
            <ChevronDown size={14} style={{ transform: showDevDrawer ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {showDevDrawer && (
            <div className="glass-card" style={{ marginTop: '0.75rem', padding: '1.25rem', textAlign: 'left', borderRadius: '12px', borderLeft: '4px solid var(--accent-500)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={14} color="#d97706" /> Instant Demo Account Selector (All 25 Members)
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Select any member account extracted from your Excel file to test their member dashboard or executive view:
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  className="form-select" 
                  value={selectedMemberId} 
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.branch}) — {m.role === 'admin' ? '⭐ Executive Officer' : 'Member'}
                    </option>
                  ))}
                </select>

                <button 
                  onClick={() => handleQuickLogin(selectedMemberId)}
                  className="btn btn-accent" 
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                >
                  Quick Log In
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

