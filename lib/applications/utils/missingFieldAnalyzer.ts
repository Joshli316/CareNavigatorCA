/**
 * Analyzer for determining why application fields are missing data
 * Categorizes missing fields by reason (sensitive, not collected, etc.)
 */

import { ApplicationField, MissingFieldInfo } from '@/types/application';

/**
 * Determine why a field is missing
 */
export function determineMissingReason(field: ApplicationField): MissingFieldInfo['reason'] {
  // Check field type for common patterns
  if (field.type === 'ssn' || field.fieldId.toLowerCase().includes('ssn')) {
    return 'sensitive';
  }

  if (field.fieldId.toLowerCase().includes('signature')) {
    return 'requires_signature';
  }

  if (field.fieldId.toLowerCase().includes('date_signed') || field.fieldId.toLowerCase().includes('today')) {
    return 'requires_date';
  }

  // Default: data not collected in quiz
  return 'not_collected';
}
