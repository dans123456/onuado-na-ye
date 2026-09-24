import React, { useState } from 'react';
import { User, Lock, Phone, Shield, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export default function LoginPage({ members, setCurrentUser, setActivePage }) {
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    setError('');

    // Match input phone number or email or name against members list
    const found = members.find(m => 
      m.phone_number.includes(phoneOrEmail.trim()) || 
      m.full_name.toLowerCase().includes(phoneOrEmail.trim().toLowerCase()) ||
      (m.excel_member_id && m.excel_member_id.toLowerCase() === phoneOrEmail.trim().toLowerCase())
    );

    if (found) {
      setCurrentUser(found);
      setActivePage(found.role === 'admin' ? 'admin' : 'dashboard');
    } else {
      setError('Member not found. Select a member from the quick login selector below or enter a valid registered phone number.');
    }
  };

  const handleQuickLogin = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setCurrentUser(member);
      setActivePage(member.role === 'admin' ? 'admin' : 'dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-dues" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          Secure Authentication
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Fellowship Member Portal Sign-In</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Sign in to view your personal contribution ledger, historical dues, and update profile details.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Box: Standard Login */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="#059669" /> Enter Credentials
          </h2>

          {error && (
            <div style={{ padding: '0.85rem', background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Phone Number or Unique Member ID
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 0244123456 or ONY-001"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={phoneOrEmail} 
                  onChange={(e) => setPhoneOrEmail(e.target.value)} 
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              Sign In to Portal <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Right Box: 1-Click Quick Demo Login for testing */}
        <div className="glass-card glass-card-glow" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-500)' }}>
          <div className="badge badge-welfare" style={{ marginBottom: '0.75rem' }}>
            <UserCheck size={14} /> Quick Demo Selector (All 24 Members)
          </div>

          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select Any Account to Log In Instantly</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Choose an account from our 24 fellowship members to test member views or admin features:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Choose Member Account:</label>
            <select 
              className="form-select" 
              value={selectedMemberId} 
              onChange={(e) => setSelectedMemberId(e.target.value)}
              style={{ padding: '0.75rem' }}
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.phone_number}) — {m.role === 'admin' ? '⭐ Admin' : 'Member'}
                </option>
              ))}
            </select>

            <button 
              onClick={() => handleQuickLogin(selectedMemberId)}
              className="btn btn-accent" 
              style={{ padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
            >
              Log In as Selected Member
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Admin Accounts:</strong> Kwesi Mensah (Chairman) & Abena Osei (Treasurer) have Admin access to `/admin` for manual transaction logging & Excel bulk imports.
          </div>
        </div>

      </div>

    </div>
  );
}
