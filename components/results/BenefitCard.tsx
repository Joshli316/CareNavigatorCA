'use client';

import { useState } from 'react';
import { EligibilityResult } from '@/types/benefit';
import { QuizData } from '@/types/quiz';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { EligibilityMeter } from './EligibilityMeter';
import { PrefillButton } from './PrefillButton';
import { ApplicationChecklist } from './ApplicationChecklist';
import {
  DollarSign,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  AlertCircle,
} from 'lucide-react';

interface BenefitCardProps {
  result: EligibilityResult;
  quizData: QuizData;
}

export function BenefitCard({ result, quizData }: BenefitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (value: number) => {
    if (value === 0) return 'Varies';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeline = (weeks: number) => {
    if (weeks < 4) return `${weeks} weeks`;
    const months = Math.round(weeks / 4);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  };

  const getCategoryColor = () => {
    switch (result.program.category) {
      case 'income':
        return 'bg-primary-100 text-primary-700';
      case 'healthcare':
        return 'bg-secondary-100 text-secondary-700';
      case 'housing':
        return 'bg-purple-100 text-purple-700';
      case 'food':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <Card hoverable className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-heading-sm text-neutral-900">{result.program.name}</h3>
              <span className={`px-3 py-1 text-body-sm rounded-full ${getCategoryColor()}`}>
                {result.program.category}
              </span>
            </div>
            <p className="text-body text-neutral-600">{result.program.description}</p>
          </div>
        </div>

        {/* Eligibility Meter */}
        <EligibilityMeter probability={result.probability} />

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-neutral-500 mt-0.5" />
            <div>
              <p className="text-body-sm text-neutral-600">Estimated Value</p>
              <p className="text-body font-semibold text-neutral-900">
                {formatCurrency(result.estimatedMonthlyBenefit)}/mo
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-neutral-500 mt-0.5" />
            <div>
              <p className="text-body-sm text-neutral-600">Processing Time</p>
              <p className="text-body font-semibold text-neutral-900">
                {formatTimeline(result.timelineWeeks)}
              </p>
            </div>
          </div>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-body text-primary-500 hover:text-primary-600 transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            {/* Reasoning Section */}
            {result.reasoning && (
              <div className="space-y-4">
                {/* Why Eligible */}
                {result.reasoning.whyEligible.length > 0 && (
                  <div className="bg-success/10 border border-success/30 rounded-card p-4">
                    <h4 className="text-body font-semibold text-success mb-2">
                      ✓ What's Working in Your Favor
                    </h4>
                    <ul className="space-y-1 text-body-sm text-neutral-700">
                      {result.reasoning.whyEligible.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Why Ineligible */}
                {result.reasoning.whyIneligible.length > 0 && (
                  <div className="bg-warning/10 border border-warning/30 rounded-card p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-body font-semibold text-warning mb-2">
                          ✗ What's Blocking Eligibility
                        </h4>
                        <ul className="space-y-1 text-body-sm text-neutral-700">
                          {result.reasoning.whyIneligible.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Improve Odds */}
                {result.reasoning.improveOdds.length > 0 && (
                  <div className="bg-secondary-50 border border-secondary-200 rounded-card p-4">
                    <h4 className="text-body font-semibold text-secondary-700 mb-2">
                      💡 How to Improve Your Chances
                    </h4>
                    <ul className="space-y-1 text-body-sm text-neutral-700">
                      {result.reasoning.improveOdds.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Failed Rules */}
            {result.failedRules.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-card p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-body font-semibold text-neutral-900 mb-2">
                      Eligibility Notes
                    </h4>
                    <ul className="space-y-1 text-body-sm text-neutral-700">
                      {result.failedRules.map((rule, index) => (
                        <li key={index}>
                          • {rule.message}
                          {rule.gap && <span className="text-warning"> ({rule.gap})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Required Documents */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-neutral-500" />
                <h4 className="text-body font-semibold text-neutral-900">
                  Required Documents ({result.program.requiredDocuments.length})
                </h4>
              </div>
              <ul className="space-y-1 text-body-sm text-neutral-700 ml-7">
                {result.program.requiredDocuments.map((doc, index) => (
                  <li key={index}>• {doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div>
              <h4 className="text-body font-semibold text-neutral-900 mb-2">Next Steps</h4>
              <ul className="space-y-1 text-body-sm text-neutral-700">
                {result.nextSteps.map((step, index) => (
                  <li key={index}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              {result.program.applicationUrl && result.program.applicationUrl !== '#' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(result.program.applicationUrl, '_blank')}
                  className="inline-flex items-center space-x-2"
                >
                  <span>Apply Online</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}

              {result.program.helplinePhone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${result.program.helplinePhone}`)}
                  className="inline-flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{result.program.helplinePhone}</span>
                </Button>
              )}
            </div>

            {/* Pre-fill Application Button */}
            <PrefillButton result={result} quizData={quizData} />

            {/* Application Checklist */}
            {result.isEligible && <ApplicationChecklist program={result.program} />}
          </div>
        )}
      </div>
    </Card>
  );
}
