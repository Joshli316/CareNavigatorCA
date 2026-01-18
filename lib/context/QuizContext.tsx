'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  QuizState,
  QuizData,
  QuizAction,
  GeographyData,
  DisabilityData,
  FinancialData,
  DemographicData,
  DisabilityType,
  IncomeType,
  AssistanceLevel,
} from '@/types/quiz';

// Initial state
const initialQuizData: QuizData = {
  geography: {
    state: '',
    county: '',
    zipCode: '',
    residencyMonths: 0,
  },
  disability: {
    hasDisability: false,
    disabilityType: [],
    receivingSSI: false,
    receivingSSDI: false,
    hasSSADetermination: false,
  },
  financial: {
    monthlyIncome: 0,
    incomeType: [],
    countableAssets: 0,
    ownsCar: false,
    carValue: 0,
    ownsHome: false,
    homeValue: 0,
  },
  demographic: {
    age: 0,
    householdSize: 1,
    hasChildren: false,
    childrenAges: [],
    isVeteran: false,
    needsAssistance: AssistanceLevel.NONE,
  },
};

const initialState: QuizState = {
  currentStep: 1,
  completedSteps: [],
  data: initialQuizData,
  validationErrors: {},
  submittedAt: null,
};

// Reducer
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'UPDATE_DATA':
      const newData = {
        ...state.data,
        [action.payload.step]: action.payload.data,
      };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('careNavigator_quizData', JSON.stringify(newData));
      }
      return { ...state, data: newData };

    case 'MARK_COMPLETE':
      const completedSteps = [...state.completedSteps];
      if (!completedSteps.includes(action.payload)) {
        completedSteps.push(action.payload);
      }
      return { ...state, completedSteps };

    case 'SET_ERRORS':
      return { ...state, validationErrors: action.payload };

    case 'RESET':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('careNavigator_quizData');
      }
      return initialState;

    default:
      return state;
  }
}

// Context
interface QuizContextValue {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  goToStep: (step: number) => void;
  updateStepData: (step: keyof QuizData, data: any) => void;
  markStepComplete: (step: number) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

// Provider
export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('careNavigator_quizData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'UPDATE_DATA', payload: { step: 'geography', data: data.geography } });
        dispatch({ type: 'UPDATE_DATA', payload: { step: 'disability', data: data.disability } });
        dispatch({ type: 'UPDATE_DATA', payload: { step: 'financial', data: data.financial } });
        dispatch({ type: 'UPDATE_DATA', payload: { step: 'demographic', data: data.demographic } });
      } catch (error) {
        console.error('Error loading quiz data:', error);
      }
    }
  }, []);

  const goToStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const updateStepData = (step: keyof QuizData, data: any) => {
    dispatch({ type: 'UPDATE_DATA', payload: { step, data } });
  };

  const markStepComplete = (step: number) => {
    dispatch({ type: 'MARK_COMPLETE', payload: step });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        goToStep,
        updateStepData,
        markStepComplete,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// Hook
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}
