interface BenefitNextStepsProps {
  steps: string[];
}

export function BenefitNextSteps({ steps }: BenefitNextStepsProps) {
  return (
    <div>
      <h4 className="text-body font-semibold text-neutral-900 mb-2">Next Steps</h4>
      <ul className="space-y-1 text-body-sm text-neutral-700">
        {steps.map((step, index) => (
          <li key={index}>
            {index + 1}. {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
