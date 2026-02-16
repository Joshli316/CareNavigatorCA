# CareNavigator — Changelog

## 2026-02-15 — Project documentation
- Added CLAUDE.md, PRD.md, and DECISIONS.md for project context and onboarding

## Undated — Demo-ready prototype
- Multi-step eligibility quiz collecting geography, disability, financial, and demographic data
- Rule engine evaluating federal (FPL-based) and Texas-specific program eligibility (STAR+PLUS, SNAP, Medicaid, Housing)
- Results page showing likely-qualifying programs with processing timelines
- Grants section for additional funding opportunities
- Document vault for tracking required paperwork per program
- Zod schemas for runtime validation of quiz data
- Static export to `out/` for serverless hosting
- Texas test data and demo flow documented in HOW_TO_START.txt

## Undated — Initial project setup
- Next.js 15 + React 18 + TypeScript + Tailwind 3
- App router with page-based quiz flow (`app/quiz/`, `app/results/`, `app/grants/`, `app/vault/`)
- Component architecture: grants, layout, quiz, results, shared
- Rule engine architecture with per-state files (`texasRules.ts`, `californiaRules.ts`)
- Federal income limits encoded in `federalLimits2026.ts`
- Anthropic SDK dependency added (scope unclear — likely AI-assisted results explanation)
- Recharts for data visualization on results page
- Client-side only — no database, answers never leave the device

*Last updated: 2026-02-15*
