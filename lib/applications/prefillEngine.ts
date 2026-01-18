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
  TransformFunction,
} from '@/types/application';
import { QuizData } from '@/types/quiz';
import { EligibilityResult } from '@/types/benefit';
import { BUILT_IN_TRANSFORMS } from './transforms/builtInTransforms';
import { evaluateConditional } from './utils/conditionalEvaluator';
import { getValueByPath } from './utils/pathResolver';
import { determineMissingReason } from './utils/missingFieldAnalyzer';

// Mutable transform registry (starts with built-in transforms)
const TRANSFORMS = { ...BUILT_IN_TRANSFORMS };

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
      if (field.conditional && !evaluateConditional(field.conditional, quizData)) {
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
          reason: determineMissingReason(field),
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
    const value = getValueByPath(quizData, field.quizDataPath);

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
