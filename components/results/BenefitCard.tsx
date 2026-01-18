'use client';

import { EligibilityResult } from '@/types/benefit';
import { QuizData } from '@/types/quiz';
import { Card } from '@/components/shared/Card';
import { EligibilityMeter } from './EligibilityMeter';
import { PrefillButton } from './PrefillButton';
import { ApplicationChecklist } from './ApplicationChecklist';
import { Expandable } from '@/components/shared/Expandable';
import {
  BenefitCardHeader,
  BenefitKeyInfo,
  BenefitReasoning,
  BenefitFailedRules,
  BenefitDocuments,
  BenefitNextSteps,
  BenefitActions,
} from './benefit-card';

interface BenefitCardProps {
  result: EligibilityResult;
  quizData: QuizData;
}

export function BenefitCard({ result, quizData }: BenefitCardProps) {
  return (
    <Card hoverable className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <BenefitCardHeader program={result.program} />

        {/* Eligibility Meter */}
        <EligibilityMeter probability={result.probability} />

        {/* Key Info */}
        <BenefitKeyInfo
          estimatedMonthlyBenefit={result.estimatedMonthlyBenefit}
          timelineWeeks={result.timelineWeeks}
        />

        {/* Expandable Details */}
        <Expandable expandText="Show Details" collapseText="Hide Details">
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            {/* Reasoning Section */}
            <BenefitReasoning reasoning={result.reasoning} />

            {/* Failed Rules */}
            <BenefitFailedRules failedRules={result.failedRules} />

            {/* Required Documents */}
            <BenefitDocuments documents={result.program.requiredDocuments} />

            {/* Next Steps */}
            <BenefitNextSteps steps={result.nextSteps} />

            {/* Actions */}
            <BenefitActions
              applicationUrl={result.program.applicationUrl}
              helplinePhone={result.program.helplinePhone}
            />

            {/* Pre-fill Application Button */}
            <PrefillButton result={result} quizData={quizData} />

            {/* Application Checklist */}
            {result.isEligible && <ApplicationChecklist program={result.program} />}
          </div>
        </Expandable>
      </div>
    </Card>
  );
}
