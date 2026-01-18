import { AlertCircle } from 'lucide-react';

interface ReasoningData {
  whyEligible: string[];
  whyIneligible: string[];
  improveOdds: string[];
}

interface BenefitReasoningProps {
  reasoning?: ReasoningData;
}

export function BenefitReasoning({ reasoning }: BenefitReasoningProps) {
  if (!reasoning) return null;

  return (
    <div className="space-y-4">
      {/* Why Eligible */}
      {reasoning.whyEligible.length > 0 && (
        <div className="bg-success/10 border border-success/30 rounded-card p-4">
          <h4 className="text-body font-semibold text-success mb-2">
            ✓ What's Working in Your Favor
          </h4>
          <ul className="space-y-1 text-body-sm text-neutral-700">
            {reasoning.whyEligible.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Why Ineligible */}
      {reasoning.whyIneligible.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-card p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-body font-semibold text-warning mb-2">
                ✗ What's Blocking Eligibility
              </h4>
              <ul className="space-y-1 text-body-sm text-neutral-700">
                {reasoning.whyIneligible.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Improve Odds */}
      {reasoning.improveOdds.length > 0 && (
        <div className="bg-secondary-50 border border-secondary-200 rounded-card p-4">
          <h4 className="text-body font-semibold text-secondary-700 mb-2">
            💡 How to Improve Your Chances
          </h4>
          <ul className="space-y-1 text-body-sm text-neutral-700">
            {reasoning.improveOdds.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
