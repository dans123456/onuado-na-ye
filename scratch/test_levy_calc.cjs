const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');
const sheet = workbook.Sheets['SPECIAL LEVY'];
const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

const rowHeader = matrix[2]; // Row 3: ['NO.', 'NAME', 'TOTAL', 'ELD. ISAAC DARKO'...]
console.log('Header Row 3:', rowHeader);

matrix.slice(3, 10).forEach((row, i) => {
  const memberName = row[2];
  const totalColVal = row[3]; // 'TOTAL' column
  
  // Sum levy installment columns starting at index 4
  let levySum = 0;
  for (let c = 4; c < row.length; c++) {
    const val = parseFloat(String(row[c]).replace(/[^0-9.]/g, '')) || 0;
    levySum += val;
  }

  console.log(`Member: ${memberName} | Total Col: ${totalColVal} | Levy Columns Sum: ${levySum}`);
});
