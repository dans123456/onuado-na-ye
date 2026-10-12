import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OfficialRegistrationPrintModal({ isOpen, onClose, memberData }) {
  if (!isOpen || !memberData) return null;

  const data = memberData;

  const handlePrint = () => {
    window.print();
  };

  const fields = [
    { label: 'NAME', value: data.full_name || data.name_in_capitals || '—' },
    { label: 'TITLE', value: data.title || 'Brother' },
    { label: 'POSITION IN CHURCH', value: data.position || data.position_in_church || 'Member' },
    { label: 'BRANCH', value: data.branch ? `${data.branch} Branch` : '—' },
    { label: 'DATE JOINED THE FELLOWSHIP', value: data.date_joined || '—' },
    { label: 'TELEPHONE NO. 1', value: data.phone_number || '—' },
    { label: 'TELEPHONE NO. 2', value: data.phone_number_2 || '—' },
    { label: 'HOUSE NO', value: data.house_no || '—' },
    { label: 'GPS CODE ADDRESS', value: data.gps_address || '—' },
    { label: 'TOWN', value: data.town || '—' },
    { label: 'E-MAIL ADDRESS (IF ANY)', value: data.email || '—' },
    { label: 'GHANA IDENTITY CARD NO.', value: data.ghana_card || data.ghana_card_no || '—' },
    { label: 'OCCUPATION', value: data.occupation || '—' },
    { label: 'PLACE OF WORK', value: data.place_of_work || '—' },
    { label: 'DATE OF BIRTH', value: data.date_of_birth || data.dob || '—' },
    { label: 'PLACE OF BIRTH', value: data.place_of_birth || '—' },
    { label: 'HOMETOWN', value: data.hometown || '—' },
    { label: 'DISTRICT', value: data.district || '—' },
    { label: 'REGION', value: data.region || '—' },
    { label: 'TRIBE', value: data.tribe || '—' },
    { label: 'NEXT OF KIN', value: data.next_of_kin || '—' },
    { label: 'RELATIONSHIP', value: data.next_of_kin_relation || data.relationship || '—' },
    { label: 'CONTACT: NEXT OF KIN', value: data.next_of_kin_contact || '—' },
    { label: 'MARITAL STATUS', value: data.marital_status || 'Single' },
    { label: 'NAME OF SPOUSE', value: data.spouse_name || '—' },
    { label: 'CONTACT ADDRESS', value: data.spouse_contact || data.spouse_contact_address || '—' },
    { 
      label: 'NO. OF CHILDREN', 
      isChildrenRow: true,
      male: data.children_male !== undefined ? data.children_male : (data.children_count ? data.children_count : '—'),
      female: data.children_female !== undefined ? data.children_female : '—'
    },
    { label: "FATHER'S NAME", value: data.father_name || '—' },
    { label: 'CONTACT ADDRESS', value: data.father_contact || data.father_contact_address || '—' },
    { label: "MOTHER'S NAME", value: data.mother_name || '—' },
    { label: 'CONTACT ADDRESS', value: data.mother_contact || data.mother_contact_address || '—' }
  ];

  return (
    <div className="official-print-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
      
      {/* Modal Actions Header (Hidden in Print) */}
      <div className="no-print" style={{ position: 'fixed', top: '1rem', right: '1.5rem', display: 'flex', gap: '0.75rem', zIndex: 100000 }}>
        <button 
          onClick={handlePrint}
          className="btn btn-primary"
          style={{ background: '#059669', color: '#fff', padding: '0.65rem 1.25rem', fontWeight: 800, boxShadow: '0 4px 14px rgba(0,0,0,0.3)', borderRadius: '10px' }}
        >
          <Printer size={18} /> Print Official Form
        </button>
        <button 
          onClick={onClose}
          className="btn btn-secondary"
          style={{ background: '#ffffff', color: '#0f172a', padding: '0.65rem 1rem', fontWeight: 700, borderRadius: '10px' }}
        >
          <X size={18} /> Close
        </button>
      </div>

      {/* The Printable Sheet */}
      <div 
        id="official-print-area"
        style={{ 
          width: '100%', 
          maxWidth: '780px', 
          background: '#ffffff', 
          color: '#000000', 
          padding: '2.5rem 3rem', 
          borderRadius: '12px', 
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          margin: 'auto',
          fontFamily: "'Segoe UI', -apple-system, Arial, sans-serif",
          isolation: 'isolate',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none'
        }}
      >
        
        {/* Document Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '3px double #1e3a8a', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#1e40af', letterSpacing: '0.04em', fontFamily: 'Impact, "Arial Black", Georgia, serif' }}>
                ONUADO NA EYE REGISTRATION FORMS
              </h1>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Men's Fellowship Official Membership Roll & Registry
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
            <div>Member Roll ID: <strong style={{ color: '#059669', fontSize: '0.9rem' }}>{data.excel_member_id || data.id || 'NEW APPLICANT'}</strong></div>
            <div>Date Enrolled: <strong>{data.date_joined || data.date_submitted || new Date().toISOString().split('T')[0]}</strong></div>
            <div>Status: <strong style={{ color: '#1e40af' }}>{data.status || 'PROBATION'}</strong></div>
          </div>
        </div>

        {/* 2-Column Official Form Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000000', fontSize: '0.86rem' }}>
          <tbody>
            {fields.map((f, idx) => {
              if (f.isChildrenRow) {
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #000000' }}>
                    <td style={{ width: '38%', padding: '0.45rem 0.75rem', fontWeight: 900, borderRight: '2px solid #000000', background: '#f8fafc', color: '#000000' }}>
                      {f.label}
                    </td>
                    <td style={{ width: '62%', padding: 0 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
                        <div style={{ padding: '0.45rem 0.75rem', borderRight: '1px solid #000000' }}>
                          <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>Male: </span>
                          <span style={{ fontWeight: 600 }}>{f.male !== undefined && f.male !== '—' ? f.male : '0'}</span>
                        </div>
                        <div style={{ padding: '0.45rem 0.75rem' }}>
                          <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>Female: </span>
                          <span style={{ fontWeight: 600 }}>{f.female !== undefined && f.female !== '—' ? f.female : '0'}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={idx} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ width: '38%', padding: '0.45rem 0.75rem', fontWeight: 900, borderRight: '2px solid #000000', background: '#f8fafc', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '0.8rem' }}>
                    {f.label}
                  </td>
                  <td style={{ width: '62%', padding: '0.45rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>
                    {f.value || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Official Endorsement Signatures & Fee Receipt */}
        <div style={{ marginTop: '2rem', borderTop: '2px dashed #94a3b8', paddingTop: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2.5rem' }}>
                APPLICANT MEMBER'S SIGNATURE
              </div>
              <div style={{ borderTop: '1.5px solid #000000', paddingTop: '0.35rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>Signature / Date</span>
                <span>Reg Fee: <strong>GH₵ 200.00 (PAID)</strong></span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2.5rem' }}>
                EXECUTIVE GENERAL SECRETARY / CHAIRMAN
              </div>
              <div style={{ borderTop: '1.5px solid #000000', paddingTop: '0.35rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>Official Stamp & Endorsement</span>
                <span>Council Seal: <strong>APPROVED</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Print Stylesheet Hook */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .no-print {
              display: none !important;
            }
            .official-print-modal-overlay {
              position: static !important;
              background: transparent !important;
              padding: 0 !important;
            }
            #official-print-area, #official-print-area * {
              visibility: visible;
            }
            #official-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              padding: 0.5in !important;
              border-radius: 0 !important;
            }
          }
        `}} />

      </div>
    </div>
  );
}
