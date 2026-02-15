'use client';

import { BenefitCategory } from '@/types/benefit';
import { EligibilityFilter } from '@/lib/context/ResultsContext';
import { cn } from '@/lib/utils/cn';

interface FilterBarProps {
  selectedCategory: BenefitCategory | 'all';
  onSelectCategory: (category: BenefitCategory | 'all') => void;
  eligibilityFilter: EligibilityFilter;
  onSelectEligibility: (filter: EligibilityFilter) => void;
  categoryCounts: Record<BenefitCategory | 'all', number>;
  eligibilityCounts: Record<EligibilityFilter, number>;
}

const categories: Array<{ value: BenefitCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: BenefitCategory.INCOME, label: 'Income' },
  { value: BenefitCategory.HEALTHCARE, label: 'Healthcare' },
  { value: BenefitCategory.HOUSING, label: 'Housing' },
  { value: BenefitCategory.FOOD, label: 'Food' },
];

const eligibilityOptions: Array<{ value: EligibilityFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'likely', label: 'Likely' },
  { value: 'possible', label: 'Possible' },
  { value: 'unlikely', label: 'Unlikely' },
];

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  eligibilityFilter,
  onSelectEligibility,
  categoryCounts,
  eligibilityCounts,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-4 bg-gray-50 rounded-xl">
      {/* Category */}
      <div role="group" aria-label="Filter by category" className="flex items-center gap-1 flex-wrap">
        <span className="text-xs font-medium text-gray-500 mr-2">Category</span>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.value;
          const count = categoryCounts[category.value] || 0;

          return (
            <button
              key={category.value}
              onClick={() => onSelectCategory(category.value)}
              aria-pressed={isSelected}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-all',
                isSelected
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              )}
            >
              {category.label}
              {count > 0 && (
                <span className={cn('ml-1.5 tabular-nums text-xs', isSelected ? 'text-accent-200' : 'text-gray-400')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden sm:block w-px h-6 bg-gray-200" />

      {/* Eligibility */}
      <div role="group" aria-label="Filter by eligibility" className="flex items-center gap-1 flex-wrap">
        <span className="text-xs font-medium text-gray-500 mr-2">Match</span>
        {eligibilityOptions.map((option) => {
          const isSelected = eligibilityFilter === option.value;
          const count = eligibilityCounts[option.value] || 0;

          return (
            <button
              key={option.value}
              onClick={() => onSelectEligibility(option.value)}
              aria-pressed={isSelected}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-all',
                isSelected
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              )}
            >
              {option.label}
              {count > 0 && (
                <span className={cn('ml-1.5 tabular-nums text-xs', isSelected ? 'text-accent-200' : 'text-gray-400')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
