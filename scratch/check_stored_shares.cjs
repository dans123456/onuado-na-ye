const fs = require('fs');
const content = fs.readFileSync('src/services/store.js', 'utf8');

const RATE = 50.584373088685016;
const memberBlocks = content.split('{\n    "id":');
memberBlocks.shift();

let totalStoreShares = 0;
let totalTreasBill = 0;

memberBlocks.forEach((block, idx) => {
  const nameMatch = block.match(/"full_name":\s*"([^"]+)"/);
  const duesMatch = block.match(/"dues_paid":\s*([\d\.]+)/);
  const svMatch = block.match(/"shares_value":\s*([\d\.]+)/);
  const tbMatch = block.match(/"treasurer_bill":\s*([\d\.]+)/);
  const divMatch = block.match(/"shares_dividends":\s*([\d\.]+)/);

  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const dues = duesMatch ? parseFloat(duesMatch[1]) : 0;
  const sv = svMatch ? parseFloat(svMatch[1]) : 0;
  const tb = tbMatch ? parseFloat(tbMatch[1]) : 0;
  const div = divMatch ? parseInt(divMatch[1]) : 0;

  const duesDiv = Math.floor(dues / 50);
  const bonusDiv = div - duesDiv;

  totalStoreShares += sv;
  totalTreasBill += tb;

  console.log(`${idx+1}. ${name} | Dues: ${dues} | StoredDiv: ${div} | DuesDiv: ${duesDiv} | BonusDiv: ${bonusDiv} | StoredSharesVal: ${sv.toFixed(2)}`);
});

console.log("\n=============================================");
console.log("SUM OF INITIAL_MEMBERS SHARES TOTAL: GH₵", totalStoreShares.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("SUM OF INITIAL_MEMBERS TREASURER BILL: GH₵", totalTreasBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
console.log("SUM OF INITIAL_MEMBERS GRAND AMOUNT: GH₵", (totalStoreShares + totalTreasBill).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
