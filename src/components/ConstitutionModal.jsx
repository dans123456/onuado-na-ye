import React, { useState } from 'react';
import { BookOpen, Search, X, Shield, Download, FileText, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export const CONSTITUTION_ARTICLES = [
  {
    art: 'Art. 1',
    title: 'PREAMBLE',
    category: 'General',
    content: `The Fellowship is a non-political, non-profit making fellowship that organizes any devoted Christians together as one body, with a common purpose of taking care of the destitute and also having its welfare for members at hand.`
  },
  {
    art: 'Art. 2',
    title: 'NAME OF THE FELLOWSHIP',
    category: 'General',
    content: `The name shall be called: ONUADO NA EYE MENS' FELLOWSHIP (thereafter referred to as FELLOWSHIP).`
  },
  {
    art: 'Art. 3',
    title: 'AIMS AND OBJECTIVES',
    category: 'General',
    content: `The fellowship aims and objectives shall be:
• Unite all interested Christians who have the welfare of the destitute at hand.
• Seek for members' welfare and mutual aid.
• Ensure that all conflicts among members are resolved in Christian harmony.
• Promote trade income and voluntary funds to feed and support the destitute.`
  },
  {
    art: 'Art. 4',
    title: 'MEMBERSHIP ADMISSION',
    category: 'Membership',
    content: `The President of the Fellowship has the constitutional right to accept or reject any new member into the Fellowship through recommendation from the Executive members.`
  },
  {
    art: 'Art. 5',
    title: 'ENROLLMENT FEE',
    category: 'Membership',
    content: `• Enrolment into the Fellowship was free up to 31st December 2022.
• From 1st January 2023, every new member shall pay an official enrollment fee of Two Hundred Ghana Cedis (GH₵ 200.00).`
  },
  {
    art: 'Art. 6',
    title: 'PROBATION & REINSTATEMENT',
    category: 'Membership',
    content: `• Any new member shall be on probation for a period of six (6) calendar months. After probation, the Executives shall approve qualification as a full member.
• Any resigned member who wishes to return shall be treated as a new member.
• Any removed member who wishes to return shall pay a penalty of One Hundred Cedis (GH₵ 100.00), settle all outstanding debt, and be placed on three (3) months probation.`
  },
  {
    art: 'Art. 7',
    title: 'MONTHLY DUES & LEVIES',
    category: 'Finance',
    content: `• Members shall contribute a monthly due of Fifty Ghana Cedis (GH₵ 50.00).
• Besides monthly dues, there shall be voluntary contributions or special levies when the need arises.`
  },
  {
    art: 'Art. 8',
    title: 'EXECUTIVE BOARD OFFICERS',
    category: 'Governance',
    content: `The following officers shall be elected into office as Executive Officers by members of the Fellowship:
1. President (Leader & Policy Implementer)
2. Vice President (Assisting Leader & Acting President)
3. General Secretary (Documentation, Correspondence & Bank Signatory Group B)
4. Financial Secretary (Treasury Accounts & Financial Statements)
5. PRO / Organizer & Liaison Officer (Social Functions, Media & MC)
6. Two Co-opted Executive Members`
  },
  {
    art: 'Art. 9',
    title: 'DUTIES OF EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `Sect. 1 — PRESIDENT: Leader over Executive members, presides over all meetings, convenes emergency meetings upon request of 5+ members, holds constitutional right to accept/reject members, ex-officio member of committees.

Sect. 2 — VICE PRESIDENT: Assists the President in performing duties. Acts as President in the absence of the substantive President.

Sect. 3 — SECRETARY: Responsible for filing all documents, schedules welfare meetings, records minutes, handles incoming/outgoing correspondence, Bank Signatory (Group B), updates member welfare cards.

Sect. 4 — FINANCIAL SECRETARY: Financial accounting expert, deposits funds into Bank Account within 48 hours of receipt, presents annual financial statements at AGMs, keeps financial records. (Not a bank signatory).

Sect. 5 — ORGANIZER / LIAISON OFFICER (PRO): Welfare duties, represents fellowship at social functions, handles gifts/purchases, monitors attendance, press/media releases, Master of Ceremonies (MC) at gatherings.`
  },
  {
    art: 'Art. 10',
    title: 'ELECTIONS & ELECTORAL COLLEGE',
    category: 'Governance',
    content: `• Members appoint a 5-member ad-hoc Electoral College to vet, conduct, and monitor elections.
• Eligibility: Apply via form to Electoral College, supported by 3 qualified members, approved as financially up-to-date by Financial Secretary.
• By-Elections: Conducted within 28 days if an Executive dies, resigns, or is removed.`
  },
  {
    art: 'Art. 11',
    title: 'TERM OF OFFICE',
    category: 'Governance',
    content: `Executive Officers shall hold office for a period of four (4) years. Upon satisfactory and diligent performance, an officer is eligible for re-election for a second term maximum.`
  },
  {
    art: 'Art. 12',
    title: 'REMOVAL OF EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `An Executive Officer may be removed from office before term expiration upon a Vote of No Confidence supported by two-thirds (2/3) majority votes of members present at a General Meeting, following a 14-day written memorandum to the Secretary.`
  },
  {
    art: 'Art. 13',
    title: 'FELLOWSHIP MEETINGS',
    category: 'Governance',
    content: `Three categories of meetings:
1. Executive Meetings (50% quorum required).
2. General Monthly Meetings (mandatory attendance at least once a year).
3. Emergency Meetings (convened by President online/offline as needed).`
  },
  {
    art: 'Art. 14',
    title: 'GOVERNING POLICY',
    category: 'Governance',
    content: `All suggestions, observations, and assistance requests must be channeled through the Secretary to the Executives. Outgoing Executives shall officially hand over to incoming Executives.`
  },
  {
    art: 'Art. 15',
    title: 'FINANCIAL POLICIES & BANK SIGNATORIES',
    category: 'Finance',
    content: `• Operate official Fidelity Bank Ghana Account & MTN Mobile Money Wallet.
• Bank Signatories (2 required):
  - GROUP A: President or Vice President.
  - GROUP B: General Secretary or appointed Executive Officer.
• No fellowship money shall be kept in a member's house or personal account.
• Monthly dues and levies paid are non-refundable.`
  },
  {
    art: 'Art. 16',
    title: 'ADMINISTRATIVE WELFARE BENEFIT SCHEDULE',
    category: 'Welfare Benefits',
    content: `Official cash donation schedule for up-to-date members:

1. BEREAVEMENT:
   • Loss of Wife or Husband: GH₵ 5,000.00
   • Loss of Father or Mother: GH₵ 3,000.00
   • Loss of Biological Child: GH₵ 2,000.00 each (up to 2 children)

2. HOSPITALIZATION & SEVERE ILLNESS:
   • Cash donation of GH₵ 1,000.00 + Official Delegation Visit.

3. DESTITUTION OR LOSS OF PROPERTY:
   • Social mishap, fire, or severe hardship: GH₵ 3,000.00 Cash Relief.

4. CHILDBIRTH & OUTDOORING CEREMONY:
   • Cash donation of GH₵ 1,000.00 presented at naming ceremony.

5. WEDDINGS & HOLY MATRIMONY:
   • 80% Cash Donation from voluntary levy pool + Transportation for 2 fellowship representatives.`
  },
  {
    art: 'Art. 17',
    title: 'QUALIFICATIONS FOR BENEFITS',
    category: 'Welfare Benefits',
    content: `• Fully up-to-date members paying dues/contributions are entitled to 100% full benefits.
• Members defaulting 3 to 6 months without formal permission lose 50% of benefits as penalty (dues arrears deducted from remaining balance).
• Members defaulting 6+ months without permission cease to be members and forfeit all benefits.`
  },
  {
    art: 'Art. 18',
    title: 'AMENDMENTS TO CONSTITUTION',
    category: 'Governance',
    content: `Provisions and amounts may be reviewed/amended at General Meetings. Proposed amendments require 30-day prior written notice to the President and approval by 2/3 majority vote.`
  },
  {
    art: 'Art. 19',
    title: 'BYE-LAWS AND REGULATIONS',
    category: 'Governance',
    content: `The Executive Board holds mandate to enact Bye-Laws and Regulations for smooth running as necessary.`
  }
];

export default function ConstitutionModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'General', 'Membership', 'Finance', 'Governance', 'Welfare Benefits'];

  const filteredArticles = CONSTITUTION_ARTICLES.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.art.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', background: 'var(--bg-card)', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', border: '1px solid var(--border-color)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, #064e3b, #059669)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fef08a' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                ONUADO NA EYE MENS' FELLOWSHIP
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#fef08a', fontWeight: 600 }}>
                📜 Official Fellowship Constitution (Articles 1 – 19)
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input 
                type="text"
                placeholder="Search constitution (e.g. Bereavement, Dues, President, Probation)..."
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '10px', fontSize: '0.88rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <a 
              href="/constitution.doc" 
              download="CONSTITUTION FOR ONUADƆ NA ƐYƐ.doc" 
              className="btn btn-accent"
              style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
            >
              <Download size={15} /> Download Document (.doc)
            </a>
          </div>

          {/* Category Pill Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedCategory === cat ? 'var(--primary-600)' : 'var(--bg-card)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Constitution Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <div>No articles match your search query "{searchTerm}".</div>
            </div>
          ) : (
            filteredArticles.map(item => (
              <div key={item.art} className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', borderLeft: item.category === 'Welfare Benefits' ? '5px solid #059669' : (item.category === 'Finance' ? '5px solid #d97706' : '5px solid #3b82f6') }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 900, color: 'var(--primary-600)', fontSize: '0.95rem', background: 'rgba(5, 150, 105, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {item.art}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {item.title}
                    </h3>
                  </div>
                  <span className="badge badge-dues" style={{ fontSize: '0.72rem' }}>
                    {item.category}
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.7, whitespace: 'pre-line' }}>
                  {item.content}
                </div>

              </div>
            ))
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Official Constitution of ONUADO NA EYE MENS' FELLOWSHIP
          </div>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
}
