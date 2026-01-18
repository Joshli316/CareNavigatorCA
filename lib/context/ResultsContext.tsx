'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { EligibilityResult, BenefitCategory } from '@/types/benefit';

interface ResultsContextValue {
  results: EligibilityResult[];
  setResults: (results: EligibilityResult[]) => void;
  selectedCategory: BenefitCategory | 'all';
  setSelectedCategory: (category: BenefitCategory | 'all') => void;
  filteredResults: EligibilityResult[];
}

const ResultsContext = createContext<ResultsContextValue | undefined>(undefined);

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategory | 'all'>('all');

  // Memoize filteredResults to prevent unnecessary recalculations
  const filteredResults = useMemo(() => {
    return selectedCategory === 'all'
      ? results
      : results.filter(r => r.program.category === selectedCategory);
  }, [results, selectedCategory]);

  return (
    <ResultsContext.Provider
      value={{
        results,
        setResults,
        selectedCategory,
        setSelectedCategory,
        filteredResults,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within ResultsProvider');
  }
  return context;
}
