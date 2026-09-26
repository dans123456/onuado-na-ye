// Master Special Levy Schedule & Member Payment Records
// Extracted strictly from Excel Sheet "SPECIAL LEVY" in "ONUADO NA EYE ACCOUNT.xlsx"

export const SPECIAL_LEVIES_MASTER = [
  {
    id: 1,
    number: '1st LEVY',
    recipient: 'ELD. ISAAC DARKO',
    amount: 200,
    status: 'ACTIVE ✓'
  },
  {
    id: 2,
    number: '2nd LEVY',
    recipient: 'ELD. SAMUEL NKANSAH',
    amount: 100,
    status: 'ACTIVE ✓'
  },
  {
    id: 3,
    number: '3rd LEVY',
    recipient: 'ELD. SAMUEL NKANSAH',
    amount: 200,
    status: 'ACTIVE ✓'
  },
  {
    id: 4,
    number: '4th LEVY',
    recipient: 'ELD. JOHN OFOSUHENE ASARE',
    amount: 200,
    status: 'ACTIVE ✓'
  },
  {
    id: 5,
    number: '5th LEVY',
    recipient: 'ELD JONATHAN DANSO SIAW',
    amount: 200,
    status: 'ACTIVE ✓'
  },
  {
    id: 6,
    number: '6th LEVY',
    recipient: 'ELD PRINCE AHWIREN ASANTE',
    amount: 100,
    status: 'ACTIVE ✓'
  },
  {
    id: 7,
    number: '7th LEVY',
    recipient: 'Fellowship Reserve',
    amount: 0,
    status: 'RESERVE ⏳'
  },
  {
    id: 8,
    number: '8th LEVY',
    recipient: 'Fellowship Reserve',
    amount: 0,
    status: 'RESERVE ⏳'
  },
  {
    id: 9,
    number: '9th LEVY',
    recipient: 'Fellowship Reserve',
    amount: 0,
    status: 'RESERVE ⏳'
  },
  {
    id: 10,
    number: '10th LEVY',
    recipient: 'Fellowship Reserve',
    amount: 0,
    status: 'RESERVE ⏳'
  },
  {
    id: 11,
    number: '11th LEVY',
    recipient: 'Fellowship Reserve',
    amount: 0,
    status: 'RESERVE ⏳'
  },
  {
    id: 12,
    number: '12th LEVY',
    recipient: 'Fellowship Reserve',
    amount: 0,
    status: 'RESERVE ⏳'
  }
];

// Member individual payment ledger for Levies 1 to 6 from SPECIAL LEVY sheet
export const MEMBER_LEVY_MATRIX = {
  "Alex Ackah": { l1: 0, l2: 0, l3: 200, l4: 200, l5: 200, l6: 100, total: 700 },
  "Danso Kingsley": { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, l6: 100, total: 100 },
  "Fanuel Hagan": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Frederick Wortey Tawiah": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "George Yeboah": { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, l6: 100, total: 100 },
  "Isaac Darko": { l1: 0, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 800, exempt: [1] },
  "Isaac Donkor": { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, l6: 100, total: 100 },
  "John Aidoo": { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, l6: 0, total: 0 },
  "John Darbo": { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, l6: 100, total: 100 },
  "John Ofosuhene Asare": { l1: 200, l2: 100, l3: 200, l4: 0, l5: 200, l6: 100, total: 800, exempt: [4] },
  "Johnson Wood": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Jonas Wereko": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Jonathan Danso Siaw": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 0, l6: 100, total: 800, exempt: [5] },
  "Joseph Kofi Amanfo": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Justice Kojo Acheampong": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Just-Mark Kwabena Quansah": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Maxwell Ofei Siaw": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Moses Oduro": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Osei Kwame": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Peter Kingsford Nkrumah": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "Prince Asante Ahwireng": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 0, total: 900, exempt: [6] },
  "Samuel Yaw Nkansah": { l1: 200, l2: 0, l3: 0, l4: 200, l5: 200, l6: 100, total: 700, exempt: [2, 3] },
  "Vincent Agamatey": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 },
  "William Kojo Anane": { l1: 200, l2: 100, l3: 200, l4: 200, l5: 200, l6: 100, total: 1000 }
};

/**
 * Returns levy breakdown list for a given member object
 */
export const getMemberLevyDetails = (member) => {
  if (!member) return [];

  const nameKey = Object.keys(MEMBER_LEVY_MATRIX).find(
    name => name.toLowerCase() === (member.full_name || '').toLowerCase()
  ) || member.full_name;

  const record = MEMBER_LEVY_MATRIX[nameKey] || {
    total: member.levy_paid || 0,
    l1: member.levy_paid >= 200 ? 200 : member.levy_paid,
    l2: member.levy_paid >= 300 ? 100 : 0,
    l3: member.levy_paid >= 500 ? 200 : 0,
    l4: member.levy_paid >= 700 ? 200 : 0,
    l5: member.levy_paid >= 900 ? 200 : 0,
    l6: member.levy_paid >= 1000 ? 100 : 0
  };

  return SPECIAL_LEVIES_MASTER.map(levy => {
    let amountPaid = 0;
    if (levy.id <= 6) {
      amountPaid = record[`l${levy.id}`] !== undefined ? record[`l${levy.id}`] : 0;
    }

    const isExempt = (record.exempt && record.exempt.includes(levy.id)) || 
      (levy.recipient.toLowerCase().includes((member.full_name || '').split(' ').slice(-1)[0].toLowerCase()));

    let statusText = 'Pending';
    let statusClass = 'badge-admin';

    if (levy.id > 6) {
      statusText = 'Upcoming Call-Up';
      statusClass = 'badge-secondary';
    } else if (isExempt && amountPaid === 0) {
      statusText = 'Beneficiary Exempt ⭐';
      statusClass = 'badge-welfare';
    } else if (amountPaid >= levy.amount && levy.amount > 0) {
      statusText = 'Fully Paid ✓';
      statusClass = 'badge-dues';
    } else if (amountPaid > 0) {
      statusText = 'Partially Paid';
      statusClass = 'badge-welfare';
    } else {
      statusText = 'Outstanding / Owed ⚠️';
      statusClass = 'badge-admin';
    }

    return {
      ...levy,
      amountPaid,
      isExempt,
      statusText,
      statusClass
    };
  });
};
