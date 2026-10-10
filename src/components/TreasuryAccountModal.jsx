import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Building2, TrendingUp, TrendingDown, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { getTreasuryAccountsData, addTreasuryTransaction, deleteTreasuryTransaction, resetTreasuryAccountToBaseline, calculateTreasuryTotals } from '../services/store';

export default function TreasuryAccountModal({ isOpen, onClose, accountKey, onAccountUpdated }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('inflow'); // 'inflow' or 'outflow'
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  if (!isOpen || !accountKey) return null;

  const rawData = getTreasuryAccountsData();
  const accountData = rawData[accountKey] || {};
  const totals = calculateTreasuryTotals(rawData)[accountKey] || {};
  const customTransactions = accountData.customTransactions || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a short description or reference.');
      return;
    }

    addTreasuryTransaction(accountKey, {
      description,
      amount: parsedAmount,
      type,
      date
    });

    setDescription('');
    setAmount('');
    setError('');
    if (onAccountUpdated) onAccountUpdated();
  };

  const handleDelete = (txId) => {
    if (window.confirm('Are you sure you want to delete this ledger entry? The balances will automatically recalculate.')) {
      deleteTreasuryTransaction(accountKey, txId);
      if (onAccountUpdated) onAccountUpdated();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this account ledger back to original Excel baseline totals? All added entries will be cleared.')) {
      resetTreasuryAccountToBaseline(accountKey);
      if (onAccountUpdated) onAccountUpdated();
    }
  };

  const getAccountLabel = () => {
    switch (accountKey) {
      case 'momo': return 'MTN Mobile Money Account';
      case 'fidelity': return 'Fidelity Bank Ghana Account';
      case 'bankTema': return 'North Tema Credit Union Account';
      case 'pettyCashVehicle': return 'Petty Cash Vehicle Fund';
      default: return 'Treasury Account';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-responsive-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                {getAccountLabel()}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Manage Transactions & Live Balance Recalculation
              </div>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Current Balance Summary Box */}
        <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(37, 99, 235, 0.08))', border: '1.5px solid rgba(5, 150, 105, 0.3)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Current Net Ending Balance
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: totals.endingBalance >= 0 ? '#059669' : '#dc2626', fontFamily: 'var(--font-heading)', marginTop: '0.15rem' }}>
              GH₵ {(totals.endingBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 700, color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            title="Reset back to baseline Excel sheet numbers"
          >
            <RotateCcw size={14} /> Reset to Baseline
          </button>
        </div>

        {/* Form to Add New Entry */}
        <form onSubmit={handleAddSubmit} style={{ padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} /> Add New Ledger Transaction / Outflow
          </div>

          {error && (
            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Transaction Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="inflow">➕ Inflow / Deposit (+)</option>
                <option value="outflow">➖ Outflow / Disbursement (−)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Amount (GH₵)</label>
              <input 
                type="number"
                step="0.01"
                required
                placeholder="e.g. 250.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Date</label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Particulars / Reference Description</label>
            <input 
              type="text"
              required
              placeholder="e.g. Bank Service Charge / Member MoMo Disbursement"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.65rem', fontWeight: 800, fontSize: '0.88rem', background: '#059669', borderColor: '#059669' }}
          >
            ⚡ Save Entry & Recalculate Account Balance
          </button>
        </form>

        {/* List of Custom Transactions */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Custom Ledger Entries ({customTransactions.length})</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-Recalculated</span>
          </div>

          {customTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No custom ledger entries added yet. Baseline Excel numbers are currently active.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {customTransactions.map((tx) => (
                <div key={tx.id} style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {tx.date} • <span style={{ fontWeight: 700, color: tx.type === 'inflow' ? '#059669' : '#dc2626' }}>{tx.type === 'inflow' ? 'Inflow (+)' : 'Outflow (−)'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 900, fontSize: '0.95rem', color: tx.type === 'inflow' ? '#059669' : '#dc2626' }}>
                      {tx.type === 'inflow' ? '+' : '-'}GH₵ {(parseFloat(tx.amount) || 0).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
