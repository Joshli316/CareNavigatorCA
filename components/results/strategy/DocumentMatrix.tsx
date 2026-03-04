'use client';

import { useState } from 'react';
import { DocumentOverlapEntry, RankedProgram } from '@/lib/utils/strategy';
import { DocumentType } from '@/types/document';

interface DocumentMatrixProps {
  documents: DocumentOverlapEntry[];
  programs: RankedProgram[];
}

export function DocumentMatrix({ documents, programs }: DocumentMatrixProps) {
  const [expanded, setExpanded] = useState(false);

  if (documents.length === 0 || programs.length === 0) return null;

  // Cap visible programs in collapsed view
  const visiblePrograms = expanded ? programs : programs.slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-subtle overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
        aria-controls="document-matrix"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span className="font-semibold text-gray-900 text-sm flex-1">Document Overlap Matrix</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide mr-2">
          {expanded ? 'Collapse' : 'Expand'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div id="document-matrix" className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-xs" role="grid" aria-label="Document requirements by program">
            <thead>
              <tr>
                <th className="text-left py-2 pr-3 font-medium text-gray-500 sticky left-0 bg-white min-w-[140px]">
                  Document
                </th>
                {visiblePrograms.map(p => (
                  <th
                    key={p.result.programId}
                    className="text-center px-1.5 py-2 font-medium text-gray-700 max-w-[80px]"
                  >
                    <div className="truncate" title={p.result.program.name}>
                      {p.result.program.shortName || p.result.program.name.split(' ').slice(0, 2).join(' ')}
                    </div>
                    <div className="text-[10px] text-gray-400 font-normal tabular-nums">
                      {p.result.probability}%
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => {
                const docType = doc.documentType;
                return (
                  <tr key={docType} className="border-t border-gray-50">
                    <td className="py-2 pr-3 text-gray-700 font-medium sticky left-0 bg-white">
                      {doc.displayName}
                    </td>
                    {visiblePrograms.map(p => {
                      const required = p.result.program.requiredDocuments.includes(docType as DocumentType);
                      return (
                        <td key={p.result.programId} className="text-center px-1.5 py-2">
                          {required ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-accent-50" aria-label="Required">
                              <svg className="w-3 h-3 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5" aria-label="Not required">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!expanded && programs.length > 6 && (
            <p className="text-[10px] text-gray-400 mt-2">
              Showing 6 of {programs.length} programs. Expand to see all.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
