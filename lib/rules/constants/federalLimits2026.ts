export const FEDERAL_LIMITS_2026 = {
  SSI: {
    FEDERAL_BENEFIT_RATE: 943,
    FEDERAL_BENEFIT_RATE_COUPLE: 1415,
    ASSET_LIMIT_INDIVIDUAL: 2000,
    ASSET_LIMIT_COUPLE: 3000,
    SUBSTANTIAL_GAINFUL_ACTIVITY: 1550,
  },

  SSDI: {
    SUBSTANTIAL_GAINFUL_ACTIVITY: 1550,
    TRIAL_WORK_PERIOD_AMOUNT: 1110,
    AVERAGE_MONTHLY_BENEFIT: 1537,
  },

  SNAP: {
    GROSS_INCOME_LIMITS: {
      1: 2266,
      2: 3052,
      3: 3838,
      4: 4624,
      5: 5410,
      6: 6196,
      7: 6982,
      8: 7768,
    },
    ASSET_LIMIT_STANDARD: 2750,
    ASSET_LIMIT_ELDERLY_DISABLED: 4250,
  },

  FEDERAL_POVERTY_LEVEL: {
    1: 15060,
    2: 20440,
    3: 25820,
    4: 31200,
    5: 36580,
    6: 41960,
    7: 47340,
    8: 52720,
  },
};

// Helper to calculate monthly FPL
export function getMonthlyFPL(householdSize: number, percentage: number = 100): number {
  const fplData = FEDERAL_LIMITS_2026.FEDERAL_POVERTY_LEVEL;
  const annual = (fplData as Record<number, number>)[householdSize] ||
                 fplData[8] + (householdSize - 8) * 5380;
  return Math.round((annual / 12) * (percentage / 100));
}
