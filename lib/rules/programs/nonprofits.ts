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

