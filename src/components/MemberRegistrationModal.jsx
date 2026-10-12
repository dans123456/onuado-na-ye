import React, { useState } from 'react';
import { X, CheckCircle2, UserPlus, CreditCard, ShieldCheck, Heart, AlertCircle, ArrowRight, ArrowLeft, Printer, Users, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { savePendingApplication, OFFICIAL_BRANCHES, GHANA_REGIONS, CHURCH_TITLES, MARITAL_STATUSES } from '../services/store';
import OfficialRegistrationPrintModal from './OfficialRegistrationPrintModal';

export default function MemberRegistrationModal({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Location, 3: Vocation, 4: Family, 5: Payment, 6: Success
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal & Church
    title: 'Brother',
    full_name: '',
    position_in_church: 'Member',
    branch: 'Aburi',
    date_joined: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    phone_number: '',
    phone_number_2: '',
    email: '',
    ghana_card_no: '',

    // Step 2: Residence & Location
    house_no: '',
    gps_address: '',
    town: '',
    region: 'Greater Accra',
    district: '',
    hometown: '',
    tribe: 'Akan',

    // Step 3: Work & Birth
    occupation: '',
    place_of_work: '',
    dob: '',
    place_of_birth: '',

    // Step 4: Family & Lineage
    next_of_kin: '',
    relationship: 'Son',
    next_of_kin_contact: '',
    marital_status: 'Married',
    name_of_spouse: '',
    spouse_contact_address: '',
    children_male: 0,
    children_female: 0,
    father_name: '',
    father_contact_address: '',
    mother_name: '',
    mother_contact_address: '',

    // Step 5: Payment
    payment_method: 'Mobile Money'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step) => {
    setError('');
    if (step === 1) {
      if (!formData.full_name.trim()) return 'Please enter your full legal name.';
      if (!formData.phone_number.trim()) return 'Please enter your primary telephone number (Telephone No. 1).';
      if (formData.phone_number.trim().length < 9) return 'Please enter a valid Ghanaian phone number (e.g. 024 XXX XXXX).';
    }
    if (step === 2) {
      if (!formData.town.trim()) return 'Please enter your current residential Town or City.';
    }
    if (step === 3) {
      if (!formData.occupation.trim()) return 'Please enter your occupation or trade.';
    }
    if (step === 4) {
      if (!formData.next_of_kin.trim()) return 'Please enter the name of your Next of Kin.';
      if (!formData.next_of_kin_contact.trim()) return 'Please enter a contact phone number for your Next of Kin.';
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
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
        setCurrentStep(6); // Success
        if (onSuccess) onSuccess(app);
      } catch (err) {
        console.error(err);
        setError('Failed to submit registration. Please try again.');
        setIsSubmitting(false);
      }
    }, 1100);
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setSubmittedApp(null);
    setError('');
    onClose();
  };

  const stepTitles = [
    { num: 1, label: 'Identity & Church' },
    { num: 2, label: 'Residence & GPS' },
    { num: 3, label: 'Vocation & Birth' },
    { num: 4, label: 'Family & Kin' },
    { num: 5, label: 'Review & Fee' }
  ];

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem', overflowY: 'auto' }}>
        <div 
          className="glass-card" 
          style={{ 
            width: '100%', 
            maxWidth: '680px', 
            padding: '2rem', 
            borderRadius: '24px', 
            background: 'var(--bg-card)', 
            backgroundColor: 'var(--bg-card)', 
            backdropFilter: 'none', 
            WebkitBackdropFilter: 'none', 
            isolation: 'isolate', 
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)', 
            border: '1px solid var(--border-color)', 
            position: 'relative',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}
        >
          
          {/* Top Close Button */}
          <button 
            onClick={resetAndClose}
            aria-label="Close"
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ padding: '0.55rem', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'flex' }}>
                <UserPlus size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  ONUADƆ NA ƐYƐ Registration Form
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Official Men's Fellowship Membership Enrolment & Registry
                </p>
              </div>
            </div>

            {/* Stepper Progress Bar (Steps 1 to 5) */}
            {currentStep <= 5 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {stepTitles.map((s) => {
                  const isActive = currentStep === s.num;
                  const isDone = currentStep > s.num;
                  return (
                    <div 
                      key={s.num} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        flex: 1, 
                        minWidth: '95px',
                        cursor: isDone ? 'pointer' : 'default' 
                      }}
                      onClick={() => isDone && setCurrentStep(s.num)}
                    >
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: isDone ? '#059669' : isActive ? 'var(--primary-600)' : 'var(--border-color)', 
                        color: isDone || isActive ? '#ffffff' : 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.72rem', 
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {isDone ? '✓' : s.num}
                      </div>
                      <span style={{ 
                        fontSize: '0.73rem', 
                        fontWeight: isActive ? 800 : 600, 
                        color: isActive ? 'var(--primary-600)' : 'var(--text-muted)',
                        whiteSpace: 'nowrap'
                      }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Message Box */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {/* ================= STEP 1: PERSONAL & CHURCH ================= */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TITLE *</label>
                  <select name="title" value={formData.title} onChange={handleChange} className="form-select" style={{ fontWeight: 700 }}>
                    {CHURCH_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>FULL NAME *</label>
                  <input type="text" name="full_name" required placeholder="e.g. Samuel Kwabena Mensah" value={formData.full_name} onChange={handleChange} className="form-input" style={{ fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>POSITION IN CHURCH</label>
                  <input type="text" name="position_in_church" placeholder="e.g. Member, Youth Leader, Deacon" value={formData.position_in_church} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>BRANCH *</label>
                  <select name="branch" value={formData.branch} onChange={handleChange} className="form-select" style={{ fontWeight: 700 }}>
                    {OFFICIAL_BRANCHES.map(b => <option key={b} value={b}>{b} Branch</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>DATE JOINED THE FELLOWSHIP</label>
                  <input type="text" name="date_joined" placeholder="e.g. January 2026" value={formData.date_joined} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TELEPHONE NO. 1 (PRIMARY) *</label>
                  <input type="tel" name="phone_number" required placeholder="024 XXX XXXX" value={formData.phone_number} onChange={handleChange} className="form-input" style={{ fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TELEPHONE NO. 2 (OPTIONAL)</label>
                  <input type="tel" name="phone_number_2" placeholder="020 XXX XXXX" value={formData.phone_number_2} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>GHANA IDENTITY CARD NO.</label>
                  <input type="text" name="ghana_card_no" placeholder="GHA-7XXXXXXXX-X" value={formData.ghana_card_no} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>E-MAIL ADDRESS (IF ANY)</label>
                <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
            </div>
          )}

          {/* ================= STEP 2: RESIDENCE & LOCATION ================= */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>HOUSE NO</label>
                  <input type="text" name="house_no" placeholder="e.g. M/E 163 or Plot 12 Block B" value={formData.house_no} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>GPS CODE ADDRESS</label>
                  <input type="text" name="gps_address" placeholder="e.g. E2-0793-9218 / GA-183-9022" value={formData.gps_address} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TOWN (CURRENT RESIDENCE) *</label>
                  <input type="text" name="town" required placeholder="e.g. Mampong Akuapem, Tema" value={formData.town} onChange={handleChange} className="form-input" style={{ fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>REGION (GHANA) *</label>
                  <select name="region" value={formData.region} onChange={handleChange} className="form-select" style={{ fontWeight: 700 }}>
                    {GHANA_REGIONS.map(r => <option key={r} value={r}>{r} Region</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>DISTRICT</label>
                  <input type="text" name="district" placeholder="e.g. Akuapem North, Amanfie East" value={formData.district} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>HOMETOWN</label>
                  <input type="text" name="hometown" placeholder="e.g. Wassa Daurampong, Aburi" value={formData.hometown} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TRIBE</label>
                <input type="text" name="tribe" placeholder="e.g. Akan / Asante, Fante, Wassa, Ewe, Ga-Dangme" value={formData.tribe} onChange={handleChange} className="form-input" />
              </div>
            </div>
          )}

          {/* ================= STEP 3: VOCATION & BIRTH ================= */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>OCCUPATION *</label>
                  <input type="text" name="occupation" required placeholder="e.g. Teacher, Driver, Civil Servant, Businessman" value={formData.occupation} onChange={handleChange} className="form-input" style={{ fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>PLACE OF WORK</label>
                  <input type="text" name="place_of_work" placeholder="e.g. Somanya, Tema Port, Self-employed" value={formData.place_of_work} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>DATE OF BIRTH</label>
                  <input type="text" name="dob" placeholder="e.g. 14th June 1980 or June 1980" value={formData.dob} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>PLACE OF BIRTH</label>
                  <input type="text" name="place_of_birth" placeholder="e.g. Asankragwa, Accra" value={formData.place_of_birth} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', fontSize: '0.82rem', color: '#d97706' }}>
                💡 Birth and work records help the Fellowship Welfare Committee provide accurate benevolent support, retirement acknowledgement, and emergency reach.
              </div>
            </div>
          )}

          {/* ================= STEP 4: FAMILY & LINEAGE ================= */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>NEXT OF KIN *</label>
                  <input type="text" name="next_of_kin" required placeholder="Full Name of Next of Kin" value={formData.next_of_kin} onChange={handleChange} className="form-input" style={{ fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>RELATIONSHIP</label>
                  <input type="text" name="relationship" placeholder="e.g. Son, Wife, Brother" value={formData.relationship} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>CONTACT: NEXT OF KIN *</label>
                  <input type="tel" name="next_of_kin_contact" required placeholder="024 XXX XXXX" value={formData.next_of_kin_contact} onChange={handleChange} className="form-input" style={{ fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>MARITAL STATUS</label>
                  <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="form-select" style={{ fontWeight: 700 }}>
                    {MARITAL_STATUSES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>NAME OF SPOUSE</label>
                  <input type="text" name="name_of_spouse" placeholder="Spouse Full Name (if married)" value={formData.name_of_spouse} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>CONTACT ADDRESS (SPOUSE / RESIDENCE)</label>
                <input type="text" name="spouse_contact_address" placeholder="Phone or physical postal address" value={formData.spouse_contact_address} onChange={handleChange} className="form-input" />
              </div>

              {/* Number of Children: Male & Female */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'var(--bg-main)', border: '1.5px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  NUMBER OF CHILDREN
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>👦 Male Children</label>
                    <input type="number" min="0" max="25" name="children_male" value={formData.children_male} onChange={handleChange} className="form-input" style={{ fontWeight: 800 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>👧 Female Children</label>
                    <input type="number" min="0" max="25" name="children_female" value={formData.children_female} onChange={handleChange} className="form-input" style={{ fontWeight: 800 }} />
                  </div>
                </div>
              </div>

              {/* Parents' Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>FATHER'S NAME</label>
                  <input type="text" name="father_name" placeholder="Father's Full Name" value={formData.father_name} onChange={handleChange} className="form-input" />
                  <input type="text" name="father_contact_address" placeholder="Father's Contact / Town" value={formData.father_contact_address} onChange={handleChange} className="form-input" style={{ marginTop: '0.35rem', fontSize: '0.82rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>MOTHER'S NAME</label>
                  <input type="text" name="mother_name" placeholder="Mother's Full Name" value={formData.mother_name} onChange={handleChange} className="form-input" />
                  <input type="text" name="mother_contact_address" placeholder="Mother's Contact / Town" value={formData.mother_contact_address} onChange={handleChange} className="form-input" style={{ marginTop: '0.35rem', fontSize: '0.82rem' }} />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: REVIEW & REGISTRATION FEE ================= */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-main)', border: '1.5px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} /> Application Summary
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Applicant:</span><strong>{formData.title} {formData.full_name}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Branch & Position:</span><strong>{formData.branch} Branch ({formData.position_in_church})</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Primary Telephone:</span><strong>{formData.phone_number}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Residence & Town:</span><strong>{formData.town}, {formData.region} Region</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Next of Kin:</span><strong>{formData.next_of_kin} ({formData.relationship}) - {formData.next_of_kin_contact}</strong></div>
              </div>

              {/* Official Registration Fee Card */}
              <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(217, 119, 6, 0.08))', border: '1.5px solid rgba(5, 150, 105, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669' }}>Fellowship Registration Fee</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official One-Time Admission Fee</div>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>GH₵ 200.00</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Preferred Payment Mode</label>
                  <select name="payment_method" value={formData.payment_method} onChange={handleChange} className="form-select" style={{ fontWeight: 700 }}>
                    <option value="Mobile Money">📱 Mobile Money (MTN MoMo, Telecel Cash, AT Money)</option>
                    <option value="Card / Paystack">💳 Debit Card / Visa / Mastercard</option>
                    <option value="Cash at Branch">💵 Cash to Branch Treasurer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 6: SUCCESS & OFFICIAL PRINT ================= */}
          {currentStep === 6 && submittedApp && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Application Submitted Successfully!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                Welcome, <strong>{submittedApp.title} {submittedApp.full_name}</strong>! Your official registration application and <strong>GH₵ 200.00</strong> fee record have been logged with the Executive Council.
              </p>

              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '380px', margin: '0 auto 1.75rem', fontSize: '0.85rem' }}>
                <div>Application Reference: <strong style={{ color: '#059669' }}>{submittedApp.id}</strong></div>
                <div>Assigned Branch: <strong>{submittedApp.branch} Branch</strong></div>
                <div>Admission Status: <strong style={{ color: '#d97706' }}>PENDING EXECUTIVE APPROVAL</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => setShowPrintModal(true)} 
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.4rem', fontWeight: 800, background: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Printer size={18} /> View / Print Official Registration Form
                </button>
                <button 
                  onClick={resetAndClose}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.25rem', fontWeight: 700 }}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.1rem' }}>
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  onClick={handleBack} 
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.15rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={resetAndClose} 
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.15rem', fontWeight: 700 }}
                >
                  Cancel
                </button>
              )}

              {currentStep < 5 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.35rem', fontWeight: 800, background: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handlePaymentConfirm} 
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #059669, #d97706)', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Confirm & Submit Application'} <CheckCircle2 size={16} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Official Printable Sheet Modal */}
      {showPrintModal && (
        <OfficialRegistrationPrintModal 
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          memberData={submittedApp}
        />
      )}
    </>
  );
}
