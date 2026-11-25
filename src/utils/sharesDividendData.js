/**
 * Dynamic Programmable Member Shares & Dividend Calculation Engine
 * Replicates the exact live formulas from Excel Workbook "ONUADO NA EYE ACCOUNT.xlsx"
 * 
 * Formula Engine:
 * 1. Dues Shares = Total Dues Paid ÷ GH₵ 2.00
 * 2. Vehicle Shares = Total Vehicle Contribution ÷ GH₵ 2.00
 * 3. T-Bill Shares = Fixed Historical Treasury Bill allocation from sheet "MEMBERS SHARES HOLDING"
 * 4. Member Total Shares = Dues Shares + Vehicle Shares + T-Bill Shares
 * 5. Fellowship Total Shares Pool = Sum of all active qualifying members' Total Shares
 * 6. Fellowship Total Dividend Pool = Liquid Cash Pool from Trial Balance (Fidelity + Tema + MoMo + Vehicle Cash = GH₵ 80,153.10)
 * 7. 1 Dividend Rate = Total Dividend Pool ÷ Total Shares Pool
 * 8. Member Individual Dividend = Member Total Shares × 1 Dividend Rate
 */

import { getMemberVehicleShares } from './vehicleSharesData.js';

// Historical Treasury Bill share allocations from Excel sheet "MEMBERS SHARES HOLDING"
export const TBILL_SHARES_BY_MEMBER = {
  "Alex Ackah": 2.14608920491273,
  "Danso Kingsley": 56.1690815971359,
  "Fanuel Hagan": 828.355258022617,
  "Frederick Wortey Tawiah": 828.355258022617,
  "Isaac Darko": 2.14608920491273,
  "Isaac Donkor": 56.1690815971359,
  "John Aidoo": 0,
  "John Ofosuhene Asare": 499.828781512605,
  "Johnson Wood": 828.355258022617,
  "Jonas Wereko": 2.14608920491273,
  "Jonathan Danso Siaw": 828.355258022617,
  "Justice Kojo Acheampong": 772.186176425481,
  "Just-Mark Kwabena Quansah": 828.355258022617,
  "Maxwell Ofei Siaw": 828.355258022617,
  "Moses Oduro": 828.355258022617,
  "Osei Kwame": 828.355258022617,
  "Prince Asante Ahwireng": 828.355258022617,
  "Vincent Agamatey": 828.355258022617,
  "William Kojo Anane": 828.355258022617,
  "Peter Kingsford Nkrumah": 0,
  "George Yeboah": 0,
  "John Darbo": 0,
  "Joseph Kofi Amanfo": 0,
  "Samuel Yaw Nkansah": 0
};

// Inactive / removed members who do not hold qualifying dividend shares in Excel
export const NON_SHAREHOLDING_NAMES = [
  "george yeboah",
  "john darbo",
  "joseph kofi amanfo",
  "peter kingsford nkrumah",
  "samuel yaw nkansah"
];

// Baseline Excel constants (Synced from ONUADO NA EYE ACCOUNT.xlsx)
export const FELLOWSHIP_TOTAL_DIVIDEND = 80605.62;
export const FELLOWSHIP_TOTAL_SHARES = 45652.70;
export const FELLOWSHIP_DIVIDEND_RATE = 1.7656265963315953;
export const CASH_ON_HAND_SHARES_POOL = 80605.62;

/**
 * Checks if a member qualifies for dividend shareholding
 */
export const isShareholdingMember = (member) => {
  if (!member) return false;
  const status = (member.status || '').toUpperCase().trim();
  if (['REMOVED', 'DECEASED', 'RESIGNED', 'INACTIVE'].includes(status)) {
    return false;
  }
  const name = (member.full_name || member.name || '').toLowerCase().trim();
  if (NON_SHAREHOLDING_NAMES.some(nh => name.includes(nh) || nh.includes(name))) {
    return false;
  }
  return true;
};

/**
 * Fuzzy name lookup for fixed T-Bill shares
 */
