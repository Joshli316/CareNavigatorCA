/**
 * AI Tool Definitions for CareNavigator
 *
 * This is the portable abstraction layer. These tools can be consumed by:
 * - Claude (Anthropic API tool_use)
 * - OpenAI (function calling)
 * - MCP Server (Model Context Protocol)
 * - Voice assistants, Slack bots, etc.
 *
 * Each tool wraps existing eligibility engine logic with typed I/O.
 * No UI dependencies — pure data in, data out.
 */

import { BenefitProgram, EligibilityResult, BenefitCategory } from '@/types/benefit';
import { QuizData } from '@/types/quiz';
import { EligibilityEngine } from '@/lib/rules/eligibilityEngine';
import { BENEFIT_PROGRAMS, getProgramsByState } from '@/lib/rules/benefitRules';
import { formatCurrency, formatTimeline } from '@/lib/utils/format';

// --- Tool Schemas (Anthropic format, easily convertible to OpenAI/MCP) ---

export const TOOL_DEFINITIONS = [
  {
    name: 'search_programs',
    description: 'Search benefit programs by keyword, category, or jurisdiction. Returns matching programs with basic info.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search keyword (e.g. "housing", "food", "SSI")' },
        category: { type: 'string', enum: ['income', 'healthcare', 'housing', 'food', 'utilities', 'faith_based'], description: 'Filter by category' },
        eligible_only: { type: 'boolean', description: 'If true, only return programs user is eligible for' },
      },
      required: [],
    },
  },
  {
    name: 'get_program_details',
    description: 'Get full details about a specific benefit program including eligibility rules, required documents, application info, and the user\'s eligibility status.',
    input_schema: {
      type: 'object' as const,
      properties: {
        program_id: { type: 'string', description: 'The program ID (e.g. "ssi-2026", "snap-2026")' },
      },
      required: ['program_id'],
    },
  },
  {
    name: 'explain_eligibility',
    description: 'Explain in detail why the user qualifies or doesn\'t qualify for a specific program. Shows which rules passed/failed and how to improve eligibility.',
    input_schema: {
      type: 'object' as const,
      properties: {
        program_id: { type: 'string', description: 'The program ID to explain eligibility for' },
      },
      required: ['program_id'],
    },
  },
  {
    name: 'what_if_scenario',
    description: 'Re-run eligibility with hypothetical changes to the user\'s data. Useful for "what if I was older" or "what if my income was lower" questions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        changes: {
          type: 'object',
          description: 'Key-value pairs of fields to change. Use dot notation (e.g. {"demographic.age": 65, "financial.monthlyIncome": 1000})',
        },
        program_id: { type: 'string', description: 'Optional: check a specific program. If omitted, re-runs all programs.' },
      },
      required: ['changes'],
    },
  },
  {
    name: 'get_application_checklist',
    description: 'Get a step-by-step application checklist for a program including required documents, where to apply, helpline numbers, and estimated timeline.',
    input_schema: {
      type: 'object' as const,
      properties: {
        program_id: { type: 'string', description: 'The program ID' },
      },
      required: ['program_id'],
    },
  },
  {
    name: 'compare_programs',
    description: 'Compare two or more programs side by side — eligibility, benefits, timelines, requirements.',
    input_schema: {
      type: 'object' as const,
      properties: {
        program_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of program IDs to compare (2-4)',
        },
      },
      required: ['program_ids'],
    },
  },
  {
    name: 'suggest_strategy',
    description: 'Suggest an optimal application strategy — which programs to apply for first based on probability, benefit value, and processing time.',
    input_schema: {
      type: 'object' as const,
      properties: {
        max_programs: { type: 'number', description: 'Maximum number of programs to suggest (default 5)' },
        priority: { type: 'string', enum: ['fastest', 'highest_value', 'best_odds'], description: 'What to optimize for' },
      },
      required: [],
    },
  },
] as const;

// --- Tool Execution Engine ---

export interface ToolContext {
  quizData: QuizData;
  results: EligibilityResult[];
  programs: BenefitProgram[];
}

export function createToolContext(quizData: QuizData, results?: EligibilityResult[]): ToolContext {
  const programs = getProgramsByState(quizData.geography.state);
  if (results && results.length > 0) {
    return { quizData, results, programs };
  }
  // Generate results if not provided
  const engine = new EligibilityEngine(programs);
  return {
    quizData,
    results: engine.evaluateEligibility(quizData),
    programs,
  };
}

