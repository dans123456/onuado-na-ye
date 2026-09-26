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
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file across ALL SHEETS
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
            unmatched: parsed.unmatched,
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

          // Scan EVERY SHEET in the uploaded workbook
          workbook.SheetNames.forEach((sheetName) => {
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
              allUnmatched.push(...res.unmatched);
              totalRowsCount += res.totalRows;
            }
          });

          // De-duplicate matched entries across sheets by member_id & payment delta
          const uniqueMatchedMap = new Map();
          allMatched.forEach(item => {
            const key = `${item.member_id}-${item.amount}-${item.contribution_type}`;
            if (!uniqueMatchedMap.has(key)) {
              uniqueMatchedMap.set(key, item);
            }
          });

          resolve({
            matched: Array.from(uniqueMatchedMap.values()),
            unmatched: allUnmatched,
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
      
      Object.keys(KEYWORD_WEIGHTS).forEach(keyType => {
        const keywords = KEYWORD_WEIGHTS[keyType];
        if (keywords.some(kw => cleanCell.includes(kw.replace(/[^a-z0-9]/g, '')))) {
          if (!currentMap[keyType]) {
            currentMap[keyType] = colIdx;
            score++;
          }
        }
      });
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
    
    const rawType = getCellVal('type') || (sNameLower.includes('levy') ? 'Special Levy' : 'Monthly Dues');
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

    // If parsing a Matrix sheet (like YEARLY DUES or SPECIAL LEVY), sum across numeric columns for this row
    let matrixSumDues = 0;
    let matrixSumLevies = 0;
    if (sNameLower.includes('dues')) {
      row.forEach(c => {
        const val = parseNum(c);
        if (val > 0 && val <= 3000) matrixSumDues += val;
      });
    } else if (sNameLower.includes('levy')) {
      row.forEach(c => {
        const val = parseNum(c);
        if (val > 0 && val <= 1000) matrixSumLevies += val;
      });
    }

    const excelDues = rawDues !== '' ? parseNum(rawDues) : (matrixSumDues > 0 ? matrixSumDues : null);
    const excelLevy = rawLevy !== '' ? parseNum(rawLevy) : (matrixSumLevies > 0 ? matrixSumLevies : null);
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
      let finalAmount = amountNum;
      let finalType = rawType.toLowerCase().includes('levy') || sNameLower.includes('levy') ? 'Special Levy' : 'Monthly Dues';
      let changeDetected = null;

      // Smart Multi-Sheet Change Detector
      if (excelDues !== null && excelDues > (member.dues_paid || 0)) {
        const duesDiff = excelDues - (member.dues_paid || 0);
        finalAmount = duesDiff;
        finalType = 'Monthly Dues';
        changeDetected = {
          hasChange: true,
          field: 'Dues Paid',
          oldVal: member.dues_paid || 0,
          newVal: excelDues,
          diff: duesDiff,
          description: `Sheet [${sheetName}]: Dues increased from GH₵ ${(member.dues_paid || 0).toFixed(2)} → GH₵ ${excelDues.toFixed(2)} (+GH₵ ${duesDiff.toFixed(2)})`
        };
      } else if (excelLevy !== null && excelLevy > (member.levy_paid || 0)) {
        const levyDiff = excelLevy - (member.levy_paid || 0);
        finalAmount = levyDiff;
        finalType = 'Special Levy';
        changeDetected = {
          hasChange: true,
          field: 'Levy Paid',
          oldVal: member.levy_paid || 0,
          newVal: excelLevy,
          diff: levyDiff,
          description: `Sheet [${sheetName}]: Levy increased from GH₵ ${(member.levy_paid || 0).toFixed(2)} → GH₵ ${excelLevy.toFixed(2)} (+GH₵ ${levyDiff.toFixed(2)})`
        };
      } else if (excelTotal !== null && excelTotal > (member.total_payments || 0)) {
        const totalDiff = excelTotal - (member.total_payments || 0);
        finalAmount = totalDiff;
        changeDetected = {
          hasChange: true,
          field: 'Total Payments',
          oldVal: member.total_payments || 0,
          newVal: excelTotal,
          diff: totalDiff,
          description: `Sheet [${sheetName}]: Total payments increased from GH₵ ${(member.total_payments || 0).toFixed(2)} → GH₵ ${excelTotal.toFixed(2)} (+GH₵ ${totalDiff.toFixed(2)})`
        };
      } else if (amountNum > 0) {
        changeDetected = {
          hasChange: true,
          field: 'New Payment',
          oldVal: 0,
          newVal: amountNum,
          diff: amountNum,
          description: `Sheet [${sheetName}]: New ${finalType} payment of GH₵ ${amountNum.toFixed(2)} logged`
        };
      } else {
        changeDetected = {
          hasChange: false,
          field: 'Up to Date',
          description: `Sheet [${sheetName}]: Record matches current portal store`
        };
      }

      matched.push({
        sheetName: sheetName || 'Main',
        rowNum: bestHeaderIdx + 2 + idx,
        member_id: member.id,
        member_name: member.full_name,
        excel_member_id: member.excel_member_id,
        phone_number: member.phone_number,
        amount: finalAmount > 0 ? finalAmount : 50,
        contribution_type: finalType,
        payment_method: rawMethod.toLowerCase().includes('cash') ? 'Cash' : 'Mobile Money',
        reference_note: `${rawRef} [Sheet: ${sheetName || 'Main'}]`,
        payment_date: rawDate,
        changeDetected: changeDetected,
        excelDues: excelDues,
        excelLevy: excelLevy,
        excelTotal: excelTotal
      });
    } else if (cleanName || cleanPhone || cleanId) {
      unmatched.push({
        sheetName: sheetName || 'Main',
        rowNum: bestHeaderIdx + 2 + idx,
        rawName,
        rawPhone,
        rawAmount,
        reason: 'No matching member found by ID, Phone, or Name'
      });
    }
  });

  return { matched, unmatched, totalRows: dataRows.length, bankUpdates };
};
