# Technical specification

Product intent belongs to `PRODUCT.md`; visual rules belong to `DESIGN.md`. This file specifies application behavior and technical contracts. Agents must warn the owner before changing AGENTS.md, WORKFLOW.md, or SPEC.md, and must obtain owner review and explicit approval before committing on dev or main. See `WORKFLOW.md` for execution procedures and owner exceptions; task sequencing and assignments are in `PLAN.md`.

## Platform, privacy, and accessibility
- Static GitHub Pages application with public source and an MIT licence; no backend.
- Answers stay in the browser: no answer-bearing URLs, remote analytics/logs, or API submissions. Shared links contain derived axis scores only.
- English and Russian, light/dark themes, responsive layouts, keyboard access, and reduced-motion support are required throughout.
- Display belief/value labels separately. Unsure is missing information, not a neutral response. Samples must be identified as illustrative; real results must not carry sample claims.
- Reference figures remain sourced, dated estimates; their requested presentation is unresolved, not cancelled by omission from the prototype. Keep personal pilot data out of the public repository.

## Stack and application structure
- pnpm, React, TypeScript, Vite, Tailwind, shadcn/ui with Radix primitives, and Zustand. Adapt component defaults to the accepted design.
- Style components with Tailwind utilities, not vanilla CSS. Global CSS is reserved for design tokens, font imports, Tailwind configuration, and application-wide base styles.
- When shadcn supplies a component for the required behavior, install and adapt its Radix version instead of improvising a substitute. Treat the prototype as a visual reference, not an architecture or copy-paste template. Preserve the accepted appearance and tokens; custom components compose existing primitives and own only genuinely custom presentation/behavior.
- FSD v2.1, pages first: start with app/pages/shared, extract reused code only when needed, and import downward through slice public APIs. Structural guidance: `.agents/skills/feature-sliced-design/SKILL.md`.
- React Router framework mode, `ssr: false`, with static prerendering. Routes are `/en/`, `/ru/`, and each language's `test` and singular `result` paths; `/` redirects to a supported language. Match router basename and Vite asset base to the GitHub Pages project path.
- Browser-only APIs must not execute during prerendering. Production output must support direct links, correct-language HTML before hydration, base-path assets, and 404 recovery; a Vite development fallback is insufficient evidence.
- Language comes from the route; use typed EN/RU dictionaries keyed by canonical research IDs, without an i18n library. Preserve presentation preferences across navigation/language changes.
- Zustand stores answers, navigation, developer selection, completion, and reset state. Persist progress in localStorage with explicit hydration after mount; derive scores/matches instead of persisting duplicates.
- Vitest and React Testing Library. CI runs lint, TypeScript, tests, and production build on PRs into dev/main and pushes to both branches.

## Questionnaire and results
- Full content: 66 core questions on 10 axes, plus an optional 15 developer questions on 3 axes; 15 core camps, 7 developer camps, 9 reference figures, and 7 hints.
- Display one question at a time with response-gated Next, Back, visible progress, and sourced term hints. Developer opt-in is unchecked and occurs before the test; there is no post-core or Results opt-in.
- Preserve progress across reloads and language changes. Duration/progress copy must describe the full questionnaire, not the prototype's short sample sequence or placeholders.
- Result pages render solely from URL scores, independently of local answers/store. Recompute matches using supported rules/data for the encoded version. Missing, malformed, or unsupported results get a recovery state.
- Generate PNG exports with browser canvas, using DESIGN for composition. Include real scores, named poles, applicable developer results, actual project URL, embedded/local fonts, and retained notices; support variable and long camp text.
- Scores, matches, UI, and exports must use the same canonical representation after URL encoding so rounding cannot change shared results.

## Data and scoring contracts
- Canonical source: `../research/research-results/data/` for IDs/numbers and `test/translations.md` for wording, resolved as WORKFLOW describes. Numeric data wins over research prose/tables; report discrepancies. Preserve wording and keying, except explicit local overrides: English Ecology/Creativity/Labor endpoints are Low harm / High harm.
- Responses are +1, +0.5, 0, -0.5, -1; skip Unsure. Compute keyed weighted means with primary weight 1 and declared secondary weight 0.5, then map [-1, 1] to [0, 100]. Coverage/Undefined rules remain unresolved.
- Match core/developer camps separately using RMS distance and `100 - distance`; exclude Undefined axes and apply the agreed wildcard penalty. Core eligibility requires at least 4 defining axes and 3 shared scored defining axes; developer eligibility requires 2 and 2. Show up to 3 eligible camps, or axes alone if none qualify.
- URL format: one version byte plus 13 stable-order axis bytes, values 0–100 or sentinel 255 for Undefined/not taken, base64url-encoded in `?r=…`. Precision, ordering, and compatibility remain unresolved; the sentinel cannot distinguish an all-Undefined developer profile from a skipped module.
- Preserve software/asset/font licences and provenance when adapting source assets from `../design/`. Historical reviews validate only the prototype scope they describe.

## Unresolved technical choices
- Scoring: minimum answered coverage, whether secondary effects count toward coverage, keying-pole balance, wildcard penalty, low-match threshold, tie-breaking, and rounding. Research's 20-point penalty and 70% threshold are proposals, not approved defaults.
- Questionnaire: fixed interleaved order versus session shuffle; storage versions, completion/restart semantics, and changed developer selection with saved progress.
- Sharing: canonical axis order/precision, supported versions, and skipped versus all-Undefined developer results.
- Results: reference-figure presentation, optional opposite camp, Russian person names, and missing real-result/Undefined/low-match/recovery copy.
- Hosting: repository base path and public metadata.

## External evidence
Read-only sibling sources supply detail where consistent with local specifications; do not import their historical workflow or prototype-only behavior as requirements.
- Research: `../research/research-results/README.md`, `spec.md`, `build.md`, `test/scoring-model.md`, `test/translations.md`, `data/`, and `open-items.md`.
- Design implementation/assets: `../design/src/`, `public/`, and `CREDITS.md`. The canonical local presentation specification is DESIGN, not a second external requirements file.
