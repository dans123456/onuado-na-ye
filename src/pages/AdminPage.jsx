import React, { useState } from 'react';
import { Shield, UploadCloud, PlusCircle, Users, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Copy, Search, ArrowRight, User, Eye, Download, X, MapPin, Phone, Mail, Heart, Building2, Calendar, FileText, CreditCard, Megaphone, Sparkles } from 'lucide-react';
import { parseUploadedFile } from '../utils/excelParser';
import { addContribution, bulkAddContributions, getMembers, getAnnouncement, saveAnnouncement } from '../services/store';
import { getMemberLevyDetails } from '../utils/levyData';

export default function AdminPage({ currentUser, members, setMembers, contributions, setContributions, setActivePage }) {
  const [activeTab, setActiveTab] = useState('uploader'); // 'uploader', 'roster', 'manual', 'announcement', 'treasury'
  const [showAllBranches, setShowAllBranches] = useState(false);

  // Uploader State
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');

  // Announcement Ticker Logger State
  const [announcementText, setAnnouncementText] = useState(getAnnouncement());
  const [announcementStatus, setAnnouncementStatus] = useState('');

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    saveAnnouncement(announcementText);
    setAnnouncementStatus('Broadcast announcement ticker updated live across the portal!');
    setTimeout(() => setAnnouncementStatus(''), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Excel Member ID',
      'Member No',
      'Full Name',
      'Title',
      'Position',
      'Branch',
      'Phone Number',
      'Date Joined',
      'Registration Fee (GHc)',
      'Dues Paid (GHc)',
      'Levy Paid (GHc)',
      'Total Payments (GHc)',
      'Balance Owed (GHc)',
      'Status',
      'Role'
    ];

    const rows = members.map(m => [
      `"${m.excel_member_id || ''}"`,
      m.member_no || '',
      `"${m.full_name || ''}"`,
      `"${m.title || ''}"`,
      `"${m.position || ''}"`,
      `"${m.branch || ''}"`,
      `"${m.phone_number || ''}"`,
      `"${m.date_joined || ''}"`,
      m.reg_fees || 0,
      m.dues_paid || 0,
      m.levy_paid || 0,
      m.total_payments || 0,
      m.balance_owed || 0,
      `"${m.status || 'ACTIVE'}"`,
      `"${m.role || 'member'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ONUADO_NA_EYE_MASTER_ROSTER_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Member Roster Search & Selected Dossier
  const [rosterSearch, setRosterSearch] = useState('');
  const [selectedDossierMember, setSelectedDossierMember] = useState(null);

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);

  // Filtered Roster
  const filteredRoster = members.filter(m => 
    (m.full_name && m.full_name.toLowerCase().includes(rosterSearch.toLowerCase())) ||
    (m.phone_number && m.phone_number.includes(rosterSearch)) ||
    (m.excel_member_id && m.excel_member_id.toLowerCase().includes(rosterSearch.toLowerCase())) ||
    (m.branch && m.branch.toLowerCase().includes(rosterSearch.toLowerCase()))
  );

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

    if (setMembers) {
      setMembers(getMembers());
    }

    setImportSuccess(`Successfully imported ${entriesToInsert.length} member payment records & updated database ledgers!`);
    setParseResult(null);

    setTimeout(() => setImportSuccess(''), 5000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.amount || parseFloat(manualForm.amount) <= 0) {
      alert('Please enter a valid contribution amount.');
      return;
    }

    const updated = addContribution({
      member_id: manualForm.member_id,
      amount: parseFloat(manualForm.amount),
      contribution_type: manualForm.contribution_type,
      payment_method: manualForm.payment_method,
      reference_note: manualForm.reference_note,
      payment_date: manualForm.payment_date,
      received_by_name: currentUser?.full_name || 'Executive Admin'
    });

    setContributions(updated);
    setManualSuccess(`Transaction of GH₵ ${parseFloat(manualForm.amount).toFixed(2)} recorded successfully!`);
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

  const exportFullRosterCSV = () => {
    const headers = [
      "Member ID,Member No,Full Name,Name in Capitals,Title,Church Position,Branch,Date Joined,Phone 1,Phone 2,House No,GPS Address,Town,Email,Ghana Card,Occupation,Place of Work,Date of Birth,Place of Birth,Hometown,District,Region,Tribe,Next of Kin,Relation,Next of Kin Contact,Marital Status,Spouse Name,Spouse Contact,Children Count,Father Name,Father Contact,Mother Name,Mother Contact,Father Status,Mother Status,Reg Fees,Dues Paid,Levy Paid,Total Payments,Dues Required,Shares Dividends,Shares Value,Treasurer Bill,Shares Holding,Status,Role\n"
    ];

    const rows = members.map(m => 
      `"${m.excel_member_id}","${m.member_no || ''}","${m.full_name}","${m.name_in_capitals || ''}","${m.title || ''}","${m.position || ''}","${m.branch || ''}","${m.date_joined || ''}","${m.phone_number || ''}","${m.phone_number_2 || ''}","${m.house_no || ''}","${m.gps_address || ''}","${m.town || ''}","${m.email || ''}","${m.ghana_card || ''}","${m.occupation || ''}","${m.place_of_work || ''}","${m.date_of_birth || ''}","${m.place_of_birth || ''}","${m.hometown || ''}","${m.district || ''}","${m.region || ''}","${m.tribe || ''}","${m.next_of_kin || ''}","${m.next_of_kin_relation || ''}","${m.next_of_kin_contact || ''}","${m.marital_status || ''}","${m.spouse_name || ''}","${m.spouse_contact || ''}","${m.children_count || ''}","${m.father_name || ''}","${m.father_contact || ''}","${m.mother_name || ''}","${m.mother_contact || ''}","${m.father_state || ''}","${m.mother_state || ''}","${m.reg_fees || 0}","${m.dues_paid || 0}","${m.levy_paid || 0}","${m.total_payments || 0}","${m.dues_fee_required || 3900}","${m.shares_dividends || 0}","${m.shares_value || 0}","${m.treasurer_bill || 0}","${m.shares_holding || 0}","${m.status || 'ACTIVE'}","${m.role || 'member'}"`
    ).join("\n");

    const totalSharesVal = members.reduce((sum, m) => sum + (parseFloat(m.shares_value) || 0), 0).toFixed(2);
    const totalTreasBill = members.reduce((sum, m) => sum + (parseFloat(m.treasurer_bill) || 0), 0).toFixed(2);
    const grandSharesHold = members.reduce((sum, m) => sum + (parseFloat(m.shares_holding) || 0), 0).toFixed(2);

    const summarySection = `\n\n` +
      `"=== EXECUTIVE TREASURY & BANK ACCOUNT BALANCES SUMMARY ==="\n` +
      `"Fidelity Bank Ghana Ending Balance (Acc: 2090182444410)","GHc 10,698.88"\n` +
      `"MTN Mobile Money Ending Balance (Line: 0530486443 / Merchant: 293658)","GHc 1.95"\n` +
      `"North Tema Co-Operative Credit Union (Acc: 2161006002421201)","GHc 366.24"\n` +
      `"Master Shares Value Total","GHc ${totalSharesVal}"\n` +
      `"Master Treasurer Bill Total","GHc ${totalTreasBill}"\n` +
      `"Grand Total Shares Holding","GHc ${grandSharesHold}"\n` +
      `"Verified Trial Balance Income","GHc 86,103.20"\n` +
      `"Verified Trial Balance Expenditure","GHc 86,103.20"\n`;

    const blob = new Blob([headers + rows + summarySection], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ONUADO_NA_EYE_Master_Ledger_And_Treasury_Balances_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Executive Admin Banner */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(5, 150, 105, 0.15))', border: '1px solid rgba(217, 119, 6, 0.3)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div className="badge badge-admin" style={{ marginBottom: '0.5rem', padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              ⭐ Executive Board Console
            </div>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
              Fellowship Executive Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Logged in as: <strong style={{ color: '#d97706' }}>{currentUser?.full_name}</strong> ({currentUser?.position || 'Executive Officer'})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={exportFullRosterCSV}
              className="btn btn-accent" 
              style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <Download size={16} /> Export All 45 Fields (CSV)
            </button>
            <button 
              onClick={() => setActivePage('dashboard')} 
              className="btn btn-secondary" 
              style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <User size={16} /> My Member Portal &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Branch & Member Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Registered Members</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>{members.length} Members</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Fellowship Branches</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>
            {new Set(members.map(m => m.branch || 'Takoradi')).size} Branches
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Aburi, Ashaiman, Atensu, Dansoman, Darkoman, Kasoa...</div>
        </div>
      </div>

      {/* 📊 EXCEL MASTER FINANCIAL TOTALS (SHARES TOTAL, TREASURER BILL TOTAL, GRAND AMOUNT) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(37, 99, 235, 0.05))', border: '2px solid rgba(220, 38, 38, 0.3)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', marginBottom: '1rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} /> Fellowship Master Financial Totals (Excel Sync)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(37, 99, 235, 0.3)', borderTop: '4px solid #2563eb' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SHARES TOTAL
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              GH₵ {members.reduce((sum, m) => sum + (parseFloat(m.shares_value) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Sum of All Member Shares Values</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(217, 119, 6, 0.3)', borderTop: '4px solid #d97706' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TREASURER BILL TOTAL
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              GH₵ {members.reduce((sum, m) => sum + (parseFloat(m.treasurer_bill) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Sum of All Treasurer Bills</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(124, 58, 237, 0.1))', borderRadius: '12px', border: '2px solid #dc2626', borderTop: '5px solid #dc2626' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>GRAND AMOUNT</span>
              <span className="badge badge-welfare" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>Master Total</span>
            </div>
            <div style={{ fontSize: '2.05rem', fontWeight: 900, color: '#dc2626', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              GH₵ {members.reduce((sum, m) => sum + (parseFloat(m.shares_holding) || (parseFloat(m.shares_value || 0) + parseFloat(m.treasurer_bill || 0))), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Shares Total + Treasurer Bill Total</div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs & Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('uploader')} 
            className={`btn ${activeTab === 'uploader' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <UploadCloud size={16} /> Excel / CSV Bulk Uploader
          </button>
          <button 
            onClick={() => setActiveTab('roster')} 
            className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <Users size={16} /> Member Master Roster ({members.length})
          </button>
          <button 
            onClick={() => setActiveTab('manual')} 
            className={`btn ${activeTab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <PlusCircle size={16} /> Log Single Transaction
          </button>
          <button 
            onClick={() => setActiveTab('announcement')} 
            className={`btn ${activeTab === 'announcement' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <Megaphone size={16} color="#d97706" /> Broadcast Announcement
          </button>
          <button 
            onClick={() => setActiveTab('treasury')} 
            className={`btn ${activeTab === 'treasury' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 800, fontSize: '0.88rem' }}
          >
            <Building2 size={16} color="#059669" /> Treasury & Bank Balances
          </button>
        </div>

        <button 
          onClick={handleExportCSV}
          className="btn btn-accent"
          style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          title="Download complete member records & ledgers as CSV Excel file"
        >
          <Download size={16} /> Export Master Ledger (.csv)
        </button>
      </div>

      {importSuccess && (
        <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderRadius: '0.75rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <CheckCircle2 size={22} /> {importSuccess}
        </div>
      )}

      {/* TAB 0: EXECUTIVE TREASURY ACCOUNTS & TRIAL BALANCE */}
      {activeTab === 'treasury' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Note */}
          <div style={{ marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Building2 size={24} color="#059669" /> Official Fellowship Treasury & Bank Balances
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
              Extracted directly from Excel sheets <strong>MTN MOMO ACCOUNT</strong>, <strong>FIDELITY BANK</strong>, <strong>BANK ACCOUNT TEMA</strong>, and <strong>TRIAL BALANCE</strong>.
            </p>
          </div>

          {/* 3 Treasury Account Cards Grid (MTN MoMo 1st, Fidelity Bank 2nd, Bank Tema 3rd) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '1.25rem' }}>
            
            {/* 1ST CARD: MTN Mobile Money Account */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '5px solid #d97706', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(255, 255, 255, 0.02))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  MTN Mobile Money Account
                </span>
                <span className="badge badge-dues" style={{ fontSize: '0.7rem' }}>MTN MOMO</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>MoMo Line: <strong style={{ color: '#d97706' }}>0530486443</strong> • Code: <strong style={{ color: '#2563eb' }}>293658</strong></div>

              <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ending MoMo Balance</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#059669', marginTop: '0.15rem' }}>
                  GH₵ 1.95
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total MoMo Inflows:</span><strong style={{ color: '#059669' }}>GH₵ 100,088.75</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Expenses & Vouchers:</span><strong>GH₵ 100,086.80</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Account Name:</span><strong>ONUADO NA EYE FELLOWSHIP</strong></div>
              </div>
            </div>

            {/* 2ND CARD: Fidelity Bank Ghana */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '5px solid #059669', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(255, 255, 255, 0.02))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Fidelity Bank Ghana
                </span>
                <span className="badge badge-dues" style={{ fontSize: '0.7rem' }}>FIDELITY</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Account No: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>2090182444410</strong></div>
              
              <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ending Bank Balance</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#059669', marginTop: '0.15rem' }}>
                  GH₵ 10,698.88
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Cash Deposited:</span><strong>GH₵ 125,113.88</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Withdrawals / Investments:</span><strong>GH₵ 114,415.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Matured Bills Reversed:</span><strong style={{ color: '#2563eb' }}>GH₵ 62,425.51</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank Interest Earned:</span><strong style={{ color: '#d97706' }}>GH₵ 88.37</strong></div>
              </div>
            </div>

            {/* North Tema Co-Operative Credit Union */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '5px solid #2563eb', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(255, 255, 255, 0.02))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bank Account Tema (Credit Union)
                </span>
                <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb' }}>TEMA</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Account No: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>2161006002421201</strong></div>

              <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ending Bank Tema Balance</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#2563eb', marginTop: '0.15rem' }}>
                  GH₵ 366.24
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank Shares Held:</span><strong>GH₵ 100.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Savings Deposited:</span><strong>GH₵ 5,500.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Bank Interest:</span><strong style={{ color: '#d97706' }}>GH₵ 166.24</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Cash Withdrawals:</span><strong>GH₵ 5,400.00</strong></div>
              </div>
            </div>

          </div>

          {/* MASTER TRIAL BALANCE TABLE */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <FileText size={20} color="#2563eb" /> Verified Fellowship Trial Balance Sheet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  Extracted from Excel sheet <strong>TRAIL BALANCE</strong>. Total Balanced Income & Expenditure: <strong>GH₵ 86,103.20</strong>.
                </p>
              </div>

              <div style={{ padding: '0.6rem 1rem', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '10px', border: '1px solid rgba(5, 150, 105, 0.3)', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#059669', fontWeight: 800 }}>Trial Balance Sum</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>GH₵ 86,103.20</div>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table" style={{ fontSize: '0.88rem' }}>
                <thead>
                  <tr>
                    <th>Particulars / Line Item</th>
                    <th>Income (GH₵)</th>
                    <th>Expenditure & Assets (GH₵)</th>
                    <th>Category / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 800 }}>REGISTRATION FEES</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 4,800.00</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Income</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TOTAL MONTHLY DUES FOR 2023</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 10,800.00</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Income</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TOTAL MONTHLY DUES FOR 2024</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 16,900.00</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Income</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TOTAL MONTHLY DUES FOR 2025</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 22,350.00</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Income</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TOTAL MONTHLY DUES FOR 2026</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 15,500.00</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Income</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TREASURER BILL INTEREST</td>
                    <td style={{ fontWeight: 800, color: '#d97706' }}>GH₵ 10,502.70</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-welfare">Investment Returns</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>LEVY BALANCE</td>
                    <td style={{ fontWeight: 800, color: '#3b82f6' }}>GH₵ 1,250.50</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Special Levy</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>SPECIAL CONTRIBUTIONS</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 4,000.00</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td><span className="badge badge-dues">Income</span></td>
                  </tr>
                  
                  {/* Expenditures */}
                  <tr style={{ background: 'rgba(5, 150, 105, 0.03)' }}>
                    <td style={{ fontWeight: 800 }}>FIDELITY BANK ENDING BALANCE</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 10,698.88</td>
                    <td><span className="badge badge-dues">Bank Asset</span></td>
                  </tr>
                  <tr style={{ background: 'rgba(37, 99, 235, 0.03)' }}>
                    <td style={{ fontWeight: 800 }}>BANK TEMA ENDING BALANCE</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 800, color: '#2563eb' }}>GH₵ 366.24</td>
                    <td><span className="badge badge-dues">Bank Asset</span></td>
                  </tr>
                  <tr style={{ background: 'rgba(5, 150, 105, 0.03)' }}>
                    <td style={{ fontWeight: 800 }}>MOMO ACCOUNT ENDING BALANCE</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 1.95</td>
                    <td><span className="badge badge-dues">MoMo Wallet</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TRANSPORTATIONS</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 5,100.00</td>
                    <td>Expenditure</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>REGISTRAR GENERAL (RGD) FEES</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 1,300.00</td>
                    <td>Legal & Compliance</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>MOMO CHARGES & COMMISSIONS</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 1,091.80</td>
                    <td>Bank Fees</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>GENERAL EXPENSES</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 1,010.00</td>
                    <td>Expenditure</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>DOCUMENTATIONS</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 500.00</td>
                    <td>Expenditure</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>PRINTING & STATIONERY</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 285.00</td>
                    <td>Expenditure</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>BANK TEMA SHARES</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 100.00</td>
                    <td>Shares Investment</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>TREASURER BILL CHARGES</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 34.34</td>
                    <td>Bank Fees</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>FIDELITY BANK CHARGES</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                    <td style={{ fontWeight: 700 }}>GH₵ 15.00</td>
                    <td>Bank Fees</td>
                  </tr>

                  {/* Grand Totals */}
                  <tr style={{ background: 'var(--bg-main)', borderTop: '2.5px solid var(--border-color)', fontSize: '1rem' }}>
                    <td style={{ fontWeight: 900, color: 'var(--primary-700)' }}>GRAND TOTALS (BALANCED)</td>
                    <td style={{ fontWeight: 900, color: '#059669', fontSize: '1.1rem' }}>GH₵ 86,103.20</td>
                    <td style={{ fontWeight: 900, color: '#059669', fontSize: '1.1rem' }}>GH₵ 86,103.20</td>
                    <td><span className="badge badge-dues" style={{ fontWeight: 800 }}>Balanced 100% ✓</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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

          {parseResult && (
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>Multi-Sheet Excel Parse & Dues Delta Summary</h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Total Rows Analyzed Across All Sheets: <strong>{parseResult.totalRows}</strong> | Matched Records: <span style={{ color: '#059669', fontWeight: 800 }}>{parseResult.matched.length}</span> | Unmatched: <span style={{ color: '#dc2626', fontWeight: 800 }}>{parseResult.unmatched.length}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => {
                      setParseResult(null);
                      setIsParsing(false);
                      setImportSuccess('');
                    }} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem', fontWeight: 700, color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.35)', background: 'rgba(220, 38, 38, 0.05)' }}
                  >
                    <X size={16} /> Cancel Upload
                  </button>

                  {parseResult.matched.length > 0 && (
                    <button onClick={handleBulkImport} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 800 }}>
                      <CheckCircle2 size={18} /> Import & Apply {parseResult.matched.length} Records to Ledgers
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-Sheet Reports Summary Badges */}
              {parseResult.sheetReports && parseResult.sheetReports.length > 0 && (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {parseResult.sheetReports.map((report, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '0.4rem 0.75rem', 
                        borderRadius: '8px', 
                        fontSize: '0.78rem', 
                        fontWeight: 700, 
                        background: report.matchedCount > 0 ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-main)', 
                        border: report.matchedCount > 0 ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid var(--border-color)',
                        color: report.matchedCount > 0 ? '#059669' : 'var(--text-muted)'
                      }}
                    >
                      📊 <strong>{report.sheetName}</strong>: {report.matchedCount} Matched ({report.totalRows} rows)
                      {report.bankUpdates && <span style={{ color: '#2563eb', marginLeft: '0.4rem' }}>[Ending Balance Scanned]</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Records & Detected Changes Preview Table */}
              {parseResult.matched.length > 0 && (
                <div className="table-container" style={{ marginBottom: '2rem' }}>
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(5, 150, 105, 0.08)', fontWeight: 800, color: '#059669', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>✅ Matched Member Records & Detected Dues Increases ({parseResult.matched.length})</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Scanned Across All Sheets</span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Row & Sheet</th>
                        <th>Member Name & ID</th>
                        <th>Phone</th>
                        <th>Category</th>
                        <th>Parsed Payment Amount</th>
                        <th>Detected Dues / Payment Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.matched.map((item, index) => (
                        <tr key={index} style={{ background: item.changeDetected?.hasChange ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>
                          <td style={{ fontWeight: 700 }}>
                            <div>#{item.rowNum}</div>
                            <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(217, 119, 6, 0.12)', color: '#d97706' }}>
                              {item.sheetName || 'Main'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800 }}>
                            {item.member_name}
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700 }}>{item.excel_member_id}</div>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.phone_number}</td>
                          <td><span className="badge badge-dues">{item.contribution_type}</span></td>
                          <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ {parseFloat(item.amount).toFixed(2)}</td>
                          <td>
                            {item.changeDetected?.hasChange ? (
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Sparkles size={14} color="#059669" />
                                <span>{item.changeDetected.description}</span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {item.changeDetected?.description || 'Matches current store'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Unmatched Rows Section if any */}
              {parseResult.unmatched.length > 0 && (
                <div className="table-container">
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.08)', fontWeight: 800, color: '#dc2626', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                    ⚠️ Unmatched Rows Across Sheets ({parseResult.unmatched.length})
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Row & Sheet</th>
                        <th>Extracted Name</th>
                        <th>Extracted Phone</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.unmatched.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            #{item.rowNum}
                            <span className="badge" style={{ fontSize: '0.68rem', marginLeft: '0.4rem' }}>{item.sheetName || 'Sheet'}</span>
                          </td>
                          <td>{item.rawName || '—'}</td>
                          <td>{item.rawPhone || '—'}</td>
                          <td style={{ color: '#dc2626', fontWeight: 600 }}>{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    {m.full_name} ({m.phone_number}) — {m.branch}
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
                  <option value="Special Levy">Special Levy</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              <PlusCircle size={18} /> Record & Update Member Ledger
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: COMPLETE 24 MEMBER ROSTER (WITH ALL 45 FIELDS DOSSIER) */}
      {activeTab === 'roster' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Complete Member Roster & Master Dossiers</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Click <strong>"Inspect Full 45-Field Dossier 📋"</strong> on any member row to view all 45 extracted fields!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search name, phone, branch, ID..."
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', width: '270px' }}
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>

              <button onClick={exportFullRosterCSV} className="btn btn-accent" style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', fontWeight: 700 }}>
                <Download size={15} /> Export CSV (45 Fields)
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No / ID</th>
                  <th>Full Name</th>
                  <th>Branch</th>
                  <th>Primary Phone</th>
                  <th>Outstanding Balance</th>
                  <th>Status</th>
                  <th>Action (Inspect Dossier)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map(m => {
                  const balanceOwed = m.balance_owed !== undefined ? m.balance_owed : Math.max(0, (m.dues_fee_required || 3900) - (m.dues_paid || 0));
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent-600)' }}>
                        #{m.member_no || m.id.replace('m-', '')} ({m.excel_member_id})
                      </td>
                      <td style={{ fontWeight: 800 }}>
                        {m.full_name}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {m.title} • {m.position}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{m.branch}</td>
                      <td>{m.phone_number}</td>
                      <td style={{ fontWeight: 800, color: balanceOwed > 0 ? '#dc2626' : '#059669' }}>
                        GH₵ {balanceOwed.toFixed(2)}
                        {balanceOwed > 0 && <span style={{ fontSize: '0.7rem', color: '#dc2626', display: 'block', fontWeight: 600 }}>Owed ⚠️</span>}
                      </td>
                      <td>
                        <span className={`badge ${m.status === 'ACTIVE' ? 'badge-dues' : 'badge-admin'}`}>
                          {m.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => setSelectedDossierMember(m)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-700)', border: '1px solid rgba(5, 150, 105, 0.4)' }}
                        >
                          <Eye size={14} color="#059669" /> Inspect 45 Fields &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST ANNOUNCEMENT TICKER */}
      {activeTab === 'announcement' && (
        <div className="glass-card" style={{ padding: '2.25rem', maxWidth: '750px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Megaphone size={24} color="#d97706" /> Broadcast Live Portal Announcement
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
              Publish official announcements, meeting notices, or fellowship updates directly to the top ticker across all portal pages.
            </p>
          </div>

          {announcementStatus && (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderRadius: '8px', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle2 size={20} /> {announcementStatus}
            </div>
          )}

          <form onSubmit={handlePublishAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Live Top Ticker Text
              </label>
              <textarea 
                rows={3}
                required
                className="form-input"
                style={{ borderRadius: '10px', fontSize: '0.92rem', padding: '0.75rem', lineHeight: 1.5 }}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. ✨ Next General Online Meeting: Sunday 1st October @ 4:00 PM GMT on Zoom!"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                This message broadcasts instantly to all logged-in members and public visitors on the top header banner.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setAnnouncementText("Welcome to ONUADO NA EYE MENS' FELLOWSHIP • \"Brotherly Love & Solidarity in Action\"")}
                className="btn btn-secondary" 
                style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
              >
                Reset Default
              </button>
              <button 
                type="submit" 
                className="btn btn-accent" 
                style={{ padding: '0.65rem 1.35rem', fontSize: '0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Megaphone size={17} /> Publish Live Ticker
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 EXECUTIVE MASTER MEMBER DOSSIER MODAL (ALL 45 FIELDS DISPLAYED) */}
      {selectedDossierMember && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(6px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '1.25rem 1rem', 
          overflowY: 'auto' 
        }}>
          <div className="glass-card" style={{ 
            maxWidth: '1100px', 
            width: '100%', 
            margin: 'auto', 
            padding: '2.25rem', 
            borderRadius: '24px', 
            background: 'var(--bg-card)', 
            maxHeight: '88vh', 
            overflowY: 'auto', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-admin" style={{ fontWeight: 800 }}>
                    Member #{selectedDossierMember.member_no} • {selectedDossierMember.excel_member_id}
                  </span>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: selectedDossierMember.status === 'ACTIVE' ? '#10b981' : '#f59e0b', color: '#fff', fontWeight: 800 }}>
                    {selectedDossierMember.status || 'ACTIVE'}
                  </span>
                  {/* Outstanding Dues Balance Badge */}
                  {(() => {
                    const bal = selectedDossierMember.balance_owed !== undefined ? selectedDossierMember.balance_owed : Math.max(0, (selectedDossierMember.dues_fee_required || 3900) - (selectedDossierMember.dues_paid || 0));
                    return (
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem5rem', borderRadius: '12px', background: bal > 0 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(5, 150, 105, 0.15)', color: bal > 0 ? '#dc2626' : '#059669', border: '1px solid currentColor', fontWeight: 800 }}>
                        {bal > 0 ? `Outstanding: GH₵ ${bal.toFixed(2)} ⚠️` : 'Dues Settled ✓'}
                      </span>
                    );
                  })()}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', margin: 0, lineHeight: 1.2 }}>
                  {selectedDossierMember.title} {selectedDossierMember.full_name}
                </h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {selectedDossierMember.position} • Branch: <strong>{selectedDossierMember.branch}</strong> • Date Joined: <strong>{selectedDossierMember.date_joined}</strong>
                </div>
              </div>

              <button 
                onClick={() => setSelectedDossierMember(null)} 
                aria-label="Close Master Dossier"
                style={{ 
                  background: 'var(--bg-main)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '50%', 
                  width: '38px', 
                  height: '38px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  flexShrink: 0, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 45 FIELDS DOSSIER CONTENT GRID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Category 1: Contact & Address Directory */}
              <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} /> 1. Contact & Digital Address Directory
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Primary Phone 1</div><strong>{selectedDossierMember.phone_number || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Secondary Phone 2</div><strong>{selectedDossierMember.phone_number_2 || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>House Number</div><strong>{selectedDossierMember.house_no || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Ghana Post GPS Address</div><strong style={{ fontFamily: 'monospace', color: '#059669' }}>{selectedDossierMember.gps_address || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Residential Town</div><strong>{selectedDossierMember.town || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Official Email</div><strong>{selectedDossierMember.email || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Ghana Card ID</div><strong style={{ color: '#2563eb' }}>{selectedDossierMember.ghana_card || '—'}</strong></div>
                </div>
              </div>

              {/* Category 2: Origin, Heritage & Workplace */}
              <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} /> 2. Origin, Heritage & Workplace Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Occupation</div><strong>{selectedDossierMember.occupation || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Place of Work</div><strong>{selectedDossierMember.place_of_work || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Date of Birth</div><strong>{selectedDossierMember.date_of_birth || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Place of Birth</div><strong>{selectedDossierMember.place_of_birth || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Hometown</div><strong>{selectedDossierMember.hometown || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>District & Region</div><strong>{selectedDossierMember.district || '—'}, {selectedDossierMember.region || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Tribe</div><strong>{selectedDossierMember.tribe || '—'}</strong></div>
                </div>
              </div>

              {/* Category 3: Family, Next of Kin & Parents */}
              <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={18} /> 3. Family, Next of Kin & Parents Directory
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Next of Kin Name</div><strong>{selectedDossierMember.next_of_kin || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Relationship to Member</div><strong>{selectedDossierMember.next_of_kin_relation || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Next of Kin Phone</div><strong>{selectedDossierMember.next_of_kin_contact || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Marital Status</div><strong>{selectedDossierMember.marital_status || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Spouse Name & Phone</div><strong>{selectedDossierMember.spouse_name || '—'} ({selectedDossierMember.spouse_contact || '—'})</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Children Count</div><strong>{selectedDossierMember.children_count || '—'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Father Name & Phone</div><strong>{selectedDossierMember.father_name || '—'} ({selectedDossierMember.father_contact || '—'}) • Status: {selectedDossierMember.father_state || 'Alive'}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Mother Name & Phone</div><strong>{selectedDossierMember.mother_name || '—'} ({selectedDossierMember.mother_contact || '—'}) • Status: {selectedDossierMember.mother_state || 'Alive'}</strong></div>
                </div>
              </div>

              {/* Category 4: Complete Financial Ledger & Shares Entitlements */}
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(217, 119, 6, 0.08))', borderRadius: '16px', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} /> 4. Financial Ledger & Outstanding Dues Balance
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Registration Fee</div><strong style={{ color: '#059669' }}>GH₵ {(selectedDossierMember.reg_fees || 200).toFixed(2)}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Dues Paid</div><strong style={{ color: '#059669' }}>GH₵ {(selectedDossierMember.dues_paid || 0).toFixed(2)}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Levy Paid</div><strong style={{ color: '#3b82f6' }}>GH₵ {(selectedDossierMember.levy_paid || 0).toFixed(2)}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Payments</div><strong style={{ color: '#d97706' }}>GH₵ {(selectedDossierMember.total_payments || 0).toFixed(2)}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Dues Fee Required</div><strong>GH₵ {(selectedDossierMember.dues_fee_required || 3900).toFixed(2)}</strong></div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Outstanding Dues Balance</div>
                    {(() => {
                      const bal = selectedDossierMember.balance_owed !== undefined ? selectedDossierMember.balance_owed : Math.max(0, (selectedDossierMember.dues_fee_required || 3900) - (selectedDossierMember.dues_paid || 0));
                      return (
                        <strong style={{ color: bal > 0 ? '#dc2626' : '#059669', fontSize: '1.05rem', fontWeight: 900 }}>
                          GH₵ {bal.toFixed(2)} {bal > 0 ? '⚠️' : '✓'}
                        </strong>
                      );
                    })()}
                  </div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Shares Dividends Count</div><strong>{selectedDossierMember.shares_dividends || 0} Shares</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Shares Value</div><strong>GH₵ {(selectedDossierMember.shares_value || 0).toFixed(2)}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Treasurer Bill</div><strong>GH₵ {(selectedDossierMember.treasurer_bill || 0).toFixed(2)}</strong></div>
                  <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Shares Holding Total</div><strong style={{ color: '#8b5cf6', fontSize: '1rem' }}>GH₵ {(selectedDossierMember.shares_holding || 0).toFixed(2)}</strong></div>
                </div>
              </div>

              {/* Category 5: Special Levies Breakdown */}
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={18} /> 5. Special Levies Breakdown (Extracted from SPECIAL LEVY Sheet)
                </h3>
                <div className="table-container">
                  <table className="data-table" style={{ fontSize: '0.82rem' }}>
                    <thead>
                      <tr>
                        <th>Levy Call-Up</th>
                        <th>Person Raised For (Header Column)</th>
                        <th>Standard Rate</th>
                        <th>Member Paid</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMemberLevyDetails(selectedDossierMember).slice(0, 6).map(levy => (
                        <tr key={levy.id}>
                          <td style={{ fontWeight: 800, color: '#3b82f6' }}>{levy.number}</td>
                          <td style={{ fontWeight: 800 }}>{levy.recipient}</td>
                          <td>GH₵ {levy.amount.toFixed(2)}</td>
                          <td style={{ fontWeight: 800, color: levy.amountPaid > 0 ? '#059669' : (levy.isExempt ? '#d97706' : 'var(--text-muted)') }}>
                            GH₵ {levy.amountPaid.toFixed(2)}
                          </td>
                          <td>
                            <span className={`badge ${levy.statusClass}`} style={{ fontSize: '0.7rem' }}>
                              {levy.statusText}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedDossierMember(null)} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontWeight: 800 }}>
                Close Master Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
