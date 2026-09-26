import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Smartphone, AlertCircle, X, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { initializePaystackPayment } from '../services/paystack';
import LoadingModal from './LoadingModal';

export default function PaystackModal({ isOpen, onClose, currentUser, onPaymentSuccess }) {
  if (!isOpen) return null;

  const defaultEmail = currentUser?.email || `${(currentUser?.full_name || 'member').toLowerCase().replace(/[^a-z0-9]/g, '')}@onuadonaeye.org`;
  const defaultPhone = currentUser?.phone_number || '';

  const [contributionType, setContributionType] = useState('Monthly Dues');
  const [amount, setAmount] = useState('300');
  const [customAmount, setCustomAmount] = useState('');
  const [payerEmail, setPayerEmail] = useState(defaultEmail);
  const [payerPhone, setPayerPhone] = useState(defaultPhone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const getFinalAmount = () => {
    if (amount === 'custom') {
      return parseFloat(customAmount) || 0;
    }
    return parseFloat(amount) || 0;
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    const finalAmt = getFinalAmount();

    if (finalAmt <= 0) {
      alert('Please enter a valid payment amount greater than GH₵ 0.00');
      return;
    }

    setIsProcessing(true);

    initializePaystackPayment({
      email: payerEmail,
      amount: finalAmt,
      memberName: currentUser?.full_name || 'Fellowship Member',
      memberId: currentUser?.excel_member_id || 'ONY-000',
      contributionType: contributionType,
      phone: payerPhone,
      onSuccess: (paymentResult) => {
        setIsProcessing(false);
        setSuccessData(paymentResult);
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentResult);
        }
      },
      onClose: () => {
        setIsProcessing(false);
      }
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2.25rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', border: '1.5px solid rgba(5, 150, 105, 0.4)', background: 'var(--bg-card)', position: 'relative' }}>
        
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {!successData ? (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(217, 119, 6, 0.2))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '0.75rem', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
                <CreditCard size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                Pay Online via Paystack
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
                Instant Mobile Money (MTN, Telecel, AirtelTigo) & Card Payments for <strong>{currentUser?.full_name || 'Member'}</strong>
              </p>
            </div>

            <form onSubmit={handlePayNow} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Category Selector */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Payment Purpose / Category
                </label>
                <select 
                  className="form-input" 
                  value={contributionType}
                  onChange={(e) => setContributionType(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="Monthly Dues">Monthly Dues (2023 – 2033)</option>
                  <option value="Special Welfare Levy">Special Welfare Levy (1st–12th Levies)</option>
                  <option value="Registration Fee">Registration Fee (GH₵ 200.00)</option>
                  <option value="Welfare Contribution">Welfare Contribution & Support</option>
                </select>
              </div>

              {/* Amount Quick Select Pills */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Select Payment Amount (GHS)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  {['100', '200', '300', '600', '900', 'custom'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      style={{
                        padding: '0.6rem 0.5rem',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        borderRadius: '10px',
                        border: amount === val ? '2px solid #059669' : '1px solid var(--border-color)',
                        background: amount === val ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-main)',
                        color: amount === val ? '#059669' : 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {val === 'custom' ? 'Custom' : `GH₵ ${val}`}
                    </button>
                  ))}
                </div>

                {amount === 'custom' && (
                  <input 
                    type="number"
                    min="1"
                    step="0.01"
                    className="form-input"
                    placeholder="Enter custom amount in GHS (e.g. 150)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    autoFocus
                  />
                )}
              </div>

              {/* Payer Phone & Email Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                    MoMo Phone Number
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="0244123456"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                    Receipt Email Address
                  </label>
                  <input 
                    type="email" 
                    className="form-input"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="member@gmail.com"
                  />
                </div>
              </div>

              {/* Gateway Supported Badge */}
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(5, 150, 105, 0.08)', borderRadius: '12px', border: '1px solid rgba(5, 150, 105, 0.2)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700 }}>
                  <ShieldCheck size={16} /> Paystack Secure Gateway
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  MTN • Telecel • Visa • Mastercard
                </div>
              </div>

              {/* Pay Now Submit Button */}
              <button 
                type="submit" 
                disabled={isProcessing || getFinalAmount() <= 0}
                className="btn btn-primary"
                style={{ padding: '0.9rem', fontSize: '1.05rem', fontWeight: 800, background: 'linear-gradient(135deg, #059669, #d97706)', border: 'none', boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)' }}
              >
                {isProcessing ? 'Connecting to Paystack...' : `Pay GH₵ ${getFinalAmount().toFixed(2)} via Paystack →`}
              </button>
            </form>
          </div>
        ) : (
          /* Payment Success Celebration Screen */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '1rem', border: '2px solid #10b981' }}>
              <CheckCircle2 size={42} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              Payment Verified & Logged!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Your payment of <strong>GH₵ {successData.amount.toFixed(2)}</strong> for <strong>{successData.contribution_type}</strong> has been processed via Paystack.
            </p>

            <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                <strong style={{ fontFamily: 'monospace', color: '#059669' }}>{successData.reference}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payer Name:</span>
                <strong>{currentUser?.full_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Channel:</span>
                <strong>{successData.method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date Logged:</span>
                <strong>{successData.date}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => { setSuccessData(null); onClose(); }} 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}
              >
                Return to Member Portal
              </button>
            </div>
          </div>
        )}

        {/* Payment Gateway Loading Overlay */}
        <LoadingModal 
          isOpen={isProcessing}
          title="Connecting to Paystack Gateway..."
          subtitle="Awaiting Mobile Money / Card Payment Authorization..."
          type="payment"
        />

      </div>
    </div>
  );
}

