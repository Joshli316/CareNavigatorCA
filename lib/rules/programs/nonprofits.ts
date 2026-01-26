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

// ============================================
// DFW ADAPTIVE SPORTS PROGRAMS
// ============================================

// DFW Adaptive Sports Coalition
export const DFW_ADAPTIVE_SPORTS: BenefitProgram = {
  id: 'dfw-adaptive-sports-2026',
  name: 'DFW Adaptive Sports Coalition',
  shortName: 'DFW Adaptive Sports',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Wheelchair basketball, sled hockey, adaptive climbing, blind fencing, amputee soccer, power soccer, handcycling, and 10+ more adaptive sports',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have a physical disability',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Dallas-Fort Worth area',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://utswmed.org/conditions-treatments/physical-medicine-and-rehabilitation/adaptive-sports-coalition/',
  helplinePhone: '214-648-3111',
};

// RISE Adaptive Sports
export const RISE_ADAPTIVE_SPORTS: BenefitProgram = {
  id: 'rise-adaptive-2026',
  name: 'RISE Adaptive Sports',
  shortName: 'RISE Sports',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'FREE adaptive programs including rugby, volleyball, swimming, tubing, and handcycling for all ages',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
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
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Serves DFW area',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.riseadaptivesports.org/',
  helplinePhone: '214-420-7100',
};

// Dallas Jr. Wheelchair Mavericks
export const DALLAS_WHEELCHAIR_MAVS: BenefitProgram = {
  id: 'dallas-wheelchair-mavs-2026',
  name: 'Dallas Jr. Wheelchair Mavericks',
  shortName: 'Jr Wheelchair Mavs',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Wheelchair basketball league for youth ages 5-18 ($12/month + $5/year rec center fee)',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must use a wheelchair or have mobility impairment',
    },
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: 18,
      weight: 0.9,
      isMandatory: false,
      failureMessage: 'Youth ages 5-18',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Practices at Bachman Recreation Center in Dallas',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.dallasparks.org/284/Wheelchair-Basketball',
  helplinePhone: '214-670-1500',
};

// Miracle League DFW
export const MIRACLE_LEAGUE_DFW: BenefitProgram = {
  id: 'miracle-league-dfw-2026',
  name: 'Miracle League of DFW',
  shortName: 'Miracle League',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Adaptive baseball, basketball, soccer, football, cheerleading, and bowling for children and adults with special needs',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For children and adults with mental or physical disabilities',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Locations in Irving, Frisco, Coppell, Waxahachie',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.miracleleaguefrisco.com/',
  helplinePhone: '972-292-6100',
};

// YMCA Champions League
export const YMCA_CHAMPIONS: BenefitProgram = {
  id: 'ymca-champions-2026',
  name: 'YMCA Champions League (Special Needs)',
  shortName: 'YMCA Champions',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'FREE monthly multi-sports league for individuals with special needs - different sport each month',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For individuals with special needs',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'At Semones Family YMCA in North Dallas',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://ymcadallas.org/adaptive_special_needs_programs',
  helplinePhone: '214-880-9622',
};

// Arise Special Needs Sports
export const ARISE_SPECIAL_NEEDS: BenefitProgram = {
  id: 'arise-sports-2026',
  name: 'Arise Special Needs Sports',
  shortName: 'Arise Sports',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Year-round adaptive sports including baseball, basketball, soccer, tennis, and cheerleading for ages 4+',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For individuals with special needs',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Serves DFW area',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.arisespecialneeds.com/sports',
  helplinePhone: '469-You-Rise',
};

// Dallas Adapted Aquatics
export const DALLAS_ADAPTED_AQUATICS: BenefitProgram = {
  id: 'dallas-adapted-aquatics-2026',
  name: 'Dallas Adapted Aquatics',
  shortName: 'Adapted Aquatics',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Adapted swimming lessons and aquatic therapy for persons with disabilities through City of Dallas',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For persons with disabilities',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must be Dallas resident',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.dallasparks.org/',
  helplinePhone: '214-670-1505',
};

