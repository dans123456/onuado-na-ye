/**
 * Member Shares Dividend & Yearly Breakdown extracted directly from Excel Sheet "MEMBERS SHARES DEVIDENT"
 * Rate: 1 Share = GH₵ 2.00 (Base Shares Rate: GH₵ 2.00 per share)
 */

export const BASE_SHARES_SCHEDULE_RAW = {
  "Alex Ackah": { baseShares: 60, vehicleShares: 0, s2023: 0, s2024: 18, s2025: 24, s2026: 18 },
  "Danso Kingsley": { baseShares: 30, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 24, s2026: 6 },
  "Fanuel Hagan": { baseShares: 68, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 14 },
  "Frederick Wortey Tawiah": { baseShares: 68, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 14 },
  "George Yeboah": { baseShares: 10, vehicleShares: 0, s2023: 0, s2024: 4, s2025: 0, s2026: 6 },
  "Isaac Darko": { baseShares: 78, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 24 },
  "Isaac Donkor": { baseShares: 66, vehicleShares: 0, s2023: 0, s2024: 18, s2025: 24, s2026: 24 },
  "John Aidoo": { baseShares: 18, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 18 },
  "John Darbo": { baseShares: 10, vehicleShares: 0, s2023: 0, s2024: 7, s2025: 0, s2026: 3 },
  "John Ofosuhene Asare": { baseShares: 68, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 14 },
  "Johnson Wood": { baseShares: 70, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 16 },
  "Jonas Wereko": { baseShares: 72, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 18 },
  "Jonathan Danso Siaw": { baseShares: 118, vehicleShares: 40, s2023: 12, s2024: 18, s2025: 24, s2026: 24 },
  "Joseph Kofi Amanfo": { baseShares: 20, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 20 },
  "Justice Kojo Acheampong": { baseShares: 60, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 6 },
  "Just-Mark Kwabena Quansah": { baseShares: 60, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 6 },
  "Maxwell Ofei Siaw": { baseShares: 74, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 20 },
  "Moses Oduro": { baseShares: 118, vehicleShares: 40, s2023: 12, s2024: 18, s2025: 24, s2026: 24 },
  "Osei Kwame": { baseShares: 110, vehicleShares: 40, s2023: 12, s2024: 18, s2025: 24, s2026: 16 },
  "Peter Kingsford Nkrumah": { baseShares: 30, vehicleShares: 0, s2023: 12, s2024: 6, s2025: 0, s2026: 12 },
  "Prince Asante Ahwireng": { baseShares: 66, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 12 },
  "Samuel Yaw Nkansah": { baseShares: 34, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 4, s2026: 0 },
  "Vincent Agamatey": { baseShares: 74, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 20 },
  "William Kojo Anane": { baseShares: 78, vehicleShares: 0, s2023: 12, s2024: 18, s2025: 24, s2026: 24 }
};

// Re-scaled for 1 share = GH₵ 2.00 (each GH₵ 50 payment tranche = 25 shares)
export const SHARES_DIVIDENDS_SCHEDULE = Object.fromEntries(
  Object.entries(BASE_SHARES_SCHEDULE_RAW).map(([name, d]) => [
    name,
    {
      totalShares: d.baseShares * 25,
      vehicleShares: d.vehicleShares * 25,
      s2023: d.s2023 * 25,
      s2024: d.s2024 * 25,
      s2025: d.s2025 * 25,
      s2026: d.s2026 * 25
    }
  ])
);

export const getMemberSharesSchedule = (fullName, duesPaid = 0) => {
  if (!fullName) {
    const calculated = Math.floor(duesPaid / 2);
    return { totalShares: calculated, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: calculated };
  }
  
  const nameLower = fullName.toLowerCase().trim();
  for (const [key, data] of Object.entries(SHARES_DIVIDENDS_SCHEDULE)) {
    const keyLower = key.toLowerCase().trim();
    if (keyLower === nameLower || nameLower.includes(keyLower) || keyLower.includes(nameLower)) {
      return data;
    }
  }
  
  const fallbackCount = Math.floor(duesPaid / 2);
  return { totalShares: fallbackCount, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: fallbackCount };
};
