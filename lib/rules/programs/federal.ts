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
import { SSI_APPLICATION_TEMPLATE } from '../../applications/formMappings/ssiMapping';
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

