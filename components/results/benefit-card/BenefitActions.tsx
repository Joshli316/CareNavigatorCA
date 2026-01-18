import { Button } from '@/components/shared/Button';
import { ExternalLink, Phone } from 'lucide-react';

interface BenefitActionsProps {
  applicationUrl?: string;
  helplinePhone?: string;
}

export function BenefitActions({ applicationUrl, helplinePhone }: BenefitActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      {applicationUrl && applicationUrl !== '#' && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.open(applicationUrl, '_blank')}
          className="inline-flex items-center space-x-2"
        >
          <span>Apply Online</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      )}

      {helplinePhone && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`tel:${helplinePhone}`)}
          className="inline-flex items-center space-x-2"
        >
          <Phone className="w-4 h-4" />
          <span>{helplinePhone}</span>
        </Button>
      )}
    </div>
  );
}
