import { formatCurrency, formatTimeline } from '@/lib/utils/format';
import { DollarSign, Clock } from 'lucide-react';

interface BenefitKeyInfoProps {
  estimatedMonthlyBenefit: number | string;
  timelineWeeks: number;
}

export function BenefitKeyInfo({ estimatedMonthlyBenefit, timelineWeeks }: BenefitKeyInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
      <div className="flex items-start space-x-3">
        <DollarSign className="w-5 h-5 text-neutral-500 mt-0.5" />
        <div>
          <p className="text-body-sm text-neutral-600">Estimated Value</p>
          <p className="text-body font-semibold text-neutral-900">
            {formatCurrency(estimatedMonthlyBenefit)}/mo
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Clock className="w-5 h-5 text-neutral-500 mt-0.5" />
        <div>
          <p className="text-body-sm text-neutral-600">Processing Time</p>
          <p className="text-body font-semibold text-neutral-900">
            {formatTimeline(timelineWeeks)}
          </p>
        </div>
      </div>
    </div>
  );
}
