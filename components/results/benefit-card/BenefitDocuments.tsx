import { DocumentType } from '@/types/document';
import { formatDocumentType } from '@/lib/utils/format';
import { FileText } from 'lucide-react';

interface BenefitDocumentsProps {
  documents: DocumentType[];
}

export function BenefitDocuments({ documents }: BenefitDocumentsProps) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <FileText className="w-5 h-5 text-neutral-500" />
        <h4 className="text-body font-semibold text-neutral-900">
          Required Documents ({documents.length})
        </h4>
      </div>
      <ul className="space-y-1 text-body-sm text-neutral-700 ml-7">
        {documents.map((doc, index) => (
          <li key={index}>• {formatDocumentType(doc)}</li>
        ))}
      </ul>
    </div>
  );
}
