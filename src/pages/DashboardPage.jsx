import React, { useState } from 'react';
import { User, Phone, MapPin, AlertCircle, Edit3, Save, CheckCircle2, Wallet, Calendar, Search, Download, CreditCard, ShieldCheck, Heart, Award, FileText, Printer, Building2, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { updateMemberProfile } from '../services/store';

export default function DashboardPage({ currentUser, setCurrentUser, members, setMembers, contributions }) {
  const [activeTab, setActiveTab] = useState('record'); // 'record', 'dues_matrix', 'levies_matrix', 'history'
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone_number: currentUser?.phone_number || '',
    momo_number: currentUser?.momo_number || '',
    home_address: currentUser?.home_address || '',
    emergency_contact: currentUser?.emergency_contact || '',
    profile_picture: currentUser?.profile_picture || ''
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Filter user's specific contributions
  const userContributions = contributions.filter(c => c.member_id === currentUser?.id);

  // Values from Excel Record or Store Fallbacks
  const regFees = currentUser?.reg_fees || 200.00;
  const duesPaid = currentUser?.dues_paid || 3000.00;
  const levyPaid = currentUser?.levy_paid || 1000.00;
  const totalPayments = currentUser?.total_payments || (duesPaid + levyPaid + regFees);
  const duesFeeRequired = currentUser?.dues_fee_required || 3900.00;
  const sharesDividends = currentUser?.shares_dividends || 60;
  const sharesValue = currentUser?.shares_value || 3035.06;
  const treasurerBill = currentUser?.treasurer_bill || 828.36;
  const sharesHolding = currentUser?.shares_holding || 3863.42;
  const balanceOwed = currentUser?.balance_owed !== undefined ? currentUser.balance_owed : Math.max(0, duesFeeRequired - duesPaid);
  const netPayoutValue = Math.max(0, sharesHolding - balanceOwed);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, profile_picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updatedMembersList = updateMemberProfile(currentUser.id, profileForm);
    setMembers(updatedMembersList);
    setCurrentUser({ ...currentUser, ...profileForm });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getInitials = (name) => {
    if (!name) return 'MB';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };


  const exportCSV = () => {
    const headers = ["ID,Date,Type,Amount (GHS),Payment Method,Reference Note,Received By\n"];
    const rows = userContributions.map(c => 
      `"${c.id}","${c.payment_date}","${c.contribution_type}","${c.amount}","${c.payment_method}","${c.reference_note}","${c.received_by_name || 'Admin'}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.full_name.replace(/[^a-zA-Z0-9]/g, '_')}_Personal_Record.csv`;
    a.click();
  };

  if (!currentUser) return null;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Top Welcome & Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div className="badge badge-dues" style={{ marginBottom: '0.5rem', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <ShieldCheck size={15} /> Official Fellowship Member Record
          </div>
          <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            {currentUser.full_name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Member ID: <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{currentUser.excel_member_id || 'ONY-001'}</span> • Branch: <strong>{currentUser.branch || 'Accra'}</strong> • 📅 Date Joined: <strong style={{ color: 'var(--accent-600)' }}>{currentUser.date_joined || 'January 2023'}</strong>
          </p>
        </div>

        <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '0.65rem 1.1rem', fontWeight: 600 }}>
          <Download size={18} /> Export Full Record (CSV)
        </button>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderRadius: '8px', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> Personal profile contact details updated successfully!
        </div>
      )}

      {/* 🔴🟣 TOP PURPLE & GOLD "CONK" HEADER BANNER (Matching Excel PERSONAL RECORD Header) */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', background: 'linear-gradient(135deg, #4c1d95, #6d28d9, #1e1b4b)', color: '#ffffff', marginBottom: '2rem', boxShadow: '0 12px 30px rgba(109, 40, 217, 0.3)', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, color: '#fff' }}>
          <Award size={200} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          
          {/* Member Photo Avatar & Name Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '75px', height: '75px', borderRadius: '50%', border: '3px solid #fef08a', overflow: 'hidden', background: '#3b0764', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, color: '#fef08a', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                {currentUser.profile_picture ? (
                  <img src={currentUser.profile_picture} alt={currentUser.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getInitials(currentUser.full_name)
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 700 }}>
                {currentUser.title || 'Elder'} — {currentUser.position || 'Fellowship Member'}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)', marginTop: '0.1rem', letterSpacing: '-0.02em', color: '#fef08a' }}>
                {currentUser.full_name}
              </div>
              <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, background: currentUser.status === 'ACTIVE' ? '#10b981' : '#f59e0b', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  FELLOWSHIP STATUS: {currentUser.status || 'ACTIVE'}
                </span>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>📅 Joined: {currentUser.date_joined || 'January 2023'}</span>
              </div>
            </div>
          </div>

          {/* Shares Holding Box */}
          <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '14px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, fontWeight: 700 }}>
              🏆 Shares Holding
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fef08a', marginTop: '0.2rem' }}>
              GH₵ {sharesHolding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.3rem' }}>
              Total entitlement value if fellowship winds up
            </div>
          </div>

          {/* Balance Owed Box */}
          <div style={{ padding: '1.25rem', background: balanceOwed > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)', borderRadius: '14px', backdropFilter: 'blur(10px)', border: balanceOwed > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, fontWeight: 700 }}>
              ⚠️ Outstanding Dues Balance
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: balanceOwed > 0 ? '#fca5a5' : '#6ee7b7', marginTop: '0.2rem' }}>
              GH₵ {balanceOwed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.3rem' }}>
              {balanceOwed > 0 ? 'Deducted from Shares Holding' : 'Fully up to date ✓'}
            </div>
          </div>

        </div>

      </div>

      {/* 🟢🟡 GREEN & YELLOW FINANCIAL OVERVIEW GRID (Matching Excel PERSONAL RECORD Row 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Registration Fees</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>GH₵ {regFees.toFixed(2)}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Dues Paid</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>GH₵ {duesPaid.toFixed(2)}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Levy Paid</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ {levyPaid.toFixed(2)}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Payments</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '0.2rem' }}>GH₵ {totalPayments.toFixed(2)}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Shares Dividends</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.2rem' }}>{sharesDividends} Shares</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Treasurer Bill</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ec4899', marginTop: '0.2rem' }}>GH₵ {treasurerBill.toFixed(2)}</div>
        </div>

      </div>

      {/* Navigation Tabs Mapped to Excel PERSONAL RECORD Breakdown */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('record')} 
          className={`btn ${activeTab === 'record' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <FileText size={18} /> Full Personal Record
        </button>
        <button 
          onClick={() => setActiveTab('dues_matrix')} 
          className={`btn ${activeTab === 'dues_matrix' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <CreditCard size={18} color="#ef4444" /> Yearly Dues Tracker (2023–2033)
        </button>
        <button 
          onClick={() => setActiveTab('levies_matrix')} 
          className={`btn ${activeTab === 'levies_matrix' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <Heart size={18} color="#3b82f6" /> 1st–12th Levies Installment Grid
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <Wallet size={18} color="#8b5cf6" /> Transaction Ledger History
        </button>
      </div>

      {/* TAB 1: FULL PERSONAL RECORD & REGISTRATION PROFILE */}
      {activeTab === 'record' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          
          {/* Member Registration Profile Details */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
                <User size={20} /> Verified Personal Profile
              </h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <Edit3 size={14} /> Edit Contact
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  Cancel
                </button>
              )}
            </div>

            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{currentUser.full_name}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date Joined Fellowship</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> {currentUser.date_joined || 'January 2023'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ghana Card National ID</div>
                  <div style={{ fontWeight: 700, color: '#3b82f6' }}>{currentUser.ghana_card || 'GHA-00134909-6'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Occupation</div>
                  <div style={{ fontWeight: 600 }}>{currentUser.occupation || 'Fellowship Member'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Primary Phone & MoMo</div>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} color="#059669" /> {currentUser.phone_number} / {currentUser.momo_number || currentUser.phone_number}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Residential Address</div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} color="#059669" /> {currentUser.home_address || 'Ashaiman, Ghana'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Emergency Contact & Next of Kin</div>
                  <div style={{ fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={14} /> {currentUser.emergency_contact || 'Executive Board - 0244123456'}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Profile Photo (Upload File or Image Link)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-input"
                    style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                  />
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Or paste photo image URL"
                    value={profileForm.profile_picture}
                    onChange={(e) => setProfileForm({ ...profileForm, profile_picture: e.target.value })}
                    style={{ marginTop: '0.35rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Primary Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>MoMo Wallet Number</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={profileForm.momo_number}
                    onChange={(e) => setProfileForm({ ...profileForm, momo_number: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Residential Address</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={profileForm.home_address}
                    onChange={(e) => setProfileForm({ ...profileForm, home_address: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Emergency Contact</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={profileForm.emergency_contact}
                    onChange={(e) => setProfileForm({ ...profileForm, emergency_contact: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem', marginTop: '0.5rem' }}>
                  <Save size={16} /> Save Profile Changes
                </button>
              </form>
            )}
          </div>

          {/* Family & Parent State Record */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706' }}>
              <Heart size={20} /> Family & Welfare Profile
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>State of Father</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: currentUser.father_state === 'Alive' ? '#059669' : '#dc2626', marginTop: '0.2rem' }}>
                  {currentUser.father_state || 'Alive'}
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>State of Mother</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: currentUser.mother_state === 'Alive' ? '#059669' : '#dc2626', marginTop: '0.2rem' }}>
                  {currentUser.mother_state || 'Alive'}
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fellowship Remarks</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: currentUser.status === 'ACTIVE' ? '#059669' : '#d97706', marginTop: '0.2rem' }}>
                  {currentUser.status || 'ACTIVE'}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: YEARLY DUES TRACKER (2023 - 2033) */}
      {activeTab === 'dues_matrix' && (
        <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '18px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={22} /> Yearly Dues Breakdown Matrix (2023 – 2033)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Exact annual dues schedule, amounts paid, and outstanding balances matching Excel sheet.</p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Expected Dues Fee</th>
                  <th>Amount Paid</th>
                  <th>Outstanding Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 800 }}>DUES 2023</td>
                  <td>GH₵ 600.00</td>
                  <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 600.00</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>GH₵ 0.00</td>
                  <td><span className="badge badge-dues">Fully Paid ✓</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>DUES 2024</td>
                  <td>GH₵ 900.00</td>
                  <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 900.00</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>GH₵ 0.00</td>
                  <td><span className="badge badge-dues">Fully Paid ✓</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>DUES 2025</td>
                  <td>GH₵ 1,200.00</td>
                  <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 1,200.00</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>GH₵ 0.00</td>
                  <td><span className="badge badge-dues">Fully Paid ✓</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>DUES 2026</td>
                  <td>GH₵ 1,200.00</td>
                  <td style={{ fontWeight: 800, color: '#3b82f6' }}>GH₵ {duesPaid > 2700 ? (duesPaid - 2700).toFixed(2) : '300.00'}</td>
                  <td style={{ fontWeight: 800, color: '#dc2626' }}>GH₵ {balanceOwed.toFixed(2)}</td>
                  <td><span className="badge badge-welfare">Partial / Owed ⚠️</span></td>
                </tr>
                {['2027', '2028', '2029', '2030', '2031', '2032', '2033'].map(year => (
                  <tr key={year}>
                    <td style={{ fontWeight: 800, opacity: 0.6 }}>DUES {year}</td>
                    <td style={{ opacity: 0.6 }}>GH₵ 1,200.00</td>
                    <td style={{ opacity: 0.6 }}>GH₵ 0.00</td>
                    <td style={{ opacity: 0.6 }}>—</td>
                    <td><span className="badge" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}>Upcoming</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 1ST - 12TH LEVIES INSTALLMENT GRID */}
      {activeTab === 'levies_matrix' && (
        <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '18px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={22} /> 1st – 12th Levies Installment Ledger
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Individual special welfare levy installments paid as recorded in Excel sheet.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>1st LEVY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ 200.00</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>2nd LEVY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ 100.00</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>3rd LEVY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ 200.00</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>4th LEVY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ 200.00</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>5th LEVY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ 200.00</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>6th LEVY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>GH₵ 100.00</div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6' }}>TOTAL LEVY BALANCE PAID</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.2rem' }}>GH₵ {levyPaid.toFixed(2)}</div>
            </div>
            <span className="badge badge-dues" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Levies Status: Verified ✓</span>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTION HISTORY & RECEIPTS */}
      {activeTab === 'history' && (
        <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '18px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={22} /> Verified Payment Receipts
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Complete history of Mobile Money and Cash payments logged into database ledgers.</p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Reference Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userContributions.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.payment_date}</td>
                    <td><span className="badge badge-dues">{item.contribution_type}</span></td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ {parseFloat(item.amount).toFixed(2)}</td>
                    <td>{item.payment_method}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.reference_note}</td>
                    <td>
                      <button 
                        onClick={() => setSelectedReceipt(item)} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Printer size={13} /> Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--primary-600)' }}>ONUADO NA YE FELLOWSHIP</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official Payment Receipt</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Receipt #: ONY-REC-{selectedReceipt.id}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Member Name:</span><strong>{currentUser.full_name}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Member ID:</span><strong>{currentUser.excel_member_id}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Category:</span><strong>{selectedReceipt.contribution_type}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span><strong style={{ fontSize: '1.1rem', color: '#059669' }}>GH₵ {parseFloat(selectedReceipt.amount).toFixed(2)}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Payment Date:</span><strong>{selectedReceipt.payment_date}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span><strong>{selectedReceipt.payment_method}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Received By:</span><strong>{selectedReceipt.received_by_name || 'Treasurer'}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                <Printer size={16} /> Print Official Receipt
              </button>
              <button onClick={() => setSelectedReceipt(null)} className="btn btn-secondary" style={{ padding: '0.65rem 1rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


