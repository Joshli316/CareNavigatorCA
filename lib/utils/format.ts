/**
 * Formatting utilities for currency, timelines, and other display values
 * Consolidates duplicate formatting logic from multiple components
 */

/**
 * Format a number as USD currency
 * Returns 'Varies' for 0 values or string values
 */
export function formatCurrency(value: number | string): string {
  if (typeof value === 'string') return value;
  if (value === 0) return 'Varies';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format weeks into a human-readable timeline
 * Converts to months if 4+ weeks
 */
export function formatTimeline(weeks: number): string {
  if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;

  const months = Math.round(weeks / 4);
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

/**
 * Format disability type from enum to display string
 */
export function formatDisabilityType(type: string): string {
  const typeMap: Record<string, string> = {
    'physical': 'Physical',
    'cognitive': 'Cognitive',
    'mental_health': 'Mental Health',
  };

  return typeMap[type] || type;
}

/**
 * Format income type from enum to display string
 */
export function formatIncomeType(type: string): string {
  const typeMap: Record<string, string> = {
    'earned': 'Earned Income',
    'unearned': 'Unearned Income',
    'ssi': 'SSI',
    'ssdi': 'SSDI',
    'tanf': 'TANF',
  };

  return typeMap[type] || type;
}

/**
 * Format document type from snake_case to Title Case
 */
export function formatDocumentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Parse a currency string (e.g. "$1,500") into a number
 */
export function parseCurrency(value: string): number {
  const cleaned = String(value).replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) || num < 0 ? 0 : num;
}
