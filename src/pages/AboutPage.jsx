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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Story of ONUADO NA EYE MENS' FELLOWSHIP</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          "ONUADO NA EYE" translates to brotherly love and good works. Founded with a shared commitment to mutual support and transparent fellowship.
        </p>
      </div>

      {/* History & Origin */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartHandshake size={28} /> Our History & Purpose
        </h2>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          ONUADO NA EYE MENS' FELLOWSHIP was created by a dedicated circle of 24 close friends and brethren who sought to establish a permanent platform for mutual welfare, financial assistance, social gatherings, and spiritual encouragement.
        </p>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.7 }}>
          Recognizing that individual strength is multiplied in unity, our members contribute regularly toward Monthly Dues, a Welfare Fund, and special community projects. Our web portal provides complete visibility into every cedi contributed.
        </p>
      </div>

      {/* Core Principles & Constitutional Aims */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>Constitutional Aims & Objectives (Art. 1–3)</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="#059669" size={22} />
              <h3 style={{ fontSize: '1.15rem' }}>Christian Unity</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Uniting devoted Christians together as one body to care for the destitute and uphold brotherly love.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="#d97706" size={22} />
              <h3 style={{ fontSize: '1.15rem' }}>Member Welfare & Relief</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Providing prompt financial, spiritual, and emotional support during bereavement, illness, marriage, and family events.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="#3b82f6" size={22} />
              <h3 style={{ fontSize: '1.15rem' }}>Conflict Resolution</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Ensuring all disputes among members are resolved in brotherly harmony through executive counseling.
            </p>
          </div>

        </div>
      </div>

      {/* 📜 CONSTITUTIONAL WELFARE BENEFIT SCHEDULE (Art. 16) */}
      <div className="glass-card" style={{ padding: '2.25rem', marginBottom: '3rem', borderRadius: '18px', borderLeft: '5px solid var(--primary-600)' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={22} /> Constitutional Welfare Benefits Schedule (Article 16)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Official cash donations guaranteed to fully up-to-date members under Article 16 of the Fellowship Constitution:
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Constitutional Provisions (Art. 16)</th>
                <th>Official Cash Benefit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 800 }}>Bereavement — Spouse</td>
                <td>Loss of Wife or Husband (Sect. 1)</td>
                <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 5,000.00</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}>Bereavement — Parent</td>
                <td>Loss of Father or Mother (Sect. 1)</td>
                <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 3,000.00</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}>Bereavement — Child</td>
                <td>Up to two (2) biological children (Sect. 1)</td>
                <td style={{ fontWeight: 800, color: '#059669' }}>GH₵ 2,000.00 each</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}>Hospitalization & Severe Illness</td>
                <td>Severe illness, accident or hospital admission (Sect. 2)</td>
                <td style={{ fontWeight: 800, color: '#3b82f6' }}>GH₵ 1,000.00 + Visitation</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}>Destitution & Property Loss</td>
                <td>Social mishap, fire, or loss of property (Sect. 3)</td>
                <td style={{ fontWeight: 800, color: '#d97706' }}>GH₵ 3,000.00 Cash Relief</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}>Childbirth & Outdooring</td>
                <td>Child naming ceremony support (Sect. 4)</td>
                <td style={{ fontWeight: 800, color: '#8b5cf6' }}>GH₵ 1,000.00 Cash Gift</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}>Weddings & Holy Matrimony</td>
                <td>Member marriage ceremony support (Sect. 5)</td>
                <td style={{ fontWeight: 800, color: '#ec4899' }}>80% Voluntary Levy Pool + Transport</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 👑 EXECUTIVE BOARD OFFICERS */}
      <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-admin" style={{ marginBottom: '0.5rem' }}>Constitutional Governance</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Official Fellowship Executive Board</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Elected Executive Officers holding administrative authority under Article 8 & 9 of the Constitution.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderLeft: '4px solid #059669' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>Moses Oduro</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '0.1rem' }}>President</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Noyem Branch • Phone: 020 354 1966</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderLeft: '4px solid #d97706' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>Osei Kwame</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#d97706', marginTop: '0.1rem' }}>Vice President</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Kasoa Branch • Phone: 024 428 3224</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>Mark-Just Quansah</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.1rem' }}>PRO & Liaison Officer</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Ashaiman Branch • Phone: 026 746 1029</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>Jonathan Danso Siaw</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.1rem' }}>General Secretary</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Aburi Branch • Phone: 024 214 5516</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>William Kojo Anane</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981', marginTop: '0.1rem' }}>Executive Board Member</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Ashaiman Branch • Phone: 026 956 3876</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>John Ofosuhene Asare</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.1rem' }}>Executive Board Member</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Kotobabi Branch • Phone: 024 292 7915</div>
          </div>
        </div>
      </div>

    </div>
  );
}
