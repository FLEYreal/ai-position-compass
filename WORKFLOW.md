# Project workflow

## Methodology

### Scope

Governs project execution, including owner and agent responsibilities, worktree setup, verification, reporting, and Git review and release.

### Updating policy

#### Rules

- Never add new content to this file without the owner's direct approval.

#### Procedures

**Update a workflow stage.** When a workflow requirement or procedure changes, update the affected stage so readers can find the current instructions where they apply.

1. Open with a short scope paragraph naming what the stage governs. Keep instructions and background in the sections below.
2. Put standing obligations and restrictions under **Rules**. Keep ordered steps and explanatory notes in their own sections.
3. Under **Procedures**, title each procedure, explain when and why to use it, then give the steps in order. Verify changed commands against the repository.
4. Under **Context**, list supporting facts, rationale, or links. Put requirements under **Rules** and actions under **Procedures**. Link to existing guidance wherever it already covers the subject.

#### Context

- The [source-of-truth map](AGENTS.md#sources-of-truth) identifies the files for application requirements, assignments, and operational status.

## Roles and permissions

Who assigns work, edits shared documents, and controls publication.

### Rules

- The owner assigns work. The planner researches, drafts specifications and task briefs, and reviews reports. The worker implements assigned supporting work independently using repository context.
- Agents may explain, review, and identify bugs in owner-owned code. Solutions, edits, and tests for owner-owned features require an explicit request. Reserved work stays with the owner even when it blocks another task.
- The owner maintains `PLAN.md` and `DEBT.md`. Agents need an explicit request to edit them. The planner maintains `MEMORY.md` and workers report operational updates.
- Workers may implement, add dependencies, test, fix, and commit locally within scope. The owner may commit directly on `main` and `dev`. Agents need explicit owner approval of the reviewed diff before committing there.
- Only the owner pushes code, uploads commits or files, changes remote branch refs, and merges or authorizes publication. This applies across all tools.
- Keep plans, review notes, reports, and handoffs Git-ignored. Never stage or track `MEMORY.md`.

### Procedures

**Edit controlled documentation.** When an assignment touches shared instructions or local notes, check the edit boundary before changing what others rely on.

1. Before editing `AGENTS.md`, `WORKFLOW.md`, or `SPEC.md`, tell the owner which files will change and why. An explicit owner instruction authorizes the edit.
2. Get explicit permission before adding a Git-visible Markdown file or removing an ignore rule that protects one. Keep existing approved tracked requirements and required third-party notices.

### Context

- See [AGENTS.md](AGENTS.md) for the source-of-truth map and instruction precedence.

## Starting work

Assignment context, linked worktrees, dependencies, and local servers.

### Rules

- Use one feature branch and worktree per task at `../worktrees/<feature>/` relative to the original checkout. The owner establishes the remote and `dev`. Initializing shared branches requires explicit owner instruction.
- Keep local sources in the original checkout. Link `PLAN.md`, `DEBT.md`, and `MEMORY.md` in same-machine worktrees using ignored symlinks. Also link `PRODUCT.md` and `DESIGN.md` when present. Require them for tasks that depend on them.
- On another machine, the owner supplies ignored context as current files in its original checkout or as an explicit bundle.
- Keep dependencies and build output per worktree. Use a distinct port per server and leave other checkouts and servers alone.
- Keep both agent hooks active and preserve agent environment markers. Verify changed hooks against the worker tools and normal worktree use.
- Resolve the read-only `../design/` and `../research/research-results/` references relative to the original checkout.

### Procedures

**Check context.** Before starting or resuming after a long wait, check for changes to the instructions and task.

1. Find the original checkout with `git worktree list --porcelain`. It is listed first. Inspect Git status and preserve existing changes.
2. Check that required files are readable and context symlinks resolve. Read [AGENTS.md](AGENTS.md), this workflow, [SPEC.md](SPEC.md), the assigned plan entry, and relevant local sources.
3. Report missing, unreadable, or dangling files by name, including optional omissions. For required files, explain what they block and ask for the current copy or an owner decision. Pause dependent changes, recommendations, and status claims. Continue diagnosis and independent work where context allows.

**Create and link a worktree.** When an assigned feature needs its own checkout, prepare context before the worker starts so it can work independently.

1. Fetch current `dev`. From the original checkout, create the branch and worktree from `origin/dev`, for example `git worktree add -b feat/tooling ../worktrees/tooling origin/dev`.
2. Before linking, check that all applicable sources are readable and each destination is absent, including dangling symlinks. Verify ignore coverage with `git check-ignore` in the feature worktree. Report failed checks and pause linking until they pass.
3. Resolve the absolute source and destination paths at runtime. Link each file with `ln -sT -- "$source" "$destination"`. Check that each link resolves to the original file and stays unstaged.

**Set up local tools.** When a clone or worktree needs tools or a server, configure it in place to keep checkouts independent.

1. Run `pnpm install --frozen-lockfile` under session restrictions. Report unavailable prerequisites. Get permission before changing registry sources.
2. Run `pnpm hooks:install` once per clone to activate the pre-push hook.
3. Start development with `pnpm dev` on a distinct port, for example `pnpm dev --port 5181 --strictPort`. Use `pnpm preview` to preview production output.

### Context

- The branch supplies tracked instructions, README, and skills.
- The [pre-push hook](.githooks/pre-push) blocks agent pushes. Trusted [Codex hooks](.codex/hooks.json) also block pushes and API code writes. GitHub rulesets are optional.

## Checks and reporting

Verification in the changed worktree and the report the owner uses to review it.

### Rules

- The owner uses TDD for core work. Workers test UI after implementation. Verify behavior and integration through normal entry points.

### Procedures

**Verify and report a change.** Before marking a PR ready or reporting a meaningful update, gather evidence for owner review.

1. Check the implementing worktree. For code changes, use applicable checks from `pnpm lint`, `pnpm build` (includes TypeScript), and `pnpm exec vitest run`. For docs-only changes, check formatting, links, and the diff.
2. For UI changes, verify affected languages and themes, responsive layouts, keyboard behavior, and reduced motion in a browser.
3. Report the changes, checks run and their results, limitations, owner actions, and suggested comprehension debt. Name the kind of check and include checkout, branch, and port when relevant. Keep private paths out of public PRs.

### Context

- Source inspection, prototype review, and frontend verification provide different evidence.

## Git, review, and cleanup

Branch roles, local commits, pull requests, releases, and worktree cleanup.

### Rules

- `main` is reserved for releases. Pushes to `main` deploy to GitHub Pages. `dev` integrates reviewed features. Feature PRs target `dev`. Use focused PRs and Conventional Commits. Make one commit per fix or completed feature with its directly related tests. Keep independent changes in separate commits.
- Keep showcases, demonstrations, galleries, fixtures, and their integration out of submissions to `dev` unless the owner approves them. Keep review copies and integration hunks visible and unstaged. Use explicit staging paths and avoid blanket ignore patterns for source files.
- Keep worktrees available while their PRs are awaiting review. Never force-push, rewrite shared history, or delete unmerged work.

### Procedures

**Sync a feature.** When `dev` advances, bring it into the affected feature branch to catch integration issues.

1. Fetch current `dev`, merge it into the feature branch, and resolve conflicts in that worktree.
2. Rerun applicable checks and report meaningful changes made after review.

**Submit a feature.** When a feature is ready for owner review, check the complete diff so the PR contains only intended changes.

1. Inspect the full diff against `dev`. The owner reviews, verifies, approves, and pushes the result.
2. After that approval and push, an agent may create or update a PR for the already-pushed diff, check CI, and address feedback locally.
3. The owner squash-merges short-lived feature PRs into `dev`.

**Release or bring back a fix.** When transferring changes between shared branches, use a PR so the owner can review them.

1. Choose the direction. Use `dev` into `main` for a release or carry the `main`-only fix into `dev`.
2. Before the first release, the owner selects **GitHub Actions** under **Settings → Pages → Build and deployment → Source**.
3. Submit the PR through owner review. The owner uses a merge commit for release PRs.
4. For a release, verify that the [GitHub Pages workflow](.github/workflows/pages.yml) succeeds and check the deployed URL.

**Clean up a merged feature.** After a PR merges, verify the work is retained before removing the worktree.

1. Confirm the PR is merged, the changes are in the destination branch, and the worktree is clean.
2. Remove the clean worktree with `git worktree remove`. If branch cleanup is blocked by an ancestry check, verify the retained patch before any branch deletion.

### Context

- A squash merge can retain the patch without preserving the feature commits as ancestors. See the [GitHub merge methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github) and [Git worktree reference](https://git-scm.com/docs/git-worktree).
