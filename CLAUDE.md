## Project

- CareNavigator — benefits eligibility tool that turns 100+ hours of research into a 15-minute guided quiz
- Stack: Next.js 15, React 18, Tailwind, Zod, TypeScript
- Status: Prototype, demo-ready

## File Structure

- `app/` — Next.js app router pages
- `app/quiz/` — Multi-step eligibility quiz flow
- `app/results/` — Results display after quiz
- `app/grants/` — Grants section
- `app/vault/` — Document vault
- `components/` — UI components (grants, layout, quiz, results, shared)
- `lib/rules/` — Eligibility rule engine
- `lib/data/` — Benefits data and program info
- `lib/context/` — React context providers
- `lib/constants/` — App constants
- `lib/hooks/` — Custom hooks
- `lib/utils/` — Utility functions
- `types/` — TypeScript type definitions

## Commands

- Dev server: `npm run dev` (port 3000)
- Build: `npm run build`
- Start: `npm start`
- Quick start: `./START_PROTOTYPE.sh`

## Environment Gotchas

- Uses npm (not pnpm)
- Tailwind 3 (not v4) — uses clsx + tailwind-merge for class composition
- Static export configured (`out/` directory exists)
- Texas test data in HOW_TO_START.txt for demo flows
- Multiple .md files with deployment/performance guides — check before duplicating docs


#assessment #financial-inclusion
