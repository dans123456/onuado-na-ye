import React from 'react';
import { Users, Heart, Wallet, ShieldCheck, ArrowRight, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage({ setActivePage, membersCount, contributionsCount }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Hero Section */}
      <div className="glass-card glass-card-glow" style={{ padding: '3.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(217, 119, 6, 0.08))' }}>
        
        <div className="badge badge-dues" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <Sparkles size={16} /> Official Fellowship Portal
        </div>

        <h1 style={{ fontSize: '2.8rem', lineHeight: 1.15, fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-700), var(--accent-600))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to Onuado Na Ye Fellowship
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          A close-knit community of 24 dedicated members standing together in brotherhood, financial accountability, mutual welfare, and community empowerment.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setActivePage('login')} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            Enter Member Portal <ArrowRight size={18} />
          </button>
          <button onClick={() => setActivePage('contact')} className="btn btn-accent" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            MoMo Transfer Details <Wallet size={18} />
          </button>
        </div>

        {/* Stats Pill Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)' }}>24</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Close-Knit Members</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-600)' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Financial Transparency</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)' }}>{contributionsCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Logged Payments</div>
          </div>
        </div>
      </div>

      {/* Announcements Banner */}
      <div className="glass-card" style={{ marginTop: '2.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', borderLeft: '5px solid var(--accent-500)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
          <BellRing size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            Upcoming Fellowship Notice: September Monthly Meeting & Dues Logging
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Please ensure all monthly dues and welfare contributions are sent via Mobile Money (0244123456) before the 1st Sunday meeting. Admins will update your personal ledger instantly!
          </div>
        </div>
      </div>

      {/* Fellowship Pillars Grid */}
      <div style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>Core Pillars of Our Fellowship</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Built on trust, accountability, and brotherly support.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '1.25rem' }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Welfare & Mutual Support</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Standing together during milestones, celebrations, emergencies, and times of need through our collective Welfare Fund.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '1.25rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Transparent Financial Ledger</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Every Mobile Money transfer and Cash payment is logged, verified, and accessible to each member via their private dashboard.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', marginBottom: '1.25rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>24 Bonded Members</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              A tight-knit community where every member is known, valued, and empowered with equal voice and accountability.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
