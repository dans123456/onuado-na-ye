const fs = require('fs');
const content = fs.readFileSync('src/services/store.js', 'utf8');

const RATE = 50.584373088685016;
const memberBlocks = content.split('{\n    "id":');
memberBlocks.shift();

let totalDues = 0;
let totalSharesVal = 0;
let totalTreasBill = 0;

memberBlocks.forEach((block, idx) => {
  const nameMatch = block.match(/"full_name":\s*"([^"]+)"/);
  const duesMatch = block.match(/"dues_paid":\s*([\d\.]+)/);
  const tbMatch = block.match(/"treasurer_bill":\s*([\d\.]+)/);
  const bonusMatch = block.match(/"bonus_dividends":\s*([\d\.]+)/) || (block.includes('Jonathan Danso Siaw') || block.includes('Osei Kwame') ? [null, "40"] : null);

  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const dues = duesMatch ? parseFloat(duesMatch[1]) : 0;
  const tb = tbMatch ? parseFloat(tbMatch[1]) : 0;
  const bonus = bonusMatch ? parseInt(bonusMatch[1]) : 0;

  const sharesDividends = Math.floor(dues / 50) + bonus;
  const sharesValue = sharesDividends * RATE;

  totalDues += dues;
  totalSharesVal += sharesValue;
  totalTreasBill += tb;

  console.log(`${idx+1}. ${name} | Dues: ${dues} | BonusDiv: ${bonus} | TotalDiv: ${sharesDividends} | SharesVal: GH₵ ${sharesValue.toFixed(2)} | TB: GH₵ ${tb.toFixed(2)}`);
});

console.log("\n=============================================");
console.log("RECALCULATED SHARES TOTAL: GH₵", totalSharesVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("RECALCULATED TREASURER BILL TOTAL: GH₵", totalTreasBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("RECALCULATED GRAND AMOUNT: GH₵", (totalSharesVal + totalTreasBill).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
