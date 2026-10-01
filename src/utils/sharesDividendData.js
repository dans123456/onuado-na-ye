/**
 * Member Shares Dividend & Yearly Breakdown extracted directly from Excel Sheet "MEMBERS SHARES DEVIDENT"
 * Base Shares Rate: GHc 50.584373 per share
 */

export const SHARES_DIVIDENDS_SCHEDULE = {
  "Alex Ackah": { totalShares: 60, vehicleShares: 0, s2023: 0, s2024: 18, s2025: 24, s2026: 18 },
  "Danso Kingsley": { totalShares: 30, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 24, s2026: 6 },
  "Fanuel Hagan": { totalShares: 68, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 14 },
  "Frederick Wortey Tawiah": { totalShares: 68, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 14 },
  "George Yeboah": { totalShares: 10, vehicleShares: 0, s2023: 0, s2024: 4, s2025: 0, s2026: 6 },
  "Isaac Darko": { totalShares: 78, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 24 },
  "Isaac Donkor": { totalShares: 66, vehicleShares: 0, s2023: 0, s2024: 18, s2025: 24, s2026: 24 },
  "John Aidoo": { totalShares: 18, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 18 },
  "John Darbo": { totalShares: 10, vehicleShares: 0, s2023: 0, s2024: 7, s2025: 0, s2026: 3 },
  "John Ofosuhene Asare": { totalShares: 68, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 14 },
  "Johnson Wood": { totalShares: 70, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 16 },
  "Jonas Wereko": { totalShares: 72, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 18 },
  "Jonathan Danso Siaw": { totalShares: 118, vehicleShares: 40, s2023: 12, s2024: 18, s2025: 24, s2026: 24 },
  "Joseph Kofi Amanfo": { totalShares: 20, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 20 },
  "Justice Kojo Acheampong": { totalShares: 60, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 6 },
  "Just-Mark Kwabena Quansah": { totalShares: 60, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 6 },
  "Maxwell Ofei Siaw": { totalShares: 74, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 20 },
  "Moses Oduro": { totalShares: 118, vehicleShares: 40, s2023: 12, s2024: 18, s2025: 24, s2026: 24 },
  "Osei Kwame": { totalShares: 110, vehicleShares: 40, s2023: 12, s2024: 18, s2025: 24, s2026: 16 },
  "Peter Kingsford Nkrumah": { totalShares: 30, vehicleShares: 0, s2023: 12, s2024: 6, s2025: 0, s2026: 12 },
  "Prince Asante Ahwireng": { totalShares: 66, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 12 },
  "Samuel Yaw Nkansah": { totalShares: 34, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 4, s2026: 0 },
  "Vincent Agamatey": { totalShares: 74, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 20 },
  "William Kojo Anane": { totalShares: 78, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 24 }
};

export const getMemberSharesSchedule = (fullName, duesPaid = 0) => {
  if (!fullName) {
    const calculated = Math.floor(duesPaid / 50);
    return { totalShares: calculated, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: calculated };
  }
  
  const nameLower = fullName.toLowerCase().trim();
  for (const [key, data] of Object.entries(SHARES_DIVIDENDS_SCHEDULE)) {
    const keyLower = key.toLowerCase().trim();
    if (keyLower === nameLower || nameLower.includes(keyLower) || keyLower.includes(nameLower)) {
      return data;
    }
  }
  
  const fallbackCount = Math.floor(duesPaid / 50);
  return { totalShares: fallbackCount, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: fallbackCount };
};
