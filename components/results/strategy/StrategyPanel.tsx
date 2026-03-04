'use client';

import { useMemo } from 'react';
import { EligibilityResult } from '@/types/benefit';
import { computeStrategy } from '@/lib/utils/strategy';
import { formatCurrency, formatEffortLevel } from '@/lib/utils/format';
import { getEffortStyles } from '@/lib/utils/styles';
import { TierGroup } from './TierGroup';
import { DocumentChecklist } from './DocumentChecklist';
import { DocumentMatrix } from './DocumentMatrix';

interface StrategyPanelProps {
  results: EligibilityResult[];
}

export function StrategyPanel({ results }: StrategyPanelProps) {
  const strategy = useMemo(() => computeStrategy(results), [results]);

  if (strategy.isEmpty) return null;

  // All unlikely — show improvement hints
  if (strategy.allUnlikely) {
    const topThree = [...results]
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
    const tips = topThree
      .flatMap(r => r.reasoning?.improveOdds || [])
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 5);

    if (tips.length === 0) return null;

    return (
      <section className="mt-10 mb-10">
        <div className="bg-warning-light border border-gray-200 rounded-xl p-6 shadow-subtle">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Improve Your Eligibility
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            No programs are a strong match yet — but there are ways to improve your chances:
          </p>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/10 text-warning text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Single eligible program — simplified card
  const singleProgram = strategy.tiers.length === 1 && strategy.tiers[0].programs.length === 1;

  // All programs across all tiers (for matrix)
  const allPrograms = strategy.tiers.flatMap(t => t.programs);

  // Determine core label
  const coreLabel = strategy.coreDocuments.length > 0
    ? `These documents are shared across your top programs. Preparing them together may reduce your overall effort.`
    : '';

  // Additional docs: union of incremental docs from medium + low tiers
  const additionalDocsMap = new Map<string, typeof strategy.fullChecklist[0]>();
  for (const tier of strategy.tiers) {
    if (tier.level === 'high') continue;
    for (const doc of tier.incrementalDocuments) {
      if (!additionalDocsMap.has(doc.documentType)) {
        additionalDocsMap.set(doc.documentType, doc);
      }
    }
  }
  const additionalDocuments = Array.from(additionalDocsMap.values());

  const rec = strategy.recommendedFirst;
  const recEffort = rec ? getEffortStyles(rec.effortLevel) : null;

  return (
    <section className="mt-10 mb-10 space-y-6" aria-label="Application Strategy Optimizer">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Application Strategy
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Prioritized plan to maximize your benefits with minimum effort.
        </p>
      </div>

      {/* Stats row — stacks on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center">
          <p className="text-lg font-semibold text-gray-900 tabular-nums">
            {strategy.totalEligibleValue > 0 ? formatCurrency(strategy.totalEligibleValue) : 'Varies'}
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wide">Est. Monthly Value</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center">
          <p className="text-lg font-semibold text-gray-900 tabular-nums">
            {strategy.totalDocumentsNeeded}
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wide">Documents Needed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center col-span-2 sm:col-span-1">
          <p className="text-lg font-semibold text-gray-900 tabular-nums">
            {strategy.tiers.reduce((sum, t) => sum + t.programs.length, 0)}
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wide">Programs Eligible</p>
        </div>
      </div>

      {/* Start Here — prominent, high visual weight */}
      {rec && !singleProgram && (
        <div className="bg-accent-50 border-2 border-accent-300 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-accent-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Start Here
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-lg">{rec.result.program.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-accent-600 tabular-nums font-medium">{rec.result.probability}% match</span>
                {rec.result.estimatedMonthlyBenefit > 0 && (
                  <span className="text-sm text-gray-500 tabular-nums">{formatCurrency(rec.result.estimatedMonthlyBenefit)}/mo</span>
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${recEffort!.bgColor} ${recEffort!.textColor}`}>
                  {formatEffortLevel(rec.effortLevel)}
                </span>
              </div>
            </div>
            {rec.result.program.applicationUrl && (
              <a
                href={rec.result.program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-5 py-2.5 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      )}

      {/* Single program simplified */}
      {singleProgram && rec && (
        <div className="bg-accent-50 border-2 border-accent-300 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-accent-700 mb-2">Your Best Match</h3>
          <p className="font-semibold text-gray-900 text-lg mb-1">{rec.result.program.name}</p>
          <p className="text-sm text-gray-600 mb-3">{rec.result.program.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-accent-600 font-medium">{rec.result.probability}% match</span>
            {rec.result.estimatedMonthlyBenefit > 0 && (
              <span className="text-sm text-gray-500">{formatCurrency(rec.result.estimatedMonthlyBenefit)}/mo</span>
            )}
            {rec.result.program.applicationUrl && (
              <a
                href={rec.result.program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      )}

      {/* Document Checklist */}
      {strategy.fullChecklist.length > 0 && (
        <DocumentChecklist
          coreDocuments={strategy.coreDocuments}
          additionalDocuments={additionalDocuments}
          coreLabel={coreLabel || 'Documents for your top programs.'}
        />
      )}

      {strategy.fullChecklist.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-subtle text-center">
          <p className="text-sm text-gray-600">Most programs don&apos;t require documentation upfront.</p>
        </div>
      )}

      {/* Document Matrix (Advanced View — collapsed by default) */}
      {strategy.fullChecklist.length > 0 && allPrograms.length > 1 && (
        <DocumentMatrix
          documents={strategy.fullChecklist}
          programs={allPrograms}
        />
      )}

      {/* Tier Groups */}
      {!singleProgram && (
        <div className="space-y-4">
          {strategy.tiers.map(tier => (
            <TierGroup
              key={tier.level}
              tier={tier}
              coreDocuments={strategy.coreDocuments.map(d => d.documentType)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
