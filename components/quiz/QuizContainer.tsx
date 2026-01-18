'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/context/QuizContext';
import { useResults } from '@/lib/context/ResultsContext';
import { EligibilityEngine } from '@/lib/rules/eligibilityEngine';
import { getProgramsByState } from '@/lib/rules/benefitRules';
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
    // Get state-specific programs
    const programs = getProgramsByState(state.data.geography.state);

    // Run eligibility engine
    const engine = new EligibilityEngine(programs);
    const results = engine.evaluateEligibility(state.data);

    // Store results
    setResults(results);

    // Navigate to results page
    router.push('/results');
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
        {renderStep()}

        <QuizNavigation
          currentStep={state.currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canGoBack={state.currentStep > 1}
          canGoForward={isStepValid}
          isLastStep={state.currentStep === TOTAL_STEPS}
        />
      </Card>
    </div>
  );
}
