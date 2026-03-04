'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { DocumentType } from '@/types/document';
import { formatDocumentType } from '@/lib/utils/format';
import { BENEFIT_PROGRAMS } from '@/lib/rules/programs/index';

const STORAGE_KEY = 'cn_vault_documents';

interface VaultDocument {
  type: DocumentType;
  fileName: string;
  uploadedAt: string;
  status: 'ready' | 'expired';
}

const ALL_DOC_TYPES = Object.values(DocumentType);

// formatDocumentType produces poor labels for some enum values (e.g. "ssn_card" -> "Ssn Card")
// Override those specific cases while still using the util for everything else
function displayDocType(type: DocumentType): string {
  const overrides: Partial<Record<DocumentType, string>> = {
    [DocumentType.SOCIAL_SECURITY_CARD]: 'Social Security Card',
    [DocumentType.ID_CARD]: 'Government ID',
    [DocumentType.LEASE_AGREEMENT]: 'Lease Agreement',
    [DocumentType.DISABILITY_DETERMINATION]: 'Disability Determination',
    [DocumentType.PROOF_OF_INCOME]: 'Proof of Income',
  };
  return overrides[type] || formatDocumentType(type);
}

function loadDocuments(): VaultDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveDocuments(docs: VaultDocument[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.warn('Failed to save vault documents:', e);
  }
}

// Count how many programs require each document type
function computeUnlockCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const dt of ALL_DOC_TYPES) {
    counts[dt] = BENEFIT_PROGRAMS.filter(p => p.requiredDocuments.includes(dt)).length;
  }
  return counts;
}

// Icons as inline SVGs
function UploadIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WarningIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function DocIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function TrashIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function VaultPage() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [mounted, setMounted] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const unlockCounts = useMemo(() => computeUnlockCounts(), []);

  useEffect(() => {
    setDocuments(loadDocuments());
    setMounted(true);
  }, []);

  const uploadedTypes = new Set(documents.map(d => d.type));
  const uploadedCount = uploadedTypes.size;
  const totalCount = ALL_DOC_TYPES.length;

  function handleUpload(type: DocumentType, file: File) {
    const newDoc: VaultDocument = {
      type,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: 'ready',
    };
    const updated = [...documents.filter(d => d.type !== type), newDoc];
    setDocuments(updated);
    saveDocuments(updated);
  }

  function handleRemove(type: DocumentType) {
    const updated = documents.filter(d => d.type !== type);
    setDocuments(updated);
    saveDocuments(updated);
  }

  function getDoc(type: DocumentType): VaultDocument | undefined {
    return documents.find(d => d.type === type);
  }

  // Compute program readiness
  const programReadiness = useMemo(() => {
    const ready: string[] = [];
    const missingOne: { name: string; missing: string }[] = [];
    const missingMany: { name: string; missingCount: number }[] = [];

    for (const program of BENEFIT_PROGRAMS) {
      if (program.requiredDocuments.length === 0) continue;
      const missing = program.requiredDocuments.filter(dt => !uploadedTypes.has(dt));
      if (missing.length === 0) {
        ready.push(program.name);
      } else if (missing.length === 1) {
        missingOne.push({ name: program.name, missing: displayDocType(missing[0]) });
      } else {
        missingMany.push({ name: program.name, missingCount: missing.length });
      }
    }

    return { ready, missingOne, missingMany };
  }, [documents]);

  // Don't render content until mounted (avoids localStorage hydration mismatch)
  if (!mounted) {
    return (
      <Container>
        <div className="py-8 max-w-4xl mx-auto">
          <div className="h-8 w-64 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-50 rounded animate-pulse" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Your Document Vault</h1>
          <p className="text-base text-gray-500">
            Upload once, use everywhere. Track which documents you have ready.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              {uploadedCount} of {totalCount} documents uploaded
            </span>
            <span className="text-sm text-gray-500">
              {uploadedCount === totalCount ? 'All set!' : `${totalCount - uploadedCount} remaining`}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
            />
          </div>
        </Card>

        {/* Document Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {ALL_DOC_TYPES.map(type => {
            const doc = getDoc(type);
            const isUploaded = !!doc;
            const isExpired = doc?.status === 'expired';

            return (
              <Card key={type} className="p-5" hoverable>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isUploaded
                      ? isExpired ? 'bg-warning-light' : 'bg-success-light'
                      : 'bg-gray-50'
                  }`}>
                    {isUploaded ? (
                      isExpired
                        ? <WarningIcon className="w-5 h-5 text-warning" />
                        : <CheckIcon className="w-5 h-5 text-success" />
                    ) : (
                      <DocIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{displayDocType(type)}</h3>
                      {unlockCounts[type] > 0 && (
                        <span className="text-xs text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2">
                          Unlocks {unlockCounts[type]} program{unlockCounts[type] !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {isUploaded ? (
                      <div>
                        <p className="text-xs text-gray-500 truncate mb-0.5">{doc.fileName}</p>
                        <p className="text-xs text-gray-400">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                            isExpired ? 'text-warning' : 'text-success'
                          }`}>
                            {isExpired ? (
                              <><WarningIcon className="w-3.5 h-3.5" /> Expired</>
                            ) : (
                              <><CheckIcon className="w-3.5 h-3.5" /> Ready</>
                            )}
                          </span>
                          <button
                            onClick={() => handleRemove(type)}
                            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-error transition-colors"
                          >
                            <TrashIcon className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-400 mb-3">Not uploaded</p>
                        <input
                          ref={el => { fileInputRefs.current[type] = el; }}
                          type="file"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(type, file);
                            e.target.value = '';
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[type]?.click()}
                        >
                          <UploadIcon className="w-4 h-4 mr-1.5" />
                          Upload
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Programs Unlocked Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Programs Unlocked</h2>
          <p className="text-sm text-gray-500 mb-6">
            With your current documents, you&apos;re ready to apply to{' '}
            <span className="font-semibold text-success">{programReadiness.ready.length} program{programReadiness.ready.length !== 1 ? 's' : ''}</span>.
          </p>

          {/* All documents ready */}
          {programReadiness.ready.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-success mb-3 flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4" />
                All documents ready ({programReadiness.ready.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {programReadiness.ready.map(name => (
                  <div key={name} className="flex items-center gap-2 px-3 py-2 bg-success-light rounded-md">
                    <CheckIcon className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-gray-800 truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing 1 document */}
          {programReadiness.missingOne.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-warning mb-3 flex items-center gap-1.5">
                <WarningIcon className="w-4 h-4" />
                Missing 1 document ({programReadiness.missingOne.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {programReadiness.missingOne.map(({ name, missing }) => (
                  <div key={name} className="flex items-center justify-between gap-2 px-3 py-2 bg-warning-light rounded-md">
                    <span className="text-sm text-gray-800 truncate">{name}</span>
                    <span className="text-xs text-warning font-medium whitespace-nowrap">Need: {missing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing 2+ documents */}
          {programReadiness.missingMany.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Missing 2+ documents ({programReadiness.missingMany.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {programReadiness.missingMany.map(({ name, missingCount }) => (
                  <div key={name} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-500 truncate">{name}</span>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{missingCount} docs needed</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no programs have required documents */}
          {programReadiness.ready.length === 0 && programReadiness.missingOne.length === 0 && programReadiness.missingMany.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-sm text-gray-500">No programs in the registry require specific documents.</p>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
