import { BenefitCategory } from '@/types/benefit';

export function getCategoryColor(_category: BenefitCategory): string {
  return 'text-gray-400';
}

export function getEligibilityColor(probability: number): string {
  if (probability >= 70) return 'text-gray-900';
  if (probability >= 40) return 'text-gray-600';
  return 'text-gray-400';
}

export function getEligibilityBackgroundColor(probability: number): string {
  if (probability >= 70) return 'bg-gray-900';
  if (probability >= 40) return 'bg-gray-500';
  return 'bg-gray-300';
}

export function getEligibilityLabel(probability: number): string {
  if (probability >= 70) return 'Likely';
  if (probability >= 40) return 'Possible';
  return 'Unlikely';
}

export interface EligibilityStatus {
  color: string;
  backgroundColor: string;
  label: string;
}

export function getEligibilityStatus(probability: number): EligibilityStatus {
  return {
    color: getEligibilityColor(probability),
    backgroundColor: getEligibilityBackgroundColor(probability),
    label: getEligibilityLabel(probability),
  };
}

export function getTierStyles(level: string): { borderColor: string; bgColor: string; textColor: string; label: string } {
  if (level === 'high') return { borderColor: 'bg-success', bgColor: 'bg-white', textColor: 'text-success', label: 'Recommended' };
  if (level === 'medium') return { borderColor: 'bg-warning', bgColor: 'bg-white', textColor: 'text-warning', label: 'Worth Applying' };
  return { borderColor: 'bg-gray-300', bgColor: 'bg-white', textColor: 'text-gray-400', label: 'Optional' };
}

export function getEffortStyles(level: string): { bgColor: string; textColor: string } {
  if (level === 'none') return { bgColor: 'bg-gray-50', textColor: 'text-gray-400' };
  if (level === 'quick') return { bgColor: 'bg-success-light', textColor: 'text-success' };
  if (level === 'moderate') return { bgColor: 'bg-warning-light', textColor: 'text-warning' };
  return { bgColor: 'bg-error-light', textColor: 'text-error' };
}
