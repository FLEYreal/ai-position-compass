# Technical specification

## Methodology

### Scope

Defines application behavior, technical constraints, data contracts, and the procedures that implement or verify them. Tracks open and deferred technical decisions in [Status](#status).

### Updating policy

#### Rules

- Never add new content to this file without the owner's direct approval.

#### Procedures

**Update a technical contract.** When a technical requirement, procedure, or source changes, update the contract that governs it so readers can find the current agreement in one place.

1. Open the contract with a short scope paragraph naming the behavior or data it governs. Keep requirements, instructions, and source details in the sections below.
2. Put required behavior, invariants, and constraints under **Rules**. Link to rules defined elsewhere and put rationale and ordered steps in their own sections.
3. Under **Procedures**, title each procedure, explain when and why to use it, then give the technical steps in order. Refer to standing rules where needed.
4. Under **Context**, list supporting facts, rationale, or source links. Put unsettled technical decisions in [Status](#status). When a decision is settled, update its contract and remove the status entry.

#### Context

- [WORKFLOW.md](WORKFLOW.md) owns project procedures. `PLAN.md` owns task assignments and progress.

## Technical contracts

### Platform and routing

The app's stack, localized routes, static hosting, accessibility, and privacy.

#### Rules

- Run the app as a static GitHub Pages site without a backend. Keep raw answers in the browser and out of URLs, APIs, analytics, and remote logs. Shared result URLs carry only derived scores and the fields needed to decode them. Keep personal pilot data private.
- Deploy to GitHub Pages only on pushes to `main`, the [release-only branch](WORKFLOW.md#git-review-and-cleanup).
- Support English and Russian, light and dark themes, responsive layouts, keyboard access, and reduced motion. Preserve presentation preferences across navigation and language changes. Retain software, asset, and font licences and attribution.
- Use pnpm, React, TypeScript, Vite, Tailwind, shadcn/ui with Radix, and Zustand. Use Tailwind utilities for components. Reserve global CSS for tokens, fonts, Tailwind configuration, and base styles.
- Use React Router framework mode with `ssr: false` and static prerendering. Each locale has home, `test`, and singular `result` routes. Unlocalized entry points redirect to a supported locale. Run browser-only APIs in the browser.

#### Procedures

**Change a route or deployment base.** When either changes, check the production output to catch paths that break under the deployment base.

1. Align the router and asset bases through `PUBLIC_BASE_PATH`. The Pages workflow supplies the configured base path (normally `/ai-position-compass/`) and the public site URL for canonical and social metadata.
2. Verify direct links, correct-language HTML before hydration, base-path assets, and 404 recovery.

**Adapt a UI component.** When the UI needs a component, reuse existing primitives to keep interactions consistent.

1. Start with the matching shadcn Radix component where available.
2. Adapt it to the accepted design and compose existing primitives for custom behavior.

#### Context

- The public source is released under the [MIT licence](LICENSE).
- Tests use Vitest and React Testing Library. See the [CI workflow](.github/workflows/ci.yml) for checks.
- See the [published artwork credits](public/ASSET-CREDITS.txt) and [software and font notices](public/licenses/). The build adds the project MIT text and bundled dependency notices.

### Structure and translations

Source layout, slice dependencies, and how localized copy reaches the UI.

#### Rules

- Follow FSD v2.1 pages-first structure and import downward through slice public APIs.
- Use the route locale and typed EN/RU dictionaries with matching keys, without an i18n library. Shell wording lives in `src/app/i18n/`, slice wording in each slice's `i18n/`, and reusable labels and infrastructure in `src/shared/i18n/`. Each dictionary exposes its contract and locale loader through `index.ts`. Route modules load only the selected locale and required dictionaries using helpers shared by prerendering and browser navigation.
- All current and future on-page editorial illustrations use the same [`EditorialPrint`](src/shared/ui/editorial-print.tsx) component in `src/shared/ui` for color and halftone. Keep that treatment in the shared component. Compositions own their source art, silhouettes, and backing paper.
- Shared UI receives translated text, accessible names, and count formatters through props. Interpolate counts and `projectName` from typed configuration using complete messages and locale-specific grammar. Use distinct keys for distinct contexts or inflections.
- Use `TRANSLATIONS.md` as the sole source for application copy. Semantic changes to question wording require owner approval.

#### Procedures

**Add or revise localized wording.** When a screen needs new copy or an edit, use the worksheet to keep both languages consistent with the reviewed wording.

1. Find the entry in the local `TRANSLATIONS.md` worksheet, including reviewed Russian spellings of public names where applicable.
2. For missing, ambiguous, or placeholder copy, give the owner the key, full English message, UI context, and placeholder meanings. Leave the affected copy pending until reviewed wording is available. Keep both locales free of placeholders and silent English fallbacks.
3. Copy the reviewed EN/RU entries into the owning dictionaries at development time. Preserve research IDs and worksheet keys.

#### Context

- The [FSD skill](.agents/skills/feature-sliced-design/SKILL.md) covers slice structure and public APIs.

### Questionnaire and saved progress

Home entry, question order, navigation, developer opt-in, completion, and persistence.

#### Rules

- Use a fixed, interleaved question order across locales and reloads. Preserve answers and the current question on reload and when switching languages. Derive question counts from the selected modules. Base published duration estimates on timed observations.
- Show one question at a time with Back and visible progress. Enable Next once the question has a response. Show all seven term hints inline with their questions. Include the sources provided by the research, and render glossary explanations without a source link when the research lists none.
- Keep unanswered, Unsure, and neutral distinct. Completion requires a response to every selected question, including Unsure. Persist answers by question ID, current question ID, developer selection, start and completion status, and questionnaire version in localStorage via Zustand. Derive scores and matches. Version the storage schema separately from the questionnaire and scoring model.

#### Procedures

**Enter or resume the questionnaire.** Restore saved state before enabling the Home action or questionnaire controls.

1. Hydrate after mount and validate saved state. Use explicit migrations for supported older schemas. Offer a confirmed reset for damaged or incompatible progress.
2. On Home, label the primary action for a fresh, unfinished, or completed questionnaire. A fresh start opens the localized welcome dialog with developer opt-in unchecked. A direct Test visit offers the same setup for a fresh questionnaire. Confirming the dialog saves the module and marks the questionnaire started before the first answer.
3. Open unfinished progress at the saved question. Skip the welcome dialog for unfinished and completed progress. For completed progress, offer results, review or editing, and restart. Before the result route supports score links, the Home results action opens the completed questionnaire screen.
4. If storage is unavailable, continue in memory and explain that progress may be lost on reload or close. Use the same fallback if a later write fails.

**Reset progress.** When the user requests a restart or changes module selection after answering begins, confirm the reset to prevent accidental data loss.

1. Ask for confirmation before applying the change.
2. On confirmation, clear the questionnaire and retain language and theme preferences. The new questionnaire opens the welcome dialog so the user can choose the module again.

#### Context

- The [scoring configuration](src/shared/config/scoring.ts) supplies question definitions in their fixed order and source links for the term hints. The hint references come from the Hints section of `../research/research-results/resources/test/questions.md`. The accepted Home and question sheet presentation lives in `DESIGN.md`.

### Scoring

Axis coverage, numeric scores, and separate core and developer camp rankings.

#### Rules

- Response values are `-1`, `-0.5`, `0`, `0.5`, and `1`. Neutral counts toward coverage. Unsure contributes neither coverage nor score.
- An axis needs at least half its primary questions answered, rounded up, including one statement with key `+1` and one with key `-1`. Failed coverage yields Undefined (`null`). Primary weight is `1` and declared secondary weight is `0.5`. Secondary effects inherit the source response and use their own key. They contribute to eligible targets even if the source axis is Undefined. Only primary answers establish coverage.
- Core camp eligibility requires 4 defining axes and 3 scored defining axes in common. Developer eligibility requires 2 and 2.
- Similarity is `100 − RMS` across scored axes. Use the score difference for defining axes and a 20-point difference for wildcards. Omit Undefined axes.
- Numeric source data takes precedence over research prose. Report discrepancies.

#### Procedures

**Calculate axis scores.** When answers need scoring, group all primary questions so coverage uses the full denominator.

1. Pass one group per axis to [`calculateAxesScore`](src/entities/scoring/model/axis.ts), with every primary question represented, including Unsure responses.
2. For eligible axes, take the weighted mean of `key × response`, map `[-1, 1]` to `[0, 100]`, and round once. Return one score per supplied axis in input order.
3. Use the same whole scores for matching, display, exports, and URL encoding.

**Rank camps.** When a result needs comparisons, score each module separately to apply its own eligibility rules.

1. Pass scores, camps, and explicit module settings to [`findCampMatches`](src/entities/scoring/model/camp.ts).
2. Use the returned ranking by descending raw similarity, with exact ties broken by stable camp ID. Read `passesThreshold` to identify close matches. It is true at raw similarity of 70 or higher.

#### Context

- The [scoring configuration](src/shared/config/scoring.ts) defines IDs, order, keys, weights, camp positions, and settings.
- The research source for numeric data is `../research/data/`, relative to the canonical checkout.
- See `../research/research-results/test/scoring-model.md` for research background.

### Results and exports

The presentation of axis scores, camp comparisons, and PNG exports.

#### Rules

- Render results from URL scores independently of saved answers. Label belief and value axes separately and distinguish Undefined from neutral. Label samples as illustrative and use result-specific copy for real scores.
- Show up to three eligible camps per module with rounded similarity percentages. Show axes alone when none qualify. Describe similarity as a distance-based measure and avoid implying a probability of camp membership.

#### Procedures

**Render a shared result.** When someone opens the results page, use the encoded version so the comparison retains its intended meaning.

1. Decode the link using the [shared result format](#shared-result-format). Show recovery if the link is missing or decoding fails.
2. Recompute matches under the encoded version's rules. If the best eligible camp falls below the close-match threshold, explain the low fit and retain the nearest comparisons.

**Export a PNG.** When someone requests an image, use the displayed result so the export reflects the same scores.

1. Follow the local `DESIGN.md` for composition. Lay out the image for browser canvas using local or embedded fonts and allow room for long camp text.
2. Draw the real scores, named poles, applicable developer results, deployed project URL, and required notices.
3. Use the eligible camp comparisons shown on the results page for any camp entries in the image. Retain their display order. When no camps qualify, show the axis profile alone.

#### Context

- The English Ecology, Creativity, and Labor endpoints are Low harm and High harm.

### Shared result format

The URL payload, validation, and compatibility across result versions.

#### Rules

- Version 1 uses 15 bytes. The first byte is the version (`1`), the second is flags, and the remaining 13 are axis scores. Flag bit 0 indicates developer participation. Reserved bits are zero.
- Fixed axis order is `regulation`, `control`, `geopolitics`, `openness`, `capability`, `existentialRisk`, `ecology`, `creativity`, `labor`, `surveillance`, `openSourcePreference`, `aiDelegation`, `displacementRisk`.
- Axis bytes are integers from 0 to 100 or `255` for Undefined. Skipping the developer module requires three Undefined developer bytes. The participation flag distinguishes a taken module with all three axes Undefined.
- A result version fixes axis order and interpretation, camp positions, and matching rules.

#### Procedures

**Encode a link.** When creating a share URL, use canonical encoding so each payload has one representation.

1. Write the version and flags, followed by scores in the fixed axis order.
2. Encode the bytes as canonical unpadded base64url and put the value in `?r=…`.

**Decode a link.** When reading a shared URL, validate the payload so missing, malformed, or unsupported data leads to recovery.

1. Check that the parameter exists and validate the alphabet, exact length, and canonical encoding.
2. Check the supported version, reserved bits, byte values, and developer flag consistency. Return the validated scores or signal a decoding failure to the results page.

**Update the version.** When a change affects link interpretation or matches, version it to preserve existing results.

1. Assign a new version to the changed format or rules.
2. Retain supported decoders and their version-specific matching definitions.

#### Context

- See [Scoring](#scoring) for how the whole scores in the payload are calculated.

## Status

### Open decisions and checks

- Define the saved-progress schema and migrations.
- Calibrate the wildcard penalty and close-match threshold during the pilot.
- Review EN/RU wording for real results, Undefined axes, low matches, storage notices, and recovery before use.
- Verify canonical URLs and social metadata on the first GitHub Pages deployment.

### Deferred

- Reference figures and opposite-camp comparisons are deferred pending an owner decision.
