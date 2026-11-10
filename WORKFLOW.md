# Roles and permissions

- The planner researches, prepares specifications/task briefs, and reviews reports. The worker implements assigned supporting work independently from repository context.
- Task ownership is defined in `PLAN.md`. For owner-owned implementations/tests, agents may explain concepts, review, and identify bugs; solutions, edits, and additional tests require an explicit request. Do not implement reserved work to unblock another task.
- The owner maintains `PLAN.md` and every section of `DEBT.md`; agents edit them only on explicit request. Suggest debt entries in reports. The planner maintains `MEMORY.md`; workers report handoff updates.
- Workers may implement, add necessary dependencies, test, fix, and commit locally within assigned scope. Agents must never push, upload commits/files, or mutate remote branch refs through Git, GitHub APIs, connectors, or other tools. The owner reviews and verifies locally, approves the result, and pushes it. Only after that approval may an agent create/update a PR for the already-pushed diff, check CI, and address review feedback locally. Only the owner merges or authorizes publication. Never force-push, rewrite shared history, or delete unmerged work.
- The owner may commit and push directly to main or dev. Agents must not commit on main or dev until the owner has reviewed the exact changes and explicitly approved the commit.
- Before editing AGENTS.md, WORKFLOW.md, or SPEC.md, warn the owner which files will change and why. Explicit owner instructions authorizing the edits remain sufficient; do not silently change these files.
- Do not add a new Git-visible Markdown file, or remove its ignore protection, without explicit owner permission. Keep plans, audit/review notes, reports and handoffs in ignored local context. Existing approved tracked Markdown requirements remain in place; required third-party notices must be retained.
- Showcases, component galleries, demonstrations, review fixtures and their integration code must stay out of changes submitted to dev unless the owner explicitly approves including them. Keep local review copies and integration hunks unstaged by default, but visible for review; do not blanket-ignore source files by names such as showcase. Stage production paths explicitly and inspect the complete diff against dev before the owner pushes it for a PR.

# Canonical checkout and local context

The original frontend checkout is the main worktree, listed first by `git worktree list --porcelain`. Locate it at runtime; do not store its absolute path in documentation. Feature worktrees live at `../worktrees/<feature>/` relative to it. Resolve sibling `../design/` and `../research/research-results/` references from the original checkout; both are read-only source material.

`PLAN.md`, `DEBT.md`, and `MEMORY.md` are required ignored local files in the original checkout. `PRODUCT.md`, `DESIGN.md`, and `TRANSLATIONS.md` are additional local sources: link them when present, and require them whenever the assigned work depends on their content. The translation source is named `TRANSLATIONS.md` (plural); see SPEC for its use.

These files have one canonical copy in the original checkout. Feature worktrees on the same machine use ignored symlinks, never copies or committed links. Tracked AGENTS/SPEC/WORKFLOW, README, and skills arrive with the branch; their changes must be integrated before new worktrees inherit them. Git-ignored files do not arrive through clone, fetch, pull, or branch switching. On another machine, the owner must manually supply current copies in that machine's canonical checkout, or provide an explicit context bundle. Symlinks pointing to the original machine are not a usable handoff.

Before acting on an assignment, check that required instructions, PLAN and local context exist, are readable files, and that any context symlinks resolve. If a required or task-relevant file is missing, unreadable, or a broken link, report its exact filename to the owner, explain what work depends on it, and request the current copy or an explicit owner decision about proceeding. Report before making dependent changes, recommendations or task-status claims. Do not silently skip the file, create an empty substitute, reconstruct it from memory, or treat missing context as permission to proceed. Read-only checks to identify the missing files may continue; independent work may continue only when its required context is available. List nonessential omitted files explicitly as well.

# Starting work

1. Run the context availability check above, then read AGENTS, this procedure, SPEC, the assigned PLAN entry, and relevant local context. Inspect Git status; preserve existing changes. A missing ignored PLAN or translation source is a handoff problem to report, not a reason to guess the assignment or wording. After a long wait, reread shared context and check updated specifications.
2. The owner establishes the remote and dev branch. Fetch current dev and create one feature branch/worktree per task; do not initialize shared branches without explicit instruction. From the original checkout, for example: `git worktree add -b feat/tooling ../worktrees/tooling origin/dev`.
3. Link context before launching the worker. Run this example from the original checkout after the feature worktree exists and task-relevant sources have been confirmed available. It reports missing optional files and checks every source/destination before creating links; it never overwrites them. Relay failures and omissions to the owner instead of silently continuing.

