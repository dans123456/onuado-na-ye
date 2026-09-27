const path = require('path');
const XLSX = require(path.resolve('./node_modules/xlsx/xlsx.js'));

const workbook = XLSX.readFile('ONUADO NA EYE ACCOUNT.xlsx');
const sheet = workbook.Sheets['MEMBERS SHARES HOLDING'] || workbook.Sheets['SHARES HOLDINGS'];

if (sheet) {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  let sumShares = 0;
  let sumTreas = 0;
  let sumGrand = 0;

  console.log("=== EXACT ROWS FROM MEMBERS SHARES HOLDING SHEET ===");
  data.forEach((row, idx) => {
    // Member rows start around Row 7
    if (row && typeof row[0] === 'number' && typeof row[1] === 'string' && typeof row[2] === 'number') {
      const name = row[1].trim();
      const sharesVal = row[2];
      const treasBill = typeof row[3] === 'number' ? row[3] : 0;
      const grandAmt = typeof row[4] === 'number' ? row[4] : (sharesVal + treasBill);

      sumShares += sharesVal;
      sumTreas += treasBill;
      sumGrand += grandAmt;

      console.log(`[Member] ${name} | SharesVal: GH₵ ${sharesVal.toFixed(2)} | TreasBill: GH₵ ${treasBill.toFixed(2)} | Grand: GH₵ ${grandAmt.toFixed(2)}`);
    }
  });

  console.log("\n=============================================");
  console.log("SUM OF SHARES TOTAL: GH₵", sumShares.toFixed(2));
  console.log("SUM OF TREASURER BILL TOTAL: GH₵", sumTreas.toFixed(2));
  console.log("SUM OF GRAND AMOUNT: GH₵", sumGrand.toFixed(2));
}
