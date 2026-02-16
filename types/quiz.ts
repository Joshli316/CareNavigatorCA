// Complete quiz state structure
export interface QuizState {
  currentStep: number;
  completedSteps: number[];
  data: QuizData;
  validationErrors: Record<string, string[]>;
  submittedAt: string | null;
}

export interface QuizData {
  geography: GeographyData;
  disability: DisabilityData;
  financial: FinancialData;
  demographic: DemographicData;
}

export interface GeographyData {
  state: string;
  county: string;
  city: string;
  zipCode: string;
  residencyMonths: number;
}

export interface DisabilityData {
  hasDisability: boolean;
  disabilityType: DisabilityType[];
  receivingSSI: boolean;
  receivingSSDI: boolean;
  hasSSADetermination: boolean;
}

export enum DisabilityType {
  PHYSICAL = 'physical',
  COGNITIVE = 'cognitive',
  MENTAL_HEALTH = 'mental_health',
  CHRONIC_ILLNESS = 'chronic_illness',
  DEVELOPMENTAL = 'developmental',
}

export interface FinancialData {
  monthlyIncome: number;
  incomeType: IncomeType[];
  countableAssets: number;
  ownsCar: boolean;
  carValue: number;
  ownsHome: boolean;
  homeValue: number;
}

export enum IncomeType {
  WAGES = 'wages',
  SSI = 'ssi',
  SSDI = 'ssdi',
  RETIREMENT = 'retirement',
  OTHER = 'other',
}

export interface DemographicData {
  age: number;
  householdSize: number;
  hasChildren: boolean;
  childrenAges: number[];
  isVeteran: boolean;
  needsAssistance: AssistanceLevel;
}

export enum AssistanceLevel {
  NONE = 'none',
  SOME = 'some',
  EXTENSIVE = 'extensive',
}

// Quiz actions
export type QuizAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: { step: keyof QuizData; data: any } }
  | { type: 'MARK_COMPLETE'; payload: number }
  | { type: 'SET_ERRORS'; payload: Record<string, string[]> }
  | { type: 'RESET' };
