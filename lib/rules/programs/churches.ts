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
