import { BenefitProgram } from '@/types/benefit';

interface BenefitCardHeaderProps {
  program: BenefitProgram;
}

export function BenefitCardHeader({ program }: BenefitCardHeaderProps) {
  return (
    <div className="p-5 pb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-medium text-gray-900 leading-snug">{program.name}</h3>
        <span className="flex-shrink-0 text-xs text-gray-400 uppercase tracking-wide">
          {program.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{program.description}</p>
    </div>
  );
}
