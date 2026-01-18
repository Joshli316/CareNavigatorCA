/**
 * Styling utilities for consistent colors and labels across components
 * Consolidates repeated color/label logic from BenefitCard, EligibilityMeter, CategoryTabs
 */

import { BenefitCategory } from '@/types/benefit';

/**
 * Get Tailwind color classes for a benefit category
 */
export function getCategoryColor(category: BenefitCategory): string {
  switch (category) {
    case 'income':
      return 'bg-primary-100 text-primary-700';
    case 'healthcare':
      return 'bg-secondary-100 text-secondary-700';
    case 'housing':
      return 'bg-purple-100 text-purple-700';
    case 'food':
      return 'bg-warning/20 text-warning';
    case 'utilities':
      return 'bg-blue-100 text-blue-700';
    case 'faith_based':
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

/**
 * Get eligibility text color based on probability
 */
export function getEligibilityColor(probability: number): string {
  if (probability >= 70) return 'text-success';
  if (probability >= 40) return 'text-warning';
  return 'text-danger';
}

/**
 * Get eligibility background color based on probability
 */
export function getEligibilityBackgroundColor(probability: number): string {
  if (probability >= 70) return 'bg-success';
  if (probability >= 40) return 'bg-warning';
  return 'bg-danger';
}

/**
 * Get eligibility label text based on probability
 */
export function getEligibilityLabel(probability: number): string {
  if (probability >= 70) return 'Likely Eligible';
  if (probability >= 40) return 'May Qualify';
  return 'Unlikely';
}

/**
 * Get complete eligibility status (color, background, label) based on probability
 * Useful when you need all three values at once
 */
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
