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
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file with multi-sheet & smart header detection
 */
export const parseUploadedFile = (file, existingMembers) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: false, // Parse as 2D array to find actual header row
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = process2DMatrix(results.data, existingMembers, 'CSV');
          resolve(parsed);
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
          let totalRowsCount = 0;

          // Scan all sheets in the workbook
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            if (matrix && matrix.length > 0) {
              const res = process2DMatrix(matrix, existingMembers, sheetName);
              allMatched.push(...res.matched);
              allUnmatched.push(...res.unmatched);
              totalRowsCount += res.totalRows;
            }
          });

          // De-duplicate matched rows if multiple sheets matched the same member-row
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
  amount: ['amount', 'dues paid', 'levy paid', 'total payments', 'paid', 'total', 'ghc', 'value', 'dues', 'levy', 'reg fees'],
  type: ['type', 'category', 'purpose', 'contribution'],
  method: ['method', 'mode', 'channel'],
  ref: ['ref', 'reference', 'note', 'receipt'],
  date: ['date', 'time', 'joined']
};

const process2DMatrix = (matrix, existingMembers, sheetName = '') => {
  if (!matrix || matrix.length === 0) return { matched: [], unmatched: [], totalRows: 0 };

  // 1. Find best header row index by searching up to first 25 rows
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

  // Fallback to row 0 if no clear header keywords matched
  if (bestHeaderIdx === -1) {
    bestHeaderIdx = 0;
  }

  // 2. Process data rows starting after the header row
  const matched = [];
  const unmatched = [];
  const dataRows = matrix.slice(bestHeaderIdx + 1);

  dataRows.forEach((row, idx) => {
    if (!Array.isArray(row) || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) {
      return; // Skip empty rows
    }

    const getCellVal = (keyType) => {
      const colIdx = headerMap[keyType];
      if (colIdx !== undefined && row[colIdx] !== undefined && row[colIdx] !== null) {
        return String(row[colIdx]).trim();
      }
      return '';
    };

    // Smart values extraction
    const rawName = getCellVal('name') || row.find(c => typeof c === 'string' && c.trim().length > 3 && !/\d/.test(c)) || '';
    const rawId = getCellVal('id') || row.find(c => String(c).toLowerCase().includes('ony')) || '';
    const rawPhone = getCellVal('phone') || row.find(c => normalizePhone(c).length >= 9) || '';
    const rawAmount = getCellVal('amount') || row.find(c => typeof c === 'number' && c > 0) || '0';
    const rawType = getCellVal('type') || 'Monthly Dues';
    const rawMethod = getCellVal('method') || 'Mobile Money';
    const rawRef = getCellVal('ref') || `Bulk Excel Import (${sheetName || 'Sheet'})`;
    const rawDate = getCellVal('date') || new Date().toISOString().split('T')[0];

    const cleanPhone = normalizePhone(rawPhone);
    const cleanId = String(rawId).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = String(rawName).toLowerCase().trim();

    // Parse amount safely
    let amountNum = 0;
    if (typeof rawAmount === 'number') {
      amountNum = rawAmount;
    } else {
      amountNum = parseFloat(String(rawAmount).replace(/[^0-9.]/g, '')) || 0;
    }

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
      matched.push({
        rowNum: bestHeaderIdx + 2 + idx,
        member_id: member.id,
        member_name: member.full_name,
        excel_member_id: member.excel_member_id,
        phone_number: member.phone_number,
        amount: amountNum > 0 ? amountNum : 50,
        contribution_type: rawType.toLowerCase().includes('levy') ? 'Special Levy' : (rawType.toLowerCase().includes('reg') ? 'Registration Fee' : 'Monthly Dues'),
        payment_method: rawMethod.toLowerCase().includes('cash') ? 'Cash' : 'Mobile Money',
        reference_note: `${rawRef} [Sheet: ${sheetName || 'Main'}]`,
        payment_date: rawDate
      });
    } else if (cleanName || cleanPhone || cleanId) {
      unmatched.push({
        rowNum: bestHeaderIdx + 2 + idx,
        rawName,
        rawPhone,
        rawAmount,
        reason: 'No matching member found by ID, Phone, or Name'
      });
    }
  });

  return { matched, unmatched, totalRows: dataRows.length };
};
