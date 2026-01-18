import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`flex items-start space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg ${className}`}>
      <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
      <p className="text-body-sm text-error font-medium">{message}</p>
    </div>
  );
}
