/**
 * PreFillEngine
 *
 * Core logic for generating pre-filled benefit application forms.
 * Maps quiz data to government form fields and tracks completion status.
 */

import {
  ApplicationTemplate,
  ApplicationField,
  PrefilledApplication,
  MissingFieldInfo,
  ApplicationExportOptions,
  TransformRegistry,
  TransformFunction,
} from '@/types/application';
import { QuizData } from '@/types/quiz';
import { EligibilityResult } from '@/types/benefit';

/**
 * Built-in transform functions
 */
const TRANSFORMS: TransformRegistry = {
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

export class PreFillEngine {
  /**
   * Generate pre-filled applications for all eligible programs
   */
  generateApplications(
    quizData: QuizData,
    results: EligibilityResult[]
  ): PrefilledApplication[] {
    return results
      .filter((result) => result.program.applicationTemplate)
      .map((result) => this.generateApplication(result.program.applicationTemplate!, quizData, result));
  }

  /**
   * Generate a single pre-filled application
   */
  generateApplication(
    template: ApplicationTemplate,
    quizData: QuizData,
    result: EligibilityResult
  ): PrefilledApplication {
    const formData: Record<string, any> = {};
    const missingFields: MissingFieldInfo[] = [];

    // Process each field in the template
    for (const field of template.fields) {
      // Check conditional logic
      if (field.conditional && !this.evaluateConditional(field.conditional, quizData)) {
        continue; // Skip this field
      }

      // Try to map the field value
      const mappedValue = this.mapFieldValue(field, quizData);

      if (mappedValue !== undefined && mappedValue !== null && mappedValue !== '') {
        formData[field.fieldId] = mappedValue;
      } else if (field.required) {
        // Field is required but we don't have data
        missingFields.push({
          fieldId: field.fieldId,
          label: field.label,
          reason: this.determineMissingReason(field),
          helpText: field.helpText,
        });
      }
    }

    // Calculate completion percentage
    const totalRequired = template.fields.filter((f) => f.required).length;
    const filledRequired = totalRequired - missingFields.length;
    const completionPercentage = totalRequired > 0 ? (filledRequired / totalRequired) * 100 : 100;

    // Calculate time savings
    const savedMinutes = template.estimatedTimeManual - template.estimatedTimePrefill;
    const savedPercentage = (savedMinutes / template.estimatedTimeManual) * 100;

    return {
      programId: template.programId,
      programName: result.program.name,
      formName: template.formName,
      formData,
      missingFields,
      readyToSubmit: missingFields.length === 0,
      completionPercentage: Math.round(completionPercentage),
      generatedAt: new Date().toISOString(),
      timeSavings: {
        manual: template.estimatedTimeManual,
        prefill: template.estimatedTimePrefill,
        savedMinutes,
        savedPercentage: Math.round(savedPercentage),
      },
    };
  }

  /**
   * Map a single field value from quiz data
   */
  private mapFieldValue(field: ApplicationField, quizData: QuizData): any {
    if (!field.quizDataPath) {
      return undefined;
    }

    // Get value from quiz data using dot notation path
    const value = this.getValueByPath(quizData, field.quizDataPath);

    if (value === undefined || value === null) {
      return undefined;
    }

    // Apply transform if specified
    if (field.transform && TRANSFORMS[field.transform]) {
      return TRANSFORMS[field.transform](value);
    }

    return value;
  }

  /**
   * Evaluate conditional logic for a field
   */
  private evaluateConditional(
    conditional: ApplicationField['conditional'],
    quizData: QuizData
  ): boolean {
    if (!conditional) return true;

    const value = this.getValueByPath(quizData, conditional.field);
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

  /**
   * Get value from nested object using dot notation path
   * Example: 'financial.monthlyIncome' -> quizData.financial.monthlyIncome
   */
  private getValueByPath(obj: any, path: string): any {
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

  /**
   * Determine why a field is missing
   */
  private determineMissingReason(field: ApplicationField): MissingFieldInfo['reason'] {
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

  /**
   * Export application to JSON format
   */
  exportToJSON(
    application: PrefilledApplication,
    options: ApplicationExportOptions = {}
  ): string {
    const exportData: any = {
      program: application.programName,
      formName: application.formName,
      prefilledFields: application.formData,
    };

    if (options.includeTimestamp !== false) {
      exportData.generatedAt = application.generatedAt;
    }

    if (application.missingFields.length > 0) {
      exportData.manualEntryRequired = application.missingFields.map((f) => f.label);
    }

    if (options.includeInstructions !== false && application.readyToSubmit) {
      exportData.instructions = `1. Download this file\n2. Fill in any manual entry fields\n3. Sign and date\n4. Submit according to program requirements`;
    }

    exportData.timeSavings = application.timeSavings;

    return options.prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
  }

  /**
   * Create a downloadable blob URL for the application
   */
  createDownloadURL(application: PrefilledApplication, options: ApplicationExportOptions = {}): string {
    const json = this.exportToJSON(application, options);
    const blob = new Blob([json], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }

  /**
   * Generate portal URL with query parameters (if supported)
   */
  generatePortalUrl(application: PrefilledApplication, baseUrl: string): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(application.formData)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Add a custom transform function
   */
  static registerTransform(name: string, fn: TransformFunction): void {
    TRANSFORMS[name] = fn;
  }
}

// Export singleton instance
export const preFillEngine = new PreFillEngine();