// ============================================
// DFW FOSTER CARE & ORPHAN SUPPORT
// ============================================

// Hope Cottage
export const HOPE_COTTAGE: BenefitProgram = {
  id: 'hope-cottage-2026',
  name: 'Hope Cottage (Adoption & Foster Care)',
  shortName: 'Hope Cottage',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: '106-year nonprofit providing adoption, foster care, parenting classes, and support services for North Texas families',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Dallas-Fort Worth area',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'demographic.hasChildren',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Services for families with children or seeking to adopt/foster',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.hopecottage.org/',
  helplinePhone: '214-526-8721',
};

// Buckner International
export const BUCKNER_INTERNATIONAL: BenefitProgram = {
  id: 'buckner-2026',
  name: 'Buckner International (Foster & Family Services)',
  shortName: 'Buckner',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Foster care, adoption services, family preservation, and Buckner NextStep for youth aging out of foster care',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Dallas-Fort Worth area',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.buckner.org/dallas',
  helplinePhone: '1-800-442-4800',
};

// CASA of Dallas
export const CASA_DALLAS: BenefitProgram = {
  id: 'casa-dallas-2026',
  name: 'CASA of Dallas County',
  shortName: 'CASA Dallas',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Court Appointed Special Advocates for children in foster care - advocacy, support, and resources',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.county',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Serves Dallas County children in foster care',
    },
    {
      type: RuleType.CATEGORICAL,
      field: 'demographic.hasChildren',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'For children in the foster care system',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.casadallas.org/',
  helplinePhone: '214-827-8961',
};

// CASA of Tarrant County
export const CASA_TARRANT: BenefitProgram = {
  id: 'casa-tarrant-2026',
  name: 'CASA of Tarrant County',
  shortName: 'CASA Tarrant',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Tarrant',
  description: 'Court Appointed Special Advocates for children in foster care in Fort Worth and Tarrant County',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Fort Worth', 'Other DFW'],
      weight: 0.9,
      isMandatory: false,
      failureMessage: 'Serves Tarrant County children in foster care',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.speakupforachild.org/',
  helplinePhone: '817-877-5891',
};

// Jonathan's Place
export const JONATHANS_PLACE: BenefitProgram = {
  id: 'jonathans-place-2026',
  name: 'Jonathan\'s Place (Abused & Neglected Children)',
  shortName: 'Jonathan\'s Place',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Emergency shelter, foster care, and foster-to-adopt services for abused, abandoned, and neglected children',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Dallas and Tarrant counties',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.jpkids.org/',
  helplinePhone: '972-241-0044',
};

// Embrace Texas
export const EMBRACE_TEXAS: BenefitProgram = {
  id: 'embrace-texas-2026',
  name: 'Embrace Texas (Church-Based Foster Support)',
  shortName: 'Embrace Texas',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Engages churches to support foster and adoptive families, recruit adoptive families for waiting children',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Collin County and surrounding areas',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.embracetexas.org/',
  helplinePhone: '469-You-Care',
};

// BraveLove
export const BRAVELOVE: BenefitProgram = {
  id: 'bravelove-2026',
  name: 'BraveLove (Adoption Advocacy)',
  shortName: 'BraveLove',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Supports birth mothers considering adoption, shares stories to reduce stigma, connects families with resources',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Dallas-based but serves nationwide',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.bravelove.org/',
  helplinePhone: '214-556-7171',
};

// ============================================
// DFW FAITH-BASED DISABILITY NONPROFITS
// ============================================

// The Well Community (Mental Health)
export const WELL_COMMUNITY: BenefitProgram = {
  id: 'well-community-2026',
  name: 'The Well Community (Mental Health Ministry)',
  shortName: 'The Well Community',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Faith-based support community for adults with serious mental illness - belonging, friendships, hope, and healing',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.9,
      isMandatory: false,
      failureMessage: 'For adults dealing with serious mental illness',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Dallas area',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://thewellcommunity.org/',
  helplinePhone: '214-363-0095',
};

