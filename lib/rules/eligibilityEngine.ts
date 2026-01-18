import {
  BenefitProgram,
  EligibilityResult,
  EligibilityRule,
  EligibilityReasoning,
  FailedRule,
  RuleOperator,
  RuleType,
} from '@/types/benefit';
import { QuizData, AssistanceLevel } from '@/types/quiz';

interface RuleEvaluation {
  rule: EligibilityRule;
  passed: boolean;
  actualValue: any;
}

export class EligibilityEngine {
  private programs: BenefitProgram[];

  constructor(programs: BenefitProgram[]) {
    this.programs = programs;
  }

  // Main evaluation method
  evaluateEligibility(quizData: QuizData): EligibilityResult[] {
    return this.programs
      .map((program) => this.evaluateProgram(program, quizData))
      .sort((a, b) => b.probability - a.probability);
  }

  private evaluateProgram(
    program: BenefitProgram,
    quizData: QuizData
  ): EligibilityResult {
    const ruleResults = program.rules.map((rule) =>
      this.evaluateRule(rule, quizData)
    );

    // Mandatory rules must ALL pass
    const mandatoryPassed = ruleResults
      .filter((r) => r.rule.isMandatory)
      .every((r) => r.passed);

    if (!mandatoryPassed) {
      return {
        programId: program.id,
        program,
        isEligible: false,
        probability: 0,
        estimatedMonthlyBenefit: 0,
        matchedRules: [],
        failedRules: ruleResults
          .filter((r) => !r.passed && r.rule.isMandatory)
          .map((r) => ({
            ruleId: r.rule.field,
            message: r.rule.failureMessage || 'Does not meet requirement',
            gap: this.calculateGap(r.rule, r.actualValue),
          })),
        nextSteps: [],
        timelineWeeks: program.processingTimeWeeks,
      };
    }

    // Calculate probability based on weighted rules
    const totalWeight = ruleResults.reduce((sum, r) => sum + r.rule.weight, 0);
    const passedWeight = ruleResults
      .filter((r) => r.passed)
      .reduce((sum, r) => sum + r.rule.weight, 0);

    // Guard against division by zero
    const probability = totalWeight > 0
      ? Math.round((passedWeight / totalWeight) * 100)
      : 0;

    const result = {
      programId: program.id,
      program,
      isEligible: probability >= 70,
      probability,
      estimatedMonthlyBenefit: this.calculateBenefit(program, quizData),
      matchedRules: ruleResults.filter((r) => r.passed).map((r) => r.rule.field),
      failedRules: ruleResults
        .filter((r) => !r.passed)
        .map((r) => ({
          ruleId: r.rule.field,
          message: r.rule.failureMessage || 'May affect eligibility',
          gap: this.calculateGap(r.rule, r.actualValue),
        })),
      nextSteps: this.generateNextSteps(program, quizData, ruleResults),
      timelineWeeks: program.processingTimeWeeks,
      reasoning: this.generateReasoning(program, ruleResults, quizData),
    };

    return result;
  }

  private evaluateRule(
    rule: EligibilityRule,
    quizData: QuizData
  ): RuleEvaluation {
    const actualValue = this.getFieldValue(quizData, rule.field);

    let passed = false;
    switch (rule.operator) {
      case RuleOperator.LESS_THAN:
        passed = actualValue < rule.value;
        break;
      case RuleOperator.LESS_THAN_OR_EQUAL:
        passed = actualValue <= rule.value;
        break;
      case RuleOperator.GREATER_THAN:
        passed = actualValue > rule.value;
        break;
      case RuleOperator.GREATER_THAN_OR_EQUAL:
        passed = actualValue >= rule.value;
        break;
      case RuleOperator.EQUALS:
        passed = actualValue === rule.value;
        break;
      case RuleOperator.INCLUDES:
        if (Array.isArray(rule.value)) {
          // Type-safe array includes check
          passed = (rule.value as (string | number)[]).includes(actualValue as string | number);
        } else {
          passed = actualValue === rule.value;
        }
        break;
      case RuleOperator.EXCLUDES:
        if (Array.isArray(rule.value)) {
          // Type-safe array excludes check
          passed = !(rule.value as (string | number)[]).includes(actualValue as string | number);
        } else {
          passed = actualValue !== rule.value;
        }
        break;
      default:
        passed = false;
    }

    return { rule, passed, actualValue };
  }

