// Re-export all benefit programs from category files
export * from './federal';
export * from './housing';
export * from './nonprofits';
export * from './churches';
export * from './texas';

import { BenefitProgram } from '@/types/benefit';
import {
  SSI_PROGRAM,
  SSDI_PROGRAM,
  TANF_PROGRAM,
  VA_DISABILITY_COMPENSATION,
  WIC_PROGRAM,
  LIFELINE_PROGRAM,
  ACP_PROGRAM,
  TX_STAR_PLUS_WAIVER,
  SNAP_PROGRAM,
  MEDICAID_PROGRAM,
  MEDICARE_SAVINGS_PROGRAM,
  LIHEAP_PROGRAM,
} from './federal';

import {
  HOUSING_GRANT_PROGRAM,
  SECTION_8_VOUCHER,
  DALLAS_HOUSING_AUTHORITY,
  DALLAS_RENTAL_ASSISTANCE,
} from './housing';

import {
  NONPROFIT_EMERGENCY_FUND,
  ASSISTIVE_TECH_GRANT,
  UNITED_WAY_DALLAS,
  MODEST_NEEDS,
  SALVATION_ARMY_NORTH_TEXAS,
  CATHOLIC_CHARITIES_DALLAS,
  NORTH_TEXAS_FOOD_BANK,
  STEWPOT_DALLAS,
  LIFE_CENTER_ILC,
  ASSISTIVE_TECH_TEXAS,
  PATIENT_ADVOCATE_FOUNDATION,
  HEALTHWELL_FOUNDATION,
  PARKLAND_HEALTH,
} from './nonprofits';

import {
  WATERMARK_ACCESS_MINISTRY,
  FIRST_BAPTIST_DALLAS,
  PRESTONWOOD_SPECIAL_FRIENDS,
  GATEWAY_CHURCH,
  LAKE_POINTE_EXCEPTIONAL,
  VILLAGE_CHURCH_ACCESS,
  JONI_AND_FRIENDS_NTX,
} from './churches';

import {
  TX_VOCATIONAL_REHAB,
  TX_CHIP,
  TX_CEAP,
  TX_HCS_WAIVER,
  TX_CLASS_WAIVER,
  TX_DBMD_WAIVER,
  TX_MDCP,
  TX_HOME_LIVING,
  TX_ABLE,
  TX_AUTISM_PROGRAM,
  TX_COMMUNITY_ATTENDANT,
  TX_PRIMARY_HOME_CARE,
  TX_PACE,
  TX_BLIND_SERVICES,
  TX_211,
  TX_VET_PROPERTY_TAX,
  TX_HAZLEWOOD,
  TX_VET_DL,
  TX_PARKLANDS_PASSPORT,
  TX_TBRA,
  TX_PROJECT_ACCESS,
  TX_MEDICAID_BUY_IN,
  TX_VET_MENTAL_HEALTH,
  TX_FUND_VET_ASSISTANCE,
  TX_WEATHERIZATION,
} from './texas';

// All programs registry (60 TOTAL PROGRAMS - TEXAS/DFW FOCUSED)
export const BENEFIT_PROGRAMS: BenefitProgram[] = [
  // ============================================
  // FEDERAL INCOME SUPPORT (4)
  // ============================================
  SSI_PROGRAM,
  SSDI_PROGRAM,
  TANF_PROGRAM,
  VA_DISABILITY_COMPENSATION,

  // ============================================
  // FEDERAL HEALTHCARE (3)
  // ============================================
  MEDICAID_PROGRAM,
  MEDICARE_SAVINGS_PROGRAM,
  TX_STAR_PLUS_WAIVER,

  // ============================================
  // TEXAS STATE HEALTHCARE & WAIVERS (12)
  // ============================================
  TX_CHIP,
  TX_HCS_WAIVER,
  TX_CLASS_WAIVER,
  TX_DBMD_WAIVER,
  TX_MDCP,
  TX_HOME_LIVING,
  TX_AUTISM_PROGRAM,
  TX_COMMUNITY_ATTENDANT,
  TX_PRIMARY_HOME_CARE,
  TX_PACE,
  TX_BLIND_SERVICES,
  TX_MEDICAID_BUY_IN,

  // ============================================
  // TEXAS DISABILITY SERVICES (3)
  // ============================================
  TX_VOCATIONAL_REHAB,
  TX_ABLE,
  ASSISTIVE_TECH_TEXAS,

  // ============================================
  // FOOD ASSISTANCE (2)
  // ============================================
  SNAP_PROGRAM,
  WIC_PROGRAM,

  // ============================================
  // UTILITIES & ENERGY (5)
  // ============================================
  LIHEAP_PROGRAM,
  LIFELINE_PROGRAM,
  ACP_PROGRAM,
  TX_CEAP,
  TX_WEATHERIZATION,

  // ============================================
  // HOUSING PROGRAMS (7)
  // ============================================
  SECTION_8_VOUCHER,
  HOUSING_GRANT_PROGRAM,
  DALLAS_HOUSING_AUTHORITY,
  DALLAS_RENTAL_ASSISTANCE,
  TX_TBRA,
  TX_PROJECT_ACCESS,
  TX_VET_PROPERTY_TAX,

  // ============================================
  // TEXAS VETERANS PROGRAMS (6)
  // ============================================
  TX_HAZLEWOOD,
  TX_VET_DL,
  TX_PARKLANDS_PASSPORT,
  TX_VET_MENTAL_HEALTH,
  TX_FUND_VET_ASSISTANCE,

  // ============================================
  // NONPROFIT EMERGENCY ASSISTANCE (7)
  // ============================================
  NONPROFIT_EMERGENCY_FUND,
  UNITED_WAY_DALLAS,
  MODEST_NEEDS,
  SALVATION_ARMY_NORTH_TEXAS,
  CATHOLIC_CHARITIES_DALLAS,
  NORTH_TEXAS_FOOD_BANK,
  STEWPOT_DALLAS,

  // ============================================
  // NONPROFIT HEALTHCARE & EQUIPMENT (5)
  // ============================================
  ASSISTIVE_TECH_GRANT,
  LIFE_CENTER_ILC,
  PATIENT_ADVOCATE_FOUNDATION,
  HEALTHWELL_FOUNDATION,
  PARKLAND_HEALTH,

  // ============================================
  // TEXAS RESOURCE LINE (1)
  // ============================================
  TX_211,

  // ============================================
  // CHRISTIAN CHURCHES WITH SPECIAL NEEDS MINISTRIES (7)
  // ============================================
  WATERMARK_ACCESS_MINISTRY,
  FIRST_BAPTIST_DALLAS,
  PRESTONWOOD_SPECIAL_FRIENDS,
  GATEWAY_CHURCH,
  LAKE_POINTE_EXCEPTIONAL,
  VILLAGE_CHURCH_ACCESS,
  JONI_AND_FRIENDS_NTX,
];

// Helper function to get state-specific programs
export function getProgramsByState(state: string): BenefitProgram[] {
  return BENEFIT_PROGRAMS.filter(program => {
    if (program.jurisdiction === 'federal' || program.jurisdiction === 'county') {
      return true;
    }
    if (program.jurisdiction === 'state') {
      return program.jurisdictionCode === state;
    }
    return true;
  });
}

// Helper function to get programs by category
export function getProgramsByCategory(category: string): BenefitProgram[] {
  return BENEFIT_PROGRAMS.filter(program => program.category === category);
}

// Get total program count
export function getTotalProgramCount(): number {
  return BENEFIT_PROGRAMS.length;
}
