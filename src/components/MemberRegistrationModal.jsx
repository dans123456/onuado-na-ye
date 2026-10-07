import React, { useState } from 'react';
import { X, CheckCircle2, UserPlus, CreditCard, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { savePendingApplication } from '../services/store';

export default function MemberRegistrationModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('form'); // 'form', 'payment', 'success'
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    branch: 'Tema',
    title: 'Brother',
    occupation: '',
    hometown: '',
    next_of_kin: '',
    next_of_kin_contact: '',
    payment_method: 'Mobile Money'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.full_name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.phone_number.trim()) {
      setError('Please enter your primary phone number.');
      return;
    }
    setStep('payment');
  };

  const handlePaymentConfirm = () => {
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      try {
        const app = savePendingApplication({
          ...formData,
          payment_reference: `REG-PAY-${Date.now()}`
        });
        setSubmittedApp(app);
        setIsSubmitting(false);
        setStep('success');
        if (onSuccess) onSuccess(app);
      } catch (err) {
        console.error(err);
        setError('Failed to process application. Please try again.');
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const resetAndClose = () => {
    setStep('form');
    setFormData({
      full_name: '',
      phone_number: '',
      email: '',
      branch: 'Tema',
      title: 'Brother',
      occupation: '',
      hometown: '',
      next_of_kin: '',
      next_of_kin_contact: '',
      payment_method: 'Mobile Money'
    });
    setError('');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: '24px', background: 'var(--bg-card)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-color)', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669' }}>
              <UserPlus size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Join Fellowship Registration</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>ONUADƆ NA ƐYƐ Men's Fellowship Membership</p>
            </div>
          </div>
          <button onClick={resetAndClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* STEP 1: BIO-DATA FORM */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Title</label>
                <select name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 700 }}>
                  <option value="Brother">Brother</option>
                  <option value="Elder">Elder</option>
                  <option value="Deacon">Deacon</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Mr">Mr</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Full Name *</label>
                <input type="text" name="full_name" required placeholder="e.g. Samuel Kojo Mensah" value={formData.full_name} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 800 }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Primary Phone *</label>
                <input type="tel" name="phone_number" required placeholder="024 XXX XXXX" value={formData.phone_number} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Branch / Location *</label>
                <select name="branch" value={formData.branch} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 700 }}>
                  <option value="Tema">Tema Branch</option>
                  <option value="Mampong">Mampong Branch</option>
                  <option value="Accra">Accra Central</option>
                  <option value="Kumasi">Kumasi Branch</option>
                  <option value="Takoradi">Takoradi Branch</option>
                  <option value="Other">Other Branch</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Email Address</label>
                <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Occupation / Place of Work</label>
                <input type="text" name="occupation" placeholder="e.g. Teacher / Businessman" value={formData.occupation} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Next of Kin Name</label>
                <input type="text" name="next_of_kin" placeholder="Relative Name" value={formData.next_of_kin} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Next of Kin Contact</label>
                <input type="tel" name="next_of_kin_contact" placeholder="Phone Number" value={formData.next_of_kin_contact} onChange={handleChange} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }} />
              </div>
            </div>

            {/* Registration Fee Summary Notice */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '14px', background: 'rgba(5, 150, 105, 0.08)', border: '1.5px solid rgba(5, 150, 105, 0.25)', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669' }}>Official Registration Fee</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required one-off membership admission fee</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>GH₵ 200.00</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={resetAndClose} className="btn btn-secondary" style={{ padding: '0.65rem 1.1rem', fontWeight: 700 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                Proceed to Pay Registration Fee &rarr;
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT CONFIRMATION */}
        {step === 'payment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>Applicant</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.15rem' }}>{formData.title} {formData.full_name}</div>
              <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, marginTop: '0.25rem' }}>📞 {formData.phone_number} • 📍 {formData.branch} Branch</div>
            </div>

            <div style={{ padding: '1.2rem', borderRadius: '16px', background: 'rgba(5, 150, 105, 0.08)', border: '1.5px solid rgba(5, 150, 105, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 700 }}>Registration Admission Fee</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>GH₵ 200.00</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Includes official onboarding, constitution handbook, and entry into the fellowship ledger.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Select Payment Method</label>
              <select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700 }}>
                <option value="Mobile Money">📱 Mobile Money (MTN / Telecel / AT)</option>
                <option value="Paystack Card">💳 Debit / Credit Card (Paystack Direct)</option>
                <option value="Bank Transfer">🏦 Bank Direct Deposit (Fidelity Bank)</option>
                <option value="Cash at Branch">💵 Cash Payment to Executive Treasurer</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setStep('form')} className="btn btn-secondary" style={{ padding: '0.65rem 1.1rem', fontWeight: 700 }} disabled={isSubmitting}>Back</button>
              <button type="button" onClick={handlePaymentConfirm} className="btn btn-primary" style={{ padding: '0.7rem 1.4rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} disabled={isSubmitting}>
                {isSubmitting ? 'Processing Payment...' : 'Confirm GH₵ 200.00 & Submit Application'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
              Application Submitted Successfully!
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Thank you, <strong>{formData.title} {formData.full_name}</strong>. Your registration application and GH₵ 200.00 payment confirmation have been recorded under <strong>Ref: {submittedApp?.payment_reference}</strong>.
            </p>

            <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, marginBottom: '1.5rem' }}>
              ℹ️ Your application is currently under <strong>Executive Admin Review</strong>. Once approved, you will be assigned your official Member ONY Number and login credentials.
            </div>

            <button onClick={resetAndClose} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 800, background: '#059669', borderColor: '#059669' }}>
              Done & Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
