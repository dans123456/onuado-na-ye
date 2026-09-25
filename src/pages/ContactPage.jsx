import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, Clock, ShieldCheck, Video, Users } from 'lucide-react';

export default function ContactPage({ setActivePage, currentUser }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handlePortalRedirect = () => {
    if (setActivePage) {
      setActivePage(currentUser ? 'dashboard' : 'login');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-dues" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Fellowship Contact & Inquiries
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Get in Touch & Online Meeting Info</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          Official online fellowship platform, executive board contacts, and direct message channel for ONUADO NA EYE MENS' FELLOWSHIP.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.75rem' }}>
        
        {/* Left Col: Executive Contacts & Fellowship Secretariat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Member Portal Payment Redirect Banner */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', borderLeft: '5px solid #059669', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(217, 119, 6, 0.08))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, color: 'var(--primary-700)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={22} color="#059669" /> Looking to Pay Dues or Levies?
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
              Official payment instructions (Fidelity Bank account details, MTN MoMo wallet, and Merchant Code) are securely located inside each member's personal <strong>Member Portal</strong> for privacy and transaction tracking.
            </p>
            <button 
              onClick={handlePortalRedirect}
              className="btn btn-primary" 
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700 }}
            >
              {currentUser ? 'Go to My Member Portal →' : 'Log Into Member Portal →'}
            </button>
          </div>

          {/* Fellowship Secretariat & Online Meeting Info */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
              <Video size={22} color="#059669" /> Online Meeting & Secretariat
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.92rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Video size={20} color="#059669" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Primary Fellowship Meetings (Online)</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.15rem', lineHeight: 1.5 }}>
                    Fellowship meetings are conducted <strong>ONLINE</strong> via Google Meet & Zoom. Meeting links are published to verified members in the Portal.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Clock size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Online Meeting Schedule</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.15rem' }}>
                    1st & 3rd Sunday of every month @ <strong>4:00 PM GMT</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Mail size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Official Fellowship Email</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.15rem' }}>
                    <strong>onuadonaeye@gmail.com</strong>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} color="#d97706" /> Executive Officers Directory
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>Moses Osei Kwarteng</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>President</div>
                </div>

                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>Osei Kwame</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vice President</div>
                </div>

                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>Mark-Just Quansah</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>P.R.O.</div>
                </div>

                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>Jonathan Danso Siaw</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Secretary</div>
                </div>

                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>William Anane</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Executive Member</div>
                </div>

                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>John Amoakohene Asare</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Executive Member</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Send Message Form */}
        <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '18px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Send Us a Message</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Have a question about online meetings, branch registration, or membership inquiry? Send a direct message to our Executive Officers.
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

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 700 }}>
              <Send size={18} /> Submit Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
