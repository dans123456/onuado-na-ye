const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');

const IGNORED_SHEET_KEYWORDS = [
  'pictures', 'vehicle', 'pastors', 'elders', 'cash flow', 'trial balance',
  'disbursement', 'vouchers', 'trading', 'accounts', 'dashboard',
  'fees', 'yearly dues fees', 'special levy fees',
  'shares', 'holding', 'holdings', 'dividend', 'devident', 'treasure bill', 'treasurer bill',
  'monthly dues 20', 'monthly dues 2', 'chrck your levy balance', 'levy balance', 'levy account',
  'levy trail', 'levy disbursement', 'momo', 'fidelity', 'petty cash', 'bank account', 'tema',
  'members list', 'registration forms', 'personal profile', 'personal record'
];

console.log('--- SCANNED PAYMENT SHEETS ---');
workbook.SheetNames.forEach(name => {
  const sLower = name.toLowerCase();
  const isIgnored = IGNORED_SHEET_KEYWORDS.some(kw => sLower.includes(kw));
  if (!isIgnored) {
    console.log('✓ ACTIVE SCANNED PAYMENT SHEET:', name);
  } else {
    console.log('✗ SKIPPED AUXILIARY SHEET:', name);
  }
});
