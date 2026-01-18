import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export function StepIndicator({ currentStep, totalSteps, completedSteps }: StepIndicatorProps) {
  const progressPercentage = Math.round(((currentStep - 1) / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      {/* Progress Percentage */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-body-sm text-neutral-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-body-sm font-semibold text-primary-600">
          {progressPercentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-neutral-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      isCompleted
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : isCurrent
                        ? 'border-primary-500 text-primary-500 bg-white'
                        : 'border-neutral-300 text-neutral-400 bg-white'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-body font-semibold">{step}</span>
                  )}
                </div>
                <span className="text-body-sm text-neutral-600 mt-2 absolute top-12 whitespace-nowrap">
                  Step {step}
                </span>
              </div>

              {/* Connecting Line */}
              {step < totalSteps && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 transition-colors
                    ${isCompleted ? 'bg-primary-500' : 'bg-neutral-300'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
