/**
 * Petty Cash Vehicle Account Data extracted directly from Excel Workbook "ONUADO NA EYE ACCOUNT.xlsx"
 * Sheet: "PETTY CASH VEHICLE"
 */

export const PETTY_CASH_VEHICLE_DATA = {
  sheetName: 'PETTY CASH VEHICLE',
  accountTitle: 'PETTY CASH ACCOUNT FOR VEHICLES',
  totalBalance: 68000.00,
  totalIncome: 68000.00,
  totalExpenses: 0.00,
  bankCapital: 62000.00,
  memberCapital: 6000.00,
  particulars: [
    {
      id: 1,
      date: '2026-03-24',
      particulars: 'Capital by the Bank',
      voucherNo: 'BANK-CAP-01',
      income: 62000.00,
      expenses: 0.00,
      balance: 62000.00,
      category: 'Bank Capital / Loan Reserve',
      recordedBy: 'Executive Board'
    },
    {
      id: 2,
      date: '2026-03-24',
      particulars: 'Capital by Eld Jonathan Danso Siaw',
      voucherNo: 'VEH-ONY-013',
      income: 2000.00,
      expenses: 0.00,
      balance: 64000.00,
      category: 'Member Vehicle Shares (40 Shares)',
      recordedBy: 'Executive Treasurer'
    },
    {
      id: 3,
      date: '2026-03-24',
      particulars: 'Capital by Eld Osei Kwame',
      voucherNo: 'VEH-ONY-019',
      income: 2000.00,
      expenses: 0.00,
      balance: 66000.00,
      category: 'Member Vehicle Shares (40 Shares)',
      recordedBy: 'Executive Treasurer'
    },
    {
      id: 4,
      date: '2026-03-24',
      particulars: 'Capital by Eld Moses Oduro',
      voucherNo: 'VEH-ONY-018',
      income: 2000.00,
      expenses: 0.00,
      balance: 68000.00,
      category: 'Member Vehicle Shares (40 Shares)',
      recordedBy: 'Executive Treasurer'
    }
  ]
};

export const getPettyCashVehicleSummary = () => {
  return PETTY_CASH_VEHICLE_DATA;
};
