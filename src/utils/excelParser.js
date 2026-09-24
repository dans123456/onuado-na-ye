import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Normalizes phone numbers (e.g., "+233244123456", "0244 123 456" -> "0244123456")
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  let str = String(phone).replace(/\s+|-|\(|\)/g, '');
  if (str.startsWith('+233')) {
    str = '0' + str.slice(4);
  } else if (str.startsWith('233')) {
    str = '0' + str.slice(3);
  }
  return str;
};

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file
 */
export const parseUploadedFile = (file, existingMembers) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = processRows(results.data, existingMembers);
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
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          const parsed = processRows(rawRows, existingMembers);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    }
  });
};

const processRows = (rows, existingMembers) => {
  const matched = [];
  const unmatched = [];

  rows.forEach((row, idx) => {
    // Standardize key lookups
    const keys = Object.keys(row);
    const getVal = (possibleKeys) => {
      const foundKey = keys.find(k => 
        possibleKeys.some(pk => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(pk.toLowerCase()))
      );
      return foundKey ? row[foundKey] : '';
    };

    const rawPhone = getVal(['phone', 'momo', 'mobile', 'contact', 'number']);
    const rawName = getVal(['name', 'member', 'fullname']);
    const rawAmount = getVal(['amount', 'paid', 'total', 'ghc', 'value']);
    const rawType = getVal(['type', 'category', 'purpose', 'contribution']) || 'Monthly Dues';
    const rawMethod = getVal(['method', 'mode', 'channel']) || 'Mobile Money';
    const rawRef = getVal(['ref', 'reference', 'transid', 'receipt', 'note']) || 'Bulk Excel Import';
    const rawDate = getVal(['date', 'paidon', 'time']) || new Date().toISOString().split('T')[0];

    const cleanPhone = normalizePhone(rawPhone);
    const amountNum = parseFloat(String(rawAmount).replace(/[^0-9.]/g, '')) || 0;

    // Match against member list by phone or name
    let member = existingMembers.find(m => 
      (cleanPhone && normalizePhone(m.phone_number) === cleanPhone) ||
      (cleanPhone && normalizePhone(m.momo_number) === cleanPhone) ||
      (m.excel_member_id && getVal(['id', 'excelid']).toString().toLowerCase() === m.excel_member_id.toLowerCase())
    );

    if (!member && rawName) {
      member = existingMembers.find(m => 
        m.full_name.toLowerCase().includes(String(rawName).trim().toLowerCase())
      );
    }

    if (member && amountNum > 0) {
      matched.push({
        rowNum: idx + 1,
        member_id: member.id,
        member_name: member.full_name,
        phone_number: member.phone_number,
        amount: amountNum,
        contribution_type: rawType.includes('Welfare') ? 'Welfare Fund' : (rawType.includes('Donation') ? 'Special Donation' : 'Monthly Dues'),
        payment_method: rawMethod.toLowerCase().includes('cash') ? 'Cash' : 'Mobile Money',
        reference_note: rawRef,
        payment_date: rawDate
      });
    } else {
      unmatched.push({
        rowNum: idx + 1,
        rawName,
        rawPhone,
        rawAmount,
        reason: amountNum <= 0 ? 'Invalid or zero amount' : 'No matching member found by phone/name'
      });
    }
  });

  return { matched, unmatched, totalRows: rows.length };
};