```bash
(
  set -eu
  project_checkout="$(pwd -P)"
  feature_checkout="$project_checkout/../worktrees/tooling"
  context_files=(PLAN.md DEBT.md MEMORY.md)
  for context_file in PRODUCT.md DESIGN.md TRANSLATIONS.md; do
    if [ -e "$project_checkout/$context_file" ] || [ -L "$project_checkout/$context_file" ]; then
      context_files+=("$context_file")
    else
      printf 'Optional context unavailable: %s; stop if required by this task.\n' "$context_file" >&2
    fi
  done
  context_error=0
  for context_file in "${context_files[@]}"; do
    if [ ! -f "$project_checkout/$context_file" ] || [ ! -r "$project_checkout/$context_file" ]; then
      printf 'Missing, unreadable or invalid context source: %s\n' "$context_file" >&2
      context_error=1
    fi
    if [ -e "$feature_checkout/$context_file" ] || [ -L "$feature_checkout/$context_file" ]; then
      printf 'Context destination already exists: %s\n' "$context_file" >&2
      context_error=1
    fi
    if ! git -C "$feature_checkout" check-ignore -q -- "$context_file"; then
      printf 'Context destination is not Git-ignored: %s\n' "$context_file" >&2
      context_error=1
    fi
  done
  if [ "$context_error" -ne 0 ]; then exit 1; fi
  for context_file in "${context_files[@]}"; do
    ln -sT -- "$project_checkout/$context_file" "$feature_checkout/$context_file"
    test "$(readlink -f -- "$feature_checkout/$context_file")" = "$(readlink -f -- "$project_checkout/$context_file")"
  done
)
```

4. Inspect worktree status and confirm no context links are staged. Keep dependencies and build output per worktree; never share node_modules symlinks. Install using the configured registry; follow session-level installation restrictions. Stop and report unavailable prerequisites instead of changing registry sources without permission.
   Run `pnpm hooks:install` once per clone to activate the Git pre-push backstop. It refuses pushes from coding-agent processes while leaving the owner's normal terminal available. `.codex/hooks.json` also blocks pushes/API code writes at the tool boundary when its trusted project layer is loaded. Both are guardrails, not a sandbox against deliberate bypasses; never disable them or remove agent environment markers to push.
5. Give each server a distinct port, for example `pnpm dev --port 5181 --strictPort`. Record checkout/branch/port in reports without embedding private home paths in public PRs. Do not stop another checkout's server. Validate the same worktree that implements the change.

# Checks and reporting

- Install: `pnpm install --frozen-lockfile`; development: `pnpm dev`; preview: `pnpm preview`.
- Checks: `pnpm lint`, `pnpm build` (includes TypeScript), and `pnpm exec vitest run`. Testing libraries and CI requirements are in SPEC.
- Owner core work uses TDD; worker UI tests follow implementation. Test meaningful behavior and integration, not component internals.
- Before a ready PR or meaningful update, run applicable checks. For UI changes, verify affected languages/themes, responsive layouts, keyboard behavior, and reduced motion in a browser. Documentation-only changes require document/link/diff checks, not application builds.
- Reports include changes, checks actually run/results, limitations, owner action needed, and suggested comprehension debt. Distinguish source inspection from observed behavior; never claim unrun checks passed or treat a prototype review as frontend verification.
- Agent hooks must cover the actual worker tools without obstructing legitimate worktree use. Verify tool-specific settings rather than copying historical examples. GitHub rulesets are not required.

# Git, review, and cleanup

- main holds released/deployable code; dev integrates reviewed features. Feature PRs target dev. Use Conventional Commits and focused PRs.
- Make one commit per fix or completed feature, including its directly related tests. Put independent fixes, features, and workflow changes in separate commits so each change can be reviewed on its own.
- Squash short-lived feature PRs into dev. Promote dev to main through an owner-merged release PR using a merge commit; bring main-only fixes back into dev through an owner-reviewed PR.
- When dev advances, merge it into affected feature branches, resolve conflicts, rerun relevant checks, and report meaningful post-review changes. Worktrees share Git refs and machine resources; do not alter another checkout.
- Keep waiting PR worktrees available for review fixes. After merge, confirm PR status, retained changes, and a clean worktree before cleanup. Squash merges may fail ancestry-based merged checks; never force-remove blindly.
