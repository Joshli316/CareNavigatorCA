'use client';

import { useGrant } from '@/lib/context/GrantContext';
import { DocumentUpload } from '@/components/grants/DocumentUpload';
import { ProfileReview } from '@/components/grants/ProfileReview';
import { GrantResults } from '@/components/grants/GrantResults';
import { Container } from '@/components/layout/Container';

export default function GrantsPage() {
  const { currentStep } = useGrant();

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator step={1} label="Upload" active={currentStep === 'upload'} complete={currentStep !== 'upload'} />
            <div className="w-12 h-0.5 bg-gray-200" />
            <StepIndicator step={2} label="Review" active={currentStep === 'review'} complete={currentStep === 'results'} />
            <div className="w-12 h-0.5 bg-gray-200" />
            <StepIndicator step={3} label="Results" active={currentStep === 'results'} complete={false} />
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && <DocumentUpload />}
        {currentStep === 'review' && <ProfileReview />}
        {currentStep === 'results' && <GrantResults />}
      </div>
    </Container>
  );
}

function StepIndicator({
  step,
  label,
  active,
  complete,
}: {
  step: number;
  label: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
          active
            ? 'bg-accent-600 text-white'
            : complete
            ? 'bg-success text-white'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {complete ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          step
        )}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-accent-600' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
