import {
  BenefitProgram,
  BenefitCategory,
  RuleType,
  RuleOperator,
} from '@/types/benefit';
import { DocumentType } from '@/types/document';
import { FEDERAL_LIMITS_2026, getMonthlyFPL } from './constants/federalLimits2026';
import { getTexasSTARPlusIncomeLimit, TEXAS_RULES } from './constants/texasRules';
import { AssistanceLevel } from '@/types/quiz';
import { SSI_APPLICATION_TEMPLATE } from '../applications/formMappings/ssiMapping';

// SSI Program Definition
export const SSI_PROGRAM: BenefitProgram = {
  id: 'ssi-2026',
  name: 'Supplemental Security Income',
  shortName: 'SSI',
  category: BenefitCategory.INCOME,
  jurisdiction: 'federal',
  description: 'Monthly cash assistance for disabled adults and children with limited income and resources',
  estimatedMonthlyValue: FEDERAL_LIMITS_2026.SSI.FEDERAL_BENEFIT_RATE,
  processingTimeWeeks: 12,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'SSI requires a qualifying disability',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: FEDERAL_LIMITS_2026.SSI.FEDERAL_BENEFIT_RATE,
      weight: 0.8,
      isMandatory: true,
      failureMessage: `Monthly income must be below $${FEDERAL_LIMITS_2026.SSI.FEDERAL_BENEFIT_RATE}`,
    },
    {
      type: RuleType.ASSET_LIMIT,
      field: 'financial.countableAssets',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: FEDERAL_LIMITS_2026.SSI.ASSET_LIMIT_INDIVIDUAL,
      weight: 0.6,
      isMandatory: true,
      failureMessage: `Countable assets must be below $${FEDERAL_LIMITS_2026.SSI.ASSET_LIMIT_INDIVIDUAL}`,
    },
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.GREATER_THAN_OR_EQUAL,
      value: 18,
      weight: 0.3,
      isMandatory: false,
      failureMessage: 'Children under 18 have different SSI requirements',
    },
  ],
  requiredDocuments: [
    DocumentType.BIRTH_CERTIFICATE,
    DocumentType.SOCIAL_SECURITY_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.BANK_STATEMENT,
  ],
  applicationUrl: 'https://www.ssa.gov/apply/disability',
  helplinePhone: '1-800-772-1213',
  applicationTemplate: SSI_APPLICATION_TEMPLATE,
};

// SSDI Program Definition
export const SSDI_PROGRAM: BenefitProgram = {
  id: 'ssdi-2026',
  name: 'Social Security Disability Insurance',
  shortName: 'SSDI',
  category: BenefitCategory.INCOME,
  jurisdiction: 'federal',
  description: 'Monthly benefits for workers who can no longer work due to disability',
  estimatedMonthlyValue: FEDERAL_LIMITS_2026.SSDI.AVERAGE_MONTHLY_BENEFIT,
  processingTimeWeeks: 16,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'SSDI requires a qualifying disability',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN,
      value: FEDERAL_LIMITS_2026.SSDI.SUBSTANTIAL_GAINFUL_ACTIVITY,
      weight: 0.9,
      isMandatory: true,
      failureMessage: `Earnings must be below $${FEDERAL_LIMITS_2026.SSDI.SUBSTANTIAL_GAINFUL_ACTIVITY}/mo (substantial gainful activity limit)`,
    },
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.GREATER_THAN_OR_EQUAL,
      value: 18,
      weight: 0.4,
      isMandatory: false,
      failureMessage: 'SSDI typically requires adult work history',
    },
  ],
  requiredDocuments: [
    DocumentType.SOCIAL_SECURITY_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.ssa.gov/benefits/disability/',
  helplinePhone: '1-800-772-1213',
};

// TANF (Temporary Assistance for Needy Families)
export const TANF_PROGRAM: BenefitProgram = {
  id: 'tanf-2026',
  name: 'Temporary Assistance for Needy Families',
  shortName: 'TANF',
  category: BenefitCategory.INCOME,
  jurisdiction: 'federal',
  description: 'Cash assistance for families with children, including those with disabilities',
  estimatedMonthlyValue: 450,
  processingTimeWeeks: 6,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 130),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 130% of federal poverty level',
    },
    {
      type: RuleType.HOUSEHOLD_SIZE,
      field: 'demographic.hasChildren',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: true,
      failureMessage: 'Must have dependent children',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.BIRTH_CERTIFICATE,
  ],
  applicationUrl: 'https://www.acf.hhs.gov/ofa/programs/tanf',
  helplinePhone: 'Contact your state TANF office',
};

