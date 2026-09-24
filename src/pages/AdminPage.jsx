import React, { useState } from 'react';
import { Shield, UploadCloud, PlusCircle, Users, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Copy, Database, Search, ArrowRight } from 'lucide-react';
import { parseUploadedFile } from '../utils/excelParser';
import { addContribution, bulkAddContributions } from '../services/store';
import { SQL_SCHEMA_SCRIPT } from '../services/supabase';

export default function AdminPage({ currentUser, members, contributions, setContributions }) {
  const [activeTab, setActiveTab] = useState('uploader'); // 'uploader', 'manual', 'roster', 'sql'

  // Uploader State
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');

  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    member_id: members[0]?.id || '',
    amount: '',
    contribution_type: 'Monthly Dues',
    payment_method: 'Mobile Money',
    reference_note: '',
    payment_date: new Date().toISOString().split('T')[0]
  });
  const [manualSuccess, setManualSuccess] = useState('');

  // Member Roster Search
  const [rosterSearch, setRosterSearch] = useState('');

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setIsParsing(true);
    setParseResult(null);
    setImportSuccess('');

    try {
      const result = await parseUploadedFile(file, members);
      setParseResult(result);
    } catch (err) {
      alert('Error parsing file: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleBulkImport = () => {
    if (!parseResult || parseResult.matched.length === 0) return;

    const entriesToInsert = parseResult.matched.map(item => ({
      member_id: item.member_id,
      amount: item.amount,
      contribution_type: item.contribution_type,
      payment_method: item.payment_method,
      reference_note: item.reference_note + ` (Excel Row ${item.rowNum})`,
      payment_date: item.payment_date,
      received_by_name: currentUser?.full_name || 'Admin'
    }));

    const updated = bulkAddContributions(entriesToInsert);
    setContributions(updated);
    setImportSuccess(`Successfully imported ${entriesToInsert.length} contributions to database ledgers!`);
    setParseResult(null);

    setTimeout(() => setImportSuccess(''), 5000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.amount || parseFloat(manualForm.amount) <= 0) {
      alert('Please enter a valid contribution amount.');
      return;
    }

    const selectedMember = members.find(m => m.id === manualForm.member_id);

    const newEntry = {
      ...manualForm,
      amount: parseFloat(manualForm.amount),
      received_by_name: currentUser?.full_name || 'Admin'
    };

    const updated = addContribution(newEntry);
    setContributions(updated);
    setManualSuccess(`Payment of GH₵ ${manualForm.amount} logged for ${selectedMember?.full_name || 'Member'}!`);
    
    setManualForm({
      member_id: members[0]?.id || '',
      amount: '',
      contribution_type: 'Monthly Dues',
      payment_method: 'Mobile Money',
      reference_note: '',
      payment_date: new Date().toISOString().split('T')[0]
    });

    setTimeout(() => setManualSuccess(''), 4000);
  };

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const filteredRoster = members.filter(m => 
    m.full_name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    m.phone_number.includes(rosterSearch) ||
    (m.excel_member_id && m.excel_member_id.toLowerCase().includes(rosterSearch.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-admin" style={{ marginBottom: '0.5rem', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(5, 150, 105, 0.2))', border: '1px solid rgba(217, 119, 6, 0.4)', color: '#d97706', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          <Shield size={15} /> Executive Command & Financial Control Center
        </div>
        <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.4rem' }}>
          Fellowship Executive Console
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Logged in as <strong>{currentUser?.full_name || 'Executive Officer'}</strong> ({currentUser?.position || 'Executive'}). Manage member records, bulk-sync MoMo statements, and issue payment receipts.
        </p>
      </div>

      {/* Executive Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Dues & Welfare Ledgers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
            GH₵ {contributions.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {contributions.length} recorded payments</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Fellowship Roster</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', margin: '0.2rem 0' }}>
            {members.length} Members
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {members.filter(m => m.status === 'ACTIVE').length} Active • {members.filter(m => m.status === 'PROBATION').length} Probation
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Regional Branches</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', margin: '0.2rem 0' }}>
            {new Set(members.map(m => m.branch)).size} Regions
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accra, Kumasi, Takoradi, Kasoa, Mampong, Aburi...</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('uploader')} 
          className={`btn ${activeTab === 'uploader' ? 'btn-accent' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <FileSpreadsheet size={18} /> Excel / MoMo Statement Uploader
        </button>
        <button 
          onClick={() => setActiveTab('manual')} 
          className={`btn ${activeTab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <PlusCircle size={18} /> Log Payment Receipt
        </button>
        <button 
          onClick={() => setActiveTab('roster')} 
          className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <Users size={18} /> Member Roster ({members.length})
        </button>
        <button 
          onClick={() => setActiveTab('sql')} 
          className={`btn ${activeTab === 'sql' ? 'btn-secondary' : 'btn-secondary'}`}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          <Database size={18} /> Supabase SQL Exporter
        </button>
      </div>

      {importSuccess && (
        <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderRadius: '0.75rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <CheckCircle2 size={22} /> {importSuccess}
        </div>
      )}

      {/* TAB 1: EXCEL / CSV BULK UPLOADER */}
      {activeTab === 'uploader' && (
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSpreadsheet size={24} /> Drag & Drop Excel / MoMo Bulk Ledger Uploader
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
              Upload your Excel sheet (`.xlsx`, `.xls`) or CSV statement from your MoMo ledger. The system auto-matches rows to the 24 fellowship members by phone or name!
            </p>
          </div>

          {/* Dropzone */}
          <div 
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('excel-file-input').click()}
          >
            <input 
              id="excel-file-input"
              type="file" 
              accept=".xlsx,.xls,.csv" 
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadCloud size={48} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Drop your Excel or CSV File Here</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports `.xlsx`, `.xls`, and `.csv` files</p>
            <button type="button" className="btn btn-secondary" style={{ marginTop: '1rem', pointerEvents: 'none' }}>
              Browse File on Computer
            </button>
          </div>

          {isParsing && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.5rem auto' }} />
              <div>Parsing rows and matching phone numbers against 24 member records...</div>
            </div>
          )}

          {/* Parsed Results Preview */}
          {parseResult && (
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>File Parse Summary</h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Total Rows Analyzed: <strong>{parseResult.totalRows}</strong> | Successfully Matched: <span style={{ color: '#059669', fontWeight: 800 }}>{parseResult.matched.length}</span> | Unmatched: <span style={{ color: '#dc2626', fontWeight: 800 }}>{parseResult.unmatched.length}</span>
                  </div>
                </div>

                {parseResult.matched.length > 0 && (
                  <button onClick={handleBulkImport} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                    <CheckCircle2 size={18} /> Import {parseResult.matched.length} Matched Records Now
                  </button>
                )}
              </div>

              {/* Matched Records Table */}
              {parseResult.matched.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#059669' }}>
                    ✅ Ready for Bulk Import ({parseResult.matched.length} Records)
                  </h4>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Row #</th>
                          <th>Matched Member</th>
                          <th>Phone</th>
                          <th>Amount (GH₵)</th>
                          <th>Category</th>
                          <th>Method</th>
                          <th>Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.matched.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.rowNum}</td>
                            <td style={{ fontWeight: 700 }}>{item.member_name}</td>
                            <td>{item.phone_number}</td>
                            <td style={{ fontWeight: 800, color: 'var(--primary-600)' }}>GH₵ {item.amount.toFixed(2)}</td>
                            <td><span className="badge badge-dues">{item.contribution_type}</span></td>
                            <td>{item.payment_method}</td>
                            <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.reference_note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Unmatched Records Table */}
              {parseResult.unmatched.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#dc2626' }}>
                    ⚠️ Skipped Rows ({parseResult.unmatched.length} Records)
                  </h4>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Row #</th>
                          <th>Raw Name</th>
                          <th>Raw Phone</th>
                          <th>Amount</th>
                          <th>Reason Skipped</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.unmatched.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.rowNum}</td>
                            <td>{item.rawName || '—'}</td>
                            <td>{item.rawPhone || '—'}</td>
                            <td>{item.rawAmount || '—'}</td>
                            <td style={{ color: '#dc2626', fontSize: '0.85rem' }}>{item.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* TAB 2: MANUAL ENTRY FORM */}
      {activeTab === 'manual' && (
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
            <PlusCircle size={24} /> Log Single Transaction (Cash or MoMo)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Manually log incoming cash paid at meetings or single Mobile Money transfers against any of the 24 members.
          </p>

          {manualSuccess && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderRadius: '0.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {manualSuccess}
            </div>
          )}

          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Select Member</label>
              <select 
                className="form-select"
                value={manualForm.member_id}
                onChange={(e) => setManualForm({ ...manualForm, member_id: e.target.value })}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.phone_number})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Amount (GH₵)</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 200.00"
                  className="form-input"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Contribution Type</label>
                <select 
                  className="form-select"
                  value={manualForm.contribution_type}
                  onChange={(e) => setManualForm({ ...manualForm, contribution_type: e.target.value })}
                >
                  <option value="Monthly Dues">Monthly Dues</option>
                  <option value="Welfare Fund">Welfare Fund</option>
                  <option value="Special Donation">Special Donation</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Payment Method</label>
                <select 
                  className="form-select"
                  value={manualForm.payment_method}
                  onChange={(e) => setManualForm({ ...manualForm, payment_method: e.target.value })}
                >
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Payment Date</label>
                <input 
                  type="date"
                  required
                  className="form-input"
                  value={manualForm.payment_date}
                  onChange={(e) => setManualForm({ ...manualForm, payment_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Reference / Receipt Note</label>
              <input 
                type="text"
                placeholder="e.g., MoMo Ref 10928374 or Cash Meeting Receipt #04"
                className="form-input"
                value={manualForm.reference_note}
                onChange={(e) => setManualForm({ ...manualForm, reference_note: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              <PlusCircle size={18} /> Record & Update Member Ledger
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: 24 MEMBER ROSTER */}
      {activeTab === 'roster' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Complete 24-Member Roster</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Registered accounts & calculated contribution totals</p>
            </div>

            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search member name or phone..."
                className="form-input"
                style={{ paddingLeft: '2.2rem', width: '260px' }}
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Excel Member ID</th>
                  <th>Full Name</th>
                  <th>Primary Phone</th>
                  <th>MoMo Number</th>
                  <th>Role</th>
                  <th>Total Contributed</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map(m => {
                  const mTotal = contributions
                    .filter(c => c.member_id === m.id)
                    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700, color: 'var(--accent-600)' }}>{m.excel_member_id}</td>
                      <td style={{ fontWeight: 700 }}>{m.full_name}</td>
                      <td>{m.phone_number}</td>
                      <td>{m.momo_number || m.phone_number}</td>
                      <td>
                        <span className={`badge ${m.role === 'admin' ? 'badge-admin' : 'badge-dues'}`}>
                          {m.role === 'admin' ? '⭐ Admin' : 'Member'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary-600)' }}>
                        GH₵ {mTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SQL DATABASE SCHEMA */}
      {activeTab === 'sql' && (
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={22} color="#059669" /> Supabase PostgreSQL Migration Script
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Copy and paste this script directly into your Supabase SQL Editor to initialize production database tables!
              </p>
            </div>

            <button onClick={copySql} className="btn btn-primary" style={{ padding: '0.6rem 1.1rem' }}>
              {copiedSql ? <CheckCircle2 size={16} /> : <Copy size={16} />} {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Code'}
            </button>
          </div>

          <pre style={{ background: '#0b131f', color: '#10b981', padding: '1.5rem', borderRadius: '0.75rem', overflowX: 'auto', fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'monospace', border: '1px solid var(--border-color)' }}>
            {SQL_SCHEMA_SCRIPT}
          </pre>
        </div>
      )}

    </div>
  );
}
