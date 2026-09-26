// Paystack Payment Integration Service for ONUADO NA EYE MENS' FELLOWSHIP
// Supports Mobile Money (MTN MoMo, Telecel Cash, AirtelTigo Money) & Bank Cards in Ghana (GHS)

const DEFAULT_PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_b7a8d56c4d791242337d6e676100188b0a514d79';

/**
 * Dynamically loads Paystack Inline JS script into document head
 */
export const loadPaystackScript = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

/**
 * Triggers Paystack Inline Payment Modal
 * 
 * @param {Object} options 
 * @param {string} options.email Payer Email
 * @param {number} options.amount Amount in GHS (e.g., 200 for GH₵ 200)
 * @param {string} options.memberName Member Full Name
 * @param {string} options.memberId Member ID (e.g., ONY-001)
 * @param {string} options.contributionType Contribution category (Dues, Levy, etc.)
 * @param {string} options.phone Payer Phone Number
 * @param {Function} options.onSuccess Callback on successful payment
 * @param {Function} options.onClose Callback when payment modal is closed
 */
export const initializePaystackPayment = async ({
  email,
  amount,
  memberName,
  memberId,
  contributionType = 'Monthly Dues',
  phone = '',
  publicKey = DEFAULT_PAYSTACK_KEY,
  onSuccess,
  onClose
}) => {
  const isLoaded = await loadPaystackScript();
  if (!isLoaded || !window.PaystackPop) {
    alert('Failed to connect to Paystack payment gateway. Please check your internet connection and try again.');
    return;
  }

  const amountInPesewas = Math.round(parseFloat(amount) * 100);
  const ref = 'ONY-PS-' + Math.floor(Math.random() * 1000000000 + 1);

  const handler = window.PaystackPop.setup({
    key: publicKey || DEFAULT_PAYSTACK_KEY,
    email: email || `${(memberName || 'member').toLowerCase().replace(/[^a-z0-9]/g, '')}@onuadonaeye.org`,
    amount: amountInPesewas,
    currency: 'GHS',
    ref: ref,
    metadata: {
      custom_fields: [
        {
          display_name: "Member Name",
          variable_name: "member_name",
          value: memberName || "Fellowship Member"
        },
        {
          display_name: "Member ID",
          variable_name: "member_id",
          value: memberId || "ONY-000"
        },
        {
          display_name: "Contribution Type",
          variable_name: "contribution_type",
          value: contributionType
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone
        }
      ]
    },
    callback: function (response) {
      if (onSuccess) {
        onSuccess({
          reference: response.reference,
          transaction_id: response.transaction || response.reference,
          amount: parseFloat(amount),
          amount_pesewas: amountInPesewas,
          status: response.status || 'success',
          date: new Date().toISOString().split('T')[0],
          method: 'Paystack (MoMo / Card)',
          contribution_type: contributionType
        });
      }
    },
    onClose: function () {
      if (onClose) {
        onClose();
      }
    }
  });

  handler.openIframe();
};