// VA Disability Compensation
export const VA_DISABILITY_COMPENSATION: BenefitProgram = {
  id: 'va-disability-2026',
  name: 'VA Disability Compensation',
  shortName: 'VA Disability',
  category: BenefitCategory.INCOME,
  jurisdiction: 'federal',
  description: 'Monthly payments for veterans with service-connected disabilities',
  estimatedMonthlyValue: 1700,
  processingTimeWeeks: 20,
  rules: [
    {
      type: RuleType.CATEGORICAL,
      field: 'demographic.isVeteran',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must be a military veteran',
    },
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have service-connected disability',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
  ],
  applicationUrl: 'https://www.va.gov/disability/',
  helplinePhone: '1-800-827-1000',
};

// WIC (Women, Infants, Children)
export const WIC_PROGRAM: BenefitProgram = {
  id: 'wic-2026',
  name: 'Women, Infants, and Children Program',
  shortName: 'WIC',
  category: BenefitCategory.FOOD,
  jurisdiction: 'federal',
  description: 'Nutrition assistance for pregnant women, new mothers, and children under 5',
  estimatedMonthlyValue: 50,
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 185),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 185% of federal poverty level',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'demographic.hasChildren',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Must have children under 5 or be pregnant',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.fns.usda.gov/wic',
  helplinePhone: 'Contact your state WIC office',
};

// Lifeline (Phone/Internet Assistance)
export const LIFELINE_PROGRAM: BenefitProgram = {
  id: 'lifeline-2026',
  name: 'Lifeline Program',
  shortName: 'Lifeline',
  category: BenefitCategory.UTILITIES,
  jurisdiction: 'federal',
  description: 'Discounted phone and internet service for low-income households',
  estimatedMonthlyValue: 30,
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 135),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 135% of federal poverty level',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'disability.receivingSSI',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'SSI/SNAP/Medicaid recipients are automatically eligible',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.lifelinesupport.org/',
  helplinePhone: '1-800-234-9473',
};

// ACP (Affordable Connectivity Program)
export const ACP_PROGRAM: BenefitProgram = {
  id: 'acp-2026',
  name: 'Affordable Connectivity Program',
  shortName: 'ACP',
  category: BenefitCategory.UTILITIES,
  jurisdiction: 'federal',
  description: 'Up to $30/month discount on internet service and devices',
  estimatedMonthlyValue: 30,
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 200% of federal poverty level',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'disability.receivingSSI',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'SSI/SNAP/Medicaid recipients are automatically eligible',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.fcc.gov/acp',
  helplinePhone: '1-877-384-2575',
};

// Texas STAR+PLUS Waiver
export const TX_STAR_PLUS_WAIVER: BenefitProgram = {
  id: 'tx-star-plus-2026',
  name: 'Texas STAR+PLUS Waiver Program',
  shortName: 'STAR+PLUS Waiver',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'state',
  jurisdictionCode: 'TX',
  description: 'Home and community-based services for Texas residents who need long-term care support',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: TEXAS_RULES.STAR_PLUS_WAIVER.PROCESSING_WEEKS,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.state',
      operator: RuleOperator.EQUALS,
      value: 'TX',
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must be a Texas resident',
    },
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have a qualifying disability or be age 65+',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'demographic.needsAssistance',
      operator: RuleOperator.INCLUDES,
      value: [AssistanceLevel.SOME, AssistanceLevel.EXTENSIVE],
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must need assistance with activities of daily living',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getTexasSTARPlusIncomeLimit(1),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Income may affect eligibility; consult with Texas Health and Human Services',
    },
  ],
  requiredDocuments: [
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.hhs.texas.gov/services/health/medicaid-chip/medicaid-waiver-programs',
  helplinePhone: '1-877-438-5658',
};

// SNAP Program
export const SNAP_PROGRAM: BenefitProgram = {
  id: 'snap-2026',
  name: 'Supplemental Nutrition Assistance Program',
  shortName: 'SNAP',
  category: BenefitCategory.FOOD,
  jurisdiction: 'federal',
  description: 'Monthly benefits to help purchase nutritious food',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 130),
      weight: 0.8,
      isMandatory: true,
      failureMessage: 'Gross income must be at or below 130% of federal poverty level',
    },
    {
      type: RuleType.ASSET_LIMIT,
      field: 'financial.countableAssets',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: FEDERAL_LIMITS_2026.SNAP.ASSET_LIMIT_ELDERLY_DISABLED,
      weight: 0.5,
      isMandatory: false,
      failureMessage: 'Asset limit may apply',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'disability.receivingSSI',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'SSI recipients are categorically eligible',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.BANK_STATEMENT,
  ],
  applicationUrl: 'https://www.fns.usda.gov/snap/state-directory',
  helplinePhone: '1-800-221-5689',
};

