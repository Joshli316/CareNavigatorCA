import { Button } from '@/components/shared/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
}

export function QuizNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  canGoBack,
  canGoForward,
  isLastStep,
}: QuizNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
      <div>
        {canGoBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        )}
      </div>

      <div className="text-body-sm text-neutral-600">
        Step {currentStep} of {totalSteps}
      </div>

      <div>
        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!canGoForward}
            className="inline-flex items-center space-x-2"
          >
            <span>See My Results</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoForward}
            className="inline-flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
