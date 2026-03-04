'use client';

import { useState } from 'react';
import { ProgramTier, RankedProgram, DocumentOverlapEntry } from '@/lib/utils/strategy';
import { formatCurrency } from '@/lib/utils/format';
import { formatEffortLevel } from '@/lib/utils/format';
import { getTierStyles, getEffortStyles } from '@/lib/utils/styles';
import { DocumentType } from '@/types/document';

interface TierGroupProps {
  tier: ProgramTier;
  coreDocuments: DocumentType[];
}

const INITIAL_SHOW = 5;

export function TierGroup({ tier, coreDocuments }: TierGroupProps) {
  const styles = getTierStyles(tier.level);
  const defaultExpanded = tier.level !== 'low';
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  const displayPrograms = showAll ? tier.programs : tier.programs.slice(0, INITIAL_SHOW);
  const hasMore = tier.programs.length > INITIAL_SHOW;

  const tierMessage = tier.level === 'high'
    ? coreDocuments.length > 0
      ? `These programs share ${coreDocuments.length} required document${coreDocuments.length !== 1 ? 's' : ''} — preparing them together saves effort.`
      : 'These are your strongest matches based on eligibility.'
    : tier.level === 'medium'
      ? tier.incrementalDocuments.length > 0
        ? `${tier.incrementalDocuments.length} additional document${tier.incrementalDocuments.length !== 1 ? 's' : ''} beyond your core packet.`
        : 'No additional documents needed beyond your core packet.'
      : 'Lower probability — worth exploring if you have time.';

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${styles.bgColor}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
        aria-expanded={expanded}
        aria-controls={`tier-${tier.level}`}
      >
        <div className={`w-1 h-8 rounded-full ${styles.borderColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm">{tier.label}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              {tier.programs.length} program{tier.programs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {tier.totalMonthlyValue > 0 && (
              <span className="font-medium text-gray-700">{formatCurrency(tier.totalMonthlyValue)}/mo</span>
            )}
            {tier.totalMonthlyValue > 0 && tier.variesCount > 0 && ' + '}
            {tier.variesCount > 0 && (
              <span>{tier.variesCount} program{tier.variesCount !== 1 ? 's' : ''} with variable benefits</span>
            )}
            {tier.totalMonthlyValue === 0 && tier.variesCount === 0 && 'Benefits vary by program'}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {expanded && (
        <div id={`tier-${tier.level}`} className="px-4 pb-4" role="region" aria-label={`${tier.label} programs`}>
          <p className="text-xs text-gray-500 mb-3 pl-4">{tierMessage}</p>
          <div className="space-y-2">
            {displayPrograms.map(program => (
              <ProgramRow key={program.result.programId} program={program} />
            ))}
          </div>
          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 text-xs text-accent-600 hover:text-accent-700 font-medium pl-4"
            >
              Show all {tier.programs.length} programs
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ProgramRow({ program }: { program: RankedProgram }) {
  const effort = getEffortStyles(program.effortLevel);
  const r = program.result;
  const hasNoDocs = r.program.requiredDocuments.length === 0;

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-white rounded-lg border border-gray-100">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold flex items-center justify-center">
        {program.rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-sm truncate">{r.program.name}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500 tabular-nums">{r.probability}% match</span>
          {typeof r.estimatedMonthlyBenefit === 'number' && r.estimatedMonthlyBenefit > 0 && (
            <span className="text-xs text-gray-400 tabular-nums">{formatCurrency(r.estimatedMonthlyBenefit)}/mo</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {hasNoDocs ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 font-medium">
            No docs needed
          </span>
        ) : (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${effort.bgColor} ${effort.textColor}`}>
            {formatEffortLevel(program.effortLevel)}
          </span>
        )}
        {r.program.applicationUrl && (
          <a
            href={r.program.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-600 hover:text-accent-700 font-medium"
          >
            Apply
          </a>
        )}
      </div>
    </div>
  );
}
