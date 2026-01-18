import {
  BenefitProgram,
  BenefitCategory,
  RuleType,
  RuleOperator,
} from '@/types/benefit';
import { DocumentType } from '@/types/document';
import { FEDERAL_LIMITS_2026, getMonthlyFPL } from '../constants/federalLimits2026';
import { getTexasSTARPlusIncomeLimit, TEXAS_RULES } from '../constants/texasRules';
import { AssistanceLevel } from '@/types/quiz';
export const HOUSING_GRANT_PROGRAM: BenefitProgram = {
  id: 'housing-grant-2026',
  name: 'Local Housing Assistance Grant',
  shortName: 'Housing Grant',
  category: BenefitCategory.HOUSING,
  jurisdiction: 'county',
  description: 'Monthly rental assistance for low-income individuals with disabilities',
  estimatedMonthlyValue: 500,
  processingTimeWeeks: 8,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Priority given to individuals with disabilities or seniors',
    },
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.GREATER_THAN_OR_EQUAL,
      value: 62,
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Priority for seniors 62+',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 150),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 150% of federal poverty level',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.LEASE_AGREEMENT,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: '#',
  helplinePhone: 'Contact local housing authority',
};

// Nonprofit Disability Emergency Fund (Example)
export const SECTION_8_VOUCHER: BenefitProgram = {
  id: 'section-8-2026',
  name: 'Section 8 Housing Choice Voucher',
  shortName: 'Section 8',
  category: BenefitCategory.HOUSING,
  jurisdiction: 'federal',
  description: 'Rental assistance vouchers that pay a portion of rent directly to landlords',
  estimatedMonthlyValue: 800,
  processingTimeWeeks: 52,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be below 50% of area median income (varies by location)',
    },
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Disability status may provide priority placement',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.BANK_STATEMENT,
  ],
  applicationUrl: 'https://www.hud.gov/topics/housing_choice_voucher_program_section_8',
  helplinePhone: 'Contact your local Public Housing Agency',
};

// Dallas Housing Authority
export const DALLAS_HOUSING_AUTHORITY: BenefitProgram = {
  id: 'dallas-housing-2026',
  name: 'Dallas Housing Authority Programs',
  shortName: 'DHA',
  category: BenefitCategory.HOUSING,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Rental assistance through Dallas Housing Authority',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 52,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Other DFW'],
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must be a Dallas resident',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 50% Area Median Income',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.dhadallas.com/',
  helplinePhone: '214-951-8300',
};

// Dallas County Emergency Rental Assistance
export const DALLAS_RENTAL_ASSISTANCE: BenefitProgram = {
  id: 'dallas-rental-2026',
  name: 'Dallas County Emergency Rental Assistance',
  shortName: 'Dallas ERA',
  category: BenefitCategory.HOUSING,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Emergency rental and utility assistance for Dallas County residents',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 6,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.county',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must be a Dallas County resident',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 250),
      weight: 0.8,
      isMandatory: true,
      failureMessage: 'Income must be at or below 80% Area Median Income',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.LEASE_AGREEMENT,
  ],
  applicationUrl: 'https://www.dallascounty.org/',
  helplinePhone: 'Contact Dallas County',
};

