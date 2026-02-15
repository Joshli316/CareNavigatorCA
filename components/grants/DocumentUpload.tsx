'use client';

import { useCallback, useState } from 'react';
import { useGrant } from '@/lib/context/GrantContext';
import { DOCUMENT_TYPES, DocumentUploadType } from '@/types/grant';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

export function DocumentUpload() {
  const { documents, uploadDocument, removeDocument, startExtraction, isExtracting, extractionProgress } = useGrant();

  const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);
  const optionalDocs = DOCUMENT_TYPES.filter((d) => !d.required);
  const uploadedCount = documents.length;
  const requiredCount = requiredDocs.length;
  const canProceed = requiredDocs.every((doc) => documents.some((d) => d.type === doc.type));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Upload Your Documents</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          We&apos;ll extract your information automatically to match you with grants and benefits you qualify for.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-accent-50 rounded-lg p-4 text-center">
        <p className="text-sm text-accent-700">
          <span className="font-semibold">{uploadedCount}</span> of{' '}
          <span className="font-semibold">{requiredCount}</span> required documents uploaded
        </p>
        <div className="mt-2 h-2 bg-accent-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-600 transition-all duration-300"
            style={{ width: `${(uploadedCount / requiredCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Required Documents */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {requiredDocs.map((docType) => (
            <DocumentCard
              key={docType.type}
              docType={docType}
              isUploaded={documents.some((d) => d.type === docType.type)}
              fileName={documents.find((d) => d.type === docType.type)?.fileName}
              onUpload={(file) => uploadDocument(docType.type, file)}
              onRemove={() => removeDocument(docType.type)}
            />
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Optional Documents</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {optionalDocs.map((docType) => (
            <DocumentCard
              key={docType.type}
              docType={docType}
              isUploaded={documents.some((d) => d.type === docType.type)}
              fileName={documents.find((d) => d.type === docType.type)?.fileName}
              onUpload={(file) => uploadDocument(docType.type, file)}
              onRemove={() => removeDocument(docType.type)}
            />
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700">Your documents are secure</p>
          <p className="text-sm text-gray-500">
            All documents are encrypted and only used to find programs you qualify for. We never share your information.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        {isExtracting ? (
          <div className="text-center">
            <div className="mb-3">
              <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-600 transition-all duration-300"
                  style={{ width: `${extractionProgress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Extracting information from your documents...</p>
          </div>
        ) : (
          <Button size="lg" onClick={startExtraction} disabled={!canProceed}>
            {canProceed ? 'Extract & Continue' : `Upload ${requiredCount - uploadedCount} more document${requiredCount - uploadedCount !== 1 ? 's' : ''}`}
          </Button>
        )}
      </div>
    </div>
  );
}

interface DocumentCardProps {
  docType: (typeof DOCUMENT_TYPES)[number];
  isUploaded: boolean;
  fileName?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function DocumentCard({ docType, isUploaded, fileName, onUpload, onRemove }: DocumentCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  return (
    <Card
      className={`p-4 transition-all ${
        isDragging ? 'border-accent-500 bg-accent-50' : isUploaded ? 'border-success bg-success-light' : ''
      }`}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{docType.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{docType.label}</h3>
              {!docType.required && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">Optional</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{docType.description}</p>

            {isUploaded ? (
              <div className="mt-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700 truncate">{fileName}</span>
                <button
                  onClick={onRemove}
                  className="ml-auto text-gray-400 hover:text-error transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="mt-3 flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-accent-500 hover:bg-accent-50 transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600">Click or drag to upload</span>
                <input
                  type="file"
                  className="hidden"
                  accept={docType.acceptedFormats.join(',')}
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
