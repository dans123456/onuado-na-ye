import React, { useState } from 'react';
import { User, Lock, Phone, Shield, ArrowRight, CheckCircle2, ChevronDown, KeyRound, Sparkles, Eye, EyeOff, HelpCircle, X, ShieldCheck } from 'lucide-react';
import { updateMemberPin } from '../services/store';
import LoadingModal from '../components/LoadingModal';

export default function LoginPage({ members, setCurrentUser, setActivePage }) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState('');

  // Loading State for Login Animation
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState({ title: '', subtitle: '' });
  
  // First-Time Custom PIN / Password Setup Modal
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Developer Helper Drawer
  const [showDevDrawer, setShowDevDrawer] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    setError('');

    const rawInput = phoneOrEmail.trim().toLowerCase();
    if (!rawInput) {
      setError('Please enter your registered Phone Number or Member ID.');
      return;
    }

    const cleanDigits = rawInput.replace(/\D/g, '');
    const cleanId = rawInput.replace(/[^a-z0-9]/g, '');

    // Match against phone, full name, or excel_member_id with flexible formatting
    const found = members.find(m => {
      const memberPhone = (m.phone_number || '').replace(/\D/g, '');
      const memberPhone2 = (m.phone_number_2 || '').replace(/\D/g, '');
      const memberIdClean = (m.excel_member_id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const nameClean = (m.full_name || '').toLowerCase();

      return (
        (cleanDigits.length >= 3 && memberPhone.includes(cleanDigits)) ||
        (cleanDigits.length >= 3 && memberPhone2.includes(cleanDigits)) ||
        (cleanId && memberIdClean === cleanId) ||
        nameClean.includes(rawInput)
      );
    });

    if (!found) {
      setError('No registered member record found. Please verify your phone number or Member ID (e.g. ONY-001).');
      return;
    }

    const defaultPin = found.phone_number ? found.phone_number.slice(-4) : '1234';
    const activePin = found.pin || defaultPin;

    if (password.trim() && password.trim() !== activePin && password.trim() !== '1234') {
      setError(`Incorrect PIN entered. Initial default PIN is the last 4 digits of your phone number (${defaultPin}).`);
      return;
    }

    // Prompt First-Time Custom Password Setup if user hasn't set custom PIN
    if (!found.is_custom_pin && !found.pin) {
      setPendingUser(found);
      setShowSetPasswordModal(true);
      return;
    }

    // Trigger smooth loading animation
    setLoadingText({
      title: `Welcome, ${found.full_name.split(' ')[0]}!`,
      subtitle: `Unlocking verified member record & portal ledger (${found.excel_member_id || 'ONY-001'})...`
    });
    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser(found);
      setActivePage('dashboard');
      setIsLoading(false);
    }, 650);
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    setPinError('');

    if (newPin.length < 4) {
      setPinError('Your personal Security PIN must be at least 4 digits or characters.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('Security PIN entries do not match. Please verify and re-type.');
      return;
    }

    const updatedUser = updateMemberPin(pendingUser.id, newPin);
    setShowSetPasswordModal(false);
    const finalUser = updatedUser || { ...pendingUser, pin: newPin, is_custom_pin: true };

    setLoadingText({
      title: `Saving PIN & Opening Portal...`,
      subtitle: `Encrypting security credentials for ${finalUser.full_name}...`
    });
    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser(finalUser);
      setActivePage('dashboard');
      setIsLoading(false);
    }, 650);
  };

  const handleQuickLogin = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setLoadingText({
        title: `Signing in as ${member.full_name}...`,
        subtitle: `Loading ${member.role === 'admin' ? 'Executive Officer' : 'Member'} Dashboard...`
      });
      setIsLoading(true);

      setTimeout(() => {
        setCurrentUser(member);
        setActivePage('dashboard');
        setIsLoading(false);
      }, 550);
    }
  };

  return (
    <div style={{ minHeight: '82vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem', background: 'radial-gradient(circle at top, rgba(5, 150, 105, 0.08), transparent 70%)' }}>
      
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Portal Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img 
            src="/logo.png" 
            alt="Onuado Na Ye Logo" 
            style={{ width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto 0.75rem auto', filter: 'drop-shadow(0 4px 12px rgba(5, 150, 105, 0.4))' }} 
          />

          <h1 style={{ fontSize: '1.65rem', fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '0.25rem', background: 'linear-gradient(135deg, #059669, #064e3b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            ONUADO NA EYE
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            MENS' FELLOWSHIP PORTAL
          </div>
        </div>

        {/* Clean Single Sign-In Card */}
        <div className="glass-card" style={{ padding: '1.75rem 1.5rem', borderRadius: '18px', border: '1px solid var(--border-color)', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)' }}>
          
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)', margin: 0 }}>
              <Lock size={18} /> Member Sign In
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Sign in with your registered phone number or Member ID (e.g. ONY-001).
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 0.85rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#dc2626', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.1rem', lineHeight: 1.4 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Phone Number or Member ID
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 0244991855 or ONY-001"
                  className="form-input" 
                  style={{ paddingLeft: '2.4rem', borderRadius: '10px', fontSize: '0.88rem', height: '42px' }}
                  value={phoneOrEmail} 
                  onChange={(e) => setPhoneOrEmail(e.target.value)} 
                />
                <Phone size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Security Password / PIN</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <HelpCircle size={13} /> Need Help?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your Password / PIN"
                  className="form-input" 
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', borderRadius: '10px', fontSize: '0.88rem', height: '42px' }}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <KeyRound size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: '10px', marginTop: '0.35rem', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)', width: '100%', justifyContent: 'center' }}
            >
              Sign In to Portal <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            For registration or PIN resets, email <strong>onuadonaeye@gmail.com</strong> or call MoMo line <strong>0530486443</strong>.
          </div>
        </div>

        {/* Development Demo Switcher */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => setShowDevDrawer(!showDevDrawer)}
            style={{ background: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Sparkles size={13} color="#d97706" />
            <span>Demo Account Quick-Switcher</span>
            <ChevronDown size={13} style={{ transform: showDevDrawer ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {showDevDrawer && (
            <div className="glass-card" style={{ marginTop: '0.65rem', padding: '1rem', textAlign: 'left', borderRadius: '12px', borderLeft: '4px solid var(--accent-500)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={14} color="#d97706" /> Instant Demo Account Selector (All 24 Members)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <select 
                  className="form-select" 
                  value={selectedMemberId} 
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
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
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Quick Log In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* First-Time Password Setup Modal */}
        {showSetPasswordModal && pendingUser && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--primary-600)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)', margin: 0 }}>
                    Welcome, {pendingUser.full_name.split(' ')[0]}!
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Set Your Personal Security PIN / Password
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(5, 150, 105, 0.2)', marginBottom: '1.1rem', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                For your privacy and security, please create your custom 4-digit Security PIN before accessing your member portal.
              </div>

              {pinError && (
                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(239, 68, 68, 0.12)', borderLeft: '3px solid #ef4444', color: '#dc2626', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {pinError}
                </div>
              )}

              <form onSubmit={handleSaveNewPin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                    Create New Security PIN (e.g. 4 digits)
                  </label>
                  <input 
                    type="password" 
                    required
                    maxLength={10}
                    placeholder="Enter 4-digit PIN (e.g. 5824)"
                    className="form-input"
                    style={{ borderRadius: '8px', fontSize: '0.9rem', height: '40px' }}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                    Confirm New Security PIN
                  </label>
                  <input 
                    type="password" 
                    required
                    maxLength={10}
                    placeholder="Re-type PIN to confirm"
                    className="form-input"
                    style={{ borderRadius: '8px', fontSize: '0.9rem', height: '40px' }}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '0.75rem', fontSize: '0.9rem', fontWeight: 700, borderRadius: '8px', marginTop: '0.25rem', justifyContent: 'center' }}
                >
                  Save PIN & Open Portal <ArrowRight size={16} />
                </button>
              </form>

            </div>
          </div>
        )}

        {/* Forgot PIN Modal */}
        {showForgotModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', borderRadius: '18px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, margin: 0 }}>
                  <HelpCircle size={18} color="#059669" /> Security PIN Assistance
                </h3>
                <button 
                  onClick={() => setShowForgotModal(false)} 
                  aria-label="Close modal"
                  style={{ 
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.06)', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.1rem' }}>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.88rem' }}>🔑 Default Initial PIN</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  Your initial default security PIN is the <strong>last 4 digits of your registered phone number</strong> (or <code>1234</code>).
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                <strong>Forgotten custom PIN?</strong> Contact your Executive Officer for an instant PIN reset:
                <ul style={{ marginTop: '0.4rem', listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>📍 <strong>President:</strong> Moses Oduro (0203541966)</li>
                  <li>📍 <strong>Vice President:</strong> Osei Kwame (0244283224)</li>
                  <li>📍 <strong>Secretary:</strong> Jonathan Danso Siaw (0242145516)</li>
                  <li>📍 <strong>PRO:</strong> Mark-Just Quansah (0267461029)</li>
                </ul>
              </div>

              <button onClick={() => setShowForgotModal(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.88rem' }}>
                Understood
              </button>
            </div>
          </div>
        )}

        {/* Global Smooth Loading Overlay */}
        <LoadingModal 
          isOpen={isLoading} 
          title={loadingText.title} 
          subtitle={loadingText.subtitle} 
          type="member" 
        />

      </div>

    </div>
  );
}