  private getFieldValue(data: QuizData, path: string): any {
    // Guard against invalid inputs
    if (!data || !path) {
      console.warn(`getFieldValue called with invalid data or path`);
      return undefined;
    }

    const value = path.split('.').reduce((obj, key) => obj?.[key], data as any);

    // Log warning if field path returns undefined (helps debug rule definitions)
    if (value === undefined) {
      console.warn(`Field path "${path}" returned undefined - check rule definition`);
    }

    return value;
  }

  private calculateGap(rule: EligibilityRule, actualValue: any): string {
    if (
      rule.type === RuleType.INCOME_THRESHOLD &&
      rule.operator === RuleOperator.LESS_THAN_OR_EQUAL &&
      typeof rule.value === 'number' &&
      typeof actualValue === 'number'
    ) {
      const difference = actualValue - rule.value;
      if (difference > 0) {
        return `Your income is $${difference} above the limit`;
      }
    }
    if (
      rule.type === RuleType.ASSET_LIMIT &&
      typeof rule.value === 'number' &&
      typeof actualValue === 'number'
    ) {
      const difference = actualValue - rule.value;
      if (difference > 0) {
        return `You have $${difference.toLocaleString()} over the asset limit`;
      }
    }
    if (
      rule.type === RuleType.AGE_RANGE &&
      rule.operator === RuleOperator.GREATER_THAN_OR_EQUAL &&
      typeof rule.value === 'number' &&
      typeof actualValue === 'number'
    ) {
      const difference = rule.value - actualValue;
      if (difference > 0) {
        return `Age requirement: ${rule.value}+ (you are ${actualValue})`;
      }
    }
    return '';
  }

