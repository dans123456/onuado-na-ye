const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');
const sheet = workbook.Sheets['MEMBERS SHARES HOLDING'] || workbook.Sheets['SHARES HOLDINGS'];

if (sheet) {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log('--- ALL ROWS IN SHARES HOLDINGS SHEET ---');
  data.forEach((row, idx) => {
    if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
      console.log(`Row ${idx + 1}:`, row);
    }
  });
}
