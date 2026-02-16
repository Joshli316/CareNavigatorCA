'use client';

import { useEffect } from 'react';
import { QuizData, AssistanceLevel } from '@/types/quiz';
import { Card } from '@/components/shared/Card';

interface ReviewStepProps {
  data: QuizData;
  onValidate: (isValid: boolean) => void;
}

export function ReviewStep({ data, onValidate }: ReviewStepProps) {
  useEffect(() => {
    // Always valid - this is just a review
    onValidate(true);
  }, [onValidate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatAssistanceLevel = (level: AssistanceLevel) => {
    const labels = {
      [AssistanceLevel.NONE]: 'No assistance needed',
      [AssistanceLevel.SOME]: 'Some assistance',
      [AssistanceLevel.EXTENSIVE]: 'Extensive assistance',
    };
    return labels[level];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-lg text-neutral-900 mb-2">Review Your Information</h2>
        <p className="text-body text-neutral-600">
          Please review your answers before we calculate your benefits. You can go back to edit any section.
        </p>
      </div>

      <Card>
        <h3 className="text-heading-sm text-neutral-900 mb-4">Location</h3>
        <div className="space-y-2 text-body text-neutral-700">
          <p><span className="font-medium">State:</span> {data.geography.state || 'Not specified'}</p>
          <p><span className="font-medium">County:</span> {data.geography.county || 'Not specified'}</p>
          <p><span className="font-medium">City:</span> {data.geography.city || 'Not specified'}</p>
          <p><span className="font-medium">ZIP Code:</span> {data.geography.zipCode || 'Not specified'}</p>
          <p><span className="font-medium">Months of residency:</span> {data.geography.residencyMonths}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-heading-sm text-neutral-900 mb-4">Disability Status</h3>
        <div className="space-y-2 text-body text-neutral-700">
          <p><span className="font-medium">Has disability:</span> {data.disability.hasDisability ? 'Yes' : 'No'}</p>
          {data.disability.hasDisability && (
            <p><span className="font-medium">Types:</span> {data.disability.disabilityType.join(', ') || 'Not specified'}</p>
          )}
          <p><span className="font-medium">Receiving SSI:</span> {data.disability.receivingSSI ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">Receiving SSDI:</span> {data.disability.receivingSSDI ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">SSA determination:</span> {data.disability.hasSSADetermination ? 'Yes' : 'No'}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-heading-sm text-neutral-900 mb-4">Financial Information</h3>
        <div className="space-y-2 text-body text-neutral-700">
          <p><span className="font-medium">Monthly income:</span> {formatCurrency(data.financial.monthlyIncome)}</p>
          <p><span className="font-medium">Countable assets:</span> {formatCurrency(data.financial.countableAssets)}</p>
          <p><span className="font-medium">Owns car:</span> {data.financial.ownsCar ? `Yes (${formatCurrency(data.financial.carValue)})` : 'No'}</p>
          <p><span className="font-medium">Owns home:</span> {data.financial.ownsHome ? `Yes (${formatCurrency(data.financial.homeValue)})` : 'No'}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-heading-sm text-neutral-900 mb-4">Household Information</h3>
        <div className="space-y-2 text-body text-neutral-700">
          <p><span className="font-medium">Age:</span> {data.demographic.age}</p>
          <p><span className="font-medium">Household size:</span> {data.demographic.householdSize}</p>
          <p><span className="font-medium">Has children:</span> {data.demographic.hasChildren ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">Veteran:</span> {data.demographic.isVeteran ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">Assistance level:</span> {formatAssistanceLevel(data.demographic.needsAssistance)}</p>
        </div>
      </Card>

      <div className="bg-primary-50 border border-primary-200 rounded-card p-6">
        <p className="text-body text-neutral-700">
          <span className="font-medium">Ready to see your results?</span> Click "See My Results" to discover which benefits you may qualify for and their estimated values.
        </p>
      </div>
    </div>
  );
}