// Local Housing Grant (Mock)
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
export const NONPROFIT_EMERGENCY_FUND: BenefitProgram = {
  id: 'nonprofit-emergency-2026',
  name: 'Disability Emergency Assistance Fund',
  shortName: 'Emergency Fund',
  category: BenefitCategory.INCOME,
  jurisdiction: 'federal',
  description: 'One-time emergency grants from nonprofit organizations for unexpected expenses (medical bills, rent, utilities)',
  estimatedMonthlyValue: 1500,
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have a disability to qualify for disability-specific emergency funds',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Emergency funds prioritize low-income households',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.needhelppayingbills.com/html/disability_grants.html',
  helplinePhone: 'Contact local United Way 211',
};

// Assistive Technology Grant (Nonprofit)
export const ASSISTIVE_TECH_GRANT: BenefitProgram = {
  id: 'nonprofit-assistive-tech-2026',
  name: 'Assistive Technology Equipment Grant',
  shortName: 'Assistive Tech Grant',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'federal',
  description: 'Grants from nonprofits for wheelchairs, hearing aids, mobility equipment, and adaptive technology',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 6,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have a disability requiring assistive technology',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 300),
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Income may affect grant priority',
    },
  ],
  requiredDocuments: [
    DocumentType.MEDICAL_RECORDS,
    DocumentType.DISABILITY_DETERMINATION,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.ataporg.org/',
  helplinePhone: '1-800-827-1000',
};

// Medicaid
export const MEDICAID_PROGRAM: BenefitProgram = {
  id: 'medicaid-2026',
  name: 'Medicaid',
  shortName: 'Medicaid',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'federal',
  description: 'Free or low-cost health coverage for low-income individuals, including those with disabilities',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 8,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Disability status may affect eligibility',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 138),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 138% of federal poverty level',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.SOCIAL_SECURITY_CARD,
  ],
  applicationUrl: 'https://www.medicaid.gov/medicaid/index.html',
  helplinePhone: '1-877-267-2323',
};

// Medicare Savings Programs
export const MEDICARE_SAVINGS_PROGRAM: BenefitProgram = {
  id: 'medicare-savings-2026',
  name: 'Medicare Savings Programs',
  shortName: 'MSP',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'federal',
  description: 'Help paying Medicare premiums, deductibles, and copayments for people with limited income',
  estimatedMonthlyValue: 175,
  processingTimeWeeks: 6,
  rules: [
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.GREATER_THAN_OR_EQUAL,
      value: 65,
      weight: 0.5,
      isMandatory: false,
      failureMessage: 'Priority for seniors 65+ or those with disabilities on Medicare',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 135),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be below 135% FPL for QMB program',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.BANK_STATEMENT,
  ],
  applicationUrl: 'https://www.medicare.gov/basics/costs/help/medicare-savings-programs',
  helplinePhone: '1-800-MEDICARE',
};

// LIHEAP (Energy Assistance)
export const LIHEAP_PROGRAM: BenefitProgram = {
  id: 'liheap-2026',
  name: 'Low Income Home Energy Assistance Program',
  shortName: 'LIHEAP',
  category: BenefitCategory.UTILITIES,
  jurisdiction: 'federal',
  description: 'Help paying heating and cooling bills, energy crisis assistance, and weatherization',
  estimatedMonthlyValue: 300,
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 150),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Income must be at or below 150% of federal poverty level',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'disability.receivingSSI',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'SSI/SNAP recipients are categorically eligible',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.acf.hhs.gov/ocs/liheap',
  helplinePhone: 'Contact your local LIHEAP office',
};

// Section 8 Housing Choice Voucher
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

// United Way Dallas (211)
export const UNITED_WAY_DALLAS: BenefitProgram = {
  id: 'united-way-dallas-2026',
  name: 'United Way of Metropolitan Dallas (211)',
  shortName: 'United Way 211',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Emergency funds for rent, utilities, food, and medical expenses',
  estimatedMonthlyValue: 500,
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.county',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Primarily serves Dallas County residents',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Emergency assistance based on need',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.unitedwaydallas.org/',
  helplinePhone: '2-1-1',
};