// Jewish Family Service of Greater Dallas
export const JEWISH_FAMILY_SERVICE: BenefitProgram = {
  id: 'jfs-dallas-2026',
  name: 'Jewish Family Service of Greater Dallas',
  shortName: 'JFS Dallas',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Counseling, case management, senior services, disability inclusion programs - serves ALL faiths',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Greater Dallas area regardless of faith',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 250),
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Sliding scale fees available',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.jfsdallas.org/',
  helplinePhone: '972-437-9950',
};

// Mission Arlington
export const MISSION_ARLINGTON: BenefitProgram = {
  id: 'mission-arlington-2026',
  name: 'Mission Arlington (Faith-Based Services)',
  shortName: 'Mission Arlington',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Tarrant',
  description: 'Emergency assistance, food, clothing, dental, medical care - physical, intellectual, emotional, and spiritual support',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Fort Worth', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Arlington and surrounding areas',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Services based on need',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.missionarlington.org/',
  helplinePhone: '817-277-6620',
};

// Positive Reflection Ministries
export const POSITIVE_REFLECTION: BenefitProgram = {
  id: 'positive-reflection-2026',
  name: 'Positive Reflection Ministries',
  shortName: 'Positive Reflection',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Emergency assistance for disabled, elderly, and low-income families - food, rent, utilities, medication',
  estimatedMonthlyValue: 300,
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Priority for disabled and elderly',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 150),
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'For low-income families in crisis',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Other DFW'],
      weight: 0.6,
      isMandatory: false,
      failureMessage: 'Serves DFW area',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://positivereflectionministries.org/',
  helplinePhone: '214-428-4530',
};

// Good Word Ministries (Deaf & Disabled)
export const GOOD_WORD_MINISTRIES: BenefitProgram = {
  id: 'good-word-2026',
  name: 'Good Word Ministries (Deaf & Disabled)',
  shortName: 'Good Word Ministries',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Ministry programs for deaf and disabled children and adults in the DFW area',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For deaf and disabled individuals',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Based in Hudson Oaks, serves DFW',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://goodwordministries.org/',
  helplinePhone: '817-888-8840',
};

// Faith in Texas (Multi-Faith Justice)
export const FAITH_IN_TEXAS: BenefitProgram = {
  id: 'faith-in-texas-2026',
  name: 'Faith in Texas (Multi-Faith Justice Coalition)',
  shortName: 'Faith in Texas',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Multi-faith coalition (Christian, Jewish, Muslim, Unitarian) working for economic and social justice for all',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Statewide organization with DFW presence',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://faithintx.org/',
  helplinePhone: '512-355-5553',
};

// ============================================
// DFW TRANSPORTATION ASSISTANCE
// ============================================

// DART Paratransit Services
export const DART_PARATRANSIT: BenefitProgram = {
  id: 'dart-paratransit-2026',
  name: 'DART Paratransit Services',
  shortName: 'DART Paratransit',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Curb-to-curb public transportation for people with disabilities who cannot use bus/rail. Free travel training available.',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have physical, cognitive, or visual disability preventing use of fixed-route transit',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Plano', 'Other DFW'],
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must live in DART service area (Dallas, Plano, Garland, Irving, Richardson, etc.)',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
  ],
  applicationUrl: 'https://www.dart.org/guide/transit-and-use/paratransit-services',
  helplinePhone: '214-515-7272',
};

// Fort Worth Transportation Authority - ACCESS
export const TRINITY_METRO_ACCESS: BenefitProgram = {
  id: 'trinity-metro-access-2026',
  name: 'Trinity Metro ACCESS Paratransit',
  shortName: 'Trinity Metro ACCESS',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Tarrant',
  description: 'Door-to-door transportation for persons with disabilities in Fort Worth/Tarrant County',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have ADA-qualifying disability',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Fort Worth', 'Other DFW'],
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must live in Trinity Metro service area',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
  ],
  applicationUrl: 'https://ridetrinitymetro.org/riders-guide/access/',
  helplinePhone: '817-215-8600',
};

