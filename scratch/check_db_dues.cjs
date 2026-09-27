const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');

// Read YEARLY DUES sheet
const duesSheet = workbook.Sheets['YEARLY DUES'];
const duesMatrix = XLSX.utils.sheet_to_json(duesSheet, { header: 1, defval: '' });

// Read SPECIAL LEVY sheet
const levySheet = workbook.Sheets['SPECIAL LEVY'];
const levyMatrix = XLSX.utils.sheet_to_json(levySheet, { header: 1, defval: '' });

console.log('--- YEARLY DUES ROW TOTALS ---');
duesMatrix.slice(4, 28).forEach(row => {
  if (row && row[2]) {
    let yearSum = 0;
    for (let c = 4; c < row.length; c++) {
      const val = parseFloat(String(row[c]).replace(/[^0-9.]/g, '')) || 0;
      yearSum += val;
    }
    console.log(`Member: ${row[2]} | Excel Dues Sum: ${yearSum}`);
  }
});

console.log('\n--- SPECIAL LEVY ROW TOTALS ---');
levyMatrix.slice(3, 27).forEach(row => {
  if (row && row[2]) {
    let levySum = 0;
    for (let c = 4; c < row.length; c++) {
      const val = parseFloat(String(row[c]).replace(/[^0-9.]/g, '')) || 0;
      levySum += val;
    }
    console.log(`Member: ${row[2]} | Excel Levy Sum: ${levySum}`);
  }
});
