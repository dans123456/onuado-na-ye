const fs = require('fs');
let file = fs.readFileSync('src/services/store.js', 'utf8');

// Replace each member in store.js to include base_dues_paid and base_shares_value
file = file.replace(/("dues_paid":\s*([\d\.]+),[\s\S]*?"shares_value":\s*([\d\.]+),)/g, (match, p1, dues, sv) => {
  return `"base_dues_paid": ${dues},\n    "base_shares_value": ${sv},\n    ${p1}`;
});

fs.writeFileSync('src/services/store.js', file, 'utf8');
console.log("Successfully added base_dues_paid and base_shares_value to store.js!");
