import React, { useState } from 'react';
import { Shield, UploadCloud, PlusCircle, Users, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Copy, Search, ArrowRight, User, Eye, Download, X, MapPin, Phone, Mail, Heart, Building2, Calendar, FileText, CreditCard, Megaphone, Sparkles, TrendingUp, TrendingDown, Edit3, Zap, Check, Sliders, DollarSign, History, Clock, Filter, ArrowUpRight, ArrowDownRight, Tag, Car, Trash2, UserPlus, UserCheck, UserX } from 'lucide-react';
import { parseUploadedFile } from '../utils/excelParser';
import { handleExcelUpload } from '../utils/excelHandler';
import { addContribution, bulkAddContributions, getMembers, resetMembersToBaseline, getAnnouncement, saveAnnouncement, updateMemberDuesDirectly, updateMemberLevyDirectly, updateMemberVehicleSharesDirectly, calculateDuesImpact, getKeyInHistory, getTrialBalanceItems, addTrialBalanceItem, deleteTrialBalanceItem, resetTrialBalanceToDefaults, addNewMember, updateMemberStatus, getPendingApplications, approvePendingApplication, rejectPendingApplication } from '../services/store';
import { getMemberLevyDetails } from '../utils/levyData';
import { getMemberVehicleShares } from '../utils/vehicleSharesData';
import LoadingModal from '../components/LoadingModal';
import PettyCashVehicleModal from '../components/PettyCashVehicleModal';
import BankAccountTemaModal from '../components/BankAccountTemaModal';

