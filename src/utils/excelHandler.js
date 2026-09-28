import * as XLSX from 'xlsx';

const roundCurrency = (val) => Math.round((Number(val) || 0) * 100) / 100;

/**
 * Handles browser-side Excel upload using SheetJS (xlsx).
 * Intelligently locates the Yearly Dues sheet, extracts members,
 * updates yearly dues, recalculates shares and grand total,
 * and saves state to localStorage.
 */
export function handleExcelUpload(file, currentMembers, setMembers, onComplete) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Excel workbook contains no sheets.');
      }

      // 1. Intelligently locate the Yearly Dues sheet
      let targetSheetName = workbook.SheetNames.find(s => s.toLowerCase() === 'yearly dues') ||
                            workbook.SheetNames.find(s => s.toLowerCase().includes('yearly dues')) ||
                            workbook.SheetNames.find(s => s.toLowerCase().includes('dues') && !s.toLowerCase().includes('check') && !s.toLowerCase().includes('fees'));

      // Fallback: find first sheet with at least 5 rows
      if (!targetSheetName) {
        for (const sName of workbook.SheetNames) {
          const ws = workbook.Sheets[sName];
          const testRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          if (testRows && testRows.length >= 5) {
            targetSheetName = sName;
            break;
          }
        }
      }

      if (!targetSheetName) {
        targetSheetName = workbook.SheetNames[0];
      }

      const worksheet = workbook.Sheets[targetSheetName];
      const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (!matrix || matrix.length === 0) {
        throw new Error(`The sheet "${targetSheetName}" is empty.`);
      }

      // 2. Find header row index (looks for NO., ELDER, NAME, or TOTAL)
      let headerIdx = matrix.findIndex(r =>
        Array.isArray(r) && r.some(c => {
          const str = String(c).toUpperCase();
          return str.includes('ELDER') || str.includes('NAME') || str.includes('MEMBER');
        })
      );

      if (headerIdx === -1) {
        headerIdx = 0;
      }

      const headerRow = matrix[headerIdx] || [];
      const headers = headerRow.map(h => String(h).trim().toLowerCase());

      const nameColIdx = headers.findIndex(h => h.includes('elder') || h.includes('name') || h.includes('member'));
      const idColIdx = headers.findIndex(h => h === 'id' || h === 'no.' || h.includes('member id') || h.includes('ony'));
      const totalColIdx = headers.findIndex(h => h.includes('total') || h.includes('dues'));

      // Collect data rows starting after header row
      const dataRows = matrix.slice(headerIdx + 1);

      let updatedCount = 0;

      const updatedMembers = currentMembers.map((member) => {
        const memberId = String(member.excel_member_id || member.id || '').trim().toLowerCase();
        const memberName = String(member.full_name || member.name || '').trim().toLowerCase();

        // Find matching row in Excel
        const matchRow = dataRows.find((row) => {
          if (!Array.isArray(row)) return false;

          const rowName = nameColIdx !== -1 && row[nameColIdx] ? String(row[nameColIdx]).trim().toLowerCase() : '';
          const rowId = idColIdx !== -1 && row[idColIdx] ? String(row[idColIdx]).trim().toLowerCase() : '';

          // Direct match by Name or ID
          if (rowName && memberName && (rowName === memberName || rowName.includes(memberName) || memberName.includes(rowName))) {
            return true;
          }
          if (rowId && memberId && (rowId === memberId || memberId.includes(rowId))) {
            return true;
          }
          return false;
        });

        if (!matchRow) return member;

        // Extract raw dues from total column or row
        let rawDues = totalColIdx !== -1 ? matchRow[totalColIdx] : 0;
        if (typeof rawDues === 'string') {
          rawDues = parseFloat(rawDues.replace(/[^0-9.-]+/g, '')) || 0;
        } else {
          rawDues = Number(rawDues) || 0;
        }

        if (rawDues <= 0) return member;

        updatedCount++;

        const newYearlyDues = rawDues;
        const previousDues = Number(member.dues_paid || member.yearlyDues || 0);
        const treasuryBill = Number(member.treasurer_bill || member.treasuryBill || 0);
        const existingShares = Number(member.shares_value || member.sharesTotal || 0);

        // Recalculate totals using delta math
        const duesDelta = newYearlyDues - previousDues;
        const updatedSharesTotal = roundCurrency(existingShares + (duesDelta * 1.0116894));
        const updatedGrandTotal = roundCurrency(updatedSharesTotal + treasuryBill);

        return {
          ...member,
          yearlyDues: roundCurrency(newYearlyDues),
          dues_paid: roundCurrency(newYearlyDues),
          shares_value: updatedSharesTotal,
          sharesTotal: updatedSharesTotal,
          shares_holding: updatedGrandTotal,
          grandTotal: updatedGrandTotal,
        };
      });

      // Update state and persistence
      setMembers(updatedMembers);
      localStorage.setItem('ony_members', JSON.stringify(updatedMembers));
      localStorage.setItem('association_members', JSON.stringify(updatedMembers));

      if (onComplete) {
        onComplete({ success: true, updatedCount });
      } else {
        alert(`Dues updated and totals recalculated successfully! (${updatedCount} member(s) updated)`);
      }
    } catch (error) {
      console.error('handleExcelUpload error:', error);
      if (onComplete) {
        onComplete({ success: false, error: error.message });
      } else {
        alert(`Failed to update dues from Excel: ${error.message}`);
      }
    }
  };

  reader.onerror = () => {
    if (onComplete) {
      onComplete({ success: false, error: 'File read error.' });
    } else {
      alert('Failed to read file from disk.');
    }
  };

  reader.readAsArrayBuffer(file);
}
