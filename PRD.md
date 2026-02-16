# CareNavigator — PRD

## Problem
- Families with disabled members spend 100+ hours researching benefits eligibility across fragmented federal/state programs
- Rules vary by state, income, disability type, household composition — easy to miss programs or misunderstand eligibility

## Status
- Prototype (demo-ready, Texas test data available)

## Target User
- Primary: Caregivers of people with disabilities (initially Texas families)
- Secondary: Social workers and case managers advising clients

## Core Features (ranked)
1. Multi-step eligibility quiz — collects geography, disability, financial, and demographic data
2. Rule engine — evaluates against federal (FPL-based) and state-specific rules (Texas STAR+PLUS, SNAP, Medicaid, Housing)
3. Results page — shows which programs the user likely qualifies for, with processing timelines
4. Grants section — additional funding opportunities
5. Document vault — track required paperwork per program
6. Anthropic Claude integration (dependency in package.json — likely for AI-assisted guidance)

## Non-Goals
- Actual benefits application submission
- Legal advice or guaranteed eligibility determination
- Multi-state coverage (Texas-only prototype)

## Success Criteria
- User completes quiz in under 15 minutes
- Results match manual eligibility research for Texas test cases
- Demo-ready for stakeholder review

## Open Questions
- What is the Anthropic SDK used for — results explanation, chat support, or something else?
- When does multi-state expansion happen (California rules file exists but unclear status)?
- Is there a plan for a backend/database, or does this stay fully client-side?

*Last updated: 2026-02-15*
