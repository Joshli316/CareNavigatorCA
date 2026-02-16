# CareNavigator — Architecture

## Stack
- Next.js 15, React 18, TypeScript, Tailwind 3
- Zod (validation), Recharts (data viz), Lucide React (icons)
- Anthropic SDK (AI features)
- npm (not pnpm), static export to `out/`

## File Structure (key files only)
- `app/quiz/page.tsx` — Quiz entry point, wraps QuizContainer component
- `app/results/page.tsx` — Results display after quiz completion
- `app/grants/` — Grants discovery section
- `app/vault/` — Document tracking section
- `components/quiz/` — Multi-step quiz UI components
- `lib/rules/constants/texasRules.ts` — Texas-specific eligibility rules (STAR+PLUS, SNAP, Medicaid, Housing)
- `lib/rules/constants/federalLimits2026.ts` — Federal poverty level calculations
- `lib/rules/constants/californiaRules.ts` — California rules (likely not yet active)
- `lib/rules/constants/documentRequirements.ts` — Required docs per program
- `types/quiz.ts` — Core types: QuizState, QuizData (geography/disability/financial/demographic), enums for DisabilityType, IncomeType, AssistanceLevel
- `lib/context/` — React context for quiz state management
- `lib/data/` — Benefits program data

## Data Flow
- User fills multi-step quiz (geography -> disability -> financial -> demographic)
- Quiz state managed via React context + reducer (QuizAction types: SET_STEP, UPDATE_DATA, MARK_COMPLETE, SET_ERRORS, RESET)
- On completion, rule engine evaluates answers against federal FPL limits + state-specific rules
- Results rendered with program names, eligibility status, processing timelines
- All data stays in browser — no server calls for eligibility logic

## Deployment
- `npm run build` produces static export in `out/`
- Deployable to any static host (Cloudflare Pages, Vercel, etc.)
- `./START_PROTOTYPE.sh` for quick local demo

## Known Limitations
- Texas only — California rules exist but may be incomplete
- No persistence — refreshing the page loses quiz progress
- No backend — Anthropic SDK usage unclear (may need API key at runtime)
- Federal poverty limits hardcoded for 2026 — needs annual update

*Last updated: 2026-02-15*
