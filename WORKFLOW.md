# Roles and permissions

- The planner researches, prepares specifications/task briefs, and reviews reports. The worker implements assigned supporting work independently from repository context.
- Task ownership is defined in `PLAN.md`. For owner-owned implementations/tests, agents may explain concepts, review, and identify bugs; solutions, edits, and additional tests require an explicit request. Do not implement reserved work to unblock another task.
- The owner maintains `PLAN.md` and every section of `DEBT.md`; agents edit them only on explicit request. Suggest debt entries in reports. The planner maintains `MEMORY.md`; workers report handoff updates.
- Workers may implement, add necessary dependencies, test, fix, commit, push feature branches, and open/update PRs within assigned scope. Only the owner merges PRs or authorizes publication. Never push directly to main/dev, force-push, rewrite shared history, or delete unmerged work.

# Canonical checkout and local context

The original frontend checkout is the main worktree, listed first by `git worktree list --porcelain`. Locate it at runtime; do not store its absolute path in documentation. Feature worktrees live at `../worktrees/<feature>/` relative to it. Resolve sibling `../design/` and `../research/research-results/` references from the original checkout; both are read-only source material.

`PLAN.md`, `DEBT.md`, and `MEMORY.md` are required ignored local files in the original checkout. `PRODUCT.md` and `DESIGN.md` are optional local sources: when present there, link them too; if an assigned task requires an absent source, report it. Never replace missing context with invented requirements.

All five files have one canonical copy in the original checkout. Feature worktrees use ignored symlinks, never copies or committed links. Tracked AGENTS/SPEC/WORKFLOW, README, and skills arrive with the branch; their changes must be integrated before new worktrees inherit them. Remote workers need an explicit context bundle because local symlinks are inaccessible remotely.

# Starting work

1. Read AGENTS, this procedure, SPEC, the assigned PLAN entry, and relevant local context. Inspect Git status; preserve existing changes. After a long wait, reread shared context and check updated specifications.
2. The owner establishes the remote and dev branch. Fetch current dev and create one feature branch/worktree per task; do not initialize shared branches without explicit instruction. From the original checkout, for example: `git worktree add -b feat/tooling ../worktrees/tooling origin/dev`.
3. Link context before launching the worker. Run this example from the original checkout after the feature worktree exists. It checks all destinations before creating links and never overwrites them. Missing optional files are skipped; broken or non-file sources are errors.

```bash
(
  set -eu
  project_checkout="$(pwd -P)"
  feature_checkout="$project_checkout/../worktrees/tooling"
  context_files=(PLAN.md DEBT.md MEMORY.md)
  for context_file in PRODUCT.md DESIGN.md; do
    if [ -e "$project_checkout/$context_file" ] || [ -L "$project_checkout/$context_file" ]; then
      context_files+=("$context_file")
    fi
  done
  for context_file in "${context_files[@]}"; do
    test -f "$project_checkout/$context_file"
    test ! -e "$feature_checkout/$context_file"
    test ! -L "$feature_checkout/$context_file"
    git -C "$feature_checkout" check-ignore -q -- "$context_file"
  done
  for context_file in "${context_files[@]}"; do
    ln -sT -- "$project_checkout/$context_file" "$feature_checkout/$context_file"
    test "$(readlink -f -- "$feature_checkout/$context_file")" = "$(readlink -f -- "$project_checkout/$context_file")"
  done
)
```

4. Inspect worktree status and confirm no context links are staged. Keep dependencies and build output per worktree; never share node_modules symlinks. Install using the configured registry; follow session-level installation restrictions. Stop and report unavailable prerequisites instead of changing registry sources without permission.
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
- Squash short-lived feature PRs into dev. Promote dev to main through an owner-merged release PR using a merge commit; bring main-only fixes back into dev through an owner-reviewed PR.
- When dev advances, merge it into affected feature branches, resolve conflicts, rerun relevant checks, and report meaningful post-review changes. Worktrees share Git refs and machine resources; do not alter another checkout.
- Keep waiting PR worktrees available for review fixes. After merge, confirm PR status, retained changes, and a clean worktree before cleanup. Squash merges may fail ancestry-based merged checks; never force-remove blindly.
