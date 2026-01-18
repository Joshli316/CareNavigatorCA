import { DocumentType } from '@/types/document';

export const DOCUMENT_REQUIREMENTS: Record<string, DocumentType[]> = {
  'ssi-2026': [
    DocumentType.BIRTH_CERTIFICATE,
    DocumentType.SOCIAL_SECURITY_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.BANK_STATEMENT,
  ],
  'ssdi-2026': [
    DocumentType.SOCIAL_SECURITY_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
  ],
  'ca-hcbs-2026': [
    DocumentType.ID_CARD,
    DocumentType.MEDICAL_RECORDS,
    DocumentType.PROOF_OF_INCOME,
  ],
  'snap-2026': [
    DocumentType.ID_CARD,
    DocumentType.PROOF_OF_INCOME,
    DocumentType.BANK_STATEMENT,
  ],
  'housing-grant-2026': [
    DocumentType.ID_CARD,
    DocumentType.LEASE_AGREEMENT,
    DocumentType.PROOF_OF_INCOME,
  ],
};
