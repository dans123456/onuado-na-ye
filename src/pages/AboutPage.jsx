import React from 'react';
import { HeartHandshake, Shield, Award, Users, CheckCircle } from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-welfare" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
          About Our Fellowship
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Story of Onuado Na Ye</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          "Onuado Na Ye" translates to brotherly love and good works. Founded with a shared commitment to mutual support and transparent fellowship.
        </p>
      </div>

      {/* History & Origin */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartHandshake size={28} /> Our History & Purpose
        </h2>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          Onuado Na Ye Fellowship was created by a dedicated circle of 24 close friends and brethren who sought to establish a permanent platform for mutual welfare, financial assistance, social gatherings, and spiritual encouragement.
        </p>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.7 }}>
          Recognizing that individual strength is multiplied in unity, our members contribute regularly toward Monthly Dues, a Welfare Fund, and special community projects. Our web portal provides complete visibility into every cedi contributed.
        </p>
      </div>

      {/* Core Principles */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>Our Core Principles</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="#059669" size={22} />
              <h3 style={{ fontSize: '1.15rem' }}>Brotherly Love</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Fostering genuine care, visitation, and emotional support for every member and their household.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="#d97706" size={22} />
              <h3 style={{ fontSize: '1.15rem' }}>Financial Integrity</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Zero ambiguity. Every Mobile Money payment and cash transaction is recorded with receipt references.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="#4f46e5" size={22} />
              <h3 style={{ fontSize: '1.15rem' }}>Prompt Support</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Rapid disbursement of welfare funds for weddings, child naming, bereavement, and health emergencies.
            </p>
          </div>

        </div>
      </div>

      {/* Leadership Officers */}
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Fellowship Administration</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Elected officers responsible for managing fellowship affairs & financial logging.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '1rem', border: '1px solid var(--border-color)', minWidth: '240px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-600)' }}>Kwesi Mensah</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.2rem' }}>Fellowship Chairman</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Phone: 024 412 3456</div>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '1rem', border: '1px solid var(--border-color)', minWidth: '240px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-600)' }}>Abena Osei</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.2rem' }}>Fellowship Treasurer</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Phone: 020 876 5432</div>
          </div>
        </div>
      </div>

    </div>
  );
}