export default function AdminPage({ currentUser, members, setMembers, contributions, setContributions, setActivePage }) {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster', 'history', 'manual', 'announcement', 'treasury'
  const [showAllBranches, setShowAllBranches] = useState(false);

  // Petty Cash Vehicle Modal State
  const [isPettyCashVehicleModalOpen, setIsPettyCashVehicleModalOpen] = useState(false);
  const [isBankTemaModalOpen, setIsBankTemaModalOpen] = useState(false);

  // Dynamic Trial Balance State
  const [trialBalanceItems, setTrialBalanceItems] = useState(() => getTrialBalanceItems());
  const [isTBModalOpen, setIsTBModalOpen] = useState(false);
  const [tbParticulars, setTbParticulars] = useState('');
  const [tbAmount, setTbAmount] = useState('');
  const [tbType, setTbType] = useState('income'); // 'income' or 'expenditure'
  const [tbCategory, setTbCategory] = useState('Income');
  const [tbError, setTbError] = useState('');

  const handleAddTrialBalanceSubmit = (e) => {
    e.preventDefault();
    setTbError('');
    if (!tbParticulars.trim()) {
      setTbError('Please enter a description for the line item.');
      return;
    }
    const val = parseFloat(tbAmount);
    if (isNaN(val) || val <= 0) {
      setTbError('Please enter a valid amount greater than GH₵ 0.00.');
      return;
    }

    const updated = addTrialBalanceItem({
      particulars: tbParticulars,
      amount: val,
      type: tbType,
      category: tbCategory || (tbType === 'income' ? 'Income' : 'Expenditure')
    });
    setTrialBalanceItems(updated);
    setTbParticulars('');
    setTbAmount('');
    setTbError('');
    setIsTBModalOpen(false);
  };

  const handleDeleteTBItem = (id, particulars) => {
    if (window.confirm(`Are you sure you want to remove "${particulars}" from the Trial Balance?`)) {
      const updated = deleteTrialBalanceItem(id);
      setTrialBalanceItems(updated);
    }
  };

  const handleResetTBToDefaults = () => {
    if (window.confirm('Reset Trial Balance back to original Excel baseline (GH₵ 88,503.20)? Any custom added items will be cleared.')) {
      const updated = resetTrialBalanceToDefaults();
      setTrialBalanceItems(updated);
    }
  };

  // Member Roster Status Filter & Registration Management
  const [rosterStatusFilter, setRosterStatusFilter] = useState('all'); // 'all', 'ACTIVE', 'PROBATION', 'REMOVED', 'PENDING'
  const [pendingApps, setPendingApps] = useState(() => getPendingApplications());
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    full_name: '',
    phone_number: '',
    branch: 'Tema',
    title: 'Brother',
    position: 'Member',
    occupation: '',
    next_of_kin: '',
    next_of_kin_contact: '',
    hometown: '',
    status: 'PROBATION',
    initial_dues: '',
    initial_levy: ''
  });
  const [addMemberError, setAddMemberError] = useState('');

  // Handle Quick Status Change
  const handleStatusChange = (memberId, newStatus) => {
    const updated = updateMemberStatus(memberId, newStatus, currentUser?.full_name || 'Executive Admin');
    if (updated) {
      setMembers(updated);
      setKeyInHistory(getKeyInHistory());
    }
  };

  // Handle Direct Executive New Member Registration
  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    setAddMemberError('');
    if (!newMemberForm.full_name.trim()) {
      setAddMemberError('Please enter the full name of the new member.');
      return;
    }
    const { updatedMembers } = addNewMember({
      ...newMemberForm,
      recorded_by: currentUser?.full_name || 'Executive Admin'
    });
    setMembers(updatedMembers);
    setKeyInHistory(getKeyInHistory());
    setIsAddMemberModalOpen(false);
    setNewMemberForm({
      full_name: '',
      phone_number: '',
      branch: 'Tema',
      title: 'Brother',
      position: 'Member',
      occupation: '',
      next_of_kin: '',
      next_of_kin_contact: '',
      hometown: '',
      status: 'PROBATION',
      initial_dues: '',
      initial_levy: ''
    });
  };

  // Handle Approve Pending Applicant
  const handleApproveApplicant = (appId, statusToAssign = 'PROBATION') => {
    const res = approvePendingApplication(appId, statusToAssign);
    if (res) {
      setMembers(res.updatedMembers);
      setPendingApps(res.remainingPending);
      setKeyInHistory(getKeyInHistory());
    }
  };

  // Handle Reject Pending Applicant
  const handleRejectApplicant = (appId) => {
    if (window.confirm('Are you sure you want to reject this membership application?')) {
      const remaining = rejectPendingApplication(appId);
      setPendingApps(remaining);
    }
  };

  // Key-In Audit History State
  const [keyInHistory, setKeyInHistory] = useState(() => getKeyInHistory());
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all', 'dues', 'levy', 'vehicle', 'add', 'deduct', 'momo', 'cash', 'bank'

  // Direct Key-In Multi-Category Editor State
  const [isDuesEditorOpen, setIsDuesEditorOpen] = useState(false);
  const [editorCategory, setEditorCategory] = useState('dues'); // 'dues', 'levy', 'vehicle'
  const [editorMemberId, setEditorMemberId] = useState(members[0]?.id || '');
  const [editorMode, setEditorMode] = useState('add'); // 'add' (top up) or 'set' (exact new total for dues)
  const [editorDuesYear, setEditorDuesYear] = useState('2025');
  const [editorAmount, setEditorAmount] = useState('');
  const [editorMethod, setEditorMethod] = useState('Mobile Money');
  const [editorDate, setEditorDate] = useState(new Date().toISOString().split('T')[0]);
  const [editorNote, setEditorNote] = useState('');
  const [editorLevyName, setEditorLevyName] = useState('1st LEVY (ELD. ISAAC DARKO)');
  const [editorCustomLevy, setEditorCustomLevy] = useState('');
  const [editorInstallment, setEditorInstallment] = useState('1st Installment Payment (GH₵ 500.00)');
  const [editorError, setEditorError] = useState('');

  const openDuesEditorForMember = (member, category = 'dues') => {
    if (!member) return;
    setEditorCategory(category);
    setEditorMemberId(member.id);
    setEditorMode('add');
    setEditorDuesYear('2025');
    setEditorAmount('');
    setEditorMethod('Mobile Money');
    setEditorDate(new Date().toISOString().split('T')[0]);
    setEditorNote('');
    setEditorLevyName('1st LEVY (ELD. ISAAC DARKO)');
    setEditorCustomLevy('');
    setEditorInstallment('1st Installment Payment (GH₵ 500.00)');
    setEditorError('');
    setIsDuesEditorOpen(true);
  };

  const handleDirectDuesSubmit = (e) => {
    e.preventDefault();
    setEditorError('');

    const targetMember = members.find(m => m.id === editorMemberId);
    if (!targetMember) {
      setEditorError('Please select a member.');
      return;
    }

    const inputVal = parseFloat(editorAmount);
    if (isNaN(inputVal) || inputVal <= 0) {
      setEditorError('Please enter a valid positive payment amount.');
      return;
    }

    try {
      if (editorCategory === 'dues') {
        const currentDues = parseFloat(targetMember.dues_paid) || 0;
        const targetDues = editorMode === 'add' ? (currentDues + inputVal) : inputVal;
        const yearTag = editorDuesYear && editorDuesYear !== 'General Dues Pool' ? `${editorDuesYear} Dues` : 'Yearly Dues';

        const result = updateMemberDuesDirectly({
          memberId: targetMember.id,
          newDuesAmount: targetDues,
          duesYear: editorDuesYear,
          paymentMethod: editorMethod,
          referenceNote: editorNote || (editorMode === 'add' ? `${yearTag} Payment Top-up (+GH₵ ${inputVal.toFixed(2)})` : `${yearTag} Set Total Dues (GH₵ ${targetDues.toFixed(2)})`),
          paymentDate: editorDate,
          receivedByName: currentUser?.full_name || 'Executive Admin'
        });

        if (setMembers) setMembers(result.updatedMembers);
        if (setContributions) setContributions(result.updatedContributions);
        setKeyInHistory(getKeyInHistory());

        const diffLabel = result.delta >= 0 ? `+GH₵ ${result.delta.toFixed(2)}` : `-GH₵ ${Math.abs(result.delta).toFixed(2)}`;
        setImportSuccess(`✅ Successfully updated ${result.affectedMember.full_name}'s Yearly Dues to GH₵ ${result.newDues.toFixed(2)} (${diffLabel})! All Shares, Dividends, and Fellowship Grand Totals recalculated live.`);
      } else if (editorCategory === 'levy') {
        const finalLevyName = editorLevyName === 'Custom' ? (editorCustomLevy || 'Special Call-Up') : editorLevyName;

        const result = updateMemberLevyDirectly({
          memberId: targetMember.id,
          levyName: finalLevyName,
          levyAmount: inputVal,
          paymentMethod: editorMethod,
          referenceNote: editorNote || `Special Levy Key-In: ${finalLevyName} (+GH₵ ${inputVal.toFixed(2)})`,
          paymentDate: editorDate,
          receivedByName: currentUser?.full_name || 'Executive Admin'
        });

        if (setMembers) setMembers(result.updatedMembers);
        if (setContributions) setContributions(result.updatedContributions);
        setKeyInHistory(getKeyInHistory());

        setImportSuccess(`✅ Successfully recorded Special Levy payment (+GH₵ ${inputVal.toFixed(2)}) for ${result.affectedMember.full_name} under [${finalLevyName}]! New Special Levy Total: GH₵ ${result.newLevy.toFixed(2)}.`);
      } else if (editorCategory === 'vehicle') {
        const result = updateMemberVehicleSharesDirectly({
          memberId: targetMember.id,
          installmentName: editorInstallment,
          amount: inputVal,
          paymentMethod: editorMethod,
          referenceNote: editorNote || `Vehicle Shares Key-In: ${editorInstallment} (+GH₵ ${inputVal.toFixed(2)})`,
          paymentDate: editorDate,
          receivedByName: currentUser?.full_name || 'Executive Admin'
        });

        if (setMembers) setMembers(result.updatedMembers);
        if (setContributions) setContributions(result.updatedContributions);
        setKeyInHistory(getKeyInHistory());

        setImportSuccess(`✅ Successfully recorded Vehicle Shares payment (+GH₵ ${inputVal.toFixed(2)}) for ${result.affectedMember.full_name} under [${editorInstallment}]! Total Vehicle Shares: ${result.newVehicleSharesCount} Shares (GH₵ ${result.newVehiclePaid.toFixed(2)}).`);
      }

      setIsDuesEditorOpen(false);
      setTimeout(() => setImportSuccess(''), 7000);
    } catch (err) {
      setEditorError(err.message || 'Error executing direct key-in entry.');
    }
  };

  // Uploader State
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');

  // Loading Modal State for Excel Upload / Import
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState('');
  const [loadingSubtitle, setLoadingSubtitle] = useState('');

  // Master Financial Totals Modal State
  const [isTotalsModalOpen, setIsTotalsModalOpen] = useState(false);
  const [totalsModalSearch, setTotalsModalSearch] = useState('');

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

  // Filtered Key-In Audit History
  const filteredHistory = keyInHistory.filter(item => {
    const matchesSearch = 
      (item.memberName && item.memberName.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.excelMemberId && item.excelMemberId.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.branch && item.branch.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.referenceNote && item.referenceNote.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.entryType && item.entryType.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.levyName && item.levyName.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.installmentName && item.installmentName.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.recordedBy && item.recordedBy.toLowerCase().includes(historySearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (historyFilter === 'dues') return item.category === 'dues' || !item.category || item.entryType?.toLowerCase().includes('dues');
    if (historyFilter === 'levy') return item.category === 'levy' || item.entryType?.toLowerCase().includes('levy');
    if (historyFilter === 'vehicle') return item.category === 'vehicle' || item.entryType?.toLowerCase().includes('vehicle');
    if (historyFilter === 'add') return item.action === 'add' || item.delta > 0;
    if (historyFilter === 'deduct') return item.action === 'deduct' || item.delta < 0;
    if (historyFilter === 'momo') return item.paymentMethod?.toLowerCase().includes('momo') || item.paymentMethod?.toLowerCase().includes('mobile money');
    if (historyFilter === 'cash') return item.paymentMethod?.toLowerCase().includes('cash');
    if (historyFilter === 'bank') return item.paymentMethod?.toLowerCase().includes('bank') || item.paymentMethod?.toLowerCase().includes('fidelity');

    return true;
  });

  const handleExportHistoryCSV = () => {
    const headers = [
      'Entry ID',
      'Date & Time',
      'Member Name',
      'Member ID',
      'Branch',
      'Entry Type',
      'Payment Method',
      'Dues Before (GHc)',
      'Dues After (GHc)',
      'Delta Amount (GHc)',
      'Action',
      'Shares Value After (GHc)',
      'Grand Total After (GHc)',
      'Recorded By',
      'Reference Note'
    ];

    const rows = filteredHistory.map(h => [
      `"${h.id}"`,
      `"${h.paymentDate || h.timestamp}"`,
      `"${h.memberName}"`,
      `"${h.excelMemberId || ''}"`,
      `"${h.branch || ''}"`,
      `"${h.entryType || 'Yearly Dues Key-In'}"`,
      `"${h.paymentMethod || 'Cash'}"`,
      h.oldDues ?? 0,
      h.newDues ?? 0,
      h.amount ?? Math.abs(h.delta || 0),
      `"${h.action || (h.delta >= 0 ? 'add' : 'deduct')}"`,
      h.newShares ?? 0,
      h.newGrandTotal ?? 0,
      `"${h.recordedBy || 'Executive Admin'}"`,
      `"${(h.referenceNote || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ONUADO_NA_EYE_KeyIn_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

    setLoadingTitle('Scanning & Analyzing Excel File...');
    setLoadingSubtitle('Cross-checking member yearly dues & special levy ledgers...');
    setIsLoadingModalOpen(true);

    try {
      const result = await parseUploadedFile(file, members);
      setParseResult(result);
    } catch (err) {
      alert('Error parsing file: ' + err.message);
    } finally {
      setTimeout(() => {
        setIsParsing(false);
        setIsLoadingModalOpen(false);
      }, 600);
    }
  };

  const handleDirectDuesUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setLoadingTitle('Processing Updated Excel Dues...');
    setLoadingSubtitle('Matching members, updating yearly dues & recalculating shares total...');
    setIsLoadingModalOpen(true);

    setTimeout(() => {
      handleExcelUpload(file, members, setMembers, ({ success, updatedCount, error }) => {
        setIsLoadingModalOpen(false);
        if (success) {
          setImportSuccess(`Dues updated and totals recalculated successfully! (${updatedCount} member(s) updated)`);
          setTimeout(() => setImportSuccess(''), 5000);
        } else {
          alert('Excel Upload Error: ' + (error || 'Unknown error'));
        }
      });
    }, 500);

    e.target.value = '';
  };

  const handleBulkImport = () => {
    if (!parseResult || parseResult.matched.length === 0) return;

    setLoadingTitle('Updating Member Information & Ledgers...');
    setLoadingSubtitle('Syncing member dues, outstanding balances, shares dividends, and grand total holdings...');
    setIsLoadingModalOpen(true);

    setTimeout(() => {
      const entriesToInsert = parseResult.matched.map(item => ({
        member_id: item.member_id,
        amount: item.amount,
        action: 'add',
        contribution_type: item.contribution_type,
        payment_method: item.payment_method,
        reference_note: item.reference_note + ` (Excel Row ${item.rowNum})`,
        payment_date: item.payment_date,
        received_by_name: currentUser?.full_name || 'Admin',
        excelDues: item.excelDues,
        excelLevy: item.excelLevy,
        excelTotal: item.excelTotal
      }));

      const updated = bulkAddContributions(entriesToInsert);
      setContributions(updated);

      if (setMembers) {
        setMembers(getMembers());
      }

      setImportSuccess(`Successfully applied ${entriesToInsert.length} member payment updates & synced all ledgers!`);
      setParseResult(null);
      setIsLoadingModalOpen(false);

      setTimeout(() => setImportSuccess(''), 5000);
    }, 1200);
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
    if (setMembers) {
      setMembers(getMembers());
    }
    setKeyInHistory(getKeyInHistory());
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

      {/* Quick Branch & Member Status Summary Cards */}
      {(() => {
        const activeCount = members.filter(m => m.status === 'ACTIVE').length;
        const probationCount = members.filter(m => m.status === 'PROBATION').length;
        const removedCount = members.filter(m => m.status === 'REMOVED').length;
        const pendingCount = pendingApps.length;

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            {/* Expanded Member Status Breakdown Card */}
            <div className="glass-card" style={{ padding: '1.35rem', borderLeft: '5px solid #059669', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Total Registered Members
                </div>
                <span className="badge badge-dues" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                  {members.length} Members Total
                </span>
              </div>

              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                {members.length} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Members</span>
              </div>

              {/* Status Breakdown Sub-bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
                <div 
                  onClick={() => { setActiveTab('roster'); setRosterStatusFilter('ACTIVE'); }}
                  style={{ cursor: 'pointer', padding: '0.45rem 0.6rem', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '10px', border: '1px solid rgba(5, 150, 105, 0.3)', transition: 'all 0.2s ease' }}
                  title="Click to view Active members"
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>🟢</span> Active
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                    {activeCount}
                  </div>
                </div>

                <div 
                  onClick={() => { setActiveTab('roster'); setRosterStatusFilter('PROBATION'); }}
                  style={{ cursor: 'pointer', padding: '0.45rem 0.6rem', background: 'rgba(217, 119, 6, 0.1)', borderRadius: '10px', border: '1px solid rgba(217, 119, 6, 0.3)', transition: 'all 0.2s ease' }}
                  title="Click to view Probation members"
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>🟡</span> Probation
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                    {probationCount}
                  </div>
                </div>

                <div 
                  onClick={() => { setActiveTab('roster'); setRosterStatusFilter('REMOVED'); }}
                  style={{ cursor: 'pointer', padding: '0.45rem 0.6rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '10px', border: '1px solid rgba(220, 38, 38, 0.3)', transition: 'all 0.2s ease' }}
                  title="Click to view Removed members"
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>🔴</span> Removed
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                    {removedCount}
                  </div>
                </div>

                {pendingCount > 0 && (
                  <div 
                    onClick={() => { setActiveTab('roster'); setRosterStatusFilter('PENDING'); }}
                    style={{ cursor: 'pointer', padding: '0.45rem 0.6rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.3)', transition: 'all 0.2s ease' }}
                    title="Click to view Pending applications"
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>📩</span> Pending
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                      {pendingCount}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Fellowship Branches Card */}
            <div className="glass-card" style={{ padding: '1.35rem', borderLeft: '5px solid #d97706', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Active Fellowship Branches
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#d97706', marginTop: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                  {new Set(members.map(m => m.branch || 'Tema')).size} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Branches</span>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
                Includes Tema, Mampong, Accra, Kumasi & regional branches.
              </div>
            </div>

          </div>
        );
      })()}

      {/* 💳 OFFICIAL FELLOWSHIP ACCOUNTS & TREASURY BALANCES (MTN MOMO, FIDELITY BANK, BANK ACCOUNT TEMA, & GRAND TOTAL) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.05), rgba(37, 99, 235, 0.05))', border: '2px solid rgba(5, 150, 105, 0.3)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', marginBottom: '1rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} color="#059669" /> Official Fellowship Accounts & Bank Balances (From Excel Sheets)
          </div>
          <button 
            onClick={() => setActiveTab('treasury')} 
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Eye size={14} /> View Complete Ledger & Trial Balance &rarr;
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          
          {/* 1. MTN MOMO ACCOUNT SHEET */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(217, 119, 6, 0.3)', borderTop: '4px solid #d97706', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  MTN MOMO ACCOUNT SHEET
                </span>
                <span className="badge badge-dues" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>MTN MOMO</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                GH₵ 1.95
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Ending MoMo Balance (Line: <strong>0530486443</strong>)
              </div>
            </div>
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Inflows:</span> <strong style={{ color: '#059669' }}>GH₵ 102,088.75</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Disbursements:</span> <strong>GH₵ 102,086.80</strong>
              </div>
            </div>
          </div>

          {/* 2. FIDELITY BANK SHEET */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(5, 150, 105, 0.3)', borderTop: '4px solid #059669', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  FIDELITY BANK SHEET
                </span>
                <span className="badge badge-dues" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>FIDELITY</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                GH₵ 10,698.88
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Ending Bank Balance (Acc: <strong>2090182444410</strong>)
              </div>
            </div>
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Cash Deposited:</span> <strong>GH₵ 125,113.88</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Withdrawals/Inv:</span> <strong>GH₵ 114,415.00</strong>
              </div>
            </div>
          </div>

          {/* 3. BANK ACCOUNT SHEET (TEMA) */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(37, 99, 235, 0.3)', borderTop: '4px solid #2563eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  BANK ACCOUNT TEMA
                </span>
                <span className="badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb' }}>CREDIT UNION</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#2563eb', marginTop: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                GH₵ 366.24
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Net Balance (Acc: <strong>2161006002421201</strong>)
              </div>
            </div>
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Income (Inflows):</span> <strong style={{ color: '#059669' }}>+GH₵ 5,766.24</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Expenses (Outflows):</span> <strong style={{ color: '#dc2626' }}>-GH₵ 5,400.00</strong>
              </div>
              <button 
                onClick={() => setIsBankTemaModalOpen(true)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.3rem 0.5rem', fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
              >
                <FileSpreadsheet size={12} /> View Particulars Breakdown &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 📊 EXCEL MASTER FINANCIAL TOTALS (SHARES TOTAL, TREASURER BILL TOTAL, GRAND AMOUNT) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(37, 99, 235, 0.05))', border: '2px solid rgba(220, 38, 38, 0.3)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', marginBottom: '1rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} /> Fellowship Master Financial Totals (Live Sync)
          </div>
          <button 
            onClick={() => {
              setEditorMemberId(members[0]?.id || '');
              setEditorMode('add');
              setEditorAmount('');
              setEditorError('');
              setIsDuesEditorOpen(true);
            }} 
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}
          >
            <Zap size={14} /> ⚡ Key In Member Dues
          </button>
        </div>

        {(() => {
          const sharesTotalVal = members.reduce((sum, m) => sum + (parseFloat(m.shares_value) || 0), 0);
          const treasBillTotalVal = members.reduce((sum, m) => sum + (parseFloat(m.treasurer_bill) || 0), 0);
          const grandMasterTotalVal = sharesTotalVal + treasBillTotalVal;
          const combinedNetWorth = grandMasterTotalVal + 11067.07;

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(37, 99, 235, 0.3)', borderTop: '4px solid #2563eb' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SHARES TOTAL
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
                  GH₵ {sharesTotalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Sum of All Member Shares Values</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1.5px solid rgba(217, 119, 6, 0.3)', borderTop: '4px solid #d97706' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TREASURER BILL TOTAL
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
                  GH₵ {treasBillTotalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Sum of All Treasurer Bills</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(124, 58, 237, 0.1))', borderRadius: '12px', border: '2px solid #dc2626', borderTop: '5px solid #dc2626' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>GRAND AMOUNT</span>
                  <span className="badge badge-welfare" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>Master Total</span>
                </div>
                <div style={{ fontSize: '2.05rem', fontWeight: 900, color: '#dc2626', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
                  GH₵ {grandMasterTotalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Shares Total + Treasurer Bill Total</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Navigation Tabs & Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              setEditorMemberId(members[0]?.id || '');
              setEditorMode('add');
              setEditorAmount('');
              setEditorError('');
              setIsDuesEditorOpen(true);
            }} 
            className="btn"
            style={{ padding: '0.6rem 1.15rem', fontWeight: 800, fontSize: '0.88rem', background: '#059669', color: '#fff', border: '1px solid #059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}
          >
            <Zap size={16} /> ⚡ Key In Member Dues
          </button>
          <button 
            onClick={() => setActiveTab('roster')} 
            className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <Users size={16} /> Member Master Roster ({members.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <History size={16} color="#2563eb" /> Key-In Entry History ({keyInHistory.length})
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

          {/* 4 Treasury Account Cards Grid (MTN MoMo, Fidelity Bank, Bank Tema, and Grand Liquid Total) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.25rem' }}>
            
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total MoMo Inflows:</span><strong style={{ color: '#059669' }}>GH₵ 102,088.75</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Expenses & Vouchers:</span><strong>GH₵ 102,086.80</strong></div>
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

            {/* 3RD CARD: North Tema Co-Operative Credit Union */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '5px solid #2563eb', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(255, 255, 255, 0.02))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bank Account Tema (Credit Union)
                </span>
                <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb' }}>TEMA</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Account No: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>2161006002421201</strong></div>

              <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Net Ending Bank Balance</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#2563eb', marginTop: '0.15rem' }}>
                  GH₵ 366.24
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '0.15rem', fontWeight: 700 }}>
                  Calculated: Income (GH₵ 5,766.24) - Expenses (GH₵ 5,400.00)
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Bank Inflows (Income):</span><strong style={{ color: '#059669' }}>+GH₵ 5,766.24</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Outflows (Withdrawals):</span><strong style={{ color: '#dc2626' }}>-GH₵ 5,400.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank Shares Held:</span><strong>GH₵ 100.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Bank Interest:</span><strong style={{ color: '#d97706' }}>GH₵ 166.24</strong></div>
              </div>

              <button
                onClick={() => setIsBankTemaModalOpen(true)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.85rem', padding: '0.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <FileSpreadsheet size={14} /> Particulars & Ledger Breakdown &rarr;
              </button>
            </div>

            {/* 4TH CARD: Petty Cash Vehicle Fund */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '5px solid #ea580c', background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08), rgba(255, 255, 255, 0.02))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Petty Cash Vehicle Fund
                </span>
                <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' }}>VEHICLE PETTY</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Excel Sheet: <strong style={{ color: '#ea580c' }}>PETTY CASH VEHICLE</strong></div>

              <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ending Vehicle Fund Balance</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#ea580c', marginTop: '0.15rem' }}>
                  GH₵ 68,000.00
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank Reserve Capital:</span><strong>GH₵ 62,000.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Member Vehicle Shares:</span><strong style={{ color: '#059669' }}>GH₵ 6,000.00</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Vehicle Shares Paid:</span><strong>120 Shares</strong></div>
                <button
                  type="button"
                  onClick={() => setIsPettyCashVehicleModalOpen(true)}
                  className="btn btn-primary"
                  style={{ marginTop: '0.4rem', padding: '0.45rem 0.75rem', fontSize: '0.78rem', fontWeight: 800, background: '#ea580c', borderColor: '#ea580c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', width: '100%' }}
                >
                  📋 View Particulars &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* MASTER TRIAL BALANCE TABLE */}
          {(() => {
            const totalTBIncome = trialBalanceItems
              .filter(item => item.type === 'income')
              .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            const totalTBExpenditure = trialBalanceItems
              .filter(item => item.type === 'expenditure')
              .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            const isBalanced = Math.abs(totalTBIncome - totalTBExpenditure) < 0.05;

            return (
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <FileText size={20} color="#2563eb" /> Verified Fellowship Trial Balance Sheet
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                      Extracted from Excel sheet <strong>TRAIL BALANCE</strong> & dynamic entries. Total Balanced Income & Expenditure: <strong>GH₵ {totalTBIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => setIsTBModalOpen(true)}
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <PlusCircle size={16} /> + Add Line Item
                    </button>

                    <button 
                      type="button"
                      onClick={handleResetTBToDefaults}
                      className="btn btn-secondary"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.78rem', fontWeight: 700 }}
                      title="Reset to original Excel baseline"
                    >
                      <RefreshCw size={13} /> Reset Baseline
                    </button>

                    <div style={{ padding: '0.6rem 1rem', background: isBalanced ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)', borderRadius: '10px', border: `1px solid ${isBalanced ? 'rgba(5, 150, 105, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`, textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: isBalanced ? '#059669' : '#dc2626', fontWeight: 800 }}>Trial Balance Status</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        {isBalanced ? `GH₵ ${totalTBIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Unbalanced (Diff: GH₵ ${Math.abs(totalTBIncome - totalTBExpenditure).toFixed(2)})`}
                      </div>
                    </div>
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
                        <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Income Rows */}
                      <tr style={{ background: 'rgba(5, 150, 105, 0.05)', fontWeight: 800 }}>
                        <td colSpan={5} style={{ color: '#059669', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          🟢 Fellowship Income Accounts
                        </td>
                      </tr>
                      {trialBalanceItems.filter(item => item.type === 'income').map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 800 }}>{item.particulars}</td>
                          <td style={{ fontWeight: 800, color: '#059669' }}>
                            GH₵ {parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>—</td>
                          <td><span className="badge badge-dues">{item.category || 'Income'}</span></td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteTBItem(item.id, item.particulars)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem', opacity: 0.7 }}
                              title="Delete line item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Expenditure Rows */}
                      <tr style={{ background: 'rgba(37, 99, 235, 0.05)', fontWeight: 800 }}>
                        <td colSpan={5} style={{ color: '#2563eb', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          🔵 Fellowship Expenditures & Assets Accounts
                        </td>
                      </tr>
                      {trialBalanceItems.filter(item => item.type === 'expenditure').map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 800 }}>{item.particulars}</td>
                          <td style={{ color: 'var(--text-muted)' }}>—</td>
                          <td style={{ fontWeight: 800, color: item.category?.toLowerCase().includes('asset') ? '#059669' : '#2563eb' }}>
                            GH₵ {parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td><span className="badge badge-dues" style={{ background: item.category?.toLowerCase().includes('asset') ? 'rgba(5, 150, 105, 0.1)' : 'rgba(37, 99, 235, 0.1)', color: item.category?.toLowerCase().includes('asset') ? '#059669' : '#2563eb' }}>{item.category || 'Expenditure'}</span></td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteTBItem(item.id, item.particulars)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem', opacity: 0.7 }}
                              title="Delete line item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Grand Totals */}
                      <tr style={{ background: 'var(--bg-main)', borderTop: '2.5px solid var(--border-color)', fontSize: '1rem' }}>
                        <td style={{ fontWeight: 900, color: 'var(--primary-700)' }}>GRAND TOTALS</td>
                        <td style={{ fontWeight: 900, color: '#059669', fontSize: '1.1rem' }}>
                          GH₵ {totalTBIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ fontWeight: 900, color: '#2563eb', fontSize: '1.1rem' }}>
                          GH₵ {totalTBExpenditure.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          {isBalanced ? (
                            <span className="badge badge-dues" style={{ fontWeight: 800 }}>Balanced 100% ✓</span>
                          ) : (
                            <span className="badge badge-welfare" style={{ fontWeight: 800, background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626' }}>Unbalanced ⚠️</span>
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

        </div>
      )}



      {/* TAB 1: DIRECT KEY-IN AUDIT HISTORY & ENTRY LOG */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 800 }}>
                    <History size={13} /> Official Audit Trail
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-Time System Log</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-700)', margin: 0 }}>
                  Key-In Entries & Financial Modification History
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  Complete record of all member dues keyed in, top-ups logged, adjustments recorded, and live shares recalculations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleExportHistoryCSV}
                  className="btn btn-accent" 
                  style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={15} /> Export History (.CSV)
                </button>
                <button 
                  onClick={() => {
                    setEditorMemberId(members[0]?.id || '');
                    setEditorMode('add');
                    setEditorAmount('');
                    setEditorError('');
                    setIsDuesEditorOpen(true);
                  }}
                  className="btn btn-primary" 
                  style={{ padding: '0.6rem 1.15rem', fontSize: '0.85rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Zap size={15} /> ⚡ Key In New Dues
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            {(() => {
              const totalAdditions = keyInHistory
                .filter(item => item.delta > 0)
                .reduce((sum, item) => sum + (parseFloat(item.delta) || 0), 0);
              const uniqueMembersCount = new Set(keyInHistory.map(item => item.memberId || item.excelMemberId)).size;

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Entries Logged</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', marginTop: '0.2rem' }}>{keyInHistory.length} Entries</div>
                  </div>

                  <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Dues Top-Ups Keyed In</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>GH₵ {totalAdditions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>

                  <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Unique Members Modified</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>{uniqueMembersCount} Members</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Search, Filter Pills & Table Container */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              
              {/* Search Bar */}
              <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="Search member, ID, note, officer, method..."
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', width: '100%' }}
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Entries' },
                  { id: 'dues', label: '💳 Yearly Dues' },
                  { id: 'levy', label: '🏷️ Special Levies' },
                  { id: 'vehicle', label: '🚗 Vehicle Shares' },
                  { id: 'add', label: '+ Additions' },
                  { id: 'momo', label: 'MTN MoMo' },
                  { id: 'cash', label: 'Cash' },
                  { id: 'bank', label: 'Fidelity Bank' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryFilter(tab.id)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: historyFilter === tab.id ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                      background: historyFilter === tab.id ? '#2563eb' : 'var(--bg-main)',
                      color: historyFilter === tab.id ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

            </div>

            {/* History Table */}
            {filteredHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
                <Clock size={42} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
                  {historySearch ? 'No Matching Key-In Entries Found' : 'No Key-In Entries Recorded Yet'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 1.25rem auto' }}>
                  {historySearch 
                    ? 'No history matching your search query. Try clearing your search or filter pills.' 
                    : 'This audit history is clean and ready. Whenever you key in dues payments or adjustments for members, they will appear here with full timestamps and details.'}
                </p>
                {historySearch ? (
                  <button onClick={() => { setHistorySearch(''); setHistoryFilter('all'); }} className="btn btn-secondary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}>
                    Clear Search Filter
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setEditorMemberId(members[0]?.id || '');
                      setEditorMode('add');
                      setEditorAmount('');
                      setEditorError('');
                      setIsDuesEditorOpen(true);
                    }}
                    className="btn btn-primary" 
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Zap size={15} /> ⚡ Key In First Dues Entry
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table" style={{ fontSize: '0.88rem' }}>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Fellowship Member</th>
                      <th>Entry Type</th>
                      <th>Payment Method</th>
                      <th>Date & Time</th>
                      <th>Fellowship Member</th>
                      <th>Entry Category & Type</th>
                      <th>Payment Method</th>
                      <th>Payment / Ledger Change</th>
                      <th>Recalculated Standings</th>
                      <th>Recorded By & Memo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item, idx) => {
                      const deltaVal = parseFloat(item.delta) || 0;
                      const isPositive = deltaVal >= 0;
                      const targetMember = members.find(m => m.id === item.memberId || m.excel_member_id === item.excelMemberId);
                      const cat = item.category || (item.entryType?.toLowerCase().includes('levy') ? 'levy' : item.entryType?.toLowerCase().includes('vehicle') ? 'vehicle' : 'dues');

                      return (
                        <tr key={item.id || idx} style={{ background: isPositive ? 'rgba(5, 150, 105, 0.02)' : 'rgba(220, 38, 38, 0.02)' }}>
                          {/* Date & Time */}
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                              {item.paymentDate || (item.timestamp ? item.timestamp.split('T')[0] : '2026-09-28')}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                              <Clock size={11} /> {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:00 PM'}
                            </div>
                          </td>

                          {/* Member Details */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(5, 150, 105, 0.3)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.profilePicture ? (
                                  <img src={item.profilePicture} alt={item.memberName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <User size={16} color="var(--text-muted)" />
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800 }}>{item.memberName}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                  {item.excelMemberId || (item.memberNo ? `ONY-${String(item.memberNo).padStart(3, '0')}` : '')} • {item.branch}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Entry Category & Type */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span style={{ 
                                padding: '0.2rem 0.55rem', 
                                borderRadius: '12px', 
                                fontSize: '0.72rem', 
                                fontWeight: 800, 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                width: 'fit-content',
                                background: isPositive ? 'rgba(5, 150, 105, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                                color: isPositive ? '#059669' : '#dc2626'
                              }}>
                                {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                {isPositive ? `+GH₵ ${deltaVal.toFixed(2)}` : `-GH₵ ${Math.abs(deltaVal).toFixed(2)}`}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                {cat === 'levy' ? `🏷️ ${item.levyName || 'Special Levy'}` : cat === 'vehicle' ? `🚗 ${item.installmentName || 'Vehicle Shares'}` : `💳 ${item.duesYear ? `${item.duesYear} Dues` : 'Yearly Dues'}`}
                              </span>
                            </div>
                          </td>

                          {/* Payment Method */}
                          <td>
                            <span className="badge" style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 700, 
                              background: item.paymentMethod?.toLowerCase().includes('momo') ? 'rgba(217, 119, 6, 0.12)' : (item.paymentMethod?.toLowerCase().includes('bank') ? 'rgba(37, 99, 235, 0.12)' : 'rgba(5, 150, 105, 0.12)'),
                              color: item.paymentMethod?.toLowerCase().includes('momo') ? '#d97706' : (item.paymentMethod?.toLowerCase().includes('bank') ? '#2563eb' : '#059669')
                            }}>
                              {item.paymentMethod || 'Cash'}
                            </span>
                          </td>

                          {/* Ledger Change (Before → After) */}
                          <td>
                            {cat === 'levy' ? (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.85rem' }}>
                                  <span style={{ color: 'var(--text-muted)' }}>GH₵ {(item.oldValue ?? 0).toFixed(2)}</span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                                  <strong style={{ color: '#d97706' }}>GH₵ {(item.newValue ?? 0).toFixed(2)}</strong>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                  Special Levy Total
                                </div>
                              </div>
                            ) : cat === 'vehicle' ? (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.85rem' }}>
                                  <span style={{ color: 'var(--text-muted)' }}>GH₵ {(item.oldValue ?? 0).toFixed(2)}</span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                                  <strong style={{ color: '#2563eb' }}>GH₵ {(item.newValue ?? 0).toFixed(2)}</strong>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                  Vehicle Shares Capital
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.85rem' }}>
                                  <span style={{ color: 'var(--text-muted)' }}>GH₵ {(item.oldDues ?? 0).toFixed(2)}</span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                                  <strong style={{ color: '#059669' }}>GH₵ {(item.newDues ?? 0).toFixed(2)}</strong>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                  Balance Owed: <strong style={{ color: Math.max(0, 3900 - (item.newDues ?? 0)) > 0 ? '#dc2626' : '#059669' }}>GH₵ {Math.max(0, 3900 - (item.newDues ?? 0)).toFixed(2)}</strong>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Recalculated Standings */}
                          <td>
                            {cat === 'vehicle' ? (
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563eb' }}>
                                  Shares Owned: {Math.floor((item.newValue ?? 0) / 50)} Shares
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                  @ GH₵ 50.00 / Share
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563eb' }}>
                                  Shares: GH₵ {(item.newShares ?? targetMember?.shares_value ?? 0).toFixed(2)}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.1rem' }}>
                                  Grand Total: GH₵ {(item.newGrandTotal ?? targetMember?.shares_holding ?? 0).toFixed(2)}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Recorded By & Reference Note */}
                          <td>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              👤 {item.recordedBy || 'Executive Admin'}
                            </div>
                            {item.referenceNote && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontStyle: 'italic', maxWidth: '200px' }}>
                                "{item.referenceNote}"
                              </div>
                            )}
                          </td>

                          {/* Quick Action Button */}
                          <td>
                            <button 
                              onClick={() => {
                                if (targetMember) {
                                  openDuesEditorForMember(targetMember, cat);
                                } else {
                                  setEditorMemberId(item.memberId || members[0]?.id);
                                  setEditorCategory(cat);
                                  setIsDuesEditorOpen(true);
                                }
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Update this member's dues again"
                            >
                              <Edit3 size={12} color="#059669" /> Key In
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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
                    {m.full_name} ({m.phone_number}{m.phone_number_2 ? ` / ${m.phone_number_2}` : ''}) — {m.branch}
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

      {/* TAB 3: COMPLETE MEMBER ROSTER & EXECUTIVE STATUS MANAGEMENT */}
      {activeTab === 'roster' && (() => {
        const activeCount = members.filter(m => m.status === 'ACTIVE').length;
        const probationCount = members.filter(m => m.status === 'PROBATION').length;
        const removedCount = members.filter(m => m.status === 'REMOVED').length;
        const pendingCount = pendingApps.length;

        const filteredMembers = members.filter(m => {
          if (rosterStatusFilter !== 'all' && rosterStatusFilter !== 'PENDING') {
            if (m.status !== rosterStatusFilter) return false;
          }
          if (historySearch.trim()) {
            const q = historySearch.toLowerCase();
            const nameMatch = m.full_name?.toLowerCase().includes(q);
            const phoneMatch = m.phone_number?.includes(q) || m.phone_number_2?.includes(q);
            const branchMatch = m.branch?.toLowerCase().includes(q);
            const idMatch = m.excel_member_id?.toLowerCase().includes(q) || String(m.member_no).includes(q);
            if (!nameMatch && !phoneMatch && !branchMatch && !idMatch) return false;
          }
          return true;
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Status Summary & Filter Cards Header */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-700)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={22} color="#059669" /> Complete Member Roster & Executive Status Console
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    Filter by status, register new members, approve online applications, or inspect full 45-field dossiers.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button 
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}
                  >
                    <UserPlus size={16} /> + Register New Member
                  </button>
                  <button onClick={exportFullRosterCSV} className="btn btn-accent" style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Download size={15} /> Export CSV (45 Fields)
                  </button>
                </div>
              </div>

              {/* Status Breakdown Pills */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setRosterStatusFilter('all')}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: rosterStatusFilter === 'all' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-color)',
                    background: rosterStatusFilter === 'all' ? 'var(--primary-600)' : 'var(--bg-main)',
                    color: rosterStatusFilter === 'all' ? '#fff' : 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  👥 All Members ({members.length})
                </button>

                <button
                  onClick={() => setRosterStatusFilter('ACTIVE')}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: rosterStatusFilter === 'ACTIVE' ? '1.5px solid #059669' : '1px solid var(--border-color)',
                    background: rosterStatusFilter === 'ACTIVE' ? '#059669' : 'rgba(5, 150, 105, 0.08)',
                    color: rosterStatusFilter === 'ACTIVE' ? '#fff' : '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  🟢 Active ({activeCount})
                </button>

                <button
                  onClick={() => setRosterStatusFilter('PROBATION')}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: rosterStatusFilter === 'PROBATION' ? '1.5px solid #d97706' : '1px solid var(--border-color)',
                    background: rosterStatusFilter === 'PROBATION' ? '#d97706' : 'rgba(217, 119, 6, 0.08)',
                    color: rosterStatusFilter === 'PROBATION' ? '#fff' : '#d97706',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  🟡 Probation ({probationCount})
                </button>

                <button
                  onClick={() => setRosterStatusFilter('REMOVED')}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: rosterStatusFilter === 'REMOVED' ? '1.5px solid #dc2626' : '1px solid var(--border-color)',
                    background: rosterStatusFilter === 'REMOVED' ? '#dc2626' : 'rgba(220, 38, 38, 0.08)',
                    color: rosterStatusFilter === 'REMOVED' ? '#fff' : '#dc2626',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  🔴 Removed ({removedCount})
                </button>

                <button
                  onClick={() => setRosterStatusFilter('PENDING')}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: rosterStatusFilter === 'PENDING' ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                    background: rosterStatusFilter === 'PENDING' ? '#2563eb' : 'rgba(37, 99, 235, 0.08)',
                    color: rosterStatusFilter === 'PENDING' ? '#fff' : '#2563eb',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  📩 Pending Registrations ({pendingCount})
                  {pendingCount > 0 && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>}
                </button>
              </div>

            </div>

            {/* PENDING APPLICATIONS VIEW */}
            {rosterStatusFilter === 'PENDING' ? (
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                    📩 Online Pending Member Registrations ({pendingApps.length})
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    Applicants who submitted their bio-data online and paid GH₵ 200.00 registration fee awaiting Executive Approval.
                  </p>
                </div>

                {pendingApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
                    <UserCheck size={38} color="#059669" style={{ margin: '0 auto 0.75rem auto', opacity: 0.7 }} />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.3rem' }}>No Pending Applications</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                      All online applicant registrations have been reviewed and admitted.
                    </p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table" style={{ fontSize: '0.88rem' }}>
                      <thead>
                        <tr>
                          <th>Submitted Date</th>
                          <th>Applicant Name</th>
                          <th>Contact Phone</th>
                          <th>Branch</th>
                          <th>Reg Fee Paid</th>
                          <th>Payment Ref</th>
                          <th>Executive Approval Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApps.map(app => (
                          <tr key={app.id}>
                            <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{app.date_submitted}</td>
                            <td style={{ fontWeight: 800 }}>{app.title} {app.full_name}</td>
                            <td style={{ fontWeight: 700 }}>📞 {app.phone_number}</td>
                            <td style={{ fontWeight: 700, color: '#059669' }}>{app.branch}</td>
                            <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 200.00 ✓</td>
                            <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.payment_reference}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => handleApproveApplicant(app.id, 'PROBATION')}
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, background: '#d97706', borderColor: '#d97706' }}
                                  title="Approve and admit as Probation Member"
                                >
                                  Admit as Probation
                                </button>
                                <button
                                  onClick={() => handleApproveApplicant(app.id, 'ACTIVE')}
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, background: '#059669', borderColor: '#059669' }}
                                  title="Approve and admit as Active Member"
                                >
                                  Admit as Active
                                </button>
                                <button
                                  onClick={() => handleRejectApplicant(app.id)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* MASTER ROSTER TABLE VIEW */
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
                    <input 
                      type="text" 
                      placeholder="Search name, phone, branch, ID..."
                      className="form-input"
                      style={{ paddingLeft: '2.2rem', width: '100%' }}
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                    />
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Showing <strong>{filteredMembers.length}</strong> of <strong>{members.length}</strong> Members
                  </div>
                </div>

                <div className="table-container">
                  <table className="data-table" style={{ fontSize: '0.88rem' }}>
                    <thead>
                      <tr>
                        <th>No / ID</th>
                        <th>Full Name</th>
                        <th>Branch</th>
                        <th>Primary Phone</th>
                        <th>Yearly Dues Paid</th>
                        <th>Vehicle Shares</th>
                        <th>Outstanding Balance</th>
                        <th>Member Status</th>
                        <th>Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map(m => {
                        const duesPaid = parseFloat(m.dues_paid) || 0;
                        const balanceOwed = m.balance_owed !== undefined ? m.balance_owed : Math.max(0, (m.dues_fee_required || 3900) - duesPaid);
                        const vShares = getMemberVehicleShares(m.full_name);
                        return (
                          <tr key={m.id} style={{ background: m.status === 'REMOVED' ? 'rgba(220, 38, 38, 0.03)' : m.status === 'PROBATION' ? 'rgba(217, 119, 6, 0.02)' : 'transparent' }}>
                            <td style={{ fontWeight: 800, color: 'var(--accent-600)' }}>
                              #{m.member_no || m.id.replace('m-', '')} ({m.excel_member_id})
                            </td>
                            <td style={{ fontWeight: 800 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${m.status === 'ACTIVE' ? '#059669' : m.status === 'PROBATION' ? '#d97706' : '#dc2626'}`, background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {m.profile_picture ? (
                                    <img src={m.profile_picture} alt={m.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <User size={18} color="var(--text-muted)" />
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.92rem' }}>{m.full_name}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    {m.title} • {m.position}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{m.branch}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{m.phone_number}</div>
                              {m.phone_number_2 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                  {m.phone_number_2}
                                </div>
                              )}
                            </td>
                            <td style={{ fontWeight: 800, color: '#059669' }}>
                              GH₵ {duesPaid.toFixed(2)}
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>of GH₵ 3,900</span>
                            </td>
                            <td style={{ fontWeight: 800, color: '#ea580c' }}>
                              GH₵ {vShares.totalPaid.toFixed(2)}
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                                {vShares.sharesCount} Shares ({vShares.status})
                              </span>
                            </td>
                            <td style={{ fontWeight: 800, color: balanceOwed > 0 ? '#dc2626' : '#059669' }}>
                              GH₵ {balanceOwed.toFixed(2)}
                              {balanceOwed > 0 && <span style={{ fontSize: '0.7rem', color: '#dc2626', display: 'block', fontWeight: 600 }}>Owed ⚠️</span>}
                            </td>

                            {/* Executive Status Selector */}
                            <td>
                              <select
                                value={m.status || 'ACTIVE'}
                                onChange={(e) => handleStatusChange(m.id, e.target.value)}
                                style={{
                                  padding: '0.25rem 0.55rem',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  border: `1.5px solid ${m.status === 'ACTIVE' ? '#059669' : m.status === 'PROBATION' ? '#d97706' : '#dc2626'}`,
                                  background: m.status === 'ACTIVE' ? 'rgba(5, 150, 105, 0.1)' : m.status === 'PROBATION' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                  color: m.status === 'ACTIVE' ? '#059669' : m.status === 'PROBATION' ? '#d97706' : '#dc2626',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="ACTIVE">🟢 ACTIVE</option>
                                <option value="PROBATION">🟡 PROBATION</option>
                                <option value="REMOVED">🔴 REMOVED</option>
                              </select>
                            </td>

                            {/* Quick Actions */}
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <button 
                                  onClick={() => openDuesEditorForMember(m)}
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#059669', borderColor: '#059669' }}
                                  title="Key in dues changes directly"
                                >
                                  <Edit3 size={13} /> Update Dues
                                </button>
                                <button 
                                  onClick={() => setSelectedDossierMember(m)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-700)', border: '1px solid rgba(5, 150, 105, 0.4)' }}
                                >
                                  <Eye size={13} color="#059669" /> Dossier
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        );
      })()}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '260px' }}>
                <div style={{ width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid #059669', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedDossierMember.profile_picture ? (
                    <img src={selectedDossierMember.profile_picture} alt={selectedDossierMember.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={36} color="var(--text-muted)" />
                  )}
                </div>
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
                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: bal > 0 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(5, 150, 105, 0.15)', color: bal > 0 ? '#dc2626' : '#059669', border: '1px solid currentColor', fontWeight: 800 }}>
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
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
                <button 
                  onClick={() => {
                    const m = selectedDossierMember;
                    setSelectedDossierMember(null);
                    openDuesEditorForMember(m);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Zap size={14} /> Key In Dues
                </button>
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
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 800 }}>Vehicle Shares Paid</div>
                    <strong style={{ color: '#ea580c' }}>
                      GH₵ {getMemberVehicleShares(selectedDossierMember.full_name).totalPaid.toFixed(2)} ({getMemberVehicleShares(selectedDossierMember.full_name).sharesCount} Shares)
                    </strong>
                  </div>
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

      {/* Loading Modal for Excel Upload / Parsing & Database Ledger Synchronization */}
      <LoadingModal 
        isOpen={isLoadingModalOpen} 
        title={loadingTitle} 
        subtitle={loadingSubtitle} 
        type="excel" 
      />

      {/* ⚡ DIRECT KEY-IN MULTI-CATEGORY EDITOR MODAL */}
      {isDuesEditorOpen && (() => {
        const activeEditorMember = members.find(m => m.id === editorMemberId) || members[0];
        const curDues = parseFloat(activeEditorMember?.dues_paid) || 0;
        const curLevy = parseFloat(activeEditorMember?.levy_paid) || 0;
        const curVehPaid = parseFloat(activeEditorMember?.vehicle_shares_paid) || 0;
        const curVehShares = activeEditorMember?.vehicle_shares_count || Math.floor(curVehPaid / 50);

        const inputNum = parseFloat(editorAmount) || 0;
        const targetDues = editorMode === 'add' ? (curDues + inputNum) : (editorAmount !== '' ? inputNum : curDues);
        const impact = calculateDuesImpact(activeEditorMember, targetDues);
        const hasChange = impact && Math.abs(impact.duesDelta) >= 0.01;

        return (
          <div className="modal-overlay">
            <div className="glass-card modal-responsive-card" style={{ maxWidth: '640px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.9rem', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#059669', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Zap size={12} /> Direct Key-In Engine
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Real-Time Ledger Update</span>
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-700)', margin: 0, lineHeight: 1.25 }}>
                    Executive Direct Key-In Entry
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                    Key in payments for Yearly Dues, Special Levies, or Vehicle Shares.
                  </p>
                </div>

                <button 
                  type="button"
                  onClick={() => setIsDuesEditorOpen(false)}
                  className="modal-close-btn"
                  aria-label="Close Direct Key-In Editor"
                >
                  <X size={20} />
                </button>
              </div>

              {/* CATEGORY SELECTOR TABS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1.25rem', background: 'var(--bg-main)', padding: '0.35rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => { setEditorCategory('dues'); setEditorAmount(''); setEditorError(''); }}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    border: 'none',
                    background: editorCategory === 'dues' ? '#059669' : 'transparent',
                    color: editorCategory === 'dues' ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CreditCard size={14} /> Yearly Dues
                </button>

                <button
                  type="button"
                  onClick={() => { 
                    setEditorCategory('levy'); 
                    setEditorAmount('200'); 
                    setEditorLevyName('1st LEVY (ELD. ISAAC DARKO)');
                    setEditorError(''); 
                  }}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    border: 'none',
                    background: editorCategory === 'levy' ? '#d97706' : 'transparent',
                    color: editorCategory === 'levy' ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Tag size={14} /> Special Levies
                </button>

                <button
                  type="button"
                  onClick={() => { 
                    setEditorCategory('vehicle'); 
                    setEditorAmount('500'); 
                    setEditorInstallment('1st Installment Payment (GH₵ 500.00)');
                    setEditorError(''); 
                  }}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    border: 'none',
                    background: editorCategory === 'vehicle' ? '#2563eb' : 'transparent',
                    color: editorCategory === 'vehicle' ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Car size={14} /> Vehicle Shares
                </button>
              </div>

              {editorError && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
                  ⚠️ {editorError}
                </div>
              )}

              <form onSubmit={handleDirectDuesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* 1. Select Member */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    1. Select Fellowship Member
                  </label>
                  <select 
                    className="form-select"
                    value={editorMemberId}
                    onChange={(e) => setEditorMemberId(e.target.value)}
                    style={{ fontWeight: 700, padding: '0.65rem 0.8rem', fontSize: '0.9rem' }}
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.excel_member_id}: {m.full_name} ({m.branch})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Snapshot of Member Standing based on Category */}
                {activeEditorMember && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2.5px solid ${editorCategory === 'dues' ? '#059669' : editorCategory === 'levy' ? '#d97706' : '#2563eb'}`, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      {activeEditorMember.profile_picture ? (
                        <img src={activeEditorMember.profile_picture} alt={activeEditorMember.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <User size={24} color="var(--text-muted)" />
                      )}
                    </div>

                    {editorCategory === 'dues' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Current Dues</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>GH₵ {curDues.toFixed(2)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Outstanding</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: Math.max(0, 3900 - curDues) > 0 ? '#dc2626' : '#059669' }}>
                            GH₵ {Math.max(0, 3900 - curDues).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Shares Value</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb' }}>
                            GH₵ {(parseFloat(activeEditorMember.shares_value) || 0).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Grand Holding</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#7c3aed' }}>
                            GH₵ {(parseFloat(activeEditorMember.shares_holding) || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}

                    {editorCategory === 'levy' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Levies Paid</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#d97706' }}>GH₵ {curLevy.toFixed(2)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Registration Fee</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb' }}>GH₵ {(parseFloat(activeEditorMember.reg_fees) || 200).toFixed(2)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Payments</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                            GH₵ {(parseFloat(activeEditorMember.total_payments) || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}

                    {editorCategory === 'vehicle' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Vehicle Capital Paid</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb' }}>GH₵ {curVehPaid.toFixed(2)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Shares Owned</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#7c3aed' }}>{curVehShares} Shares</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Vehicle Share Price</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>GH₵ 50.00 / Share</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CATEGORY SPECIFIC SELECTIONS */}
                {editorCategory === 'dues' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        2. Select Dues Target Year (Which year is this payment for?)
                      </label>
                      <select 
                        className="form-select"
                        value={editorDuesYear}
                        onChange={(e) => setEditorDuesYear(e.target.value)}
                        style={{ fontWeight: 700, padding: '0.65rem 0.8rem', fontSize: '0.88rem' }}
                      >
                        <option value="2023">📅 2023 Dues (Settlement of 2023 Arrears)</option>
                        <option value="2024">📅 2024 Dues (Settlement of 2024 Arrears)</option>
                        <option value="2025">📅 2025 Dues (2025 Fiscal Year)</option>
                        <option value="2026">📅 2026 Dues (2026 Fiscal Year)</option>
                        <option value="2027">📅 2027 Advance Dues</option>
                        <option value="2028">📅 2028 Advance Dues</option>
                        <option value="2029">📅 2029 Advance Dues</option>
                        <option value="2030">📅 2030 Advance Dues</option>
                        <option value="2031">📅 2031 Advance Dues</option>
                        <option value="2032">📅 2032 Advance Dues</option>
                        <option value="2033">📅 2033 Advance Dues</option>
                        <option value="General Dues Pool">📂 General Dues Pool / Backlog Settlement</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        3. Choose Entry Mode
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                        <button
                          type="button"
                          onClick={() => setEditorMode('add')}
                          style={{
                            padding: '0.65rem 0.6rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            background: editorMode === 'add' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-main)',
                            border: editorMode === 'add' ? '2px solid #059669' : '1px solid var(--border-color)',
                            color: editorMode === 'add' ? '#059669' : 'var(--text-main)',
                            textAlign: 'center'
                          }}
                        >
                          <PlusCircle size={15} /> + Add Payment
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditorMode('set')}
                          style={{
                            padding: '0.65rem 0.6rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            background: editorMode === 'set' ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-main)',
                            border: editorMode === 'set' ? '2px solid #2563eb' : '1px solid var(--border-color)',
                            color: editorMode === 'set' ? '#2563eb' : 'var(--text-main)',
                            textAlign: 'center'
                          }}
                        >
                          <Edit3 size={15} /> ✏️ Set Total Dues
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {editorCategory === 'levy' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        2. Select Special Levy Call-Up / Recipient
                      </label>
                      <select 
                        className="form-select"
                        value={editorLevyName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditorLevyName(val);
                          if (val.includes('1st LEVY')) setEditorAmount('200');
                          else if (val.includes('2nd LEVY')) setEditorAmount('100');
                          else if (val.includes('3rd LEVY')) setEditorAmount('200');
                          else if (val.includes('4th LEVY')) setEditorAmount('200');
                          else if (val.includes('5th LEVY')) setEditorAmount('200');
                          else if (val.includes('6th LEVY')) setEditorAmount('100');
                          else if (val !== 'Custom') setEditorAmount('200');
                        }}
                        style={{ fontWeight: 700, padding: '0.65rem 0.8rem', fontSize: '0.88rem' }}
                      >
                        <option value="1st LEVY (ELD. ISAAC DARKO)">1st LEVY: ELD. ISAAC DARKO (GH₵ 200.00 Target)</option>
                        <option value="2nd LEVY (ELD. SAMUEL NKANSAH)">2nd LEVY: ELD. SAMUEL NKANSAH (GH₵ 100.00 Target)</option>
                        <option value="3rd LEVY (ELD. SAMUEL NKANSAH)">3rd LEVY: ELD. SAMUEL NKANSAH (GH₵ 200.00 Target)</option>
                        <option value="4th LEVY (ELD. JOHN OFOSUHENE ASARE)">4th LEVY: ELD. JOHN OFOSUHENE ASARE (GH₵ 200.00 Target)</option>
                        <option value="5th LEVY (ELD JONATHAN DANSO SIAW)">5th LEVY: ELD JONATHAN DANSO SIAW (GH₵ 200.00 Target)</option>
                        <option value="6th LEVY (ELD PRINCE AHWIREN ASANTE)">6th LEVY: ELD PRINCE AHWIREN ASANTE (GH₵ 100.00 Target)</option>
                        <option value="7th LEVY (Fellowship Reserve)">7th LEVY: Fellowship Reserve</option>
                        <option value="8th LEVY (Fellowship Reserve)">8th LEVY: Fellowship Reserve</option>
                        <option value="9th LEVY (Fellowship Reserve)">9th LEVY: Fellowship Reserve</option>
                        <option value="10th LEVY (Fellowship Reserve)">10th LEVY: Fellowship Reserve</option>
                        <option value="11th LEVY (Fellowship Reserve)">11th LEVY: Fellowship Reserve</option>
                        <option value="12th LEVY (Fellowship Reserve)">12th LEVY: Fellowship Reserve</option>
                        <option value="General Special Levy Pool">General Special Levy Pool</option>
                        <option value="Custom">➕ Custom Call-Up / Member Cause...</option>
                      </select>
                    </div>

                    {editorLevyName === 'Custom' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          Specify Custom Special Levy Cause / Recipient Name
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Eld Osei Kwame Wedding Special Levy"
                          className="form-input"
                          value={editorCustomLevy}
                          onChange={(e) => setEditorCustomLevy(e.target.value)}
                          style={{ fontSize: '0.88rem' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {editorCategory === 'vehicle' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      2. Select Vehicle Shares Installment / Top-Up
                    </label>
                    <select 
                      className="form-select"
                      value={editorInstallment}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditorInstallment(val);
                        if (val.includes('Installment')) setEditorAmount('500');
                      }}
                      style={{ fontWeight: 700, padding: '0.65rem 0.8rem', fontSize: '0.88rem' }}
                    >
                      <option value="1st Installment Payment (GH₵ 500.00)">1st Installment (GH₵ 500.00 - 10 Vehicle Shares)</option>
                      <option value="2nd Installment Payment (GH₵ 500.00)">2nd Installment (GH₵ 500.00 - 10 Vehicle Shares)</option>
                      <option value="3rd Installment Payment (GH₵ 500.00)">3rd Installment (GH₵ 500.00 - 10 Vehicle Shares)</option>
                      <option value="4th Installment Payment (GH₵ 500.00)">4th Installment (GH₵ 500.00 - 10 Vehicle Shares)</option>
                      <option value="Custom Vehicle Shares Top-Up">Custom Vehicle Capital Top-Up / Full Payment</option>
                    </select>
                  </div>
                )}

                {/* 4. Amount Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {editorCategory === 'dues' 
                      ? (editorMode === 'add' ? '3. Payment Amount to Add (GH₵)' : '3. Exact New Yearly Dues Amount (GH₵)')
                      : editorCategory === 'levy'
                      ? '3. Special Levy Amount Keyed In (GH₵)'
                      : '3. Vehicle Shares Amount Keyed In (GH₵)'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>
                      GH₵
                    </span>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      placeholder={editorCategory === 'vehicle' ? '500.00' : 'e.g. 200.00'}
                      className="form-input"
                      style={{ paddingLeft: '3.2rem', fontSize: '1.1rem', fontWeight: 800, height: '46px' }}
                      value={editorAmount}
                      onChange={(e) => setEditorAmount(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                {/* 5. Payment Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Payment Method</label>
                    <select 
                      className="form-select"
                      value={editorMethod}
                      onChange={(e) => setEditorMethod(e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '0.55rem' }}
                    >
                      <option value="Mobile Money">Mobile Money (0530486443)</option>
                      <option value="Cash">Cash at Meeting</option>
                      <option value="Fidelity Bank">Fidelity Bank (2090182444410)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Payment Date</label>
                    <input 
                      type="date"
                      className="form-input"
                      value={editorDate}
                      onChange={(e) => setEditorDate(e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '0.55rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Reference / Receipt Note (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Recorded at Executive Meeting"
                    className="form-input"
                    value={editorNote}
                    onChange={(e) => setEditorNote(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                {/* 6. LIVE BEFORE & AFTER IMPACT PREVIEW */}
                {editorCategory === 'dues' && impact && (
                  <div style={{ padding: '1rem', borderRadius: '12px', background: hasChange ? 'rgba(5, 150, 105, 0.06)' : 'var(--bg-main)', border: hasChange ? '1.5px solid rgba(5, 150, 105, 0.35)' : '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: hasChange ? '#059669' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                      <span>⚡ Live Financial Calculation Preview</span>
                      {hasChange && (
                        <span className="badge" style={{ background: impact.duesDelta >= 0 ? '#059669' : '#dc2626', color: '#fff', fontSize: '0.7rem' }}>
                          {impact.duesDelta >= 0 ? `+GH₵ ${impact.duesDelta.toFixed(2)} Increase` : `-GH₵ ${Math.abs(impact.duesDelta).toFixed(2)} Deduction`}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.65rem', fontSize: '0.82rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Yearly Dues Paid</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {impact.oldDues.toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: '#059669' }}>GH₵ {impact.newDues.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Outstanding Balance</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {impact.oldBalanceOwed.toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: impact.newBalanceOwed > 0 ? '#dc2626' : '#059669' }}>
                            GH₵ {impact.newBalanceOwed.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Shares Value</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {impact.oldShares.toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: '#2563eb' }}>GH₵ {impact.newShares.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Grand Total Holding</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {impact.oldGrandTotal.toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: '#7c3aed' }}>GH₵ {impact.newGrandTotal.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {editorCategory === 'levy' && inputNum > 0 && (
                  <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.06)', border: '1.5px solid rgba(217, 119, 6, 0.35)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                      ⚡ Special Levy Calculation Preview
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', fontSize: '0.82rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Special Levies Paid</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {curLevy.toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: '#d97706' }}>GH₵ {(curLevy + inputNum).toFixed(2)}</strong>
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Fellowship Total Payments</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {(parseFloat(activeEditorMember?.total_payments) || 0).toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: '#059669' }}>GH₵ {((parseFloat(activeEditorMember?.total_payments) || 0) + inputNum).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {editorCategory === 'vehicle' && inputNum > 0 && (
                  <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.06)', border: '1.5px solid rgba(37, 99, 235, 0.35)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                      ⚡ Vehicle Shares Calculation Preview (@ GH₵ 50.00 / Share)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', fontSize: '0.82rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Vehicle Shares Paid</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GH₵ {curVehPaid.toFixed(2)}</span>
                          <span>→</span>
                          <strong style={{ color: '#2563eb' }}>GH₵ {(curVehPaid + inputNum).toFixed(2)}</strong>
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Vehicle Shares Owned</div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{curVehShares} Shares</span>
                          <span>→</span>
                          <strong style={{ color: '#7c3aed' }}>{Math.floor((curVehPaid + inputNum) / 50)} Shares</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Action Buttons */}
                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => setIsDuesEditorOpen(false)}
                    className="btn btn-secondary"
                    style={{ padding: '0.7rem 1.25rem', fontWeight: 700, flex: '1 1 90px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      fontWeight: 800, 
                      fontSize: '0.92rem', 
                      background: editorCategory === 'dues' ? '#059669' : editorCategory === 'levy' ? '#d97706' : '#2563eb', 
                      borderColor: editorCategory === 'dues' ? '#059669' : editorCategory === 'levy' ? '#d97706' : '#2563eb', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.45rem', 
                      flex: '2 1 180px' 
                    }}
                  >
                    <CheckCircle2 size={18} /> 
                    {editorCategory === 'dues' ? 'Save & Apply Yearly Dues' : editorCategory === 'levy' ? 'Save & Apply Special Levy' : 'Save & Apply Vehicle Shares'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* 🚐 PETTY CASH VEHICLE PARTICULARS MODAL */}
      <PettyCashVehicleModal 
        isOpen={isPettyCashVehicleModalOpen}
        onClose={() => setIsPettyCashVehicleModalOpen(false)}
      />

      {/* 🏦 BANK ACCOUNT TEMA PARTICULARS MODAL */}
      <BankAccountTemaModal 
        isOpen={isBankTemaModalOpen}
        onClose={() => setIsBankTemaModalOpen(false)}
      />

      {/* 📊 ADD TRIAL BALANCE ITEM MODAL */}
      {isTBModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '1.8rem', borderRadius: '20px', background: 'var(--bg-card)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Add Trial Balance Line Item</h3>
              </div>
              <button onClick={() => setIsTBModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
                <X size={20} />
              </button>
            </div>

            {tbError && (
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⚠️ {tbError}
              </div>
            )}

            <form onSubmit={handleAddTrialBalanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Particulars / Description *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., SPECIAL DONATION 2026 or EQUIPMENT EXPENSE"
                  value={tbParticulars}
                  onChange={(e) => setTbParticulars(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Entry Type *
                  </label>
                  <select
                    value={tbType}
                    onChange={(e) => {
                      setTbType(e.target.value);
                      if (e.target.value === 'income' && tbCategory === 'Expenditure') setTbCategory('Income');
                      if (e.target.value === 'expenditure' && tbCategory === 'Income') setTbCategory('Expenditure');
                    }}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    <option value="income">🟢 Income</option>
                    <option value="expenditure">🔵 Expenditure / Asset</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Amount (GH₵) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={tbAmount}
                    onChange={(e) => setTbAmount(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Category / Tag Note
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Income, Expenditure, Bank Asset, Special Levy, Shares"
                  value={tbCategory}
                  onChange={(e) => setTbCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button"
                  onClick={() => setIsTBModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.1rem', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.25rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} /> Save Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👤 REGISTER NEW MEMBER MODAL (DIRECT EXECUTIVE ADD) */}
      {isAddMemberModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', borderRadius: '24px', background: 'var(--bg-card)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserPlus size={22} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Register New Member</h3>
              </div>
              <button onClick={() => setIsAddMemberModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
                <X size={20} />
              </button>
            </div>

            {addMemberError && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⚠️ {addMemberError}
              </div>
            )}

            <form onSubmit={handleAddMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Title</label>
                  <select
                    value={newMemberForm.title}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, title: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    <option value="Brother">Brother</option>
                    <option value="Elder">Elder</option>
                    <option value="Deacon">Deacon</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Mr">Mr</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Full Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Emmanuel Mensah"
                    value={newMemberForm.full_name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, full_name: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="024 XXX XXXX"
                    value={newMemberForm.phone_number}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone_number: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Branch *</label>
                  <select
                    value={newMemberForm.branch}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, branch: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    <option value="Tema">Tema Branch</option>
                    <option value="Mampong">Mampong Branch</option>
                    <option value="Accra">Accra Central</option>
                    <option value="Kumasi">Kumasi Branch</option>
                    <option value="Takoradi">Takoradi Branch</option>
                    <option value="Other">Other Branch</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Admission Status *</label>
                  <select
                    value={newMemberForm.status}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, status: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    <option value="PROBATION">🟡 PROBATION (Onboarding Member)</option>
                    <option value="ACTIVE">🟢 ACTIVE (Full Member)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Church Position</label>
                  <input 
                    type="text"
                    placeholder="e.g. Member / Committee"
                    value={newMemberForm.position}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, position: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                💡 Registration Fee: <strong>GH₵ 200.00</strong> will be credited to total payments. Member Number & ONY ID will be auto-assigned sequentially.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="btn btn-secondary" style={{ padding: '0.65rem 1.1rem', fontWeight: 700 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.35rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={16} /> Register & Admit Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
