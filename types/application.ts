/**
 * Application Pre-fill System Types
 *
 * Defines the structure for mapping quiz data to government benefit application forms.
 * Supports multiple export formats (JSON, PDF, URL parameters) and tracks which fields
 * can be auto-filled vs require manual entry.
 */

export type ApplicationFieldType = 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'textarea' | 'phone' | 'email' | 'ssn';

export type ConditionalOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'includes' | 'excludes';

export interface ConditionalRule {
  field: string;                    // Quiz data path to check
  operator: ConditionalOperator;
  value: any;
}

export interface ApplicationField {
  fieldId: string;                  // Unique identifier for this field
  label: string;                    // Human-readable field label
  type: ApplicationFieldType;
  quizDataPath?: string;            // Path to quiz data (e.g., 'financial.monthlyIncome')
  transform?: string;               // Name of transform function to apply
  conditional?: ConditionalRule;    // Only include field if condition met
  required?: boolean;               // Is this a required field?
  maxLength?: number;
  options?: string[];               // For select fields
  placeholder?: string;
  helpText?: string;                // Additional guidance for user
}

export interface ApplicationTemplate {
  programId: string;                // Must match BenefitProgram.id
  formName: string;                 // Official form name (e.g., "SSA-16")
  formNumber?: string;              // Official form number
  formUrl: string;                  // Link to official blank form
  version: string;                  // Form version/year (e.g., "2026-01")
  fields: ApplicationField[];       // All form fields in order
  supportedFormats: ExportFormat[];
  instructions: string;             // Multi-line submission instructions
  estimatedTimeManual: number;      // Minutes to fill manually
  estimatedTimePrefill: number;     // Minutes with pre-fill assistance
  lastUpdated: string;              // ISO date string
}

export type ExportFormat = 'json' | 'pdf' | 'url';

export interface PrefilledApplication {
  programId: string;
  programName: string;
  formName: string;
  formData: Record<string, any>;    // Mapped field values
  missingFields: MissingFieldInfo[];
  readyToSubmit: boolean;           // True if all required fields filled
  completionPercentage: number;     // 0-100
  downloadUrl?: string;             // Client-side blob URL for download
  portalUrl?: string;               // Portal URL with query parameters
  generatedAt: string;              // ISO timestamp
  timeSavings: {
    manual: number;                 // Minutes
    prefill: number;                // Minutes
    savedMinutes: number;
    savedPercentage: number;        // 0-100
  };
}

export interface MissingFieldInfo {
  fieldId: string;
  label: string;
  reason: 'not_collected' | 'sensitive' | 'requires_signature' | 'requires_date';
  helpText?: string;
}

export interface ApplicationExportOptions {
  format?: ExportFormat;
  includeInstructions?: boolean;
  includeTimestamp?: boolean;
  prettyPrint?: boolean;
}

/**
 * Transform functions that can be referenced by name in ApplicationField.transform
 */
export type TransformFunction = (value: any) => any;

export interface TransformRegistry {
  [key: string]: TransformFunction;
}
