import { getMonthlyFPL } from './federalLimits2026';

export const TEXAS_RULES = {
  // Texas STAR+PLUS Waiver (equivalent to HCBS)
  STAR_PLUS_WAIVER: {
    INCOME_LIMIT_PERCENTAGE_FPL: 300,
    MIN_ASSISTANCE_LEVEL: 'some',
    PROCESSING_WEEKS: 20,
    NAME: 'STAR+PLUS Waiver Program',
  },

  // Texas SNAP (called SNAP in TX too, but managed by HHSC)
  SNAP: {
    PROCESSING_WEEKS: 3,
    EXPEDITED_AVAILABLE: true,
  },

  // Texas Housing Programs
  HOUSING: {
    AMI_PERCENTAGE: 50,
    PROCESSING_WEEKS: 12,
  },

  // Texas Medicaid
  MEDICAID: {
    INCOME_LIMIT_SSI: true, // Tied to SSI eligibility
  },
};

// Helper to get Texas STAR+PLUS income limit
export function getTexasSTARPlusIncomeLimit(householdSize: number): number {
  return getMonthlyFPL(householdSize, TEXAS_RULES.STAR_PLUS_WAIVER.INCOME_LIMIT_PERCENTAGE_FPL);
}
