const fs = require('fs');
const content = fs.readFileSync('src/services/store.js', 'utf8');

// Find all members objects
const duesMatches = [...content.matchAll(/"dues_paid":\s*([\d\.]+)/g)].map(m => parseFloat(m[1]));
const sharesValMatches = [...content.matchAll(/"shares_value":\s*([\d\.]+)/g)].map(m => parseFloat(m[1]));
const treasMatches = [...content.matchAll(/"treasurer_bill":\s*([\d\.]+)/g)].map(m => parseFloat(m[1]));

const totalDues = duesMatches.reduce((a, b) => a + b, 0);
const totalSharesVal = sharesValMatches.reduce((a, b) => a + b, 0);
const totalTreas = treasMatches.reduce((a, b) => a + b, 0);
const grandTotal = totalSharesVal + totalTreas;

console.log("=== EXACT STORE DATABASE TOTALS ===");
console.log("Count of Dues Matches:", duesMatches.length);
console.log("Total Dues Paid: GH₵", totalDues.toFixed(2));
console.log("SHARES TOTAL (Shares Value): GH₵", totalSharesVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("TREASURER BILL TOTAL: GH₵", totalTreas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("GRAND AMOUNT: GH₵", grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
