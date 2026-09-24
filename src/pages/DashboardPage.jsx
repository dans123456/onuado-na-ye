import React, { useState } from 'react';
import { User, Phone, MapPin, AlertCircle, Edit3, Save, CheckCircle2, Wallet, Calendar, Search, Download, CreditCard, ShieldCheck } from 'lucide-react';
import { updateMemberProfile } from '../services/store';

export default function DashboardPage({ currentUser, setCurrentUser, members, setMembers, contributions }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone_number: currentUser?.phone_number || '',
    momo_number: currentUser?.momo_number || '',
    home_address: currentUser?.home_address || '',
    emergency_contact: currentUser?.emergency_contact || ''
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter state for contribution table
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filter user's specific contributions
  const userContributions = contributions.filter(c => c.member_id === currentUser?.id);

  // Calculations
  const totalDues = userContributions
    .filter(c => c.contribution_type === 'Monthly Dues')
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  const totalWelfare = userContributions
    .filter(c => c.contribution_type === 'Welfare Fund')
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  const totalDonations = userContributions
    .filter(c => c.contribution_type === 'Special Donation')
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  const grandTotal = totalDues + totalWelfare + totalDonations;

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updatedMembersList = updateMemberProfile(currentUser.id, profileForm);
    setMembers(updatedMembersList);
    setCurrentUser({ ...currentUser, ...profileForm });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredLedger = userContributions.filter(item => {
    const matchesSearch = 
      item.reference_note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contribution_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || item.contribution_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const headers = ["ID,Date,Type,Amount (GHS),Payment Method,Reference Note,Received By\n"];
    const rows = userContributions.map(c => 
      `"${c.id}","${c.payment_date}","${c.contribution_type}","${c.amount}","${c.payment_method}","${c.reference_note}","${c.received_by_name || 'Admin'}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.full_name.replace(/[^a-zA-Z0-9]/g, '_')}_Contributions.csv`;
    a.click();
  };

  if (!currentUser) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Header Welcome Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div className="badge badge-dues" style={{ marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> Member Portal Access
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Welcome back, {currentUser.full_name}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Member ID: <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{currentUser.excel_member_id || 'ONY-MBR'}</span> | Role: <strong>{currentUser.role === 'admin' ? 'Executive Admin' : 'Fellowship Member'}</strong>
          </p>
        </div>

        <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '0.65rem 1.1rem' }}>
          <Download size={18} /> Export Contribution Ledger (CSV)
        </button>
      </div>

      {savedSuccess && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderRadius: '0.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> Personal profile details updated successfully!
        </div>
      )}

      {/* Financial Overview Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Contributions</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '0.2rem' }}>
            GH₵ {grandTotal.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Cumulative lifetime payments</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Monthly Dues</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            GH₵ {totalDues.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Dues ledger balance</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Welfare Fund</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-600)', marginTop: '0.2rem' }}>
            GH₵ {totalWelfare.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Emergency & celebration support</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Special Donations</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.2rem' }}>
            GH₵ {totalDonations.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Voluntary project support</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Profile Card (Left) */}
        <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="#059669" /> Member Profile Info
            </h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                <Edit3 size={14} /> Edit
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{currentUser.full_name}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Phone Number</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="#059669" /> {currentUser.phone_number || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MoMo Number</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={14} color="#d97706" /> {currentUser.momo_number || currentUser.phone_number}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Residential Address</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="#059669" /> {currentUser.home_address || 'Not specified'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Emergency Contact</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={14} color="#dc2626" /> {currentUser.emergency_contact || 'Not specified'}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Phone Number</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>MoMo Number</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={profileForm.momo_number}
                  onChange={(e) => setProfileForm({ ...profileForm, momo_number: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Residential Address</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={profileForm.home_address}
                  onChange={(e) => setProfileForm({ ...profileForm, home_address: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Emergency Contact</label>
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

        {/* Contribution Ledger Table (Right) */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={20} color="#d97706" /> Contribution Ledger History
            </h2>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select 
                className="form-select" 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Categories</option>
                <option value="Monthly Dues">Monthly Dues</option>
                <option value="Welfare Fund">Welfare Fund</option>
                <option value="Special Donation">Special Donation</option>
              </select>

              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search ledger..."
                  className="form-input"
                  style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem', width: '180px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          {filteredLedger.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No payments found matching your filter options.
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference / Note</th>
                    <th>Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLedger.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{item.payment_date}</td>
                      <td>
                        <span className={`badge ${
                          item.contribution_type === 'Monthly Dues' ? 'badge-dues' : 
                          item.contribution_type === 'Welfare Fund' ? 'badge-welfare' : 'badge-donation'
                        }`}>
                          {item.contribution_type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary-600)' }}>
                        GH₵ {parseFloat(item.amount).toFixed(2)}
                      </td>
                      <td>{item.payment_method}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.reference_note || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.received_by_name || 'Admin'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
