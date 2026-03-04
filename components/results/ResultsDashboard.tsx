'use client';

import { useMemo, useEffect } from 'react';
import { useResults } from '@/lib/context/ResultsContext';
import { useQuiz } from '@/lib/context/QuizContext';
import { trackEvent } from '@/lib/utils/analytics';
import { BenefitCategory } from '@/types/benefit';
import { BenefitCard } from './BenefitCard';
import { FilterBar } from './FilterBar';
import { ExportResults } from './ExportResults';
import { StrategyPanel } from './strategy/StrategyPanel';
import { EligibilityFilter } from '@/lib/context/ResultsContext';
import { formatCurrency } from '@/lib/utils/format';
import { useTracker, STATUS_CONFIG } from '@/lib/context/TrackerContext';

export function ResultsDashboard() {
  const { results, filteredResults, selectedCategory, setSelectedCategory, eligibilityFilter, setEligibilityFilter } = useResults();
  const { state: quizState } = useQuiz();
  const { counts: trackerCounts } = useTracker();

  useEffect(() => {
    if (results.length > 0) {
      trackEvent('results_view');
    }
  }, [results.length]);

  if (results.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-50 mb-6">
          <svg className="w-8 h-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">No results yet</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Complete the assessment to discover programs you may qualify for.
        </p>
      </div>
    );
  }

  const categoryCounts = useMemo(() => {
    return results.reduce((counts, result) => {
      counts['all'] = (counts['all'] || 0) + 1;
      counts[result.program.category] = (counts[result.program.category] || 0) + 1;
      return counts;
    }, {} as Record<BenefitCategory | 'all', number>);
  }, [results]);

  const eligibilityCounts = useMemo(() => {
    return results.reduce((counts, result) => {
      counts['all'] = (counts['all'] || 0) + 1;
      if (result.probability >= 70) {
        counts['likely'] = (counts['likely'] || 0) + 1;
      } else if (result.probability >= 40) {
        counts['possible'] = (counts['possible'] || 0) + 1;
      } else {
        counts['unlikely'] = (counts['unlikely'] || 0) + 1;
      }
      return counts;
    }, {} as Record<EligibilityFilter, number>);
  }, [results]);

  const totalMonthlyBenefit = useMemo(() => {
    return results
      .filter(r => r.isEligible && typeof r.estimatedMonthlyBenefit === 'number')
      .reduce((sum, r) => sum + r.estimatedMonthlyBenefit, 0);
  }, [results]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">
          Your Results
        </h1>
        <p className="text-gray-500">
          We found {results.length} programs you may qualify for based on your responses.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-accent-50 rounded-xl p-6">
          <p className="text-sm text-accent-600 font-medium mb-1">Likely Eligible</p>
          <p className="text-3xl font-semibold text-accent-900 tabular-nums">
            {results.filter(r => r.isEligible).length}
            <span className="text-lg font-normal text-accent-600 ml-1">programs</span>
          </p>
        </div>
        <div className="bg-success-light rounded-xl p-6">
          <p className="text-sm text-success font-medium mb-1">Estimated Value</p>
          <p className="text-3xl font-semibold text-gray-900 tabular-nums">
            {formatCurrency(totalMonthlyBenefit)}
            <span className="text-lg font-normal text-gray-500 ml-1">/month</span>
          </p>
        </div>
        <div className="bg-warning-light rounded-xl p-6">
          <p className="text-sm text-warning font-medium mb-1">Avg. Processing</p>
          <p className="text-3xl font-semibold text-gray-900 tabular-nums">
            {Math.round(results.reduce((sum, r) => sum + r.timelineWeeks, 0) / results.length)}
            <span className="text-lg font-normal text-gray-500 ml-1">weeks</span>
          </p>
        </div>
      </div>

      {/* Application Tracker Summary */}
      {(trackerCounts.gathering_docs + trackerCounts.applied + trackerCounts.in_review + trackerCounts.approved + trackerCounts.denied) > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {(['gathering_docs', 'applied', 'in_review', 'approved', 'denied'] as const).map(status => {
            if (trackerCounts[status] === 0) return null;
            const c = STATUS_CONFIG[status];
            return (
              <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${c.bg} ${c.color}`}>
                <span className="font-semibold">{trackerCounts[status]}</span> {c.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        eligibilityFilter={eligibilityFilter}
        onSelectEligibility={setEligibilityFilter}
        categoryCounts={categoryCounts}
        eligibilityCounts={eligibilityCounts}
      />

      {/* Results Grid */}
      <section className="mt-6">
        {filteredResults.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 rounded-xl">
            <p className="text-gray-500">No programs match these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResults.map((result) => (
              <BenefitCard.Root key={result.programId} result={result} quizData={quizState.data}>
                <BenefitCard.Header />
                <BenefitCard.Meter />
                <BenefitCard.KeyInfo />
                <BenefitCard.Spacer />
                <BenefitCard.ExpandableDetails />
              </BenefitCard.Root>
            ))}
          </div>
        )}
      </section>

      {/* Application Strategy */}
      <StrategyPanel results={results} />

      {/* Export */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <ExportResults results={results} quizData={quizState.data} />
      </div>

      {/* Help Footer */}
      <footer className="mt-12 bg-accent-50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Need help applying?</h3>
            <p className="text-gray-600 text-sm mb-2">
              Call <span className="font-semibold text-accent-700">2-1-1</span> for free assistance with your applications.
            </p>
          </div>
        </div>
      </footer>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        These results are preliminary estimates based on the information you provided.
        Final eligibility will be determined by the administering agencies upon application review.
      </p>
    </div>
  );
}
