'use client';

import { useState } from 'react';
import { DocumentOverlapEntry } from '@/lib/utils/strategy';

interface DocumentChecklistProps {
  coreDocuments: DocumentOverlapEntry[];
  additionalDocuments: DocumentOverlapEntry[];
  coreLabel: string;
}

export function DocumentChecklist({ coreDocuments, additionalDocuments, coreLabel }: DocumentChecklistProps) {
  if (coreDocuments.length === 0 && additionalDocuments.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-subtle" role="region" aria-label="Document checklist">
      <h3 className="font-semibold text-gray-900 text-sm mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Your Document Checklist
      </h3>

      {/* Core Packet */}
      {coreDocuments.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-3">
            {coreLabel}
          </p>
          <div className="space-y-2">
            {coreDocuments.map(doc => (
              <DocRow key={doc.documentType} doc={doc} variant="core" />
            ))}
          </div>
        </div>
      )}

      {/* Additional */}
      {additionalDocuments.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-3">
            Applying to additional programs would require these documents beyond your core packet.
          </p>
          <div className="space-y-2">
            {additionalDocuments.map(doc => (
              <DocRow key={doc.documentType} doc={doc} variant="additional" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocRow({ doc, variant }: { doc: DocumentOverlapEntry; variant: 'core' | 'additional' }) {
  const [showPrograms, setShowPrograms] = useState(false);

  return (
    <div className="py-2 px-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${variant === 'core' ? 'bg-accent-400' : 'bg-gray-300'}`} />
        <span className="font-medium text-gray-800 text-sm flex-1">{doc.displayName}</span>
        <button
          onClick={() => setShowPrograms(!showPrograms)}
          className="text-[10px] px-2 py-0.5 rounded-full bg-accent-50 text-accent-600 font-medium hover:bg-accent-100 transition-colors"
          aria-expanded={showPrograms}
          aria-label={`Show programs requiring ${doc.displayName}`}
        >
          {doc.programCount} program{doc.programCount !== 1 ? 's' : ''}
        </button>
      </div>
      {showPrograms && (
        <div className="mt-2 ml-5 flex flex-wrap gap-1">
          {doc.programNames.map(name => (
            <span key={name} className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-100 text-gray-500">
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
