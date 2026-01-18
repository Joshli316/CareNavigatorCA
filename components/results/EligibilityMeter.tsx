import { getEligibilityStatus } from '@/lib/utils/styles';

interface EligibilityMeterProps {
  probability: number;
}

export function EligibilityMeter({ probability }: EligibilityMeterProps) {
  const status = getEligibilityStatus(probability);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-neutral-700">Eligibility</span>
        <span className={`text-heading-md font-bold ${status.color}`}>
          {probability}%
        </span>
      </div>

      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${status.backgroundColor} transition-all duration-500 ease-out`}
          style={{ width: `${probability}%` }}
        />
      </div>

      <p className={`text-body-sm font-medium ${status.color}`}>
        {status.label}
      </p>
    </div>
  );
}