export const getMemberTBillShares = (fullName) => {
  if (!fullName) return 0;
  const target = fullName.toLowerCase().trim();
  if (NON_SHAREHOLDING_NAMES.some(nh => target.includes(nh) || nh.includes(target))) {
    return 0;
  }
  for (const [name, shares] of Object.entries(TBILL_SHARES_BY_MEMBER)) {
    const key = name.toLowerCase().trim();
    if (key === target || target.includes(key) || key.includes(target)) {
      return shares;
    }
  }
  return 0;
};

/**
 * Calculate dynamic shares breakdown for an individual member
 */
export const calculateMemberShares = (member, duesOverride, vehicleOverride) => {
  if (!member) {
    const dues = parseFloat(duesOverride) || 0;
    const veh = parseFloat(vehicleOverride) || 0;
    const duesShares = dues / 2.0;
    const vehicleShares = veh / 2.0;
    return {
      duesPaid: dues,
      duesShares,
      vehPaid: veh,
      vehicleShares,
      tBillShares: 0,
      totalShares: duesShares + vehicleShares
    };
  }

  const fullName = member.full_name || member.name || '';
  
  if (!isShareholdingMember(member)) {
    return {
      fullName,
      duesPaid: parseFloat(member.dues_paid) || 0,
      duesShares: 0,
      vehPaid: parseFloat(member.vehicle_shares_paid) || 0,
      vehicleShares: 0,
      tBillShares: 0,
      totalShares: 0
    };
  }

  // Dues
  const duesPaid = duesOverride !== undefined ? (parseFloat(duesOverride) || 0) : (parseFloat(member.dues_paid) || 0);
  const duesShares = duesPaid / 2.0;

  // Vehicle Contribution
  let vehPaid = 0;
  if (vehicleOverride !== undefined) {
    vehPaid = parseFloat(vehicleOverride) || 0;
  } else if (member.vehicle_shares_paid !== undefined && member.vehicle_shares_paid !== null && member.vehicle_shares_paid !== '') {
    vehPaid = parseFloat(member.vehicle_shares_paid) || 0;
  } else {
    const fallback = getMemberVehicleShares(fullName);
    vehPaid = fallback?.totalPaid || 0;
  }
  const vehicleShares = vehPaid / 2.0;

  // Fixed T-Bill Shares
  const tBillShares = getMemberTBillShares(fullName);

  // Total Member Shares
  const totalShares = duesShares + vehicleShares + tBillShares;

  return {
    fullName,
    duesPaid,
    duesShares,
    vehPaid,
    vehicleShares,
    tBillShares,
    totalShares
  };
};

/**
 * Calculate Fellowship Master Pools dynamically based on live member list and dividend pool
 */
export const calculateFellowshipPools = (membersList = [], customDividendPool = null) => {
  const members = Array.isArray(membersList) ? membersList : [];

  let totalSharesPool = 0;
  const breakdown = [];

  for (const m of members) {
    if (isShareholdingMember(m)) {
      const shareData = calculateMemberShares(m);
      totalSharesPool += shareData.totalShares;
      breakdown.push({ member: m, ...shareData });
    }
  }

  // If sum is zero, fallback to baseline
  if (totalSharesPool === 0) {
    totalSharesPool = FELLOWSHIP_TOTAL_SHARES;
  }

  // Dividend Pool: either custom, or default to GH₵ 80,153.10 baseline
  const dividendPool = (customDividendPool !== null && customDividendPool !== undefined && !isNaN(customDividendPool))
    ? parseFloat(customDividendPool)
    : FELLOWSHIP_TOTAL_DIVIDEND;

  // 1 Dividend Rate = Dividend Pool ÷ Total Shares Pool
  const dividendRate = totalSharesPool > 0 ? (dividendPool / totalSharesPool) : FELLOWSHIP_DIVIDEND_RATE;

  return {
    totalSharesPool,
    dividendPool,
    dividendRate,
    breakdown,
    calculateMemberDividend: (m, duesOverride, vehicleOverride) => {
      const ms = calculateMemberShares(m, duesOverride, vehicleOverride);
      return ms.totalShares * dividendRate;
    }
  };
};

