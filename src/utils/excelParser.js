import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Normalizes phone numbers (e.g., "+233244123456", "0244 123 456" -> "0244123456")
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  let str = String(phone).replace(/\D/g, '');
  if (str.length === 9 && !str.startsWith('0')) {
    str = '0' + str;
  }
  if (str.startsWith('233') && str.length === 12) {
    str = '0' + str.slice(3);
  }
  return str;
};

/**
 * List of non-payment / auxiliary / picture sheet titles to ignore for payment matching
 */
const IGNORED_SHEET_KEYWORDS = [
  'pictures', 'vehicle', 'pastors', 'elders', 'cash flow', 'trial balance',
  'disbursement', 'disbursment', 'vouchers', 'trading', 'accounts', 'dashboard',
  'fees', 'yearly dues fees', 'special levy fees',
  'shares', 'holding', 'holdings', 'dividend', 'devident', 'treasure bill', 'treasurer bill',
  'monthly dues 20', 'monthly dues 2', 'chrck your levy balance', 'levy balance', 'levy account',
  'chrck your dues balance', 'dues balance', 'dues account', 'dues trail',
  'levy trail', 'levy disbursement', 'momo', 'fidelity', 'petty cash', 'bank account', 'tema',
  'members list', 'registration forms', 'personal profile', 'personal record', 'records'
];

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file across sheets with intelligent change filtering
 */
export const parseUploadedFile = (file, existingMembers) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = processSheetMatrix(results.data, existingMembers, 'CSV Data');
          resolve({
            matched: parsed.matched,
            unmatched: [],
            sheetReports: [parsed],
            totalRows: parsed.totalRows
          });
        },
        error: (err) => reject(err)
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          let allMatched = [];
          let allUnmatched = [];
          let sheetReports = [];
          let totalRowsCount = 0;

          // Scan sheets in the uploaded workbook
          workbook.SheetNames.forEach((sheetName) => {
            const sLower = sheetName.toLowerCase();
            
            // Skip auxiliary picture / vehicle / internal summary sheets
            const isIgnored = IGNORED_SHEET_KEYWORDS.some(kw => sLower.includes(kw));
            if (isIgnored) return;

            const worksheet = workbook.Sheets[sheetName];
            const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            if (matrix && matrix.length > 0) {
              const res = processSheetMatrix(matrix, existingMembers, sheetName);
              sheetReports.push({
                sheetName,
                matchedCount: res.matched.length,
                unmatchedCount: res.unmatched.length,
                totalRows: res.totalRows,
                bankUpdates: res.bankUpdates,
                matched: res.matched
              });

              allMatched.push(...res.matched);
              totalRowsCount += res.totalRows;
            }
          });

          // De-duplicate matched entries across sheets by member_id & contribution_type, keeping highest delta
          const uniqueMatchedMap = new Map();
          allMatched.forEach(item => {
            const key = `${item.member_id}-${item.contribution_type}`;
            const existing = uniqueMatchedMap.get(key);
            if (!existing || (item.amount > existing.amount)) {
              uniqueMatchedMap.set(key, item);
            }
          });

          resolve({
            matched: Array.from(uniqueMatchedMap.values()),
            unmatched: [],
            sheetReports: sheetReports,
            totalRows: totalRowsCount
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    }
  });
};

const KEYWORD_WEIGHTS = {
  name: ['name', 'full name', 'member name', 'capitals', 'fullname', 'member'],
  id: ['id', 'excel id', 'member id', 'member no', 'ony', 'no'],
  phone: ['phone', 'momo', 'mobile', 'contact', 'number', 'tel'],
  dues_paid: ['dues paid', 'yearly dues', 'dues 2023', 'dues 2024', 'dues 2025', 'dues 2026', 'dues'],
  levy_paid: ['levy paid', 'special levy', '1st levy', '2nd levy', '3rd levy', 'levy'],
  total_payments: ['total payments', 'total paid', 'total payment', 'total'],
  reg_fees: ['reg fees', 'registration', 'reg fee'],
  amount: ['amount', 'paid', 'ghc', 'value'],
  type: ['type', 'category', 'purpose', 'contribution'],
  method: ['method', 'mode', 'channel'],
  ref: ['ref', 'reference', 'note', 'receipt'],
  date: ['date', 'time', 'joined']
};

