import React, { useState } from 'react';
import { Users, Heart, Wallet, ShieldCheck, ArrowRight, BellRing, Sparkles, Building2, Award, BookOpen } from 'lucide-react';
import ConstitutionModal from '../components/ConstitutionModal';

export default function HomePage({ setActivePage, membersCount, contributionsCount }) {
  const [showConstitutionModal, setShowConstitutionModal] = useState(false);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Hero Section */}
      <div className="glass-card glass-card-glow" style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, rgba(5, 150, 105, 0.12), rgba(217, 119, 6, 0.08) 70%)', border: '1px solid rgba(5, 150, 105, 0.25)' }}>
        
        <div className="badge badge-dues" style={{ padding: '0.45rem 1.25rem', fontSize: '0.88rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(217, 119, 6, 0.2))', border: '1px solid rgba(5, 150, 105, 0.4)', color: 'var(--primary-700)' }}>
          <Sparkles size={16} color="#d97706" /> Official Fellowship & Mutual Aid Portal
        </div>

        <h1 style={{ fontSize: '3rem', lineHeight: 1.12, fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '1.25rem', background: 'linear-gradient(135deg, #059669, #064e3b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
          ONUADO NA EYE MENS' FELLOWSHIP
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto 2.25rem auto', lineHeight: 1.65, fontWeight: 500 }}>
          Standing together in brotherly love, financial solidarity, mutual welfare, and divine fellowship across 10+ regional branches in Ghana.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setActivePage('login')} className="btn btn-primary" style={{ padding: '0.9rem 1.75rem', fontSize: '1.02rem', fontWeight: 700, boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)' }}>
            Access Member Portal <ArrowRight size={18} />
          </button>
          <button onClick={() => setActivePage('contact')} className="btn btn-accent" style={{ padding: '0.9rem 1.75rem', fontSize: '1.02rem', fontWeight: 700, boxShadow: '0 6px 20px rgba(217, 119, 6, 0.3)' }}>
            Fidelity Bank & MoMo Details <Wallet size={18} />
          </button>
          <button onClick={() => setShowConstitutionModal(true)} className="btn btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1.02rem', fontWeight: 700, background: 'var(--bg-card)', border: '1px solid var(--primary-600)', color: 'var(--primary-600)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)' }}>
            Read Fellowship Constitution <BookOpen size={18} color="#059669" />
          </button>
        </div>

        {/* Stats Pill Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-600)' }}>{membersCount || 24}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Faithful Members</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3b82f6' }}>10+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Regional Branches</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-600)' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Financial Transparency</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-700)' }}>{contributionsCount || 49}+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Verified Dues Payments</div>
          </div>
        </div>
      </div>

      {/* Announcements Banner */}
      <div className="glass-card" style={{ marginTop: '2.5rem', padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderLeft: '6px solid var(--accent-500)', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
          <BellRing size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            Fellowship Announcement: Monthly Dues & Fidelity Bank / MoMo Sync
          </div>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Members can send monthly dues and welfare contributions via MTN Mobile Money (<strong>0530486443</strong>), Merchant Code (<strong>293658</strong>), or <strong>Fidelity Bank Ghana</strong>. All transfers are automatically reconciled!
          </div>
        </div>
      </div>

      {/* Fellowship Pillars Grid */}
      <div style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-welfare" style={{ marginBottom: '0.5rem' }}>Fellowship Principles</div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>Pillars of ONUADO NA EYE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Built on Christian faith, mutual financial solidarity, and executive accountability.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '1.25rem' }}>
              <Heart size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>Welfare & Emergency Solidarity</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Standing shoulder-to-shoulder during life milestones, bereavement, family support, and emergencies through our dedicated Welfare Fund.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(217, 119, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '1.25rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>Transparent Financial Ledger</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Every Mobile Money payment and Cash receipt is verified, logged into database ledgers, and viewable in real-time on your private portal.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '1.25rem' }}>
              <Building2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>Nationwide Regional Branches</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Connecting members across Accra, Kumasi, Takoradi, Ashaiman, Kasoa, Mampong, Aburi, Nsawam, and Mankessim.
            </p>
          </div>

        </div>
      </div>

      {/* Executive Leadership Highlight */}
      <div className="glass-card" style={{ marginTop: '4rem', padding: '3rem 2rem', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.05), rgba(217, 119, 6, 0.05))' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-admin" style={{ marginBottom: '0.5rem' }}>Executive Board</div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>Fellowship Executive Board</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Elected Executive Officers governing ONUADO NA EYE MENS' FELLOWSHIP under the Constitution.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '14px', borderTop: '4px solid #059669' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #064e3b)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              MO
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>Moses Oduro</h4>
            <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 800 }}>President</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Noyem Branch • Tipper Truck Business</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '14px', borderTop: '4px solid #d97706' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              OK
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>Osei Kwame</h4>
            <div style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 800 }}>Vice President</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Kasoa Branch • Car Dealer</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '14px', borderTop: '4px solid #3b82f6' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              JQ
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>Mark-Just Quansah</h4>
            <div style={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: 800 }}>PRO & Liaison Officer</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Ashaiman Branch • Bakery Enterprise</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '14px', borderTop: '4px solid #8b5cf6' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              JS
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>Jonathan Danso Siaw</h4>
            <div style={{ fontSize: '0.82rem', color: '#8b5cf6', fontWeight: 800 }}>General Secretary</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Aburi Branch • Pensioner</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '14px', borderTop: '4px solid #10b981' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              WA
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>William Kojo Anane</h4>
            <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 800 }}>Executive Member</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Ashaiman Branch • Mechanical Engineering</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '14px', borderTop: '4px solid #f59e0b' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              JA
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>John Ofosuhene Asare</h4>
            <div style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: 800 }}>Executive Member</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Kotobabi Branch • Building Construction</div>
          </div>

        </div>
      </div>

      {/* Constitution Modal */}
      <ConstitutionModal 
        isOpen={showConstitutionModal} 
        onClose={() => setShowConstitutionModal(false)} 
      />

    </div>
  );
}
