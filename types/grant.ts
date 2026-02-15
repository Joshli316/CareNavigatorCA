// Grant Navigator Types

export interface UploadedDocument {
  id: string;
  type: DocumentUploadType;
  file: File | null;
  fileName: string;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  extractedData?: Record<string, string>;
  confidence?: number;
  error?: string;
}

export type DocumentUploadType =
  | 'id'
  | 'income'
  | 'residence'
  | 'household'
  | 'disability';

export interface DocumentTypeConfig {
  type: DocumentUploadType;
  label: string;
  description: string;
  required: boolean;
  icon: string;
  acceptedFormats: string[];
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    type: 'id',
    label: 'Government ID',
    description: "Driver's license, state ID, or passport",
    required: true,
    icon: '🪪',
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'income',
    label: 'Proof of Income',
    description: 'Pay stubs, tax return, or benefits statement',
    required: true,
    icon: '💰',
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'residence',
    label: 'Proof of Residence',
    description: 'Utility bill, lease, or bank statement with address',
    required: true,
    icon: '🏠',
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'household',
    label: 'Household Composition',
    description: 'Birth certificates, marriage certificate, or custody documents',
    required: true,
    icon: '👨‍👩‍👧‍👦',
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'disability',
    label: 'Disability Documentation',
    description: 'Medical records, SSA disability letter, or VA rating',
    required: false,
    icon: '📋',
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
];

export interface ExtractedProfile {
  // Personal Info
  fullName: string;
  dateOfBirth: string;
  ssn?: string; // Last 4 only for display

  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Financial
  monthlyIncome: number;
  employmentStatus: 'employed' | 'unemployed' | 'self-employed' | 'retired' | 'disabled';

  // Household
  householdSize: number;
  dependents: number;

  // Status
  hasDisability: boolean;
  isVeteran: boolean;
  isSenior: boolean;

  // Metadata
  extractionConfidence: number;
  documentsProcessed: DocumentUploadType[];
}

export interface Grant {
  id: string;
  name: string;
  organization: string;
  category: GrantCategory;
  description: string;
  benefitAmount: string;
  processingTime: string;
  eligibilityScore: number;
  confidence: 'likely' | 'possible' | 'unlikely';
  matchReasons: string[];
  failReasons: string[];
  requiredDocuments: string[];
  applicationUrl?: string;
  hasAPI: boolean;
  hasPDF: boolean;
}

export type GrantCategory =
  | 'income'
  | 'healthcare'
  | 'food'
  | 'housing'
  | 'utilities'
  | 'education'
  | 'emergency';

export interface GrantApplication {
  id: string;
  grantId: string;
  grant: Grant;
  status: 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'denied';
  submittedAt?: Date;
  pdfUrl?: string;
}
