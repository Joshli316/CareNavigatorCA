import { BenefitCategory } from '@/types/benefit';

interface CategoryTabsProps {
  selectedCategory: BenefitCategory | 'all';
  onSelectCategory: (category: BenefitCategory | 'all') => void;
  categoryCounts: Record<BenefitCategory | 'all', number>;
}

const categories: Array<{ value: BenefitCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All Benefits' },
  { value: BenefitCategory.INCOME, label: 'Income' },
  { value: BenefitCategory.HEALTHCARE, label: 'Healthcare' },
  { value: BenefitCategory.HOUSING, label: 'Housing' },
  { value: BenefitCategory.FOOD, label: 'Food' },
];

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryTabsProps) {
  return (
    <div className="border-b border-neutral-200">
      <nav className="flex space-x-8" aria-label="Benefit categories">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.value;
          const count = categoryCounts[category.value] || 0;

          return (
            <button
              key={category.value}
              onClick={() => onSelectCategory(category.value)}
              className={`
                py-4 px-1 border-b-2 font-medium text-body transition-colors
                ${
                  isSelected
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }
              `}
              aria-current={isSelected ? 'page' : undefined}
            >
              {category.label}
              {count > 0 && (
                <span
                  className={`
                    ml-2 px-2 py-0.5 text-body-sm rounded-full
                    ${
                      isSelected
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
