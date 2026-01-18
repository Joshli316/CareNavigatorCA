/**
 * SSI (Supplemental Security Income) Application Template
 *
 * Form: SSA-16 (Application for Supplemental Security Income)
 * Official URL: https://www.ssa.gov/forms/ssa-16.pdf
 *
 * This template maps quiz data to the SSA-16 form fields.
 * Note: Some sensitive fields (SSN, signature) must be entered manually by the user.
 */

import { ApplicationTemplate } from '@/types/application';

export const SSI_APPLICATION_TEMPLATE: ApplicationTemplate = {
  programId: 'ssi-2026',
  formName: 'SSA-16 (Application for Supplemental Security Income)',
  formNumber: 'SSA-16',
  formUrl: 'https://www.ssa.gov/forms/ssa-16.pdf',
  version: '2026-01',
  supportedFormats: ['json', 'url'],
  estimatedTimeManual: 45,
  estimatedTimePrefill: 3,
  lastUpdated: '2026-01-17',
  instructions: `Instructions for submitting your pre-filled SSI application:

1. Download the pre-filled application data
2. Visit https://www.ssa.gov/benefits/ssi/ or call 1-800-772-1213
3. Complete any missing fields (marked in yellow):
   - Your full legal name
   - Social Security Number
   - Date of birth
   - Contact information
4. Review all pre-filled information for accuracy
5. Sign and date the application
6. Submit online, by mail, or in person at your local SSA office

Note: This pre-filled data saves you approximately 42 minutes of form-filling time.`,

  fields: [
    // ===== SECTION 1: Applicant Information =====
    {
      fieldId: 'applicant_first_name',
      label: 'First Name',
      type: 'text',
      required: true,
      maxLength: 50,
      helpText: 'Your legal first name as it appears on your birth certificate',
    },
    {
      fieldId: 'applicant_middle_name',
      label: 'Middle Name',
      type: 'text',
      required: false,
      maxLength: 50,
    },
    {
      fieldId: 'applicant_last_name',
      label: 'Last Name',
      type: 'text',
      required: true,
      maxLength: 50,
      helpText: 'Your legal last name as it appears on your birth certificate',
    },
    {
      fieldId: 'applicant_ssn',
      label: 'Social Security Number',
      type: 'ssn',
      required: true,
      helpText: 'We never collect SSN for security reasons. Enter this directly on the official form.',
    },
    {
      fieldId: 'applicant_dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      helpText: 'Format: MM/DD/YYYY',
    },
    {
      fieldId: 'applicant_age',
      label: 'Current Age',
      type: 'number',
      quizDataPath: 'demographic.age',
      required: true,
    },

    // ===== SECTION 2: Contact Information =====
    {
      fieldId: 'mailing_address',
      label: 'Mailing Address',
      type: 'text',
      required: true,
      maxLength: 100,
      helpText: 'Street address where you receive mail',
    },
    {
      fieldId: 'city',
      label: 'City',
      type: 'text',
      required: true,
      maxLength: 50,
    },
    {
      fieldId: 'state',
      label: 'State',
      type: 'text',
      quizDataPath: 'geography.state',
      required: true,
    },
    {
      fieldId: 'county',
      label: 'County',
      type: 'text',
      quizDataPath: 'geography.county',
      required: true,
    },
    {
      fieldId: 'zip_code',
      label: 'ZIP Code',
      type: 'text',
      quizDataPath: 'geography.zipCode',
      required: true,
      maxLength: 10,
    },
    {
      fieldId: 'phone_number',
      label: 'Phone Number',
      type: 'phone',
      required: true,
      helpText: 'Primary phone number where SSA can reach you',
    },
    {
      fieldId: 'email',
      label: 'Email Address',
      type: 'email',
      required: false,
      maxLength: 100,
    },

    // ===== SECTION 3: Disability Information =====
    {
      fieldId: 'has_disability',
      label: 'Do you have a disability that prevents you from working?',
      type: 'checkbox',
      quizDataPath: 'disability.hasDisability',
      transform: 'yesNo',
      required: true,
    },
    {
      fieldId: 'disability_types',
      label: 'Type(s) of Disability',
      type: 'textarea',
      quizDataPath: 'disability.disabilityType',
      transform: 'disabilityTypes',
      conditional: {
        field: 'disability.hasDisability',
        operator: 'eq',
        value: true,
      },
      required: false,
      helpText: 'Describe your disability and how it affects your ability to work',
    },
    {
      fieldId: 'has_ssa_determination',
      label: 'Do you have an existing SSA disability determination?',
      type: 'checkbox',
      quizDataPath: 'disability.hasSSADetermination',
      transform: 'yesNo',
      required: false,
    },
    {
      fieldId: 'currently_receiving_ssdi',
      label: 'Are you currently receiving SSDI benefits?',
      type: 'checkbox',
      quizDataPath: 'disability.receivingSSDI',
      transform: 'yesNo',
      required: false,
    },

    // ===== SECTION 4: Income Information =====
    {
      fieldId: 'monthly_gross_income',
      label: 'Total Monthly Gross Income',
      type: 'number',
      quizDataPath: 'financial.monthlyIncome',
      transform: 'currency',
      required: true,
      helpText: 'Total income before taxes from all sources',
    },
    {
      fieldId: 'income_sources',
      label: 'Sources of Income',
      type: 'textarea',
      quizDataPath: 'financial.incomeType',
      transform: 'incomeTypes',
      required: true,
      helpText: 'List all sources (wages, SSI, SSDI, retirement, etc.)',
    },
    {
      fieldId: 'currently_receiving_ssi',
      label: 'Are you currently receiving SSI benefits?',
      type: 'checkbox',
      quizDataPath: 'disability.receivingSSI',
      transform: 'yesNo',
      required: false,
    },

    // ===== SECTION 5: Asset Information =====
    {
      fieldId: 'countable_assets',
      label: 'Total Countable Assets',
      type: 'number',
      quizDataPath: 'financial.countableAssets',
      transform: 'currency',
      required: true,
      helpText: 'Savings, checking accounts, stocks, bonds (not including primary home or one vehicle)',
    },
    {
      fieldId: 'owns_vehicle',
      label: 'Do you own a vehicle?',
      type: 'checkbox',
      quizDataPath: 'financial.ownsCar',
      transform: 'yesNo',
      required: true,
    },
    {
      fieldId: 'vehicle_value',
      label: 'Estimated Vehicle Value',
      type: 'number',
      quizDataPath: 'financial.carValue',
      transform: 'currency',
      conditional: {
        field: 'financial.ownsCar',
        operator: 'eq',
        value: true,
      },
      required: false,
    },
    {
      fieldId: 'owns_home',
      label: 'Do you own your home?',
      type: 'checkbox',
      quizDataPath: 'financial.ownsHome',
      transform: 'yesNo',
      required: true,
    },
    {
      fieldId: 'home_value',
      label: 'Estimated Home Value',
      type: 'number',
      quizDataPath: 'financial.homeValue',
      transform: 'currency',
      conditional: {
        field: 'financial.ownsHome',
        operator: 'eq',
        value: true,
      },
      required: false,
      helpText: 'Primary residence is typically exempt from asset limits',
    },

    // ===== SECTION 6: Household Information =====
    {
      fieldId: 'household_size',
      label: 'Total Household Size',
      type: 'number',
      quizDataPath: 'demographic.householdSize',
      required: true,
      helpText: 'Include yourself and everyone who lives with you',
    },
    {
      fieldId: 'has_children',
      label: 'Do you have children under 18?',
      type: 'checkbox',
      quizDataPath: 'demographic.hasChildren',
      transform: 'yesNo',
      required: false,
    },
    {
      fieldId: 'children_ages',
      label: 'Ages of Children',
      type: 'text',
      quizDataPath: 'demographic.childrenAges',
      transform: 'joinComma',
      conditional: {
        field: 'demographic.hasChildren',
        operator: 'eq',
        value: true,
      },
      required: false,
    },
    {
      fieldId: 'is_veteran',
      label: 'Are you a military veteran?',
      type: 'checkbox',
      quizDataPath: 'demographic.isVeteran',
      transform: 'yesNo',
      required: false,
    },

    // ===== SECTION 7: Living Situation & Care Needs =====
    {
      fieldId: 'assistance_level',
      label: 'Level of assistance needed with daily activities',
      type: 'select',
      quizDataPath: 'demographic.needsAssistance',
      required: false,
      options: ['None', 'Some assistance', 'Extensive assistance'],
      helpText: 'Cooking, bathing, dressing, managing medications, etc.',
    },
    {
      fieldId: 'months_in_state',
      label: 'How long have you lived in this state?',
      type: 'number',
      quizDataPath: 'geography.residencyMonths',
      required: true,
      helpText: 'Total months of residency',
    },

    // ===== SECTION 8: Certification & Signature =====
    {
      fieldId: 'applicant_signature',
      label: 'Applicant Signature',
      type: 'text',
      required: true,
      helpText: 'You must sign this form in person or electronically',
    },
    {
      fieldId: 'date_signed',
      label: "Today's Date",
      type: 'date',
      required: true,
      helpText: 'Date you sign the application',
    },
    {
      fieldId: 'certification',
      label: 'I certify that the information provided is true and correct',
      type: 'checkbox',
      required: true,
      helpText: 'You are signing under penalty of perjury',
    },
  ],
};
