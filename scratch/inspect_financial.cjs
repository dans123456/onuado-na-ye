const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');

const sheetsToInspect = ['YEARLY DUES', 'CHRCK YOUR DUES BALANCE', 'MONTHLY DUES 2026', 'SPECIAL LEVY', 'PERSONAL RECORD'];

sheetsToInspect.forEach(sheetName => {
  if (workbook.Sheets[sheetName]) {
    console.log(`\n================ SHEET: ${sheetName} ================`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    data.slice(0, 10).forEach((row, idx) => {
      if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
        console.log(`Row ${idx + 1}:`, row);
      }
    });
  }
});