// My Ride Dallas (Non-Emergency Medical Transport)
export const MY_RIDE_DALLAS: BenefitProgram = {
  id: 'my-ride-dallas-2026',
  name: 'My Ride Dallas (Medicaid Transport)',
  shortName: 'My Ride Dallas',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Free non-emergency medical transportation for Medicaid recipients to medical appointments',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves DFW Medicaid recipients',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 138),
      weight: 0.9,
      isMandatory: false,
      failureMessage: 'Must be enrolled in Texas Medicaid',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.myridedallas.com/',
  helplinePhone: '1-855-687-4337',
};

// ============================================
// DFW RESPITE CARE SERVICES
// ============================================

// North Central Texas Area Agency on Aging - Respite Vouchers
export const NCTAAA_RESPITE: BenefitProgram = {
  id: 'nctaaa-respite-2026',
  name: 'North Central Texas AAA - Respite Vouchers',
  shortName: 'NCTAAA Respite',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Up to $1,000 in vouchers for family caregivers to purchase in-home or institutional respite care',
  estimatedMonthlyValue: 1000,
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves 16-county North Central Texas region',
    },
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'For family caregivers of elderly or disabled individuals',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.nctcog.org/aging-services/caregivers/caregiver-support-and-respite-services',
  helplinePhone: '1-800-272-3921',
};

// Arise Special Needs - Respite Care
export const ARISE_RESPITE: BenefitProgram = {
  id: 'arise-respite-2026',
  name: 'Arise Special Needs - Respite Care',
  shortName: 'Arise Respite',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Respite care including overnight, social skills training, tutoring, community outing support',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For individuals with special needs',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Serves North Dallas and Richardson area',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.arisespecialneeds.com/respite',
  helplinePhone: '469-You-Rise',
};

// Special Birds Family Nursing - Respite
export const SPECIAL_BIRDS: BenefitProgram = {
  id: 'special-birds-2026',
  name: 'Special Birds Family Nursing - Respite Care',
  shortName: 'Special Birds',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Tarrant',
  description: 'High-quality respite care for loved ones with special needs in Fort Worth area',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 1,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'For families with special needs loved ones',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Fort Worth', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Serves Fort Worth area',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://specialbirdsfamilynursing.com/',
  helplinePhone: '817-862-1002',
};

// ============================================
// DFW LEGAL AID SERVICES
// ============================================

// Disability Rights Texas - Dallas Office
export const DISABILITY_RIGHTS_TX: BenefitProgram = {
  id: 'drtx-dallas-2026',
  name: 'Disability Rights Texas (Dallas Office)',
  shortName: 'DRTx Dallas',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Free legal advocacy for disability rights - education, employment, housing, benefits, abuse/neglect',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.DISABILITY_REQUIRED,
      field: 'disability.hasDisability',
      operator: RuleOperator.EQUALS,
      value: true,
      weight: 1.0,
      isMandatory: true,
      failureMessage: 'Must have a mental or physical disability',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Statewide organization with Dallas office',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://disabilityrightstx.org/',
  helplinePhone: '1-800-252-9108',
};

// Legal Aid of NorthWest Texas
export const LEGAL_AID_NWT: BenefitProgram = {
  id: 'legal-aid-nwt-2026',
  name: 'Legal Aid of NorthWest Texas',
  shortName: 'LANWT',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Free civil legal services for low-income residents - disability benefits, housing, family law, consumer issues',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must meet low-income guidelines',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Offices in Dallas, Fort Worth, Denton, McKinney, Waxahachie',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://legalaidtx.org/',
  helplinePhone: '1-888-529-5277',
};

// Dallas Volunteer Attorney Program
export const DVAP: BenefitProgram = {
  id: 'dvap-2026',
  name: 'Dallas Volunteer Attorney Program',
  shortName: 'DVAP',
  category: BenefitCategory.INCOME,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Free legal help with benefits, consumer, employment, family, housing, and landlord-tenant matters',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 2,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must meet low-income guidelines',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.county',
      operator: RuleOperator.EQUALS,
      value: 'Dallas',
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must be Dallas County resident',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://dallasvolunteerattorneyprogram.org/',
  helplinePhone: '214-748-1234',
};

