global.localStorage = { getItem: () => null, setItem: () => {} };
const path = require('path');
const { getMembers } = require(path.resolve('./src/services/store.js'));

const members = getMembers();
const sharesTotal = members.reduce((sum, m) => sum + (parseFloat(m.shares_value) || 0), 0);
const treasTotal = members.reduce((sum, m) => sum + (parseFloat(m.treasurer_bill) || 0), 0);
const grandTotal = members.reduce((sum, m) => sum + (parseFloat(m.shares_holding) || 0), 0);

console.log('--- STORE MEMBERS CALCULATED TOTALS ---');
console.log('SHARES TOTAL:', sharesTotal.toFixed(2));
console.log('TREASURER BILL TOTAL:', treasTotal.toFixed(2));
console.log('GRAND AMOUNT:', grandTotal.toFixed(2));
