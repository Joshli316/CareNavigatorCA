'use client';

import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { BenefitProgram } from '@/types/benefit';

interface ApplicationChecklistProps {
  program: BenefitProgram;
}

export function ApplicationChecklist({ program }: ApplicationChecklistProps) {
  const getApplicationSteps = (programId: string) => {
    // Generic steps that apply to most programs
    const genericSteps = [
      'Gather required documents (ID, proof of income, proof of assets)',
      'Complete application form online or in-person',
      'Submit application with all supporting documents',
      'Attend any required interviews or assessments',
      'Check application status regularly',
      'Respond promptly to any requests for additional information',
    ];

    // Program-specific steps
    const programSpecificSteps: Record<string, string[]> = {
      'ssi-2026': [
        'Schedule appointment with Social Security Administration',
        'Gather medical records documenting your disability',
        'Prepare proof of income (last 2 months of pay stubs or benefits statements)',
        'Bring bank statements showing assets under $2,000',
        'Complete form SSA-16 (Application for SSI)',
        'Attend disability determination interview',
        'Complete additional medical forms if requested',
        'Wait 3-5 months for initial decision',
      ],
      'ssdi-2026': [
        'Create or log into your my Social Security account',
        'Gather work history for the past 15 years',
        'Collect medical records from all treating physicians',
        'Document how your condition prevents you from working',
        'Complete form SSA-16 (Application for SSDI)',
        'Submit online at ssa.gov/benefits/disability',
        'Attend consultative exam if scheduled',
        'Appeal if initially denied (most cases require appeal)',
      ],
      'snap-2026': [
        'Apply online at your state SNAP portal or local office',
        'Provide proof of identity and residence',
        'Submit income documentation for all household members',
        'Provide proof of expenses (rent, utilities)',
        'Complete interview (phone or in-person)',
        'Receive EBT card within 30 days if approved',
      ],
    };

    return programSpecificSteps[programId] || genericSteps;
  };

  const steps = getApplicationSteps(program.id);

  return (
    <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
      <h4 className="text-body font-semibold text-neutral-900 mb-3 flex items-center">
        <CheckCircle2 className="w-5 h-5 text-primary-500 mr-2" />
        Application Checklist
      </h4>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Circle className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
            <span className="text-body-sm text-neutral-700">{step}</span>
          </div>
        ))}
      </div>

      {program.applicationUrl && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <a
            href={program.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <span>Start Application</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      <div className="mt-4 p-3 bg-primary-50 rounded border-l-4 border-primary-500">
        <p className="text-body-sm text-neutral-700">
          <span className="font-semibold">Tip:</span> Gather all required documents before starting your application to avoid delays. Processing typically takes {program.processingTimeWeeks} weeks.
        </p>
      </div>
    </div>
  );
}