// ============================================
// DFW DENTAL & VISION SERVICES
// ============================================

// Texas Mission of Mercy - Free Dental
export const TEXAS_MISSION_MERCY: BenefitProgram = {
  id: 'tmom-2026',
  name: 'Texas Mission of Mercy - Free Dental Care',
  shortName: 'TX Mission of Mercy',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'state',
  jurisdictionCode: 'TX',
  description: 'Free dental cleanings, fillings, and extractions at traveling clinic events (no ID, insurance, or income requirements)',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.state',
      operator: RuleOperator.EQUALS,
      value: 'TX',
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Events held across Texas including DFW area',
    },
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.GREATER_THAN_OR_EQUAL,
      value: 8,
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Must be age 8 or older',
    },
  ],
  requiredDocuments: [],
  applicationUrl: 'https://www.tmominc.org/',
  helplinePhone: '512-443-3675',
};

// Mercy Clinic Friends Fort Worth - Free Medical/Dental
export const MERCY_CLINIC_FW: BenefitProgram = {
  id: 'mercy-clinic-fw-2026',
  name: 'Mercy Clinic Friends - Free Medical & Dental',
  shortName: 'Mercy Clinic FW',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Tarrant',
  description: 'Free medical and dental care, blood work, pharmacy for uninsured adults in Fort Worth (zip codes 76104, 76110, 76115)',
  estimatedMonthlyValue: 'varies',
  processingTimeWeeks: 0,
  rules: [
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.EQUALS,
      value: 'Fort Worth',
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'Must live in Fort Worth zip codes 76104, 76110, or 76115',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.8,
      isMandatory: true,
      failureMessage: 'Income must be below 200% FPL',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
  ],
  applicationUrl: 'https://www.mercy-clinic.org/',
  helplinePhone: '817-921-2848',
};

// Lions Club - Vision Assistance
export const LIONS_VISION_DFW: BenefitProgram = {
  id: 'lions-vision-dfw-2026',
  name: 'Lions Club - Vision Assistance Program',
  shortName: 'Lions Vision',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Free eye exams, glasses, and vision screenings for low-income individuals and children',
  estimatedMonthlyValue: 200,
  processingTimeWeeks: 4,
  rules: [
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Based on financial need',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Contact local Lions Club chapter',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://e-district.org/sites/2x1/',
  helplinePhone: 'Contact local Lions Club',
};

// Essilor Vision Foundation
export const ESSILOR_VISION: BenefitProgram = {
  id: 'essilor-vision-2026',
  name: 'Essilor Vision Foundation - Kids Vision',
  shortName: 'Essilor Vision',
  category: BenefitCategory.HEALTHCARE,
  jurisdiction: 'county',
  jurisdictionCode: 'Dallas',
  description: 'Free eye exams and glasses for children from low-income families',
  estimatedMonthlyValue: 150,
  processingTimeWeeks: 3,
  rules: [
    {
      type: RuleType.AGE_RANGE,
      field: 'demographic.age',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: 18,
      weight: 0.9,
      isMandatory: true,
      failureMessage: 'For children under 18',
    },
    {
      type: RuleType.INCOME_THRESHOLD,
      field: 'financial.monthlyIncome',
      operator: RuleOperator.LESS_THAN_OR_EQUAL,
      value: getMonthlyFPL(1, 200),
      weight: 0.8,
      isMandatory: false,
      failureMessage: 'Must demonstrate financial need',
    },
    {
      type: RuleType.GEOGRAPHY_MATCH,
      field: 'geography.city',
      operator: RuleOperator.INCLUDES,
      value: ['Dallas', 'Fort Worth', 'Plano', 'Other DFW'],
      weight: 0.7,
      isMandatory: false,
      failureMessage: 'Available through participating schools and clinics',
    },
  ],
  requiredDocuments: [
    DocumentType.ID_CARD,
  ],
  applicationUrl: 'https://www.essilorvisionfoundationusa.org/',
  helplinePhone: '1-888-892-0979',
};

