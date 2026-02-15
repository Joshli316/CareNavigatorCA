import { formatCurrency, formatTimeline } from '@/lib/utils/format';

interface BenefitKeyInfoProps {
  estimatedMonthlyBenefit: number | string;
  timelineWeeks: number;
}

export function BenefitKeyInfo({ estimatedMonthlyBenefit, timelineWeeks }: BenefitKeyInfoProps) {
  return (
    <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Value</p>
        <p className="text-sm text-gray-900 tabular-nums">
          {formatCurrency(estimatedMonthlyBenefit)}
          <span className="text-gray-400">/mo</span>
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Timeline</p>
        <p className="text-sm text-gray-900">{formatTimeline(timelineWeeks)}</p>
      </div>
    </div>
  );
}
