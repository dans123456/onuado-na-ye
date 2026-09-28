import * as XLSX from 'xlsx';

const roundCurrency = (val) => Math.round((Number(val) || 0) * 100) / 100;

/**
 * Handles browser-side Excel upload using SheetJS (xlsx).
 * Matches each member by Member ID or Full Name, updates yearly dues,
 * recalculates Shares Total and Grand Total using delta arithmetic,
 * and saves state to localStorage.
 *
 * @param {File} file - The uploaded Excel file (.xlsx / .xls)
 * @param {Array} currentMembers - Array of current member objects
 * @param {Function} setMembers - React state dispatcher for members
 * @param {Function} [onComplete] - Callback executed when parsing completes: ({ success, updatedCount, error })
 */
export function handleExcelUpload(file, currentMembers, setMembers, onComplete) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error('Excel workbook contains no sheets.');

      const sheet = workbook.Sheets[sheetName];
      const uploadedRows = XLSX.utils.sheet_to_json(sheet);

      if (!uploadedRows || uploadedRows.length === 0) {
        throw new Error('The uploaded sheet is empty or unreadable.');
      }

      let updatedCount = 0;

      const updatedMembers = currentMembers.map((member) => {
        const memberId = String(member.excel_member_id || member.id || '').trim().toLowerCase();
        const memberName = String(member.full_name || member.name || '').trim().toLowerCase();

        // 1. Match row by Member ID or Full Name
        const match = uploadedRows.find((row) => {
          const rowId = String(row['Member ID'] || row['ID'] || row['Member No'] || '').trim().toLowerCase();
          const rowName = String(row['Full Name'] || row['Name'] || row['Member Name'] || '').trim().toLowerCase();
          return (rowId && rowId === memberId) || (rowName && rowName === memberName);
        });

        if (!match) return member; // Keep existing member if no match found

        updatedCount++;

        // 2. Extract new dues and strip non-numeric characters (e.g. GH₵, commas)
        const rawDues = match['Yearly Dues'] || match['Dues Paid'] || match['Dues'] || 0;
        const newYearlyDues = typeof rawDues === 'string'
          ? parseFloat(rawDues.replace(/[^0-9.-]+/g, '')) || 0
          : Number(rawDues) || 0;

        const previousDues = Number(member.yearlyDues || member.dues_paid || 0);
        const treasuryBill = Number(member.treasuryBill || member.treasurer_bill || 0);
        const existingShares = Number(member.sharesTotal || member.shares_holding || 0);

        // 3. Recalculate totals using delta math to avoid double-counting on re-uploads
        const duesDelta = newYearlyDues - previousDues;
        const updatedSharesTotal = roundCurrency(existingShares + duesDelta);
        const updatedGrandTotal = roundCurrency(updatedSharesTotal + treasuryBill);

        return {
          ...member,
          yearlyDues: roundCurrency(newYearlyDues),
          dues_paid: roundCurrency(newYearlyDues),
          sharesTotal: updatedSharesTotal,
          shares_holding: updatedSharesTotal,
          grandTotal: updatedGrandTotal,
        };
      });

      // 4. Update React state & localStorage for persistence
      setMembers(updatedMembers);
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
