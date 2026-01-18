import { DocumentType } from './document';
import { ApplicationTemplate } from './application';

// Flexible rule engine structure
export interface BenefitProgram {
  id: string;
  name: string;
  shortName: string;
  category: BenefitCategory;
  jurisdiction: 'federal' | 'state' | 'county' | 'city';
  jurisdictionCode?: string;
  description: string;
  estimatedMonthlyValue: number | 'varies';
  processingTimeWeeks: number;
  rules: EligibilityRule[];
  requiredDocuments: DocumentType[];
  applicationUrl?: string;
  helplinePhone?: string;
  applicationTemplate?: ApplicationTemplate;  // Pre-fill form template
}

export enum BenefitCategory {
  INCOME = 'income',
  HEALTHCARE = 'healthcare',
  HOUSING = 'housing',
  FOOD = 'food',
  UTILITIES = 'utilities',
  FAITH_BASED = 'faith_based',
}

export interface EligibilityRule {
  type: RuleType;
  field: string;
  operator: RuleOperator;
  value: string | number | boolean | string[] | number[];
  weight: number;
  isMandatory: boolean;
  failureMessage?: string;
}

export enum RuleType {
  INCOME_THRESHOLD = 'income_threshold',
  ASSET_LIMIT = 'asset_limit',
  AGE_RANGE = 'age_range',
  DISABILITY_REQUIRED = 'disability_required',
  GEOGRAPHY_MATCH = 'geography_match',
  CATEGORICAL = 'categorical',
  HOUSEHOLD_SIZE = 'household_size',
}

export enum RuleOperator {
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  EQUALS = 'eq',
  INCLUDES = 'includes',
  EXCLUDES = 'excludes',
}

export interface EligibilityResult {
  programId: string;
  program: BenefitProgram;
  isEligible: boolean;
  probability: number;
  estimatedMonthlyBenefit: number;
  matchedRules: string[];
  failedRules: FailedRule[];
  nextSteps: string[];
  timelineWeeks: number;
  reasoning?: EligibilityReasoning;
}

export interface EligibilityReasoning {
  whyEligible: string[];
  whyIneligible: string[];
  improveOdds: string[];
}

export interface FailedRule {
  ruleId: string;
  message: string;
  gap?: string;
}
