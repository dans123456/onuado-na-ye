/**
 * Member Shares Dividend & Yearly Breakdown extracted directly from Excel Sheet "SHARES DEVIDENT"
 * Rate: 1 Share = GH₵ 2.00
 * Cash on Hand Shares Pool: GH₵ 79,131.72
 */

export const CASH_ON_HAND_SHARES_POOL = 79131.72;

export const SHARES_DIVIDENDS_SCHEDULE = {
  "Alex Ackah": { totalShares: 1550, vehicleShares: 0, s2023: 0, s2024: 450, s2025: 600, s2026: 500, poolAmount: 2744.50, tBill: 2.15 },
  "Danso Kingsley": { totalShares: 750, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 600, s2026: 150, poolAmount: 1425.47, tBill: 56.17 },
  "Fanuel Hagan": { totalShares: 1700, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 350, poolAmount: 4470.64, tBill: 828.36 },
  "Frederick Wortey Tawiah": { totalShares: 1850, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 500, poolAmount: 4735.87, tBill: 828.36 },
  "George Yeboah": { totalShares: 0, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 0, poolAmount: 0, tBill: 0 },
  "Isaac Darko": { totalShares: 1950, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 600, poolAmount: 3451.78, tBill: 2.15 },
  "Isaac Donkor": { totalShares: 1650, vehicleShares: 0, s2023: 0, s2024: 450, s2025: 600, s2026: 600, poolAmount: 3016.85, tBill: 56.17 },
  "John Aidoo": { totalShares: 450, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 450, poolAmount: 795.69, tBill: 0 },
  "John Darbo": { totalShares: 0, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 0, poolAmount: 0, tBill: 0 },
  "John Ofosuhene Asare": { totalShares: 1700, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 350, poolAmount: 3889.74, tBill: 499.83 },
  "Johnson Wood": { totalShares: 1750, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 400, poolAmount: 4559.05, tBill: 828.36 },
  "Jonas Wereko": { totalShares: 1800, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 450, poolAmount: 3186.55, tBill: 2.15 },
  "Jonathan Danso Siaw": { totalShares: 2950, vehicleShares: 1000, s2023: 300, s2024: 450, s2025: 600, s2026: 600, poolAmount: 6680.89, tBill: 828.36 },
  "Joseph Kofi Amanfo": { totalShares: 0, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 0, poolAmount: 0, tBill: 0 },
  "Justice Kojo Acheampong": { totalShares: 1500, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 150, poolAmount: 4017.68, tBill: 772.19 },
  "Just-Mark Kwabena Quansah": { totalShares: 1650, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 300, poolAmount: 4382.23, tBill: 828.36 },
  "Maxwell Ofei Siaw": { totalShares: 1850, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 500, poolAmount: 4735.87, tBill: 828.36 },
  "Moses Oduro": { totalShares: 2950, vehicleShares: 1000, s2023: 300, s2024: 450, s2025: 600, s2026: 600, poolAmount: 6680.89, tBill: 828.36 },
  "Osei Kwame": { totalShares: 2750, vehicleShares: 1000, s2023: 300, s2024: 450, s2025: 600, s2026: 400, poolAmount: 6327.25, tBill: 828.36 },
  "Peter Kingsford Nkrumah": { totalShares: 0, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 0, poolAmount: 0, tBill: 0 },
  "Prince Asante Ahwireng": { totalShares: 1650, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 300, poolAmount: 4382.23, tBill: 828.36 },
  "Samuel Yaw Nkansah": { totalShares: 0, vehicleShares: 0, s2023: 0, s2024: 0, s2025: 0, s2026: 0, poolAmount: 0, tBill: 0 },
  "Vincent Agamatey": { totalShares: 1850, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 500, poolAmount: 4735.87, tBill: 828.36 },
  "William Kojo Anane": { totalShares: 1950, vehicleShares: 0, s2023: 300, s2024: 450, s2025: 600, s2026: 600, poolAmount: 4912.69, tBill: 828.36 }
};

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
