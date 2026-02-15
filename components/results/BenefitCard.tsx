'use client';

import React, { createContext, useContext } from 'react';
import { EligibilityResult } from '@/types/benefit';
import { QuizData } from '@/types/quiz';
import { Card } from '@/components/shared/Card';
import { Expandable } from '@/components/shared/Expandable';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatTimeline } from '@/lib/utils/format';
import {
  BenefitReasoning,
  BenefitFailedRules,
  BenefitDocuments,
  BenefitNextSteps,
  BenefitActions,
} from './benefit-card';
import { PrefillButton } from './PrefillButton';
import { ApplicationChecklist } from './ApplicationChecklist';
import { TrackerBadge } from './TrackerBadge';

interface BenefitCardContextValue {
  result: EligibilityResult;
  quizData: QuizData;
}

const BenefitCardContext = createContext<BenefitCardContextValue | null>(null);

function useBenefitCard() {
  const context = useContext(BenefitCardContext);
  if (!context) {
    throw new Error('BenefitCard compound components must be used within BenefitCard.Root');
  }
  return context;
}

interface RootProps {
  result: EligibilityResult;
  quizData: QuizData;
  children: React.ReactNode;
  className?: string;
}

function Root({ result, quizData, children, className }: RootProps) {
  return (
    <BenefitCardContext.Provider value={{ result, quizData }}>
      <Card hoverable className={cn('p-0 h-full overflow-hidden', className)}>
        <div className="flex flex-col h-full">
          {children}
        </div>
      </Card>
    </BenefitCardContext.Provider>
  );
}

interface HeaderProps {
  className?: string;
}

function Header({ className }: HeaderProps) {
  const { result } = useBenefitCard();
  const { program } = result;

  return (
    <div className={cn('p-5 pb-4', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-gray-900 leading-snug flex-1">{program.name}</h3>
        <TrackerBadge programId={result.programId} />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="px-2 py-0.5 text-xs font-medium text-accent-700 bg-accent-50 rounded">
          {program.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{program.description}</p>
    </div>
  );
}

interface MeterProps {
  className?: string;
}

function Meter({ className }: MeterProps) {
  const { result } = useBenefitCard();
  const { probability } = result;

  const getBarColor = (prob: number) => {
    if (prob >= 70) return 'bg-success';
    if (prob >= 40) return 'bg-warning';
    return 'bg-gray-300';
  };

  const getTextColor = (prob: number) => {
    if (prob >= 70) return 'text-success';
    if (prob >= 40) return 'text-warning';
    return 'text-gray-400';
  };

  return (
    <div className={cn('px-5 pb-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">Match Score</span>
        <span className={cn('text-sm font-semibold tabular-nums', getTextColor(probability))}>
          {probability}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={probability}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', getBarColor(probability))}
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>
  );
}

interface KeyInfoProps {
  className?: string;
}

function KeyInfo({ className }: KeyInfoProps) {
  const { result } = useBenefitCard();
  const { estimatedMonthlyBenefit, timelineWeeks } = result;

  return (
    <div className={cn('px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-4 bg-gray-50/50', className)}>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Est. Value</p>
        <p className="text-sm font-semibold text-gray-900 tabular-nums">
          {formatCurrency(estimatedMonthlyBenefit)}
          <span className="text-gray-400 font-normal">/mo</span>
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Timeline</p>
        <p className="text-sm font-semibold text-gray-900">{formatTimeline(timelineWeeks)}</p>
      </div>
    </div>
  );
}

function Spacer() {
  return <div className="flex-grow" />;
}

interface DetailsProps {
  children: React.ReactNode;
  className?: string;
}

function Details({ children, className }: DetailsProps) {
  return (
    <div className={cn('px-5 py-4 border-t border-gray-100 space-y-4 bg-gray-50', className)}>
      {children}
    </div>
  );
}

interface ExpandableDetailsProps {
  className?: string;
}

function ExpandableDetails({ className }: ExpandableDetailsProps) {
  const { result, quizData } = useBenefitCard();

  return (
    <div className="border-t border-gray-100">
      <Expandable expandText="View details" collapseText="Hide details">
        <Details className={className}>
          <BenefitReasoning reasoning={result.reasoning} />
          <BenefitFailedRules failedRules={result.failedRules} />
          <BenefitDocuments documents={result.program.requiredDocuments} />
          <BenefitNextSteps steps={result.nextSteps} />
          <BenefitActions
            applicationUrl={result.program.applicationUrl}
            helplinePhone={result.program.helplinePhone}
          />
          <PrefillButton result={result} quizData={quizData} />
          {result.isEligible && <ApplicationChecklist program={result.program} />}
        </Details>
      </Expandable>
    </div>
  );
}

export const BenefitCard = {
  Root,
  Header,
  Meter,
  KeyInfo,
  Spacer,
  Details,
  ExpandableDetails,
  useContext: useBenefitCard,
};

export type { BenefitCardContextValue, RootProps };