const processSheetMatrix = (matrix, existingMembers, sheetName = '') => {
  if (!matrix || matrix.length === 0) return { matched: [], unmatched: [], totalRows: 0, bankUpdates: null };

  const sNameLower = sheetName.toLowerCase();
  let bankUpdates = null;

  // 1. Check if sheet is a Treasury/Bank Balance sheet
  if (sNameLower.includes('fidelity') || sNameLower.includes('momo') || sNameLower.includes('bank') || sNameLower.includes('tema')) {
    let extractedBalance = 0;
    matrix.forEach(row => {
      if (Array.isArray(row)) {
        row.forEach(cell => {
          const cellStr = String(cell).toLowerCase();
          if (cellStr.includes('ending') || cellStr.includes('balance') || cellStr.includes('total')) {
            const num = parseFloat(String(cell).replace(/[^0-9.]/g, ''));
            if (num > 0) extractedBalance = num;
          }
        });
      }
    });
    if (extractedBalance > 0) {
      bankUpdates = { sheetName, endingBalance: extractedBalance };
    }
  }

  // 2. Find best header row index by searching up to first 25 rows
  let bestHeaderIdx = -1;
  let maxScore = 0;
  let headerMap = {};

  for (let r = 0; r < Math.min(matrix.length, 25); r++) {
    const row = matrix[r];
    if (!Array.isArray(row)) continue;

    let score = 0;
    const currentMap = {};

    row.forEach((cell, colIdx) => {
      if (cell === null || cell === undefined || cell === '') return;
      const cleanCell = String(cell).toLowerCase().replace(/[^a-z0-9]/g, '');
      const rawCellStr = String(cell).trim();

      // Check keyword weights
      Object.keys(KEYWORD_WEIGHTS).forEach(keyType => {
        const keywords = KEYWORD_WEIGHTS[keyType];
        if (keywords.some(kw => cleanCell.includes(kw.replace(/[^a-z0-9]/g, '')))) {
          if (!currentMap[keyType]) {
            currentMap[keyType] = colIdx;
            score += 2;
          }
        }
      });

      // Extra score for primary matrix header indicators (year numbers 2023-2033, ELDER, NO., NAME, TOTAL)
      if (/\b(202[3-9]|203[0-3])\b/.test(rawCellStr) || rawCellStr.includes('ELDER') || rawCellStr === 'NAME' || rawCellStr === 'NO.' || rawCellStr.includes('TOTAL')) {
        score += 3;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestHeaderIdx = r;
      headerMap = currentMap;
    }
  }

  if (bestHeaderIdx === -1) {
    bestHeaderIdx = 0;
  }

  // 3. Process data rows starting after the header row
  const matched = [];
  const unmatched = [];
  const dataRows = matrix.slice(bestHeaderIdx + 1);

  dataRows.forEach((row, idx) => {
    if (!Array.isArray(row) || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) {
      return;
    }

    const getCellVal = (keyType) => {
      const colIdx = headerMap[keyType];
      if (colIdx !== undefined && row[colIdx] !== undefined && row[colIdx] !== null) {
        return String(row[colIdx]).trim();
      }
      return '';
    };

    const rawName = getCellVal('name') || row.find(c => typeof c === 'string' && c.trim().length > 3 && !/\d/.test(c)) || '';
    const rawId = getCellVal('id') || row.find(c => String(c).toLowerCase().includes('ony')) || '';
    const rawPhone = getCellVal('phone') || row.find(c => normalizePhone(c).length >= 9) || '';
    
    const rawDues = getCellVal('dues_paid');
    const rawLevy = getCellVal('levy_paid');
    const rawTotal = getCellVal('total_payments');
    const rawAmount = getCellVal('amount') || row.find(c => typeof c === 'number' && c > 0) || '0';
    
    const rawType = getCellVal('type') || (sNameLower.includes('levy') ? 'Special Levy' : 'Yearly Dues');
    const rawMethod = getCellVal('method') || 'Mobile Money';
    const rawRef = getCellVal('ref') || `Excel Sync [${sheetName || 'Main'}]`;
    const rawDate = getCellVal('date') || new Date().toISOString().split('T')[0];

    const cleanPhone = normalizePhone(rawPhone);
    const cleanId = String(rawId).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = String(rawName).toLowerCase().trim();

    const parseNum = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
    };

    const amountNum = parseNum(rawAmount);

    // Identify year or levy breakdown columns in header row
    const headerRow = matrix[bestHeaderIdx] || [];
    const yearColIndices = [];
    const levyColIndices = [];
    let totalColIdx = headerMap['total_payments'] !== undefined ? headerMap['total_payments'] : headerMap['dues_paid'];

    headerRow.forEach((cell, cIdx) => {
      if (cell === null || cell === undefined || cIdx === headerMap['name'] || cIdx === headerMap['id'] || cIdx === headerMap['phone']) return;
      const str = String(cell).toLowerCase().trim();
      
      if (/\b(202[3-9]|203[0-3])\b/.test(str)) {
        yearColIndices.push(cIdx);
      } else if (sNameLower.includes('levy') && (str.includes('eld') || /\b(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|11th|12th)\b/.test(str)) && !str.includes('total')) {
        levyColIndices.push(cIdx);
      }
    });

    let calculatedDues = null;
    let calculatedLevy = null;

    if (sNameLower.includes('dues')) {
      if (yearColIndices.length > 0) {
        let yearSum = 0;
        yearColIndices.forEach(cIdx => {
          if (row[cIdx] !== undefined && row[cIdx] !== null) {
            const val = parseNum(row[cIdx]);
            if (val > 0) yearSum += val;
          }
        });
        calculatedDues = yearSum;
      } else if (totalColIdx !== undefined && row[totalColIdx] !== undefined) {
        calculatedDues = parseNum(row[totalColIdx]);
      } else if (rawDues !== '') {
        calculatedDues = parseNum(rawDues);
      }
    } else if (sNameLower.includes('levy')) {
      if (levyColIndices.length > 0) {
        let levySum = 0;
        levyColIndices.forEach(cIdx => {
          if (row[cIdx] !== undefined && row[cIdx] !== null) {
            const val = parseNum(row[cIdx]);
            if (val > 0) levySum += val;
          }
        });
        calculatedLevy = levySum;
      } else if (totalColIdx !== undefined && row[totalColIdx] !== undefined) {
        calculatedLevy = parseNum(row[totalColIdx]);
      } else if (rawLevy !== '') {
        calculatedLevy = parseNum(rawLevy);
      }
    }

    const excelDues = calculatedDues !== null && calculatedDues > 0 ? calculatedDues : (rawDues !== '' ? parseNum(rawDues) : null);
    const excelLevy = calculatedLevy !== null && calculatedLevy > 0 ? calculatedLevy : (rawLevy !== '' ? parseNum(rawLevy) : null);
    const excelTotal = rawTotal !== '' ? parseNum(rawTotal) : null;

    // Match against existing members by Phone, Member ID, or Name
    let member = existingMembers.find(m => {
      const mPhone = normalizePhone(m.phone_number);
      const mPhone2 = normalizePhone(m.phone_number_2);
      const mId = (m.excel_member_id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const mName = (m.full_name || '').toLowerCase().trim();

      return (
        (cleanPhone && cleanPhone.length >= 9 && (mPhone === cleanPhone || mPhone2 === cleanPhone)) ||
        (cleanId && mId.length > 2 && (mId === cleanId || cleanId.includes(mId))) ||
        (cleanName && cleanName.length > 3 && (mName === cleanName || mName.includes(cleanName) || cleanName.includes(mName)))
      );
    });

    if (member) {
      let finalAmount = 0;
      let finalType = rawType.toLowerCase().includes('levy') || sNameLower.includes('levy') ? 'Special Levy' : 'Yearly Dues';
      let changeDetected = null;

      // Smart Change Detection: ONLY flag records that have actual edits/changes (>= 0.01 GHS difference)
      const currentDuesPaid = parseFloat(member.dues_paid) || 0;
      const currentLevyPaid = parseFloat(member.levy_paid) || 0;
      const currentTotalPaid = parseFloat(member.total_payments) || 0;

      if (excelDues !== null && Math.abs(excelDues - currentDuesPaid) >= 0.01) {
        const duesDiff = excelDues - currentDuesPaid;
        finalAmount = Math.abs(duesDiff);
        finalType = 'Yearly Dues';
        const isIncrease = duesDiff > 0;
        changeDetected = {
          hasChange: true,
          field: 'Dues Paid',
          oldVal: currentDuesPaid,
          newVal: excelDues,
          diff: duesDiff,
          description: `Sheet [${sheetName}]: Yearly Dues updated for ${member.full_name}: ${isIncrease ? 'increased' : 'adjusted/decreased'} from GH₵ ${currentDuesPaid.toFixed(2)} → GH₵ ${excelDues.toFixed(2)} (${isIncrease ? '+' : ''}GH₵ ${duesDiff.toFixed(2)})`
        };
      } else if (excelLevy !== null && Math.abs(excelLevy - currentLevyPaid) >= 0.01) {
        const levyDiff = excelLevy - currentLevyPaid;
        finalAmount = Math.abs(levyDiff);
        finalType = 'Special Levy';
        const isIncrease = levyDiff > 0;
        changeDetected = {
          hasChange: true,
          field: 'Levy Paid',
          oldVal: currentLevyPaid,
          newVal: excelLevy,
          diff: levyDiff,
          description: `Sheet [${sheetName}]: Special Levy updated for ${member.full_name}: ${isIncrease ? 'increased' : 'adjusted/decreased'} from GH₵ ${currentLevyPaid.toFixed(2)} → GH₵ ${excelLevy.toFixed(2)} (${isIncrease ? '+' : ''}GH₵ ${levyDiff.toFixed(2)})`
        };
      } else if (excelTotal !== null && Math.abs(excelTotal - currentTotalPaid) >= 0.01) {
        const totalDiff = excelTotal - currentTotalPaid;
        finalAmount = Math.abs(totalDiff);
        const isIncrease = totalDiff > 0;
        changeDetected = {
          hasChange: true,
          field: 'Total Payments',
          oldVal: currentTotalPaid,
          newVal: excelTotal,
          diff: totalDiff,
          description: `Sheet [${sheetName}]: Total payments ${isIncrease ? 'increased' : 'adjusted/decreased'} from GH₵ ${currentTotalPaid.toFixed(2)} → GH₵ ${excelTotal.toFixed(2)} (${isIncrease ? '+' : ''}GH₵ ${totalDiff.toFixed(2)})`
        };
      }

      // ONLY push to matched IF there is an actual DETECTED CHANGE / NEW PAYMENT!
      if (changeDetected && changeDetected.hasChange && finalAmount > 0) {
        matched.push({
          sheetName: sheetName || 'Main',
          rowNum: bestHeaderIdx + 2 + idx,
          member_id: member.id,
          member_name: member.full_name,
          excel_member_id: member.excel_member_id,
          phone_number: member.phone_number,
          amount: finalAmount,
          contribution_type: finalType,
          payment_method: rawMethod.toLowerCase().includes('cash') ? 'Cash' : 'Mobile Money',
          reference_note: `${finalType} Update [Sheet: ${sheetName || 'Main'}]`,
          payment_date: rawDate,
          changeDetected: changeDetected,
          excelDues: excelDues,
          excelLevy: excelLevy,
          excelTotal: excelTotal,
          action: changeDetected.diff < 0 ? 'deduct' : 'add'
        });
      }
    }
  });

  return { matched, unmatched: [], totalRows: dataRows.length, bankUpdates };
};
