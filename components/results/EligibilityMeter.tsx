interface EligibilityMeterProps {
  probability: number;
}

export function EligibilityMeter({ probability }: EligibilityMeterProps) {
  const getColor = () => {
    if (probability >= 70) return 'text-success';
    if (probability >= 40) return 'text-warning';
    return 'text-danger';
  };

  const getBackgroundColor = () => {
    if (probability >= 70) return 'bg-success';
    if (probability >= 40) return 'bg-warning';
    return 'bg-danger';
  };

  const getLabel = () => {
    if (probability >= 70) return 'Likely Eligible';
    if (probability >= 40) return 'May Qualify';
    return 'Unlikely';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-neutral-700">Eligibility</span>
        <span className={`text-heading-md font-bold ${getColor()}`}>
          {probability}%
        </span>
      </div>

      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBackgroundColor()} transition-all duration-500 ease-out`}
          style={{ width: `${probability}%` }}
        />
      </div>

      <p className={`text-body-sm font-medium ${getColor()}`}>
        {getLabel()}
      </p>
    </div>
  );
}
