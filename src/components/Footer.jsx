import React from 'react';
import { HeartHandshake, Phone, MapPin, ShieldCheck, CreditCard } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: '4rem', padding: '3rem 1.5rem 1.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
        
        {/* Col 1: Brand & Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #059669, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <HeartHandshake size={20} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-600)' }}>
              ONUADO NA YE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            A close-knit fellowship of 24 members bound by mutual support, spiritual fellowship, financial accountability, and brotherly love.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
            <li><button onClick={() => setActivePage('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>Home Page</button></li>
            <li><button onClick={() => setActivePage('about')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>About Fellowship</button></li>
            <li><button onClick={() => setActivePage('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>Contact & MoMo Details</button></li>
            <li><button onClick={() => setActivePage('login')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>Member Portal Sign-In</button></li>
          </ul>
        </div>

        {/* Col 3: MoMo Payment Info */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CreditCard size={18} color="#d97706" /> Official MoMo Info
          </h4>
          <div style={{ background: 'var(--bg-main)', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--primary-600)' }}>MTN Mobile Money</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.2rem' }}>024 412 3456</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Account Name: Onuado Na Ye Fellowship</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Reference: Your Name / Phone Number</div>
          </div>
        </div>

        {/* Col 4: Contact & Meetings */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={18} color="#059669" /> Meeting Schedule
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong>Monthly General Meeting:</strong> First Sunday of every month @ 4:00 PM.<br />
            <strong>Venue:</strong> Fellowship Hall, East Legon, Accra.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '2rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>&copy; {new Date().getFullYear()} Onuado Na Ye Fellowship. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button 
            onClick={() => setActivePage('login')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <ShieldCheck size={14} color="#d97706" /> Executive Officer Portal
          </button>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#10b981" /> 100% Financial Accountability
          </span>
        </div>
      </div>
    </footer>
  );
}
