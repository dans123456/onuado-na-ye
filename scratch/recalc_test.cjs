const fs = require('fs');
const content = fs.readFileSync('src/services/store.js', 'utf8');

const RATE = 50.584373088685016;

// Parse member dues, levy, and treasurer bill from store.js
const memberBlocks = content.split('{\n    "id":');
memberBlocks.shift(); // remove header

let totalDues = 0;
let totalSharesVal = 0;
let totalTreasBill = 0;

memberBlocks.forEach((block, idx) => {
  const nameMatch = block.match(/"full_name":\s*"([^"]+)"/);
  const duesMatch = block.match(/"dues_paid":\s*([\d\.]+)/);
  const tbMatch = block.match(/"treasurer_bill":\s*([\d\.]+)/);

  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const dues = duesMatch ? parseFloat(duesMatch[1]) : 0;
  const tb = tbMatch ? parseFloat(tbMatch[1]) : 0;

  const sharesDividends = Math.floor(dues / 50);
  const sharesValue = sharesDividends * RATE;

  totalDues += dues;
  totalSharesVal += sharesValue;
  totalTreasBill += tb;

  console.log(`${idx+1}. ${name} | Dues: GH₵ ${dues} | Shares Div: ${sharesDividends} | Shares Val: GH₵ ${sharesValue.toFixed(2)} | TB: GH₵ ${tb.toFixed(2)}`);
});

console.log("\n=================================");
console.log("RECALCULATED TOTAL DUES: GH₵", totalDues.toFixed(2));
console.log("RECALCULATED SHARES TOTAL: GH₵", totalSharesVal.toFixed(2));
console.log("RECALCULATED TREASURER BILL TOTAL: GH₵", totalTreasBill.toFixed(2));
console.log("RECALCULATED GRAND TOTAL: GH₵", (totalSharesVal + totalTreasBill).toFixed(2));