  // Helper function for currency-safe calculations (avoids floating point issues)
  private safeCurrencyCalculation(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private calculateBenefit(
    program: BenefitProgram,
    quizData: QuizData
  ): number {
    if (typeof program.estimatedMonthlyValue === 'number') {
      // For SSI, reduce benefit by countable income
      if (program.id === 'ssi-2026') {
        // TODO: Extract these constants to federalLimits2026.ts
        const GENERAL_INCOME_EXCLUSION = 20;
        const EARNED_INCOME_REDUCTION_RATE = 0.5;

        const countableIncome = Math.max(
          0,
          quizData.financial.monthlyIncome - GENERAL_INCOME_EXCLUSION
        );
        const reduction = this.safeCurrencyCalculation(
          countableIncome * EARNED_INCOME_REDUCTION_RATE
        );
        return this.safeCurrencyCalculation(
          Math.max(0, program.estimatedMonthlyValue - reduction)
        );
      }
      return program.estimatedMonthlyValue;
    }
    return 0;
  }

  private generateNextSteps(
    program: BenefitProgram,
    quizData: QuizData,
    ruleResults: RuleEvaluation[]
  ): string[] {
    const steps: string[] = [];

    const failedMandatory = ruleResults.filter(
      (r) => !r.passed && r.rule.isMandatory
    );

    if (failedMandatory.length > 0) {
      steps.push(
        `Address ${failedMandatory.length} eligibility requirement${failedMandatory.length > 1 ? 's' : ''}`
      );
    } else {
      steps.push(`Upload ${program.requiredDocuments.length} required documents`);
      if (program.applicationUrl && program.applicationUrl !== '#') {
        steps.push('Complete online application');
      }
      if (program.helplinePhone) {
        steps.push(`Call ${program.helplinePhone} for assistance`);
      }
    }

    return steps;
  }

  private generateReasoning(
    program: BenefitProgram,
    ruleResults: RuleEvaluation[],
    quizData: QuizData
  ): EligibilityReasoning {
    const whyEligible: string[] = [];
    const whyIneligible: string[] = [];
    const improveOdds: string[] = [];

    ruleResults.forEach((result) => {
      const { rule, passed, actualValue } = result;

      if (passed) {
        // Explain what they got right
        whyEligible.push(this.explainPassedRule(rule, actualValue));
      } else {
        // Explain what's blocking them
        whyIneligible.push(this.explainFailedRule(rule, actualValue));

        // Suggest how to improve
        const improvement = this.suggestImprovement(rule, actualValue, quizData);
        if (improvement) {
          improveOdds.push(improvement);
        }
      }
    });

    return { whyEligible, whyIneligible, improveOdds };
  }

  private explainPassedRule(rule: EligibilityRule, actualValue: any): string {
    const formatValue = (val: any) => {
      if (typeof val === 'number') {
        return val >= 100 ? `$${val.toLocaleString()}` : val;
      }
      return val;
    };

    switch (rule.type) {
      case RuleType.INCOME_THRESHOLD:
        if (rule.operator === RuleOperator.LESS_THAN_OR_EQUAL) {
          return `✓ Your income (${formatValue(actualValue)}/mo) is below the limit of ${formatValue(rule.value)}/mo`;
        }
        break;
      case RuleType.ASSET_LIMIT:
        return `✓ Your assets (${formatValue(actualValue)}) are below the limit of ${formatValue(rule.value)}`;
      case RuleType.DISABILITY_REQUIRED:
        return `✓ You have a qualifying disability`;
      case RuleType.GEOGRAPHY_MATCH:
        return `✓ You are a ${rule.value} resident`;
      case RuleType.AGE_RANGE:
        if (rule.operator === RuleOperator.GREATER_THAN_OR_EQUAL) {
          return `✓ You meet the age requirement (${actualValue} years old)`;
        }
        break;
      case RuleType.CATEGORICAL:
        return `✓ You meet categorical eligibility requirements`;
    }
    return `✓ Requirement met`;
  }

  private explainFailedRule(rule: EligibilityRule, actualValue: any): string {
    const formatValue = (val: any) => {
      if (typeof val === 'number') {
        return val >= 100 ? `$${val.toLocaleString()}` : val;
      }
      return val;
    };

    switch (rule.type) {
      case RuleType.INCOME_THRESHOLD:
        if (
          rule.operator === RuleOperator.LESS_THAN_OR_EQUAL &&
          typeof rule.value === 'number' &&
          typeof actualValue === 'number'
        ) {
          const difference = actualValue - rule.value;
          return `✗ Your income (${formatValue(actualValue)}/mo) exceeds the limit by ${formatValue(difference)}/mo`;
        }
        break;
      case RuleType.ASSET_LIMIT:
        if (typeof rule.value === 'number' && typeof actualValue === 'number') {
          const assetDiff = actualValue - rule.value;
          return `✗ Your assets (${formatValue(actualValue)}) exceed the limit by ${formatValue(assetDiff)}`;
        }
        break;
      case RuleType.DISABILITY_REQUIRED:
        return `✗ This program requires a qualifying disability`;
      case RuleType.GEOGRAPHY_MATCH:
        return `✗ You must be a ${rule.value} resident (currently: ${actualValue})`;
      case RuleType.AGE_RANGE:
        if (rule.operator === RuleOperator.GREATER_THAN_OR_EQUAL) {
          return `✗ Minimum age is ${rule.value} (you are ${actualValue})`;
        }
        break;
      case RuleType.CATEGORICAL:
        // Provide specific categorical requirement details based on the field
        return this.explainCategoricalFailure(rule, actualValue);
      case RuleType.HOUSEHOLD_SIZE:
        return this.explainHouseholdFailure(rule, actualValue);
    }
    return rule.failureMessage || `✗ Requirement not met`;
  }

  private explainCategoricalFailure(rule: EligibilityRule, actualValue: any): string {
    // Provide specific feedback based on the field being checked
    if (rule.field === 'disability.receivingSSI') {
      return `✗ This program provides categorical eligibility if you receive SSI (currently: ${actualValue ? 'Yes' : 'No'})`;
    }
    if (rule.field === 'disability.receivingSSDI') {
      return `✗ This program provides categorical eligibility if you receive SSDI (currently: ${actualValue ? 'Yes' : 'No'})`;
    }
    if (rule.field === 'demographic.isVeteran') {
      return `✗ This program requires you to be a military veteran (currently: ${actualValue ? 'Yes' : 'No'})`;
    }
    if (rule.field === 'demographic.hasChildren') {
      return `✗ This program requires dependent children in the household (currently: ${actualValue ? 'Yes' : 'No'})`;
    }
    if (rule.field === 'demographic.needsAssistance') {
      const expected = Array.isArray(rule.value) ? rule.value.join(' or ') : rule.value;
      return `✗ This program requires assistance level: ${expected} (currently: ${actualValue})`;
    }
    if (rule.field === 'financial.existingBenefits') {
      const expected = Array.isArray(rule.value) ? rule.value.join(', ') : rule.value;
      return `✗ Categorical eligibility available if receiving: ${expected}`;
    }

    // Default categorical message with more context
    return rule.failureMessage || `✗ Does not meet categorical eligibility requirements (${rule.field})`;
  }

  private explainHouseholdFailure(rule: EligibilityRule, actualValue: any): string {
    if (rule.field === 'demographic.hasChildren') {
      if (rule.operator === RuleOperator.EQUALS && rule.value === true) {
        return `✗ This program requires dependent children in the household`;
      }
    }
    if (rule.field === 'demographic.householdSize') {
      return `✗ Household size requirement not met (current: ${actualValue}, required: ${rule.value})`;
    }
    return rule.failureMessage || `✗ Household requirement not met`;
  }

  private suggestImprovement(
    rule: EligibilityRule,
    actualValue: any,
    quizData: QuizData
  ): string | null {
    switch (rule.type) {
      case RuleType.INCOME_THRESHOLD:
        if (
          rule.operator === RuleOperator.LESS_THAN_OR_EQUAL &&
          typeof rule.value === 'number' &&
          typeof actualValue === 'number'
        ) {
          const difference = actualValue - rule.value;
          if (difference > 0) {
            return `→ If you reduce monthly income by $${difference.toLocaleString()}, you would meet the income requirement`;
          }
        }
        break;

      case RuleType.ASSET_LIMIT:
        if (typeof rule.value === 'number' && typeof actualValue === 'number') {
          const assetDiff = actualValue - rule.value;
          if (assetDiff > 0) {
            return `→ If you reduce assets by $${assetDiff.toLocaleString()} (exempt assets like your home and car don't count), you would meet the asset requirement`;
          }
        }
        break;

      case RuleType.DISABILITY_REQUIRED:
        if (!quizData.disability.hasSSADetermination) {
          return `→ Apply for an SSA disability determination to qualify`;
        }
        break;

      case RuleType.AGE_RANGE:
        if (
          rule.operator === RuleOperator.GREATER_THAN_OR_EQUAL &&
          typeof rule.value === 'number' &&
          typeof actualValue === 'number'
        ) {
          const ageDiff = rule.value - actualValue;
          if (ageDiff > 0) {
            return `→ You will become eligible in ${ageDiff} years when you turn ${rule.value}`;
          }
        }
        break;

      case RuleType.CATEGORICAL:
        return this.suggestCategoricalImprovement(rule, actualValue, quizData);
    }

    return null;
  }

  private suggestCategoricalImprovement(
    rule: EligibilityRule,
    actualValue: any,
    quizData: QuizData
  ): string | null {
    // Provide specific suggestions based on the categorical field
    if (rule.field === 'disability.receivingSSI') {
      if (!quizData.disability.hasDisability) {
        return `→ Apply for SSI if you have a disability and limited income`;
      }
      return `→ If you have a disability, consider applying for SSI to gain categorical eligibility`;
    }

    if (rule.field === 'disability.receivingSSDI') {
      if (!quizData.disability.hasDisability) {
        return `→ Apply for SSDI if you have a disability that prevents you from working`;
      }
      return `→ If you have a work history and disability, consider applying for SSDI`;
    }

    if (rule.field === 'demographic.isVeteran') {
      return `→ This program is specifically for military veterans - you may qualify for other similar programs`;
    }

    if (rule.field === 'demographic.hasChildren') {
      return `→ This program is for families with dependent children - explore programs for individuals/couples without children`;
    }

    if (rule.field === 'demographic.needsAssistance') {
      const expected = Array.isArray(rule.value) ? rule.value : [rule.value];
      if (expected.includes(AssistanceLevel.SOME) || expected.includes(AssistanceLevel.EXTENSIVE)) {
        return `→ This program requires you to need help with daily activities (bathing, dressing, meals, etc.) - get a functional assessment from your doctor`;
      }
    }

    if (rule.field === 'financial.existingBenefits') {
      const benefitList = Array.isArray(rule.value) ? rule.value.join(', ') : rule.value;
      return `→ Apply for ${benefitList} first - receiving these programs automatically qualifies you (categorical eligibility)`;
    }

    // Default suggestion
    return `→ Check if you qualify for programs that provide categorical eligibility for this benefit`;
  }
}
