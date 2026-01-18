'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { EligibilityResult, BenefitCategory } from '@/types/benefit';

interface ResultsContextValue {
  results: EligibilityResult[];
  setResults: (results: EligibilityResult[]) => void;
  selectedCategory: BenefitCategory | 'all';
  setSelectedCategory: (category: BenefitCategory | 'all') => void;
  filteredResults: EligibilityResult[];
}

const ResultsContext = createContext<ResultsContextValue | undefined>(undefined);

const STORAGE_KEY = 'carenavigator_results';

export function ResultsProvider({ children }: { children: ReactNode }) {
  // Load from localStorage on mount
  const [results, setResultsState] = useState<EligibilityResult[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<BenefitCategory | 'all'>('all');

  // Save to localStorage whenever results change
  const setResults = (newResults: EligibilityResult[]) => {
    setResultsState(newResults);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResults));
    } catch (error) {
      console.warn('Failed to save results to localStorage:', error);
    }
  };

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
