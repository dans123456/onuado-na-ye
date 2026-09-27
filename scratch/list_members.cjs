const fs = require('fs');
const content = fs.readFileSync('src/services/store.js', 'utf8');

// Regex match each member block
const nameMatches = [...content.matchAll(/"full_name":\s*"([^"]+)"/g)].map(m => m[1]);
const duesMatches = [...content.matchAll(/"dues_paid":\s*([\d\.]+)/g)].map(m => parseFloat(m[1]));
const sharesValMatches = [...content.matchAll(/"shares_value":\s*([\d\.]+)/g)].map(m => parseFloat(m[1]));

console.log("Member Count:", nameMatches.length);
let sumDues = 0;
let sumSharesVal = 0;

for (let i = 0; i < nameMatches.length; i++) {
  console.log(`${i+1}. ${nameMatches[i]} | Dues: ${duesMatches[i]} | SharesVal: ${sharesValMatches[i] ? sharesValMatches[i].toFixed(2) : 0}`);
  sumDues += duesMatches[i] || 0;
  sumSharesVal += sharesValMatches[i] || 0;
}

console.log("\nTOTAL DUES:", sumDues);
console.log("TOTAL SHARES VALUE:", sumSharesVal.toFixed(2));
