'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/context/QuizContext';
import { useResults } from '@/lib/context/ResultsContext';
import { EligibilityEngine } from '@/lib/rules/eligibilityEngine';
import { getProgramsByState } from '@/lib/rules/benefitRules';
import { trackEvent } from '@/lib/utils/analytics';
import { StepIndicator } from './StepIndicator';
import { QuizNavigation } from './QuizNavigation';
import { GeographyStep } from './steps/GeographyStep';
import { DisabilityStep } from './steps/DisabilityStep';
import { FinancialStep } from './steps/FinancialStep';
import { DemographicStep } from './steps/DemographicStep';
import { ReviewStep } from './steps/ReviewStep';
import { Card } from '@/components/shared/Card';

const TOTAL_STEPS = 5;

export function QuizContainer() {
  const router = useRouter();
  const { state, updateStepData, markStepComplete, goToStep } = useQuiz();
  const { setResults } = useResults();
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const stepHeadingRef = useRef<HTMLDivElement>(null);

  // Track quiz start on mount
  useEffect(() => {
    trackEvent('quiz_start');
  }, []);

  // Focus step heading on step change
  useEffect(() => {
    trackEvent('quiz_step', { step: state.currentStep });
    if (stepHeadingRef.current) {
      stepHeadingRef.current.focus();
    }
  }, [state.currentStep]);

  const handleNext = () => {
    markStepComplete(state.currentStep);
    if (state.currentStep < TOTAL_STEPS) {
      goToStep(state.currentStep + 1);
    }
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      goToStep(state.currentStep - 1);
    }
  };

  const handleSubmit = () => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      const programs = getProgramsByState(state.data.geography.state);
      const engine = new EligibilityEngine(programs);
      const results = engine.evaluateEligibility(state.data);

      setResults(results);
      trackEvent('quiz_complete');
      router.push('/results');
    } catch (err) {
      setSubmitError('Something went wrong calculating your results. Please try again.');
      console.error('Eligibility engine error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <GeographyStep
            data={state.data.geography}
            onChange={(data) => updateStepData('geography', data)}
            onValidate={setIsStepValid}
          />
        );
      case 2:
        return (
          <DisabilityStep
            data={state.data.disability}
            onChange={(data) => updateStepData('disability', data)}
            onValidate={setIsStepValid}
          />
        );
      case 3:
        return (
          <FinancialStep
            data={state.data.financial}
            onChange={(data) => updateStepData('financial', data)}
            onValidate={setIsStepValid}
          />
        );
      case 4:
        return (
          <DemographicStep
            data={state.data.demographic}
            onChange={(data) => updateStepData('demographic', data)}
            onValidate={setIsStepValid}
          />
        );
      case 5:
        return <ReviewStep data={state.data} onValidate={setIsStepValid} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator
        currentStep={state.currentStep}
        totalSteps={TOTAL_STEPS}
        completedSteps={state.completedSteps}
      />

      <Card className="p-8">
        <div ref={stepHeadingRef} tabIndex={-1} className="outline-none">
          {renderStep()}
        </div>

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
            {submitError}
          </div>
        )}

        <QuizNavigation
          currentStep={state.currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canGoBack={state.currentStep > 1}
          canGoForward={isStepValid}
          isLastStep={state.currentStep === TOTAL_STEPS}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
