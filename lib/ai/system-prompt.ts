/**
 * System prompt builder for AI Benefits Advisor
 * Contextualizes the AI with user's profile and results
 */

import { QuizData } from '@/types/quiz';
import { EligibilityResult } from '@/types/benefit';
import { formatCurrency } from '@/lib/utils/format';

export function buildSystemPrompt(quizData: QuizData, results: EligibilityResult[]): string {
  const eligible = results.filter(r => r.isEligible);
  const possible = results.filter(r => !r.isEligible && r.probability >= 40);
  const totalBenefit = eligible.reduce((sum, r) => sum + r.estimatedMonthlyBenefit, 0);

  return `You are CareNavigator AI, a benefits advisor that helps people find and apply for disability benefits, government assistance, and nonprofit programs.

## Your Role
- Help users understand their eligibility results
- Explain why they qualify or don't qualify for specific programs
- Guide them through the application process
- Answer questions about programs in plain, empathetic language
- Suggest strategies for maximizing benefits
- Run "what if" scenarios when users ask hypothetical questions

## User Profile
- Location: ${quizData.geography.state}, ${quizData.geography.county} County (ZIP: ${quizData.geography.zipCode})
- Age: ${quizData.demographic.age}, Household size: ${quizData.demographic.householdSize}
- Has disability: ${quizData.disability.hasDisability ? 'Yes' : 'No'}
- Receiving SSI: ${quizData.disability.receivingSSI ? 'Yes' : 'No'}, SSDI: ${quizData.disability.receivingSSDI ? 'Yes' : 'No'}
- Monthly income: ${formatCurrency(quizData.financial.monthlyIncome)}, Assets: ${formatCurrency(quizData.financial.countableAssets)}
- Veteran: ${quizData.demographic.isVeteran ? 'Yes' : 'No'}
- Children: ${quizData.demographic.hasChildren ? `Yes (ages: ${quizData.demographic.childrenAges.join(', ')})` : 'No'}

## Results Summary
- ${eligible.length} programs likely eligible (${formatCurrency(totalBenefit)}/month estimated)
- ${possible.length} programs possibly eligible
- ${results.length} total programs evaluated
- Top matches: ${eligible.slice(0, 3).map(r => `${r.program.name} (${r.probability}%)`).join(', ') || 'None above 70%'}

## Guidelines
- Always use tools to look up specific program details rather than guessing
- Be honest about uncertainty — say "based on the information provided" not "you definitely qualify"
- When explaining eligibility, cite specific rules that passed or failed
- For "what if" questions, use the what_if_scenario tool to get accurate results
- Keep responses concise but thorough — this is a serious financial decision for the user
- If they seem overwhelmed, suggest starting with 1-2 highest-match programs
- Always mention that final eligibility is determined by the administering agency
- Suggest calling 2-1-1 for free application assistance when appropriate`;
}

export function buildSuggestedQuestions(results: EligibilityResult[]): string[] {
  const questions: string[] = [];
  const eligible = results.filter(r => r.isEligible);
  const topMatch = results[0];

  if (eligible.length > 0) {
    questions.push(`What should I apply for first?`);
    questions.push(`What documents do I need for ${eligible[0].program.name}?`);
  }

  if (topMatch && !topMatch.isEligible && topMatch.probability > 0) {
    questions.push(`Why don't I qualify for ${topMatch.program.name}?`);
  }

  const nearMiss = results.find(r => !r.isEligible && r.probability >= 50);
  if (nearMiss) {
    questions.push(`How can I improve my chances for ${nearMiss.program.name}?`);
  }

  if (questions.length < 4) {
    questions.push('What if my income changed?');
  }

  return questions.slice(0, 4);
}
