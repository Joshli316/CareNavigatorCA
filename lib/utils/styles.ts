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
