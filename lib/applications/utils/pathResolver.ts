/**
 * Utility for resolving nested object paths
 * Supports dot notation like 'financial.monthlyIncome'
 */

/**
 * Get value from nested object using dot notation path
 * Example: 'financial.monthlyIncome' -> obj.financial.monthlyIncome
 */
export function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}
