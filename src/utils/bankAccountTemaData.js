/**
 * Bank Account Tema Data extracted directly from Excel Workbook "ONUADO NA EYE ACCOUNT.xlsx"
 * Sheet: "BANK ACCOUNT TEMA" (North Tema Co-Operative Credit Union Ltd)
 * Account No: 2161006002421201
 */

export const BANK_ACCOUNT_TEMA_DATA = {
  accountTitle: "North Tema Co-Operative Credit Union",
  accountNumber: "2161006002421201",
  sheetName: "BANK ACCOUNT TEMA",
  totalIncome: 5766.24,
  totalExpenses: 5400.00,
  netBalance: 366.24,
  breakdown: {
    cashDeposits: 5500.00,
    bankShares: 100.00,
    bankInterest: 166.24,
    withdrawals: 5400.00
  },
  transactions: [
    {
      date: '06-Apr-2023',
      particulars: 'Cash Deposited',
      income: 5400.00,
      expenses: 0.00,
      runningBalance: 5400.00,
      category: 'Savings Deposit'
    },
    {
      date: '06-Apr-2023',
      particulars: 'Shares from the Bank',
      income: 100.00,
      expenses: 0.00,
      runningBalance: 5500.00,
      category: 'Bank Shares'
    },
    {
      date: '03-May-2023',
      particulars: 'Cash Deposited',
      income: 100.00,
      expenses: 0.00,
      runningBalance: 5600.00,
      category: 'Savings Deposit'
    },
    {
      date: '31-Dec-2023',
      particulars: 'Bank Interest for the year',
      income: 166.24,
      expenses: 0.00,
      runningBalance: 5766.24,
      category: 'Bank Interest'
    },
    {
      date: '27-Feb-2024',
      particulars: 'Cash Withdrawal',
      income: 0.00,
      expenses: 5400.00,
      runningBalance: 366.24,
      category: 'Cash Withdrawal'
    }
  ]
};

export const getBankAccountTemaSummary = () => {
  return BANK_ACCOUNT_TEMA_DATA;
};
