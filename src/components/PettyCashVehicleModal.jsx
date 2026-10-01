import React from 'react';
import { X, Car, Building2, CheckCircle2, FileSpreadsheet, ShieldCheck, DollarSign, Wallet } from 'lucide-react';
import { PETTY_CASH_VEHICLE_DATA } from '../utils/pettyCashVehicleData';

export default function PettyCashVehicleModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const data = PETTY_CASH_VEHICLE_DATA;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="glass-card modal-responsive-card" style={{ maxWidth: '780px', width: '92%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.9rem', gap: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#ea580c', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Car size={13} /> Excel Sheet: {data.sheetName}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Verified Ledger Particulars</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-700)', margin: 0, lineHeight: 1.25 }}>
              🚐 {data.accountTitle}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
              Complete particulars breakdown of vehicle acquisition capital, bank reserve, and member shares contributions.
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close Petty Cash Vehicle Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(255, 255, 255, 0.02))', borderRadius: '14px', border: '1.5px solid rgba(234, 88, 12, 0.35)', borderTop: '4px solid #ea580c' }}>
            <div style={{ fontSize: '0.72rem', color: '#ea580c', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>Ending Vehicle Fund Balance</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ea580c', marginTop: '0.2rem' }}>
              GH₵ {data.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Full Liquid Capital Available</div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderTop: '4px solid #2563eb' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Bank Capital Reserve</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb', marginTop: '0.2rem' }}>
              GH₵ {data.bankCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Capital by the Bank</div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderTop: '4px solid #059669' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Member Shares Capital</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
              GH₵ {data.memberCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>120 Vehicle Shares Paid (3 Members)</div>
          </div>

        </div>

        {/* Particulars Ledger Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileSpreadsheet size={16} color="#ea580c" /> Official Ledger Particulars & Capital Inflows
          </div>

          <div className="table-container">
            <table className="data-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Particulars / Capital Source</th>
                  <th>PV Number</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Income (GH₵)</th>
                  <th style={{ textAlign: 'right' }}>Expenses (GH₵)</th>
                  <th style={{ textAlign: 'right' }}>Balance (GH₵)</th>
                </tr>
              </thead>
              <tbody>
                {data.particulars.map((item) => (
                  <tr key={item.id} style={{ background: item.id === 1 ? 'rgba(37, 99, 235, 0.03)' : 'rgba(5, 150, 105, 0.03)' }}>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        {item.id === 1 ? <Building2 size={16} color="#2563eb" /> : <Car size={16} color="#059669" />}
                        <span>{item.particulars}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{item.voucherNo}</td>
                    <td>
                      <span className="badge" style={{ 
                        fontSize: '0.7rem', 
                        background: item.id === 1 ? 'rgba(37, 99, 235, 0.12)' : 'rgba(5, 150, 105, 0.12)', 
                        color: item.id === 1 ? '#2563eb' : '#059669',
                        fontWeight: 700 
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                      +GH₵ {item.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                      GH₵ {item.expenses.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#ea580c' }}>
                      GH₵ {item.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid var(--border-color)', background: 'rgba(234, 88, 12, 0.08)', fontWeight: 900 }}>
                  <td colSpan={3} style={{ textTransform: 'uppercase', color: '#ea580c', letterSpacing: '0.04em' }}>
                    TOTAL PETTY CASH VEHICLE FUND BALANCE
                  </td>
                  <td style={{ textAlign: 'right', color: '#059669', fontSize: '0.95rem' }}>
                    +GH₵ {data.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                    GH₵ {data.totalExpenses.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', color: '#ea580c', fontSize: '1.05rem', fontWeight: 900 }}>
                    GH₵ {data.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(234, 88, 12, 0.08)', borderRadius: '12px', border: '1px solid rgba(234, 88, 12, 0.25)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="#ea580c" />
          <span>
            This petty cash vehicle ledger is verified directly against Excel sheet <strong>PETTY CASH VEHICLE</strong>. Total vehicle capital reserve currently stands at <strong>GH₵ 68,000.00</strong>.
          </span>
        </div>

        {/* Action Button */}
        <button 
          type="button"
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.7rem', fontWeight: 800, background: '#ea580c', borderColor: '#ea580c' }}
        >
          Close Particulars Ledger
        </button>

      </div>
    </div>
  );
}
