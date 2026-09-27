const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');
const sheet = workbook.Sheets['YEARLY DUES'];
const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// Let's test header detection and cell summing
const rowHeader = matrix[2]; // Row 3: ['NO.', 'ELDER', 'TOTAL ', 2023, 2024, 2025, 2026...]
console.log('Header Row 3:', rowHeader);

matrix.slice(4, 10).forEach((row, i) => {
  const memberName = row[2];
  const totalColVal = row[3]; // 'TOTAL ' column
  
  // Sum year columns (2023-2033) which start at index 4
  let yearSum = 0;
  for (let c = 4; c < row.length; c++) {
    const val = parseFloat(String(row[c]).replace(/[^0-9.]/g, '')) || 0;
    yearSum += val;
  }

  console.log(`Member: ${memberName} | Total Col: ${totalColVal} | Year Columns Sum: ${yearSum}`);
});
