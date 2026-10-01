/**
 * Vehicle Shares Data extracted directly from Excel workbook "ONUADO NA EYE ACCOUNT.xlsx"
 * Sheet: "VEHICLE SHARES HOLDING"
 * Share Rate: GHc 50.00 per share
 */

export const VEHICLE_SHARES_POOL = {
  totalPaid: 6000.00,
  totalShares: 120,
  totalMembersPaid: 3,
  totalMembersNotPaid: 21,
  ratePerShare: 50.00,
  vehicleAcquisitionFund: 68000.00
};

export const VEHICLE_SHARES_BY_MEMBER = {
  "Jonathan Danso Siaw": {
    totalPaid: 2000.00,
    sharesCount: 40,
    payments: { p1: 2000.00, p2: 0, p3: 0, p4: 0 },
    status: "PAID"
  },
  "Moses Oduro": {
    totalPaid: 2000.00,
    sharesCount: 40,
    payments: { p1: 2000.00, p2: 0, p3: 0, p4: 0 },
    status: "PAID"
  },
  "Osei Kwame": {
    totalPaid: 2000.00,
    sharesCount: 40,
    payments: { p1: 2000.00, p2: 0, p3: 0, p4: 0 },
    status: "PAID"
  }
};

export const getMemberVehicleShares = (fullName) => {
  if (!fullName) return { totalPaid: 0, sharesCount: 0, payments: { p1: 0, p2: 0, p3: 0, p4: 0 }, status: "UNPAID" };
  const nameLower = fullName.toLowerCase().trim();
  for (const [key, data] of Object.entries(VEHICLE_SHARES_BY_MEMBER)) {
    const keyLower = key.toLowerCase().trim();
    if (keyLower === nameLower || nameLower.includes(keyLower) || keyLower.includes(nameLower)) {
      return data;
    }
  }
  return { totalPaid: 0, sharesCount: 0, payments: { p1: 0, p2: 0, p3: 0, p4: 0 }, status: "UNPAID" };
};
