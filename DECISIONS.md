# CareNavigator — Key Decisions

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| — | Next.js 15 + React 18 + TypeScript | App router for page-based quiz flow, static export for easy hosting | Active |
| — | Client-side only, no database | Prototype speed; answers never leave the device (privacy feature) | Active |
| — | Zod for validation | Type-safe quiz data with runtime validation (QuizData schema) | Active |
| — | Texas as first state | Specific stakeholder need; texasRules.ts + federalLimits2026.ts encode real eligibility rules | Active |
| — | State-specific rule files (texasRules.ts, californiaRules.ts) | Each state has different programs, income limits, and processing times — separate files scale better than one monolith | Active |
| — | Anthropic SDK dependency | Likely AI-assisted explanation of results or conversational guidance | Active — unclear scope |
| — | Static export (out/ directory) | No server needed for prototype; deploy as static files | Active |
| — | Recharts for data visualization | Results page likely shows income vs. thresholds or eligibility breakdown | Active |

*Last updated: 2026-02-15*


#assessment #financial-inclusion #strategy
