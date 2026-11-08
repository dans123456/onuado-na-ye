import React, { useState } from 'react';
import { X, Heart, Shield, CheckCircle2, Save, RotateCcw, Plus, AlertCircle, Sparkles, User } from 'lucide-react';
import { getSpecialLeviesMaster, saveSpecialLeviesMaster, SPECIAL_LEVIES_MASTER } from '../utils/levyData';

export default function SpecialLeviesManagerModal({ isOpen, onClose, members = [], onSaveSuccess }) {
  if (!isOpen) return null;

  const [levies, setLevies] = useState(() => {
    return JSON.parse(JSON.stringify(getSpecialLeviesMaster()));
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleUpdateLevy = (id, field, value) => {
    setLevies(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'amount' ? (parseFloat(value) || 0) : value
        };
      }
      return item;
    }));
  };

  const handleToggleStatus = (id) => {
    setLevies(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'ACTIVE ✓' ? 'RESERVE ⏳' : 'ACTIVE ✓';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleSave = () => {
    saveSpecialLeviesMaster(levies);
    setSuccessMsg('✅ Special Levies Schedule saved successfully! All member portals updated live.');
    if (onSaveSuccess) onSaveSuccess(levies);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Reset all 1st – 12th Levies back to official Excel baseline?')) {
      const resetList = JSON.parse(JSON.stringify(SPECIAL_LEVIES_MASTER));
      setLevies(resetList);
      saveSpecialLeviesMaster(resetList);
      setSuccessMsg('Restored to official Excel schedule baseline.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <div 
        className="glass-card"
        style={{ 
          width: '100%', 
          maxWidth: '850px', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column', 
          borderRadius: '20px', 
          border: '1.5px solid rgba(59, 130, 246, 0.4)', 
          background: 'var(--bg-card)', 
          backgroundColor: 'var(--bg-card)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)', 
          isolation: 'isolate', 
          overflow: 'hidden' 
        }}
      >
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(5, 150, 105, 0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Heart size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Executive Special Levies Schedule Manager
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Set Beneficiaries (Person Raised For), Standard Call-Up Target Rates (GH₵), & Active Status for 1st – 12th Levies
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(5, 150, 105, 0.12)', borderBottom: '1px solid rgba(5, 150, 105, 0.3)', color: '#059669', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Scrollable Schedule Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            💡 <strong>Executive Guide:</strong> When a new member support call-up begins (e.g. 8th Levy), change its status to <strong>ACTIVE ✓</strong>, select or type the <strong>Beneficiary Name</strong>, and enter the <strong>Target Rate</strong> (e.g. GH₵ 200). That beneficiary is automatically exempt from paying their own levy, and all member portals will show the new card live.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.85rem' }}>
            {levies.map((levy) => {
              const isActive = levy.status === 'ACTIVE ✓' || levy.status?.includes('ACTIVE');
              return (
                <div 
                  key={levy.id}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: isActive ? '1.5px solid #2563eb' : '1px solid var(--border-color)', 
                    background: isActive ? 'rgba(59, 130, 246, 0.04)' : 'var(--bg-main)',
                    boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.1)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  {/* Top Bar of Levy Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: isActive ? '#2563eb' : 'var(--text-muted)' }}>
                        {levy.number}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: '#059669', color: '#fff', fontWeight: 800 }}>
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(levy.id)}
                      style={{
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: 'none',
                        background: isActive ? 'rgba(5, 150, 105, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                        color: isActive ? '#059669' : 'var(--text-muted)'
                      }}
                      title="Click to toggle Active / Reserve"
                    >
                      {isActive ? '🟢 Active Call-Up' : '⏳ Reserve Slot'}
                    </button>
                  </div>

                  {/* Beneficiary Field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Beneficiary (Person Raised For):
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input 
                        type="text"
                        value={levy.recipient}
                        onChange={(e) => handleUpdateLevy(levy.id, 'recipient', e.target.value)}
                        placeholder="e.g. ELD. OSEI KWAME or Fellowship Reserve"
                        className="form-input"
                        style={{ flex: 1, padding: '0.45rem 0.65rem', fontSize: '0.82rem', borderRadius: '8px', fontWeight: 700 }}
                      />
                      
                      {/* Quick Member Selector */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleUpdateLevy(levy.id, 'recipient', e.target.value);
                            if (levy.amount === 0) handleUpdateLevy(levy.id, 'amount', 200);
                            if (!isActive) handleUpdateLevy(levy.id, 'status', 'ACTIVE ✓');
                          }
                        }}
                        style={{ width: '38px', padding: '0.2rem', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
                        title="Pick from registered members list"
                        value=""
                      >
                        <option value="" disabled>👤</option>
                        {members.map(m => (
                          <option key={m.id} value={`ELD. ${m.full_name.toUpperCase()}`}>
                            {m.full_name} ({m.branch})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Target Rate (GH₵) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        Standard Target Rate (GH₵):
                      </label>
                      <input 
                        type="number"
                        step="10"
                        min="0"
                        value={levy.amount}
                        onChange={(e) => handleUpdateLevy(levy.id, 'amount', e.target.value)}
                        placeholder="e.g. 200"
                        className="form-input"
                        style={{ width: '100%', padding: '0.45rem 0.65rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: '8px' }}
                      />
                    </div>

                    {/* Quick rate shortcut buttons */}
                    <div style={{ display: 'flex', gap: '0.3rem', alignSelf: 'flex-end', paddingBottom: '2px' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateLevy(levy.id, 'amount', 100)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, borderRadius: '6px', border: '1px solid var(--border-color)', background: levy.amount === 100 ? '#2563eb' : 'transparent', color: levy.amount === 100 ? '#fff' : 'var(--text-main)', cursor: 'pointer' }}
                      >
                        100
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateLevy(levy.id, 'amount', 200)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, borderRadius: '6px', border: '1px solid var(--border-color)', background: levy.amount === 200 ? '#2563eb' : 'transparent', color: levy.amount === 200 ? '#fff' : 'var(--text-main)', cursor: 'pointer' }}
                      >
                        200
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'var(--bg-main)' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}
          >
            <RotateCcw size={14} /> Reset to Defaults
          </button>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem', fontWeight: 800, background: 'linear-gradient(135deg, #2563eb, #059669)', border: 'none', color: '#fff', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Save size={16} /> Save All Levies Schedule
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

