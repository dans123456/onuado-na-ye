import React, { useState } from 'react';
import { Phone, Mail, MapPin, CreditCard, CheckCircle2, Send, Copy, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleCopy = () => {
    navigator.clipboard.writeText('0244123456');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-dues" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Contact & Payment Info
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Get in Touch & MoMo Guide</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
          Official payment channel, meeting venue details, and contact lines for Onuado Na Ye Fellowship.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Left Col: Official MoMo Payment Box */}
        <div className="glass-card glass-card-glow" style={{ padding: '2.25rem', borderLeft: '5px solid var(--accent-500)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-600)' }}>
            <CreditCard size={24} /> Official MoMo Payment Details
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Members making monthly dues, welfare contributions, or donations via Mobile Money should use the official fellowship line below:
          </p>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
              MTN Mobile Money Number
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--primary-600)' }}>
                024 412 3456
              </span>
              <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                {copied ? <CheckCircle2 size={16} color="#059669" /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.6rem' }}>
              Account Name: <span style={{ color: 'var(--accent-600)' }}>Onuado Na Ye Fellowship</span>
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '0.5rem', border: '1px dashed var(--primary-500)', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-700)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertCircle size={16} /> Important MoMo Reference Note:
            </div>
            When sending money, please put your <strong>Full Name</strong> or <strong>Phone Number</strong> in the MoMo reference line (e.g. <em>"Kwesi Mensah Dues"</em>). This enables our automated Excel parser in `/admin` to match your payment instantly!
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Meeting Venue</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <MapPin size={18} color="#059669" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <div>Fellowship Hall, Near East Legon Police Station, Accra, Ghana.</div>
            </div>
          </div>
        </div>

        {/* Right Col: Send Message Form */}
        <div className="glass-card" style={{ padding: '2.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Send Us a Message</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Have a question about fellowship meetings, membership, or payment verification?
          </p>

          {submitted && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '0.5rem', color: '#059669', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> Thank you! Your message has been sent to the Fellowship Executives.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Your Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g., Kwame Appiah"
                className="form-input" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Phone Number</label>
              <input 
                type="tel" 
                required 
                placeholder="e.g., 0244123456"
                className="form-input" 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Message / Inquiry</label>
              <textarea 
                rows="4" 
                required 
                placeholder="Type your message here..."
                className="form-input" 
                value={form.message} 
                onChange={(e) => setForm({ ...form, message: e.target.value })} 
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              <Send size={18} /> Submit Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
