const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');
const sheet = workbook.Sheets['SHARES HOLDINGS'] || workbook.Sheets['CHECK YOUR SHARES HOLDING'];
if (sheet) {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log('--- SHARES HOLDINGS SHEET ---');
  data.slice(0, 15).forEach((row, i) => console.log(`Row ${i+1}:`, row));
} else {
  console.log('Sheet names:', workbook.SheetNames);
}