export function executeTool(name: string, input: Record<string, any>, ctx: ToolContext): string {
  switch (name) {
    case 'search_programs': return searchPrograms(input, ctx);
    case 'get_program_details': return getProgramDetails(input, ctx);
    case 'explain_eligibility': return explainEligibility(input, ctx);
    case 'what_if_scenario': return whatIfScenario(input, ctx);
    case 'get_application_checklist': return getApplicationChecklist(input, ctx);
    case 'compare_programs': return comparePrograms(input, ctx);
    case 'suggest_strategy': return suggestStrategy(input, ctx);
    default: return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// --- Tool Implementations ---

function searchPrograms(input: Record<string, any>, ctx: ToolContext): string {
  let matches = ctx.results;

  if (input.query) {
    const q = input.query.toLowerCase();
    matches = matches.filter(r =>
      r.program.name.toLowerCase().includes(q) ||
      r.program.description.toLowerCase().includes(q) ||
      r.program.category.toLowerCase().includes(q)
    );
  }

  if (input.category) {
    matches = matches.filter(r => r.program.category === input.category);
  }

  if (input.eligible_only) {
    matches = matches.filter(r => r.isEligible);
  }

  return JSON.stringify(matches.map(r => ({
    id: r.programId,
    name: r.program.name,
    category: r.program.category,
    match: `${r.probability}%`,
    eligible: r.isEligible,
    benefit: r.estimatedMonthlyBenefit > 0 ? formatCurrency(r.estimatedMonthlyBenefit) + '/mo' : 'Varies',
    timeline: formatTimeline(r.timelineWeeks),
  })));
}

function getProgramDetails(input: Record<string, any>, ctx: ToolContext): string {
  const result = ctx.results.find(r => r.programId === input.program_id);
  if (!result) {
    // Try finding program directly
    const program = ctx.programs.find(p => p.id === input.program_id);
    if (!program) return JSON.stringify({ error: `Program '${input.program_id}' not found. Use search_programs to find valid IDs.` });
    return JSON.stringify({
      id: program.id,
      name: program.name,
      description: program.description,
      category: program.category,
      jurisdiction: program.jurisdiction,
      estimatedValue: program.estimatedMonthlyValue,
      processingTime: formatTimeline(program.processingTimeWeeks),
      requiredDocuments: program.requiredDocuments,
      applicationUrl: program.applicationUrl,
      helpline: program.helplinePhone,
      ruleCount: program.rules.length,
    });
  }

  return JSON.stringify({
    id: result.programId,
    name: result.program.name,
    description: result.program.description,
    category: result.program.category,
    jurisdiction: result.program.jurisdiction,
    matchScore: `${result.probability}%`,
    eligible: result.isEligible,
    estimatedBenefit: result.estimatedMonthlyBenefit > 0 ? formatCurrency(result.estimatedMonthlyBenefit) + '/mo' : 'Varies',
    processingTime: formatTimeline(result.timelineWeeks),
    requiredDocuments: result.program.requiredDocuments,
    applicationUrl: result.program.applicationUrl,
    helpline: result.program.helplinePhone,
    matchedRules: result.matchedRules,
    failedRules: result.failedRules,
    nextSteps: result.nextSteps,
  });
}

function explainEligibility(input: Record<string, any>, ctx: ToolContext): string {
  const result = ctx.results.find(r => r.programId === input.program_id);
  if (!result) return JSON.stringify({ error: `Program '${input.program_id}' not found` });

  return JSON.stringify({
    program: result.program.name,
    matchScore: `${result.probability}%`,
    eligible: result.isEligible,
    reasoning: result.reasoning || { whyEligible: [], whyIneligible: [], improveOdds: [] },
    failedRules: result.failedRules,
    summary: result.isEligible
      ? `You are likely eligible for ${result.program.name} with a ${result.probability}% match score.`
      : `You are currently not eligible for ${result.program.name}. ${result.failedRules.length} rule(s) failed.`,
  });
}

function whatIfScenario(input: Record<string, any>, ctx: ToolContext): string {
  // Deep clone quiz data and apply changes
  const modified = JSON.parse(JSON.stringify(ctx.quizData)) as QuizData;

  for (const [path, value] of Object.entries(input.changes || {})) {
    const parts = path.split('.');
    let obj: any = modified;
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
      if (!obj) break;
    }
    if (obj) {
      obj[parts[parts.length - 1]] = value;
    }
  }

  const engine = new EligibilityEngine(ctx.programs);
  const newResults = engine.evaluateEligibility(modified);

  if (input.program_id) {
    const oldResult = ctx.results.find(r => r.programId === input.program_id);
    const newResult = newResults.find(r => r.programId === input.program_id);
    if (!newResult) return JSON.stringify({ error: `Program '${input.program_id}' not found` });

    return JSON.stringify({
      program: newResult.program.name,
      changes_applied: input.changes,
      before: {
        matchScore: oldResult ? `${oldResult.probability}%` : 'N/A',
        eligible: oldResult?.isEligible ?? false,
        benefit: oldResult ? formatCurrency(oldResult.estimatedMonthlyBenefit) : 'N/A',
      },
      after: {
        matchScore: `${newResult.probability}%`,
        eligible: newResult.isEligible,
        benefit: formatCurrency(newResult.estimatedMonthlyBenefit),
      },
      improved: (newResult.probability > (oldResult?.probability ?? 0)),
    });
  }

  // Compare all results
  const improvements = newResults
    .filter(nr => {
      const or = ctx.results.find(r => r.programId === nr.programId);
      return or && nr.probability > or.probability;
    })
    .map(nr => {
      const or = ctx.results.find(r => r.programId === nr.programId)!;
      return {
        program: nr.program.name,
        before: `${or.probability}%`,
        after: `${nr.probability}%`,
        nowEligible: !or.isEligible && nr.isEligible,
      };
    });

  const newlyEligible = newResults.filter(nr => {
    const or = ctx.results.find(r => r.programId === nr.programId);
    return or && !or.isEligible && nr.isEligible;
  });

  return JSON.stringify({
    changes_applied: input.changes,
    programs_improved: improvements.length,
    newly_eligible: newlyEligible.map(r => r.program.name),
    details: improvements.slice(0, 10),
  });
}

function getApplicationChecklist(input: Record<string, any>, ctx: ToolContext): string {
  const result = ctx.results.find(r => r.programId === input.program_id);
  const program = result?.program || ctx.programs.find(p => p.id === input.program_id);
  if (!program) return JSON.stringify({ error: `Program '${input.program_id}' not found` });

  return JSON.stringify({
    program: program.name,
    eligible: result?.isEligible ?? 'unknown',
    matchScore: result ? `${result.probability}%` : 'unknown',
    checklist: {
      documents: program.requiredDocuments.map(doc => ({
        type: doc,
        label: doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      })),
      applicationUrl: program.applicationUrl || 'Contact agency directly',
      helpline: program.helplinePhone || 'Call 2-1-1 for assistance',
      estimatedTimeline: formatTimeline(program.processingTimeWeeks),
      nextSteps: result?.nextSteps || ['Gather required documents', 'Submit application'],
    },
  });
}

function comparePrograms(input: Record<string, any>, ctx: ToolContext): string {
  const ids: string[] = input.program_ids || [];
  const comparisons = ids.map(id => {
    const result = ctx.results.find(r => r.programId === id);
    const program = result?.program || ctx.programs.find(p => p.id === id);
    if (!program) return { id, error: 'Not found' };

    return {
      id: program.id,
      name: program.name,
      category: program.category,
      matchScore: result ? `${result.probability}%` : 'N/A',
      eligible: result?.isEligible ?? 'unknown',
      monthlyBenefit: result && result.estimatedMonthlyBenefit > 0 ? formatCurrency(result.estimatedMonthlyBenefit) : 'Varies',
      processingTime: formatTimeline(program.processingTimeWeeks),
      documentsNeeded: program.requiredDocuments.length,
      failedRules: result?.failedRules.length ?? 'unknown',
      hasOnlineApplication: !!program.applicationUrl && program.applicationUrl !== '#',
    };
  });

  return JSON.stringify({ comparison: comparisons });
}

function suggestStrategy(input: Record<string, any>, ctx: ToolContext): string {
  const maxPrograms = input.max_programs || 5;
  const priority = input.priority || 'best_odds';

  let eligible = ctx.results.filter(r => r.probability > 0);

  switch (priority) {
    case 'fastest':
      eligible.sort((a, b) => a.timelineWeeks - b.timelineWeeks);
      break;
    case 'highest_value':
      eligible.sort((a, b) => b.estimatedMonthlyBenefit - a.estimatedMonthlyBenefit);
      break;
    case 'best_odds':
    default:
      eligible.sort((a, b) => {
        if (b.probability !== a.probability) return b.probability - a.probability;
        return b.estimatedMonthlyBenefit - a.estimatedMonthlyBenefit;
      });
  }

  const top = eligible.slice(0, maxPrograms);
  const totalMonthly = top.reduce((sum, r) => sum + r.estimatedMonthlyBenefit, 0);

  return JSON.stringify({
    strategy: priority,
    recommended: top.map((r, i) => ({
      priority: i + 1,
      id: r.programId,
      name: r.program.name,
      matchScore: `${r.probability}%`,
      benefit: r.estimatedMonthlyBenefit > 0 ? formatCurrency(r.estimatedMonthlyBenefit) + '/mo' : 'Varies',
      timeline: formatTimeline(r.timelineWeeks),
      reason: i === 0 ? 'Highest priority — apply first' : undefined,
    })),
    totalEstimatedMonthly: formatCurrency(totalMonthly),
    totalPrograms: top.length,
  });
}
