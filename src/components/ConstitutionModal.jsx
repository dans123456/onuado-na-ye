import React, { useState } from 'react';
import { BookOpen, Search, X, Download, FileText } from 'lucide-react';

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
2. Vice President (Assists President & Acts in Absence)
3. P.R.O. (Public Relations & Information Dissemination)
4. Secretary (Secretariat Records & Official Correspondence)
5. Financial Secretary / Treasurer (Monetary Ledger & Bank Accounts)
6. Organizers & Executive Members (Welfare & Operations)`
  },
  {
    art: 'Art. 9',
    title: 'ELECTION OF EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `• Officers shall be elected by simple majority vote of active members present at an official General Meeting.
• Tenure of office shall be four (4) years, subject to re-election.`
  },
  {
    art: 'Art. 10',
    title: 'DUTIES OF THE PRESIDENT',
    category: 'Governance',
    content: `The President shall preside over all general and executive meetings, uphold the constitution, direct affairs of the fellowship, and represent the fellowship in external matters.`
  },
  {
    art: 'Art. 11',
    title: 'DUTIES OF THE SECRETARY',
    category: 'Governance',
    content: `The Secretary shall keep true records of all proceedings, issue notice of meetings, handle correspondence, and maintain an updated register of members.`
  },
  {
    art: 'Art. 12',
    title: 'DUTIES OF THE FINANCIAL SECRETARY & TREASURER',
    category: 'Finance',
    content: `• Collect all dues, levies, and contributions, and issue receipts.
• Pay all moneys into the official Fidelity Bank Ghana account of the Fellowship within 48 hours.
• Present audited financial statements at general meetings.`
  },
  {
    art: 'Art. 13',
    title: 'FELLOWSHIP BANK ACCOUNT & SIGNATORIES',
    category: 'Finance',
    content: `• Bank Name: Fidelity Bank Ghana
• Account Name: ONUADO NA EYE MENS' FELLOWSHIP
• Account Number: 2090182444410
• Signatories: Group A (President & Secretary) and Group B (Treasurer). Cheques/transfers require one signature from Group A and one from Group B.`
  },
  {
    art: 'Art. 14',
    title: 'MEETINGS & QUORUM',
    category: 'General',
    content: `• Meetings are held online (via Google Meet / Zoom) and physically as scheduled on 1st & 3rd Sundays of every month.
• Quorum for general meetings shall be one-third (1/3) of active members.`
  },
  {
    art: 'Art. 15',
    title: 'DISCIPLINE & ABSENTEEISM',
    category: 'General',
    content: `• Members shall observe Christian discipline, respect, and decorum.
• Unexcused absence from three consecutive meetings attracts a query or fine determined by Executives.`
  },
  {
    art: 'Art. 16',
    title: 'WELFARE BENEFITS SCHEDULE',
    category: 'Welfare Benefits',
    content: `Official Welfare Benefits for Full Members (after 6 months probation):
• Bereavement of Member: GH₵ 5,000.00
• Bereavement of Spouse: GH₵ 3,000.00
• Bereavement of Biological Parent: GH₵ 2,000.00
• Hospitalization (3+ days): GH₵ 1,000.00
• Naming Ceremony / New Child: GH₵ 1,000.00
• Member Wedding: 80% contribution support from Welfare Fund.`
  },
  {
    art: 'Art. 17',
    title: 'DESTITUTE AID & CHARITY FUND',
    category: 'Welfare Benefits',
    content: `A dedicated portion of voluntary donations and levies shall be allocated to supporting orphanages, widow aid, destitution relief, and community outreach in Ghana.`
  },
  {
    art: 'Art. 18',
    title: 'AMENDMENTS TO CONSTITUTION',
    category: 'Governance',
    content: `This Constitution may be amended at a General Meeting by a two-thirds (2/3) majority vote of members present, provided two weeks' notice of amendment has been served.`
  },
  {
    art: 'Art. 19',
    title: 'DISSOLUTION OF FELLOWSHIP',
    category: 'General',
    content: `In the event of dissolution, all remaining assets after liabilities are settled shall be converted to Shares Holding payouts or donated to registered charitable bodies.`
  }
];

export default function ConstitutionModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterPills, setShowFilterPills] = useState(false);

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
      padding: '0.75rem', 
      overflowY: 'auto' 
    }}>
      <div className="glass-card" style={{ 
        maxWidth: '900px', 
        width: '100%', 
        margin: 'auto', 
        maxHeight: '92vh', 
        background: 'var(--bg-card)', 
        borderRadius: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', 
        border: '1px solid var(--border-color)' 
      }}>
        
        {/* Header - Compact Banner & Fixed Clear Exit X Button */}
        <div style={{ 
          padding: '0.85rem 1.1rem', 
          background: 'linear-gradient(135deg, #064e3b, #059669)', 
          color: '#ffffff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '0.75rem',
          flexShrink: 0 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fef08a', flexShrink: 0 }}>
              <BookOpen size={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#ffffff', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                ONUADO NA EYE MENS' FELLOWSHIP
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 700, marginTop: '0.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Official Constitution (Articles 1 – 19)
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            aria-label="Close Constitution Reader"
            style={{ 
              background: 'rgba(255, 255, 255, 0.25)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ffffff', 
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Collapsible Category Toolbar */}
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <input 
                type="text"
                placeholder="Search constitution..."
                className="form-input"
                style={{ paddingLeft: '2.2rem', paddingRight: '0.5rem', borderRadius: '8px', fontSize: '0.84rem', height: '36px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterPills(!showFilterPills)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', fontWeight: 700, height: '36px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
              title="Filter Categories"
            >
              <span>{selectedCategory !== 'All' ? selectedCategory : 'Filter'}</span>
            </button>

            {/* Compact Download Button */}
            <a 
              href="/constitution.doc" 
              download="CONSTITUTION FOR ONUADƆ NA ƐYƐ.doc" 
              className="btn btn-accent"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, height: '36px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0, whiteSpace: 'nowrap' }}
              title="Download Document (.doc)"
            >
              <Download size={15} /> <span>.doc</span>
            </a>
          </div>

          {/* Collapsible Category Pill Filters */}
          {showFilterPills && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilterPills(false);
                  }}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.72rem',
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
          )}
        </div>

        {/* Scrollable Constitution Content - Maximum Clear Viewport */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <div>No articles match your search query "{searchTerm}".</div>
            </div>
          ) : (
            filteredArticles.map(item => (
              <div 
                key={item.art} 
                className="glass-card" 
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: '14px', 
                  borderLeft: item.category === 'Welfare Benefits' ? '5px solid #059669' : (item.category === 'Finance' ? '5px solid #d97706' : '5px solid #3b82f6'),
                  background: 'var(--bg-card)'
                }}
              >
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 900, color: 'var(--primary-600)', fontSize: '0.88rem', background: 'rgba(5, 150, 105, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      {item.art}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {item.title}
                    </h3>
                  </div>
                  <span className="badge badge-dues" style={{ fontSize: '0.72rem' }}>
                    {item.category}
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {item.content}
                </div>

              </div>
            ))
          )}

        </div>

        {/* Compact Footer Caption */}
        <div style={{ padding: '0.45rem 1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
            Official Constitution • ONUADO NA EYE MENS' FELLOWSHIP
          </div>
        </div>

      </div>
    </div>
  );
}