// Modest Needs
export const MODEST_NEEDS: BenefitProgram = {
  id: 'modest-needs-2026',
  name: 'Modest Needs Self-Sufficiency Grants',
  shortName: 'Modest Needs',
  category: BenefitCategory.INCOME,
  jurisdiction: 'federal',
  description: 'One-time grants up to $1,000 for emergency expenses to prevent homelessness',
  estimatedMonthlyValue: 1000,
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 250),
      weight: 0.8,
      isMandatory: true,
      failureMessage: 'Income must be below 250% of federal poverty level',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.BANK_STATEMENT,
  ],
  applicationUrl: 'https://www.modestneeds.org/',
  helplinePhone: '1-855-466-3378',
};

// Salvation Army North Texas
export const SALVATION_ARMY_NORTH_TEXAS: BenefitProgram = {
  id: 'salvation-army-ntx-2026',
  name: 'Salvation Army North Texas',
  shortName: 'Salvation Army',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Emergency financial assistance, food, clothing, and shelter services in DFW',
  estimatedMonthlyValue: 300,
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Multiple locations across DFW',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Emergency assistance based on individual need',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.salvationarmyusa.org/',
  helplinePhone: 'Contact local Salvation Army',
};

// Catholic Charities Dallas
export const CATHOLIC_CHARITIES_DALLAS: BenefitProgram = {
  id: 'catholic-charities-dallas-2026',
  name: 'Catholic Charities Dallas',
  shortName: 'Catholic Charities',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Emergency financial assistance, food pantries, and disability services',
  estimatedMonthlyValue: 400,
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Open to all in need regardless of religion',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Services available to all in need',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.ccdallas.org/',
  helplinePhone: 'Contact Catholic Charities Dallas',
};

// North Texas Food Bank
export const NORTH_TEXAS_FOOD_BANK: BenefitProgram = {
  id: 'ntfb-2026',
  name: 'North Texas Food Bank',
  shortName: 'NTFB',
  category: BenefitCategory.FOOD,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Food assistance through 200+ partner agencies across North Texas',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves North Texas region',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 185),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Income-based through partner agencies',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.ntfb.org/',
  helplinePhone: '214-330-1396',
};

// The Stewpot Dallas
export const STEWPOT_DALLAS: BenefitProgram = {
  id: 'stewpot-dallas-2026',
  name: 'The Stewpot Dallas',
  shortName: 'Stewpot',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Food, clothing, medical care, case management for homeless and at-risk individuals',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Serves Dallas individuals',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.thestewpot.org/',
  helplinePhone: '214-746-2785',
};

// LIFE Center for Independent Living (Dallas)
export const LIFE_CENTER_ILC: BenefitProgram = {
  id: 'life-center-dallas-2026',
  name: 'LIFE Center for Independent Living (Dallas)',
  shortName: 'LIFE Center',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Home modifications, assistive tech, advocacy, equipment lending, peer counseling',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 6,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have a disability',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Dallas area residents',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
  ],
  applicationUrl: 'https://www.lifecil.org/',
  helplinePhone: '214-821-2874',
};

// Assistive Technology Program of Texas
export const ASSISTIVE_TECH_TEXAS: BenefitProgram = {
  id: 'at-texas-2026',
  name: 'Assistive Technology Program of Texas',
  shortName: 'AT Texas',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'state',
  jurisdictionCode: 'TX',
  description: 'Device loans, low-interest financing, equipment recycling for Texas residents with disabilities',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.state',
      operator: RuleOperator.EQUALS,
      value: 'TX',
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must be a Texas resident',
    },
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must have a disability',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
  ],
  applicationUrl: 'https://www.texasat.org/',
  helplinePhone: '800-828-7839',
};

// Patient Advocate Foundation
export const PATIENT_ADVOCATE_FOUNDATION: BenefitProgram = {
  id: 'paf-2026',
  name: 'Patient Advocate Foundation',
  shortName: 'PAF',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'federal',
  description: 'Help with medical bills, insurance premiums, and prescription costs',
  estimatedMonthlyValue: 500,
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.9,
      isMandatory: false,
      failureMessage: 'Must have chronic or life-threatening illness',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 500),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Income limits vary by disease fund',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.patientadvocate.org/',
  helplinePhone: '1-800-532-5274',
};

// HealthWell Foundation
export const HEALTHWELL_FOUNDATION: BenefitProgram = {
  id: 'healthwell-2026',
  name: 'HealthWell Foundation',
  shortName: 'HealthWell',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'federal',
  description: 'Financial assistance for prescription medications, insurance premiums, and copays',
  estimatedMonthlyValue: 600,
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.9,
      isMandatory: false,
      failureMessage: 'Must have chronic or life-altering disease',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 500),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Income limits vary by fund',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.healthwellfoundation.org/',
  helplinePhone: '1-800-675-8416',
};

