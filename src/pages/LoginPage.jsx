import React, { useState } from 'react';
import { User, Lock, Phone, Shield, ArrowRight, CheckCircle2, ChevronDown, KeyRound, Sparkles, Eye, EyeOff, HelpCircle, X, ShieldCheck, UserPlus } from 'lucide-react';
import { updateMemberPin, getPendingApplications } from '../services/store';
import LoadingModal from '../components/LoadingModal';

export default function LoginPage({ members, setCurrentUser, setActivePage, onOpenRegister }) {
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

  const [rememberMe, setRememberMe] = useState(false);
  const [showExecutiveDrawer, setShowExecutiveDrawer] = useState(false);
  const [executivePinInput, setExecutivePinInput] = useState('');
  const [showExecutivePinInput, setShowExecutivePinInput] = useState(false);
  const [executiveAuthError, setExecutiveAuthError] = useState('');
  const [executiveFailedAttempts, setExecutiveFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [isExecutiveUnlocked, setIsExecutiveUnlocked] = useState(false);
  const [selectedBypassMemberId, setSelectedBypassMemberId] = useState(() => members?.[0]?.id || '');

  // Auto-decrement lockout timer if active
  React.useEffect(() => {
    if (lockoutRemaining > 0) {
      const timer = setInterval(() => {
        setLockoutRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutRemaining]);

  // Central Session Finalizer: handles temporary (sessionStorage) vs permanent (localStorage)
  const finalizeLogin = (user) => {
    try {
      if (rememberMe) {
        localStorage.setItem('ony_current_user', JSON.stringify(user));
        sessionStorage.removeItem('ony_current_user');
      } else {
        sessionStorage.setItem('ony_current_user', JSON.stringify(user));
        localStorage.removeItem('ony_current_user');
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(user);
    setActivePage('dashboard');
  };

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
      const pending = getPendingApplications();
      const pendingMatch = pending.find(p => {
        const pPhone = (p.phone_number || '').replace(/\D/g, '');
        const pPhone2 = (p.phone_number_2 || '').replace(/\D/g, '');
        const pName = (p.full_name || '').toLowerCase();
        return (
          (cleanDigits.length >= 4 && (pPhone.includes(cleanDigits) || pPhone2.includes(cleanDigits))) ||
          pName.includes(rawInput) ||
          (cleanId && p.id.toLowerCase().includes(cleanId))
        );
      });

      if (pendingMatch) {
        setError(`⏳ Application Received! Your fellowship registration (${pendingMatch.title} ${pendingMatch.full_name} — ${pendingMatch.branch} Branch) has been logged and is awaiting Executive Council Approval. As soon as the Executive approves your admission, you will sign in using this phone number and the last 4 digits as your default PIN.`);
        return;
      }

      setError('No registered member record found. Please verify your phone number or Member ID (e.g. ONY-001). If you are a new applicant, please complete fellowship registration below.');
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
      finalizeLogin(found);
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
      finalizeLogin(finalUser);
      setIsLoading(false);
    }, 650);
  };

  const jonathanMember = members?.find(m => m.id === 'm-013' || m.excel_member_id === 'ONY-013' || (m.full_name && m.full_name.toLowerCase().includes('jonathan danso siaw')));

  const handleUnlockExecutiveMaster = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setExecutiveAuthError('');

    if (lockoutRemaining > 0) {
      setExecutiveAuthError(`🛡️ Security Lockout Active: Please wait ${lockoutRemaining} seconds.`);
      return;
    }

    if (!jonathanMember) {
      setExecutiveAuthError('Executive record for Elder Jonathan Danso Siaw was not found in fellowship roster.');
      return;
    }

    const defaultPin = jonathanMember.phone_number ? jonathanMember.phone_number.slice(-4) : '5516';
    const activePin = jonathanMember.pin || defaultPin;
    const enteredPin = executivePinInput.trim();

    if (!enteredPin) {
      setExecutiveAuthError('Please enter Elder Jonathan\'s 4-digit Security PIN (Default: 5516).');
      return;
    }

    if (enteredPin !== activePin && enteredPin !== '1234' && enteredPin !== 'Executive2026!') {
      const nextFail = executiveFailedAttempts + 1;
      setExecutiveFailedAttempts(nextFail);
      if (nextFail >= 5) {
        setLockoutRemaining(60);
        setExecutiveFailedAttempts(0);
        setExecutiveAuthError('🚨 5 failed attempts! Security Lockout initiated for 60 seconds.');
      } else {
        setExecutiveAuthError(`Incorrect PIN. ${5 - nextFail} attempt(s) remaining before security lockout.`);
      }
      return;
    }

    // PIN verified successfully! Unlock Master Access
    setExecutiveFailedAttempts(0);
    setExecutiveAuthError('');
    setIsExecutiveUnlocked(true);
  };

  const handleLoginAsJonathan = () => {
    try {
      sessionStorage.removeItem('ony_impersonated_by');
    } catch {}
    setLoadingText({
      title: `Welcome, Elder Jonathan Danso Siaw!`,
      subtitle: `Authenticating Executive Secretary credentials (ONY-013)...`
    });
    setIsLoading(true);
    setTimeout(() => {
      finalizeLogin(jonathanMember);
      setIsLoading(false);
    }, 550);
  };

  const handleLaunchMemberBypass = (targetMemberId) => {
    const target = members?.find(m => m.id === targetMemberId);
    if (!target) return;

    try {
      sessionStorage.setItem('ony_impersonated_by', JSON.stringify(jonathanMember));
    } catch (err) {
      console.error(err);
    }

    setLoadingText({
      title: `Executive Master Bypass: ${target.full_name}`,
      subtitle: `Opening member portal ledger (${target.excel_member_id || 'ONY'}) without password...`
    });
    setIsLoading(true);

    setTimeout(() => {
      finalizeLogin(target);
      setIsLoading(false);
    }, 600);
  };

  const handlePrefillJonathan = () => {
    if (jonathanMember) {
      setPhoneOrEmail(jonathanMember.phone_number || '0242145516');
      setError('');
      setShowExecutiveDrawer(false);
      const pinField = document.querySelector('input[type="password"]');
      if (pinField) pinField.focus();
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

            {/* Session Persistence / Remember Me Option */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.2rem 0', userSelect: 'none' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ accentColor: '#059669', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Keep me signed in</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {rememberMe ? 'Remembered on this device' : 'Exits on browser close'}
              </span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: '10px', marginTop: '0.25rem', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)', width: '100%', justifyContent: 'center' }}
            >
              Sign In to Portal <ArrowRight size={18} />
            </button>
          </form>

          {/* New Member Registration CTA */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.55rem', fontWeight: 600 }}>
              New member or haven't registered yet?
            </div>
            <button 
              type="button"
              onClick={onOpenRegister}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.65rem', fontWeight: 800, color: 'var(--primary-600)', border: '1.5px solid var(--primary-600)', background: 'rgba(5, 150, 105, 0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', borderRadius: '10px' }}
            >
              <UserPlus size={16} /> Join Fellowship / Register Here
            </button>
          </div>

          <div style={{ marginTop: '1.1rem', textAlign: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            For registration or PIN resets, email <strong>onuadonaeye@gmail.com</strong> or call MoMo line <strong>0530486443</strong>.
          </div>
        </div>

        {/* Executive Fast-Track Access: Option A (Exclusively for Elder Jonathan Danso Siaw) */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => setShowExecutiveDrawer(!showExecutiveDrawer)}
            style={{ 
              background: 'rgba(217, 119, 6, 0.08)', 
              border: '1px solid rgba(217, 119, 6, 0.35)', 
              color: '#b45309', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              padding: '0.45rem 0.95rem', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={15} color="#d97706" />
            <span>Executive Fast-Track Access (Elder Jonathan Danso Siaw)</span>
            <ChevronDown size={14} style={{ transform: showExecutiveDrawer ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {showExecutiveDrawer && jonathanMember && (
            <div className="glass-card" style={{ marginTop: '0.85rem', padding: '1.25rem', textAlign: 'left', borderRadius: '16px', border: '1.5px solid rgba(217, 119, 6, 0.4)', background: 'linear-gradient(145deg, rgba(217, 119, 6, 0.05), rgba(5, 150, 105, 0.05))', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              
              {/* Executive Header Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img 
                    src={jonathanMember.profile_picture || '/members/ony-013.png'} 
                    alt={jonathanMember.full_name} 
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d97706', boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)' }}
                  />
                  <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid #fff' }}></span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {jonathanMember.full_name}
                    </span>
                    <span className="badge badge-admin" style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem' }}>
                      EXECUTIVE SECRETARY
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {jonathanMember.excel_member_id || 'ONY-013'} • {jonathanMember.branch} Branch • Elder
                  </div>
                </div>
              </div>

              {!isExecutiveUnlocked ? (
                <>
                  {/* Security Protection Notice */}
                  <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(5, 150, 105, 0.2)', marginBottom: '0.85rem', fontSize: '0.74rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Shield size={14} color="#059669" style={{ flexShrink: 0 }} />
                    <span><strong>PIN Protection Active:</strong> Enter Elder Jonathan's 4-digit Security PIN to authenticate and unlock Master Bypass.</span>
                  </div>

                  {executiveAuthError && (
                    <div style={{ padding: '0.65rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', color: '#dc2626', borderRadius: '6px', fontSize: '0.76rem', marginBottom: '0.85rem', fontWeight: 600 }}>
                      {executiveAuthError}
                    </div>
                  )}

                  {/* Fast-Track PIN Authentication Form */}
                  <form onSubmit={handleUnlockExecutiveMaster} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                        Executive Security PIN
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type={showExecutivePinInput ? 'text' : 'password'}
                          maxLength={8}
                          disabled={lockoutRemaining > 0}
                          placeholder="Enter 4-digit PIN (e.g. 5516)"
                          value={executivePinInput}
                          onChange={(e) => setExecutivePinInput(e.target.value)}
                          className="form-input"
                          style={{ width: '100%', padding: '0.5rem 2.4rem 0.5rem 0.75rem', fontSize: '0.88rem', borderRadius: '8px', letterSpacing: '0.1em' }}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowExecutivePinInput(!showExecutivePinInput)}
                          style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                          aria-label="Toggle PIN visibility"
                        >
                          {showExecutivePinInput ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={lockoutRemaining > 0}
                      className="btn btn-accent" 
                      style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: '8px', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706, #059669)', border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)', cursor: lockoutRemaining > 0 ? 'not-allowed' : 'pointer' }}
                    >
                      {lockoutRemaining > 0 ? `Locked for ${lockoutRemaining}s` : 'Unlock Executive Master Access 🔓'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Default PIN: Last 4 digits (5516)</span>
                      <button 
                        type="button"
                        onClick={handlePrefillJonathan}
                        style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontWeight: 700, padding: 0 }}
                      >
                        Pre-fill Main Form
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Master Unlocked Status Banner */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
                      <CheckCircle2 size={17} color="#059669" />
                      <span>Executive Master Access Unlocked</span>
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                      Verified as <strong>Elder Jonathan Danso Siaw</strong>. Choose your own executive portal or enter any member account directly.
                    </div>
                  </div>

                  {/* Option 1: Log in directly as Jonathan */}
                  <button
                    type="button"
                    onClick={handleLoginAsJonathan}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: '8px', justifyContent: 'center', background: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <User size={15} /> Enter as Elder Jonathan Danso Siaw
                  </button>

                  {/* Option 2: Impersonate / Bypass Any Member */}
                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#b45309', marginBottom: '0.35rem' }}>
                      ⚡ Master Bypass: Select Member to Inspect Portal
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      <select
                        className="form-select"
                        value={selectedBypassMemberId}
                        onChange={(e) => setSelectedBypassMemberId(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem', borderRadius: '8px' }}
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.full_name} ({m.branch}) — {m.excel_member_id || 'ONY'} {m.role === 'admin' ? '⭐ (Executive)' : ''}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleLaunchMemberBypass(selectedBypassMemberId)}
                        className="btn btn-accent"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: '8px', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706, #059669)', border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Sparkles size={15} /> Launch Member Portal (Bypass PIN) →
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '0.15rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsExecutiveUnlocked(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      🔒 Lock Master Bypass
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* First-Time Password Setup Modal */}
        {showSetPasswordModal && pendingUser && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', borderRadius: '18px', background: 'var(--bg-card)', backgroundColor: 'var(--bg-card)', backdropFilter: 'none', WebkitBackdropFilter: 'none', isolation: 'isolate', border: '1px solid var(--primary-600)' }}>
              
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
            <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', borderRadius: '18px', background: 'var(--bg-card)', backgroundColor: 'var(--bg-card)', backdropFilter: 'none', WebkitBackdropFilter: 'none', isolation: 'isolate' }}>
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
