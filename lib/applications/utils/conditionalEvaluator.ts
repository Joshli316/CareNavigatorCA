/**
 * Conditional logic evaluator for application fields
 * Determines if a field should be shown based on quiz data
 */

import { ApplicationField } from '@/types/application';
import { QuizData } from '@/types/quiz';
import { getValueByPath } from './pathResolver';

/**
 * Evaluate conditional logic for a field
 */
export function evaluateConditional(
  conditional: ApplicationField['conditional'],
  quizData: QuizData
): boolean {
  if (!conditional) return true;

  const value = getValueByPath(quizData, conditional.field);
  const targetValue = conditional.value;

  switch (conditional.operator) {
    case 'eq':
      return value === targetValue;
    case 'ne':
      return value !== targetValue;
    case 'gt':
      return Number(value) > Number(targetValue);
    case 'lt':
      return Number(value) < Number(targetValue);
    case 'gte':
      return Number(value) >= Number(targetValue);
    case 'lte':
      return Number(value) <= Number(targetValue);
    case 'includes':
      return Array.isArray(value) && value.includes(targetValue);
    case 'excludes':
      return Array.isArray(value) && !value.includes(targetValue);
    default:
      return true;
  }
}
