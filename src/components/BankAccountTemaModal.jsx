import React from 'react';
import { X, Building2, CheckCircle2, DollarSign, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck } from 'lucide-react';
import { BANK_ACCOUNT_TEMA_DATA } from '../utils/bankAccountTemaData';

export default function BankAccountTemaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const data = BANK_ACCOUNT_TEMA_DATA;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="glass-card modal-responsive-card" style={{ maxWidth: '780px', width: '92%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.9rem', gap: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#2563eb', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building2 size={13} /> Excel Sheet: {data.sheetName}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Acc: {data.accountNumber}</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-700)', margin: 0, lineHeight: 1.25 }}>
              🏦 {data.accountTitle}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
              Itemized ledger reconciliation calculated directly from Income and Expenses columns.
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close Bank Account Tema Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Core Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(255, 255, 255, 0.02))', borderRadius: '14px', border: '1.5px solid rgba(5, 150, 105, 0.35)', borderTop: '4px solid #059669' }}>
            <div style={{ fontSize: '0.72rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>Total Bank Inflows (Income)</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
              GH₵ {data.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Deposits + Shares + Interest</div>
          </div>

          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.12), rgba(255, 255, 255, 0.02))', borderRadius: '14px', border: '1.5px solid rgba(220, 38, 38, 0.35)', borderTop: '4px solid #dc2626' }}>
            <div style={{ fontSize: '0.72rem', color: '#dc2626', textTransform: 'uppercase', fontWeight: 700 }}>Total Outflows (Expenses)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginTop: '0.2rem' }}>
              GH₵ {data.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Cash Withdrawals</div>
          </div>

          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(255, 255, 255, 0.02))', borderRadius: '14px', border: '1.5px solid rgba(37, 99, 235, 0.35)', borderTop: '4px solid #2563eb' }}>
            <div style={{ fontSize: '0.72rem', color: '#2563eb', textTransform: 'uppercase', fontWeight: 800 }}>Ending Bank Balance</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#2563eb', marginTop: '0.2rem' }}>
              GH₵ {data.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#2563eb', marginTop: '0.15rem', fontWeight: 700 }}>Income - Expenses Tally</div>
          </div>

        </div>

        {/* Income vs Expenses Formula Banner */}
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1.5px solid rgba(37, 99, 235, 0.3)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            📊 Official Reconciliation Formula
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Income: GH₵ 5,766.24</span>
            <span style={{ fontWeight: 900 }}>-</span>
            <span style={{ color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Expenses: GH₵ 5,400.00</span>
            <span style={{ fontWeight: 900 }}>=</span>
            <span style={{ color: '#2563eb', background: 'rgba(37, 99, 235, 0.12)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '1.05rem', fontWeight: 900 }}>
              Balance: GH₵ 366.24
            </span>
          </div>
        </div>

        {/* Itemized Transactions Table */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            📋 Ledger Transactions Breakdown
          </div>

          <div className="table-container" style={{ borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '280px', overflowY: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Date</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Particulars</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Income (GH₵)</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Expenses (GH₵)</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Running Balance (GH₵)</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((tx, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.015)' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>{tx.date}</td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>{tx.particulars}</span>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tx.category}</span>
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: tx.income > 0 ? '#059669' : 'var(--text-muted)' }}>
                      {tx.income > 0 ? `+GH₵ ${tx.income.toFixed(2)}` : '—'}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: tx.expenses > 0 ? '#dc2626' : 'var(--text-muted)' }}>
                      {tx.expenses > 0 ? `-GH₵ ${tx.expenses.toFixed(2)}` : '—'}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 900, color: '#2563eb' }}>
                      GH₵ {tx.runningBalance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1.25rem', fontWeight: 800 }}
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
