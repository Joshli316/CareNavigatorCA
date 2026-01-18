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

  // Get top 3 priority programs to apply to first
  const priorityPrograms = useMemo(() => {
    return results
      .filter(r => r.isEligible)
      .sort((a, b) => {
        // Sort by probability desc, then monthly benefit desc
        if (b.probability !== a.probability) return b.probability - a.probability;
        const aBenefit = typeof a.estimatedMonthlyBenefit === 'number' ? a.estimatedMonthlyBenefit : 0;
        const bBenefit = typeof b.estimatedMonthlyBenefit === 'number' ? b.estimatedMonthlyBenefit : 0;
        return bBenefit - aBenefit;
      })
      .slice(0, 3);
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Priority Programs Banner */}
      {priorityPrograms.length > 0 && (
        <div className="bg-success/10 border-2 border-success rounded-card p-6">
          <h3 className="text-heading-sm text-neutral-900 mb-3 font-bold">
            🎯 Start with these programs first:
          </h3>
          <ul className="space-y-2">
            {priorityPrograms.map((result, index) => (
              <li key={result.programId} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-success text-white rounded-full flex items-center justify-center text-body-sm font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-neutral-900">{result.program.name}</span>
                  <span className="text-body-sm text-neutral-600 ml-2">
                    ({result.probability}% match
                    {typeof result.estimatedMonthlyBenefit === 'number' &&
                      ` • ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(result.estimatedMonthlyBenefit)}/mo`
                    })
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {/* Need Help Section */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-card p-6 text-center">
        <h3 className="text-heading-sm text-neutral-900 mb-2 font-bold">
          Need help applying?
        </h3>
        <p className="text-body text-neutral-700 mb-3">
          Call <span className="font-bold text-primary-700">2-1-1</span> for free assistance with benefit applications
        </p>
        <p className="text-body-sm text-neutral-600">
          United Way's 2-1-1 connects you with local caseworkers who can guide you through the application process for free.
        </p>
      </div>

      {/* Footer Note */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6">
        <p className="text-body-sm text-neutral-700">
          <span className="font-semibold">Important:</span> These results are preliminary estimates based on the information you provided. Actual eligibility and benefit amounts will be determined by the administering agencies. We recommend contacting each program directly to confirm your eligibility and begin the application process.
        </p>
      </div>
    </div>
  );
}
