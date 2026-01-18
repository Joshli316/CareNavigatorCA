import { AlertCircle } from 'lucide-react';

interface FailedRule {
  message: string;
  gap?: string;
}

interface BenefitFailedRulesProps {
  failedRules: FailedRule[];
}

export function BenefitFailedRules({ failedRules }: BenefitFailedRulesProps) {
  if (failedRules.length === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-card p-4">
      <div className="flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
        <div className="flex-1">
          <h4 className="text-body font-semibold text-neutral-900 mb-2">
            Eligibility Notes
          </h4>
          <ul className="space-y-1 text-body-sm text-neutral-700">
            {failedRules.map((rule, index) => (
              <li key={index}>
                • {rule.message}
                {rule.gap && <span className="text-warning"> ({rule.gap})</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
