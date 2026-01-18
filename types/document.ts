export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadedAt: string;
  verificationStatus: VerificationStatus;
  usedForPrograms: string[];
  expiresAt?: string;
}

export enum DocumentType {
  BIRTH_CERTIFICATE = 'birth_certificate',
  SOCIAL_SECURITY_CARD = 'ssn_card',
  PROOF_OF_INCOME = 'income_proof',
  BANK_STATEMENT = 'bank_statement',
  LEASE_AGREEMENT = 'lease',
  MEDICAL_RECORDS = 'medical_records',
  DISABILITY_DETERMINATION = 'disability_letter',
  ID_CARD = 'id',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface VaultState {
  documents: Document[];
  uploadProgress: Record<string, number>;
  autoFillEnabled: boolean;
}