// Parkland Health (Dallas County)
export const PARKLAND_HEALTH: BenefitProgram = {
  id: 'parkland-health-2026',
  name: 'Parkland Health (Dallas County)',
  shortName: 'Parkland',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Sliding scale medical care - primary care, specialty care, behavioral health',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 3,
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
      value: getMonthlyFPL(1, 200),
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Sliding scale based on income',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.parklandhospital.com/',
  helplinePhone: '214-590-8000',
};

//==================================================================
// CHRISTIAN CHURCHES WITH SPECIAL NEEDS MINISTRIES (DFW AREA)
//==================================================================

// Watermark Community Church - Access Ministry
export const WATERMARK_ACCESS_MINISTRY: BenefitProgram = {
  id: 'watermark-access-2026',
  name: 'Watermark Community Church - Access Ministry',
  shortName: 'Watermark Access',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Respite care, special needs classes, disability support groups, family events',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Open to all families with special needs individuals',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Located in Dallas',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.watermark.org/access',
  helplinePhone: 'accessministry@watermark.org',
};

// First Baptist Dallas - Special Needs Ministry
export const FIRST_BAPTIST_DALLAS: BenefitProgram = {
  id: 'fbc-dallas-2026',
  name: 'First Baptist Dallas - Special Needs Ministry',
  shortName: 'FBC Dallas',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Sunday school, respite care, family support, summer camps for all ages',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'All ages, all disabilities welcome',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Located in Dallas',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.firstdallas.org/',
  helplinePhone: '(214) 969-0111',
};

// Prestonwood Baptist Church - Special Friends Ministry
export const PRESTONWOOD_SPECIAL_FRIENDS: BenefitProgram = {
  id: 'prestonwood-2026',
  name: 'Prestonwood Baptist Church - Special Friends Ministry',
  shortName: 'Prestonwood',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Sunday programming, VBS, respite nights, parent support groups',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves children and adults with disabilities',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Plano',
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Located in Plano',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.prestonwood.org/',
  helplinePhone: 'specialfriends@prestonwood.org',
};

// Gateway Church - Special Needs Ministry
export const GATEWAY_CHURCH: BenefitProgram = {
  id: 'gateway-church-2026',
  name: 'Gateway Church - Special Needs Ministry',
  shortName: 'Gateway',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Worship accommodations, sensory-friendly rooms, family support across DFW campuses',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Open to all special needs families',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Multiple campuses across DFW',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.gatewaypeople.com/',
  helplinePhone: 'specialneeds@gatewaypeople.com',
};

// Lake Pointe Church - Exceptional Ministry
export const LAKE_POINTE_EXCEPTIONAL: BenefitProgram = {
  id: 'lake-pointe-2026',
  name: 'Lake Pointe Church - Exceptional Ministry',
  shortName: 'Lake Pointe',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Sunday classes, summer camps, respite events, sibling support',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves all ages with physical, cognitive, or developmental disabilities',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Located in Rockwall area',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.lakepointe.org/',
  helplinePhone: 'exceptional@lakepointe.org',
};

// Village Church - Access Ministry
export const VILLAGE_CHURCH_ACCESS: BenefitProgram = {
  id: 'village-church-2026',
  name: 'Village Church - Access Ministry',
  shortName: 'Village Church',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Adaptive worship, community groups, respite care, counseling - no membership required',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Open to all, no membership required for ministry participation',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Multiple DFW campuses',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.thevillagechurch.net/',
  helplinePhone: 'access@thevillagechurch.net',
};

// Joni and Friends - North Texas Chapter
export const JONI_AND_FRIENDS_NTX: BenefitProgram = {
  id: 'joni-friends-ntx-2026',
  name: 'Joni and Friends - North Texas Chapter',
  shortName: 'Joni and Friends',
  category: BenefitCategory.FAITH_BASED,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Family retreats, respite care, special needs family support, equipment loan closet',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Christian organization serving families affected by disability',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Serves North Texas region',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.joniandfriends.org/',
  helplinePhone: 'northtexas@joniandfriends.org',
};

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

  // Nonprofit Emergency Assistance (6)
  NONPROFIT_EMERGENCY_FUND,
  UNITED_WAY_DALLAS,
  MODEST_NEEDS,
  SALVATION_ARMY_NORTH_TEXAS,
  CATHOLIC_CHARITIES_DALLAS,
  NORTH_TEXAS_FOOD_BANK,
  STEWPOT_DALLAS,

  // Nonprofit Healthcare & Equipment (5)
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
