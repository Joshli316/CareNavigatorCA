'use client';

import { useMemo } from 'react';
import { useResults } from '@/lib/context/ResultsContext';
import { useQuiz } from '@/lib/context/QuizContext';
import { BenefitCategory } from '@/types/benefit';
import { BenefitCard } from './BenefitCard';
import { CategoryTabs } from './CategoryTabs';
import { ExportResults } from './ExportResults';
import { Sparkles } from 'lucide-react';

export function ResultsDashboard() {
  const { results, filteredResults, selectedCategory, setSelectedCategory } = useResults();
  const { state: quizState } = useQuiz();

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h2 className="text-heading-md text-neutral-900 mb-2">No Results Yet</h2>
        <p className="text-body text-neutral-600">
          Complete the quiz to see your personalized benefits roadmap.
        </p>
      </div>
    );
  }

  // Memoize category counts to prevent recalculation on every render
  const categoryCounts = useMemo(() => {
    return results.reduce((counts, result) => {
      counts['all'] = (counts['all'] || 0) + 1;
      counts[result.program.category] = (counts[result.program.category] || 0) + 1;
      return counts;
    }, {} as Record<BenefitCategory | 'all', number>);
  }, [results]);

  // Memoize total monthly benefit calculation
  const totalMonthlyBenefit = useMemo(() => {
    return results
      .filter(r => r.isEligible && typeof r.estimatedMonthlyBenefit === 'number')
      .reduce((sum, r) => sum + r.estimatedMonthlyBenefit, 0);
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-card p-8">
        <h2 className="text-heading-lg text-neutral-900 mb-2">Your Benefits Roadmap</h2>
        <p className="text-body text-neutral-700 mb-6">
          Based on your answers, we found <span className="font-semibold">{results.length} benefit programs</span> you may qualify for.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">Likely Eligible</p>
            <p className="text-heading-md font-bold text-success">
              {results.filter(r => r.isEligible).length} programs
            </p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">Potential Monthly Value</p>
            <p className="text-heading-md font-bold text-primary-700">
              {totalMonthlyBenefit > 0
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(totalMonthlyBenefit)
                : 'Varies'}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">Average Processing</p>
            <p className="text-heading-md font-bold text-secondary-700">
              {Math.round(
                results.reduce((sum, r) => sum + r.timelineWeeks, 0) / results.length
              )}{' '}
              weeks
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mt-6 pt-6 border-t border-primary-100">
          <ExportResults results={results} quizData={quizState.data} />
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-card">
          <p className="text-body text-neutral-600">
            No programs in this category match your profile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <BenefitCard key={result.programId} result={result} quizData={quizState.data} />
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6">
        <p className="text-body-sm text-neutral-700">
          <span className="font-semibold">Important:</span> These results are preliminary estimates based on the information you provided. Actual eligibility and benefit amounts will be determined by the administering agencies. We recommend contacting each program directly to confirm your eligibility and begin the application process.
        </p>
      </div>
    </div>
  );
}
