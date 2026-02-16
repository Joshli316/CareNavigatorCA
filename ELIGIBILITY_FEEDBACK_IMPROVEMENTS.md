# Eligibility Feedback Improvements

## Overview
Enhanced the eligibility engine to provide **much more detailed and actionable feedback** when a user doesn't qualify for a program due to categorical eligibility requirements.

## What Changed

### Before (Generic Message)
```
✗ What's Blocking Eligibility
✗ Does not meet categorical eligibility requirements
```

### After (Specific, Actionable Feedback)

#### Example 1: VA Disability (Veteran Requirement)
```
✗ What's Blocking Eligibility
✗ This program requires you to be a military veteran (currently: No)

→ How to Improve Your Odds
→ This program is specifically for military veterans - you may qualify for other similar programs
```

#### Example 2: TANF (Children Requirement)
```
✗ What's Blocking Eligibility
✗ This program requires dependent children in the household (currently: No)

→ How to Improve Your Odds
→ This program is for families with dependent children - explore programs for individuals/couples without children
```

#### Example 3: Texas STAR+PLUS (ADL Assistance Requirement)
```
✗ What's Blocking Eligibility
✗ This program requires assistance level: some or extensive (currently: none)

→ How to Improve Your Odds
→ This program requires you to need help with daily activities (bathing, dressing, meals, etc.) - get a functional assessment from your doctor
```

#### Example 4: SNAP Categorical Eligibility
```
✗ What's Blocking Eligibility
✗ This program provides categorical eligibility if you receive SSI (currently: No)

→ How to Improve Your Odds
→ If you have a disability, consider applying for SSI to gain categorical eligibility
```

## Categorical Fields Now Supported

The engine now provides specific feedback for:

1. **`disability.receivingSSI`** - Whether user receives SSI
2. **`disability.receivingSSDI`** - Whether user receives SSDI
3. **`demographic.isVeteran`** - Whether user is a military veteran
4. **`demographic.hasChildren`** - Whether user has dependent children
5. **`demographic.needsAssistance`** - Level of assistance needed (none/some/extensive)
6. **`financial.existingBenefits`** - Which benefits user currently receives

## Benefits

### For Users
- **Clear Understanding**: Users now know exactly WHY they don't qualify
- **Actionable Steps**: Specific guidance on what they can do to become eligible
- **No Confusion**: No more vague "categorical eligibility" messages

### For Program Eligibility
Each of the 34 programs that uses categorical rules now provides:
- The specific field being checked (e.g., "military veteran", "dependent children")
- The user's current status (e.g., "currently: No")
- A concrete suggestion for what to do next

## Programs Most Affected

These programs have categorical eligibility rules and will show much better feedback:

1. **VA Disability Compensation** - Veteran requirement
2. **TANF** - Dependent children requirement
3. **WIC** - Children under 5 requirement
4. **Texas STAR+PLUS Waiver** - ADL assistance requirement
5. **SNAP** - SSI/SSDI categorical eligibility
6. **Lifeline** - SSI/SNAP/Medicaid categorical eligibility
7. **ACP** - SSI/SNAP/Medicaid categorical eligibility
8. **LIHEAP** - SSI/SNAP categorical eligibility

## Technical Implementation

### New Methods Added to `eligibilityEngine.ts`:

1. **`explainCategoricalFailure()`** - Provides specific explanations for categorical rule failures
2. **`explainHouseholdFailure()`** - Provides specific explanations for household size failures
3. **`suggestCategoricalImprovement()`** - Provides actionable improvement suggestions

### Code Location
`lib/rules/eligibilityEngine.ts` lines 312-438

## Example User Journey

**Scenario**: Single adult with disability applies for TANF (which requires children)

**Old Experience**:
```
TANF - Not Eligible (0%)
✗ Does not meet categorical eligibility requirements
```

**New Experience**:
```
TANF - Not Eligible (0%)
✗ This program requires dependent children in the household (currently: No)

→ How to Improve
→ This program is for families with dependent children - explore programs for
  individuals/couples without children
```

The user now understands:
1. They need children to qualify
2. They currently don't have children in the household
3. They should look for other programs designed for individuals

## Accessibility & Plain Language

All feedback messages:
- Use simple, clear language
- Avoid jargon (explained terms like "categorical eligibility")
- Provide concrete next steps
- Show current vs. required status
- Are empathetic and helpful in tone


#assessment #financial-inclusion
