/**
 * Built-in transform functions for application field values
 * Used by PreFillEngine to format quiz data for government forms
 */

import { TransformRegistry } from '@/types/application';

export const BUILT_IN_TRANSFORMS: TransformRegistry = {
  // Format currency
  currency: (val: number) => val.toFixed(2),

  // Join array with commas
  joinComma: (arr: string[]) => arr.join(', '),

  // Join array with semicolons
  joinSemicolon: (arr: string[]) => arr.join('; '),

  // Convert boolean to Yes/No
  yesNo: (val: boolean) => (val ? 'Yes' : 'No'),

  // Convert boolean to Yes/No/Unknown
  yesNoUnknown: (val: boolean | undefined) => {
    if (val === undefined) return 'Unknown';
    return val ? 'Yes' : 'No';
  },

  // Format phone number
  phone: (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return val;
  },

  // Convert disability types array to readable string
  disabilityTypes: (types: string[]) => {
    return types
      .map((t) => t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
      .join(', ');
  },

  // Convert income types array to readable string
  incomeTypes: (types: string[]) => {
    return types
      .map((t) => t.toUpperCase())
      .join(', ');
  },
};