/**
 * Live dynamic schedule lookup for a member, backwards-compatible with existing calls
 */
export const getMemberSharesSchedule = (fullName, duesPaid = 0, vehiclePaid = null, membersList = null, customDividendPool = null) => {
  const tBillShares = getMemberTBillShares(fullName);
  
  // Calculate vehicle paid
  let vehPaid = 0;
  if (vehiclePaid !== null && vehiclePaid !== undefined) {
    vehPaid = parseFloat(vehiclePaid) || 0;
  } else {
    const vFallback = getMemberVehicleShares(fullName);
    vehPaid = vFallback?.totalPaid || 0;
  }

  const dues = parseFloat(duesPaid) || 0;
  const duesShares = dues / 2.0;
  const vehicleShares = vehPaid / 2.0;
  const totalShares = duesShares + vehicleShares + tBillShares;

  // Calculate live pools
  const pools = calculateFellowshipPools(membersList || [], customDividendPool);
  const dividendRate = pools.dividendRate;
  const individualDividend = Number((totalShares * dividendRate).toFixed(2));

  return {
    fullName,
    totalShares,
    vehicleShares,
    tBillShares,
    duesShares,
    s2023: Math.min(duesShares, 300),
    s2024: 450,
    s2025: 600,
    s2026: Math.max(0, duesShares - 1350),
    individualDividend,
    poolAmount: individualDividend,
    tBill: tBillShares,
    dividendRate,
    totalSharesPool: pools.totalSharesPool,
    dividendPool: pools.dividendPool
  };
};

// Static reference schedule for backwards compatibility
export const SHARES_DIVIDENDS_SCHEDULE = {
  "Alex Ackah": { totalShares: 1602.15, vehicleShares: 0, tBillShares: 2.15, individualDividend: 2825.29 },
  "Danso Kingsley": { totalShares: 856.17, vehicleShares: 0, tBillShares: 56.17, individualDividend: 1509.80 },
  "Fanuel Hagan": { totalShares: 2528.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4458.60 },
  "Frederick Wortey Tawiah": { totalShares: 2678.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4723.12 },
  "Isaac Darko": { totalShares: 1852.15, vehicleShares: 0, tBillShares: 2.15, individualDividend: 3266.15 },
  "Isaac Donkor": { totalShares: 1606.17, vehicleShares: 0, tBillShares: 56.17, individualDividend: 2832.38 },
  "John Aidoo": { totalShares: 450.00, vehicleShares: 0, tBillShares: 0, individualDividend: 793.55 },
  "John Ofosuhene Asare": { totalShares: 2099.83, vehicleShares: 0, tBillShares: 499.83, individualDividend: 3702.92 },
  "Johnson Wood": { totalShares: 2678.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4723.12 },
  "Jonas Wereko": { totalShares: 1852.15, vehicleShares: 0, tBillShares: 2.15, individualDividend: 3266.15 },
  "Jonathan Danso Siaw": { totalShares: 3778.36, vehicleShares: 1000, tBillShares: 828.36, individualDividend: 6662.90 },
  "Justice Kojo Acheampong": { totalShares: 2722.19, vehicleShares: 0, tBillShares: 772.19, individualDividend: 4800.41 },
  "Just-Mark Kwabena Quansah": { totalShares: 2478.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4370.43 },
  "Maxwell Ofei Siaw": { totalShares: 2578.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4546.77 },
  "Moses Oduro": { totalShares: 3778.36, vehicleShares: 1000, tBillShares: 828.36, individualDividend: 6662.90 },
  "Osei Kwame": { totalShares: 3778.36, vehicleShares: 1000, tBillShares: 828.36, individualDividend: 6662.90 },
  "Prince Asante Ahwireng": { totalShares: 2578.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4546.77 },
  "Vincent Agamatey": { totalShares: 2778.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4899.46 },
  "William Kojo Anane": { totalShares: 2778.36, vehicleShares: 0, tBillShares: 828.36, individualDividend: 4899.46 }
};
