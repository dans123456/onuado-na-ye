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
    title: 'NAME',
    category: 'General',
    content: `The name shall be called: "ONUADO NA EYE MEN'S FELLOWSHIP", thereafter referred to as "FELLOWSHIP."`
  },
  {
    art: 'Art. 3',
    title: 'AIMS AND OBJECTIVES',
    category: 'General',
    content: `The fellowship aims and objectives shall:
• Unite any interested Christians who have the welfare of the destitute at hand.
• Seek for members' welfare.
• Ensure that all conflicts among members are resolved.
• Promote trade income to feed the destitute.`
  },
  {
    art: 'Art. 4',
    title: 'MEMBERSHIP',
    category: 'Membership',
    content: `The President of the Fellowship has the constitutional right to accept or reject any new member into the Fellowship through the recommendation from the Executive members.`
  },
  {
    art: 'Art. 5',
    title: 'ENROLLMENT',
    category: 'Membership',
    content: `• Enrolment into the Fellowship shall be free up to 31st December 2022.
• From 1st January 2023, a new member shall pay an enrollment fee of Two Hundred Cedis (GH₵ 200.00).`
  },
  {
    art: 'Art. 6',
    title: 'PROBATION',
    category: 'Membership',
    content: `• Any new member shall be on probation for a period of six (6) calendar months.
• After the probation period, the Executives shall approve of his qualification as a full member.
• Any resigned member who wishes to come back shall be treated as a new member.
• Any removed member who wishes to come back shall pay a penalty of One Hundred Cedis (GH₵ 100.00), pay all his debt, and in addition be placed on three (3) months' probation.`
  },
  {
    art: 'Art. 7',
    title: 'DUES AND OTHER CONTRIBUTIONS',
    category: 'Finance',
    content: `• Members shall contribute a monthly due of One Hundred Cedis (GH₵ 100.00).
• Besides the monthly dues, there shall be a voluntary contribution or levy when the need arises.`
  },
  {
    art: 'Art. 8',
    title: 'EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `The following officers shall be elected into office as Executive Officers by members of the Fellowship:
1. President
2. Vice President
3. Secretary
4. Financial Secretary
5. Organizer / Liaison Officer
6. Two Co-opted Members`
  },
  {
    art: 'Art. 9',
    title: 'DUTIES OF THE EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `Sect. 1 — PRESIDENT:
• Shall be the leader over the Executive members and implement policies.
• Shall preside over all meetings of the Fellowship.
• Shall convene meetings when he deems it necessary or when requested to do so by at least five (5) members of the Fellowship.
• Shall have powers to accept or reject a new member or remove a member from the Fellowship.
• Shall by virtue of his office be an ex-officio member of every committee of the Fellowship.

Sect. 2 — VICE PRESIDENT:
• Shall assist the President in performing his duties.
• In the absence of the President, the Vice President shall act as President.

Sect. 3 — SECRETARY:
• Shall be responsible for the filing of all documents relating to the Fellowship.
• Shall schedule and coordinate all welfare meetings and communicate same to Members.
• Shall take minutes at all Fellowship meetings and ensure Executive Members receive copies within fourteen (14) days after the meeting day.
• Shall attend to all incoming and outgoing correspondence on behalf of the Fellowship.
• Shall be one of the signatories to the Fellowship bank account.
• Shall ensure that members' welfare cards are promptly updated.
• Shall perform all other duties assigned to him by the President and shall have knowledge of administration.

Sect. 4 — FINANCIAL SECRETARY:
• Shall have knowledge in Financial Accounting.
• Shall receive and deposit all monies into the Fellowship Bank Account within 48 hours upon receipt.
• Shall not be one of the signatories to the Fellowship bank account.
• Shall present yearly Financial Statements to members at the Annual General Meetings.
• Shall keep and update all financial documents of the Fellowship in good order for easy access.
• Shall also act as Secretary in the absence of the substantive Secretary.

Sect. 5 — ORGANIZER / LIAISON OFFICER:
• Shall perform duties relating to welfare assigned to him by the President.
• Shall represent the Fellowship at any social function on behalf of the Fellowship.
• Shall, upon approval from Executive Members, be responsible for purchasing gifts for a member on an occasion if the need arises.
• Shall monitor the attendance of members to Fellowship meetings.
• Shall communicate with the public and deliver press or media releases in a public forum on behalf of the Fellowship.
• Shall act as Master of Ceremony (MC) at all meetings and gatherings.

Sect. 6 — CO-OPTED MEMBER:
• Shall be members of the Executives.
• Shall have Executive power to take decisions during Executive meetings.`
  },
  {
    art: 'Art. 10',
    title: 'ELECTIONS',
    category: 'Governance',
    content: `Sect. 1 — ELECTORAL COLLEGE:
• Members shall appoint a five-member ad-hoc Committee to conduct elections by a majority vote of members.
• The Electoral College shall have powers for vetting, conducting, and monitoring elections.
• The Chairman of the Electoral College shall declare the results of each Executive Position.

Sect. 2 — ELIGIBILITIES FOR ELECTION AS EXECUTIVE OFFICER:
• Shall apply by filling a form to the President of the Electoral College.
• Shall be supported by three qualified members at a General Meeting.
• Shall be approved by the Financial Secretary that his financial obligations are up to date.
• Shall make sure that he is fully qualified for the post.

Sect. 3 — BY-ELECTIONS:
• Whenever an Executive Member dies, resigns, or is removed from office, the President or Acting President shall convene an emergency meeting, in consultation with Executive Members, to conduct a by-election within twenty-eight (28) days to fill that vacant post.`
  },
  {
    art: 'Art. 11',
    title: 'TERM OF OFFICE FOR EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `• Executive Officers shall hold office for a period of four (4) years.
• Upon satisfactory, efficient, and diligent performance, an Executive Officer shall be eligible for re-election for a second term only.`
  },
  {
    art: 'Art. 12',
    title: 'REMOVAL OF EXECUTIVE OFFICERS',
    category: 'Governance',
    content: `• An Executive Officer may be removed from office before his term expires upon a "Vote of No Confidence" supported by two-thirds (2/3) votes of members present at a General Meeting.
• Any member seeking the removal of an Executive Officer shall submit a written or oral memorandum to the General Secretary stating his reasons within fourteen (14) days prior to the General Meeting, and shall appear before the Executive Meeting to substantiate his grounds.
• Grounds for removal/demotion also include: absenting oneself from church for three (3) months without reasonable grounds (upon enquiry with colleague Elders and Branch Pastor); death; travelling outside Ghana for six (6) months; or suspension by the National Council.`
  },
  {
    art: 'Art. 13',
    title: 'MEETINGS',
    category: 'General',
    content: `There shall be three (3) categories of meetings adhered to by members: Executive Meeting, General Monthly Meeting, and Annual Meeting. Due to members not being in one place, meetings may be held on any suitable platform.

Sect. 1 — EXECUTIVE MEETINGS:
• The President shall convene an Executive meeting as and when the need arises. 50% of Executive Members present shall form a quorum.

Sect. 2 — GENERAL MEETINGS:
• There shall be General Meetings for all members at least once a year. It is mandatory for every member of the Fellowship to attend.

Sect. 3 — EMERGENCY MEETINGS:
• The President shall convene an emergency meeting online, in consultation with Executive Members, as and when necessary.`
  },
  {
    art: 'Art. 14',
    title: 'GOVERNING POLICY',
    category: 'General',
    content: `• All suggestions, contributions, and observations should be channeled through the Secretary to the Executives.
• All letters from members requesting assistance shall be channeled through the Secretary to the Executives.
• Members are expected to be committed to any welfare matters of the Fellowship.
• To avoid dispute, outgoing Executives shall hand over officially to incoming Executives.`
  },
  {
    art: 'Art. 15',
    title: 'FINANCIAL POLICIES & BANK SIGNATORIES',
    category: 'Finance',
    content: `Sect. 1 — POLICIES:
• Shall raise funds through welfare dues, levies, or voluntary contributions.
• Shall operate a Bank Account (Current or Savings, or both) and a MoMo Account of their choice.
• If a member is due for any benefits under Administrative Policies, there shall be a voluntary contribution or levy to support.
• Members shall lose their benefits if they do not contribute to their monthly welfare dues, levies, and other voluntary contributions.
• Shall invest in Treasury Bills when the need arises.
• Members shall not be entitled to loans whatsoever.
• The Fellowship shall decide on an Imprest the Financial Secretary shall hold annually.
• No money belonging to the Fellowship shall be kept in a member's house, office, or personal account.
• Monthly dues, levies, or voluntary contributions made by any member whatsoever are NOT refundable.

Sect. 2 — BANK SIGNATORIES:
• Any transaction with the bank or money drawn shall be made known to all Executive Members.
• Two signatory groups: GROUP A (President or Vice President) and GROUP B (Secretary or an Executive Member appointed by the Executive and approved by members).
• The Fellowship reserves the right to recommend or withdraw signatories. Any signatory who resigns or abrogates his membership automatically ceases to be a signatory.`
  },
  {
    art: 'Art. 16',
    title: 'ADMINISTRATIVE POLICY (WELFARE BENEFITS)',
    category: 'Welfare Benefits',
    content: `Sect. 1 — BEREAVEMENT:
Notify the President through the Secretary in writing or orally. Close relatives covered are Wife, Father, Mother, or up to two (2) Biological Children:
• Wife: Five Thousand Cedis (GH₵ 5,000.00)
• Father or Mother: Three Thousand Cedis (GH₵ 3,000.00)
• Biological Children: Two Thousand Cedis (GH₵ 2,000.00) each

Sect. 2 — HOSPITALIZATION:
In case of severe illness, hospitalization, or accident, notify the President through the Secretary. Members will visit, and for serious cases an emergency voluntary contribution may be raised.
• Cash donation: One Thousand Cedis (GH₵ 1,000.00)

Sect. 3 — DESTITUTION OR LOSS OF PROPERTY:
Where a member faces destitution, indisposition, or social mishap, the President shall call an emergency Executive meeting to raise special voluntary contributions.
• Cash donation: Three Thousand Cedis (GH₵ 3,000.00)

Sect. 4 — CHILDBIRTH / OUTDOORING CEREMONY:
Notify the Secretary in writing or orally for the naming day. This benefit shall be once for a member.
• Cash donation: One Thousand Cedis (GH₵ 1,000.00)

Sect. 5 — WEDDINGS:
Notify the Secretary one (1) month prior to the wedding ceremony. Transportation for two representatives is provided by the Fellowship.
• Cash donation: Eighty percent (80%) of voluntary contributions made.`
  },
  {
    art: 'Art. 17',
    title: 'QUALIFICATION FOR BENEFITS',
    category: 'Welfare Benefits',
    content: `• Any registered member who pays all his monthly dues and other contributions shall be entitled to full benefits.
• Any registered member who defaults in paying his monthly dues or any other contributions for six (6) calendar months and above without formal permission to the President or Executives shall cease to be a member and will not be entitled to any benefits whatsoever.
• Any registered member who defaults in paying his monthly dues for three (3) to six (6) months without informing the Executives about his financial situation shall lose 50% of his benefits due him as penalty, and all arrears owed by him shall be deducted from the remaining benefits.`
  },
  {
    art: 'Art. 18',
    title: 'AMENDMENTS TO THE CONSTITUTION',
    category: 'Governance',
    content: `Sect. 1 — MISCELLANEOUS:
• Amounts stated in this Constitution may be amended or reviewed as necessary to keep pace with inflation and the liquidity of the Fellowship, subject to General Meeting approval.

Sect. 2 — PROVISIONS FOR AMENDMENTS:
• There shall be provisions for amendments to sections of the Constitution as and when it becomes necessary.

Sect. 3 — PROCEDURES TO AMEND:
• Any motion to amend part or whole of the Constitution shall be made at a General Meeting and supported by two-thirds (2/3) votes of members present.
• Written notice must be given to the President within thirty (30) days prior to the General Meeting.
• Where debate is inconclusive, deliberations shall be postponed to a new date fixed by the President.`
  },
  {
    art: 'Art. 19',
    title: 'BYE-LAWS, REGULATIONS & DECLARATION',
    category: 'Governance',
    content: `The Executive Members of the Fellowship shall have the mandate to make Bye-Laws and Regulations for the running of the Fellowship as and when necessary to adhere to all procedures stipulated in this Constitution.

DECLARATION:
THIS CONSTITUTION IS HEREBY APPROVED BY MEMBERS OF ONUADƆ NA ƐYƐ MEN'S FELLOWSHIP AT A GENERAL MEETING, HELD ONLINE, ON THE 30TH DAY OF SEPTEMBER 2022.

Signed: MOSES ODURO (President)`
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
