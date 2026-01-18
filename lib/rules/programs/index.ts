// Re-export all benefit programs from category files
export * from './federal';
export * from './housing';
export * from './nonprofits';
export * from './churches';

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

// All programs registry (34 TOTAL PROGRAMS - TEXAS/DFW FOCUSED)
export const BENEFIT_PROGRAMS: BenefitProgram[] = [
  // Federal Income Support (4)
  SSI_PROGRAM,
  SSDI_PROGRAM,
  TANF_PROGRAM,
  VA_DISABILITY_COMPENSATION,

  // Healthcare Programs (4)
  MEDICAID_PROGRAM,
  MEDICARE_SAVINGS_PROGRAM,
  TX_STAR_PLUS_WAIVER,
  ASSISTIVE_TECH_TEXAS,

  // Food Assistance (2)
  SNAP_PROGRAM,
  WIC_PROGRAM,

  // Utilities & Communication (3)
  LIHEAP_PROGRAM,
  LIFELINE_PROGRAM,
  ACP_PROGRAM,

  // Housing Programs (4)
  SECTION_8_VOUCHER,
  HOUSING_GRANT_PROGRAM,
  DALLAS_HOUSING_AUTHORITY,
  DALLAS_RENTAL_ASSISTANCE,

  // Nonprofit Emergency Assistance (7)
  NONPROFIT_EMERGENCY_FUND,
  UNITED_WAY_DALLAS,
  MODEST_NEEDS,
  SALVATION_ARMY_NORTH_TEXAS,
  CATHOLIC_CHARITIES_DALLAS,
  NORTH_TEXAS_FOOD_BANK,
  STEWPOT_DALLAS,

  // Nonprofit Healthcare & Equipment (6)
  ASSISTIVE_TECH_GRANT,
  LIFE_CENTER_ILC,
  PATIENT_ADVOCATE_FOUNDATION,
  HEALTHWELL_FOUNDATION,
  PARKLAND_HEALTH,

  // Christian Churches with Special Needs Ministries (7)
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
