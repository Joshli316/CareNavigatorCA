interface EligibilityMeterProps {
  probability: number;
}

export function EligibilityMeter({ probability }: EligibilityMeterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Match</span>
        <span className="text-sm font-medium text-gray-900 tabular-nums">
          {probability}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={probability}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Eligibility match"
        className="w-full h-0.5 bg-gray-100 overflow-hidden"
      >
        <div
          className="h-full bg-gray-900 transition-all duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>
  );
}
