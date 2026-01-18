import { getMonthlyFPL } from './federalLimits2026';

export const CALIFORNIA_RULES = {
  HCBS_WAIVER: {
    INCOME_LIMIT_PERCENTAGE_FPL: 300,
    MIN_ASSISTANCE_LEVEL: 'some',
    PROCESSING_WEEKS: 26,
  },

  CALFRESH: {
    ENHANCED_BENEFITS: true,
  },

  HOUSING: {
    AMI_PERCENTAGE: 50,
  },
};

// Helper to get CA HCBS income limit
export function getCAHCBSIncomeLimit(householdSize: number): number {
  return getMonthlyFPL(householdSize, CALIFORNIA_RULES.HCBS_WAIVER.INCOME_LIMIT_PERCENTAGE_FPL);
}
