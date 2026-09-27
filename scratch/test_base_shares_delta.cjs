const fs = require('fs');
const content = fs.readFileSync('src/services/store.js', 'utf8');

const RATE = 50.584373088685016;
const memberBlocks = content.split('{\n    "id":');
memberBlocks.shift();

let sumShares = 0;
let sumTreas = 0;
let sumGrand = 0;

memberBlocks.forEach((block, idx) => {
  const nameMatch = block.match(/"full_name":\s*"([^"]+)"/);
  const duesMatch = block.match(/"dues_paid":\s*([\d\.]+)/);
  const svMatch = block.match(/"shares_value":\s*([\d\.]+)/);
  const tbMatch = block.match(/"treasurer_bill":\s*([\d\.]+)/);

  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const duesPaid = duesMatch ? parseFloat(duesMatch[1]) : 0;
  const initialDues = duesPaid;
  const baseSharesValue = svMatch ? parseFloat(svMatch[1]) : 0;
  const tb = tbMatch ? parseFloat(tbMatch[1]) : 0;

  // Simulate recalculateMemberFinancials
  const duesDelta = duesPaid - initialDues;
  const sharesDelta = Math.floor(duesDelta / 50) * RATE;
  const sharesValue = baseSharesValue + sharesDelta;

  sumShares += sharesValue;
  sumTreas += tb;
  sumGrand += (sharesValue + tb);

  console.log(`${idx+1}. ${name} | Base SV: ${baseSharesValue.toFixed(2)} | Calculated SV: ${sharesValue.toFixed(2)}`);
});

console.log("\n=============================================");
console.log("INITIAL BASELINE SHARES TOTAL: GH₵", sumShares.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("INITIAL BASELINE TREASURER BILL TOTAL: GH₵", sumTreas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("INITIAL BASELINE GRAND AMOUNT: GH₵", sumGrand.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
