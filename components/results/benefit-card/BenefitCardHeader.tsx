import { BenefitProgram } from '@/types/benefit';
import { getCategoryColor } from '@/lib/utils/styles';

interface BenefitCardHeaderProps {
  program: BenefitProgram;
}

export function BenefitCardHeader({ program }: BenefitCardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-heading-sm text-neutral-900">{program.name}</h3>
          <span className={`px-3 py-1 text-body-sm rounded-full ${getCategoryColor(program.category)}`}>
            {program.category}
          </span>
        </div>
        <p className="text-body text-neutral-600">{program.description}</p>
      </div>
    </div>
  );
}
