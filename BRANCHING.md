Branching: what branches are and how to use them

What is a branch?
A branch is a lightweight movable pointer to commits in Git. It represents an independent line of development so multiple tasks can proceed in parallel without interfering.

Primary branches
- main (protected): always release-ready. Never push broken code directly.
- develop (optional): integration branch for features before release.

Feature workflow (recommended)
1. Create a short, focused feature branch off main:
   git checkout -b feat/<short-description>
2. Work in small commits with clear messages.
3. Push branch and open a pull request to main with a descriptive title and tests.
4. Use code review and CI. Rebase interactively or merge with squash depending on team preference.

Hotfixes
- Create hotfix/<reason> from main, fix, test, PR to main and backport to develop if used.

Naming conventions (examples)
- feat/login-rate-limit
- fix/invalid-localstorage-parse
- chore/update-deps
- docs/interactive-components

Best practices
- Keep PRs small and focused.
- Rebase locally to keep history linear when the team prefers it: git fetch && git rebase origin/main
- Prefer "squash and merge" for feature branches that benefit from a single commit in main.
- Protect main with branch protection rules: require PR reviews, passing CI, and signed commits if needed.

Working with Antigravity / Jules
- Share branch names in the issue or message.
- Push early for CI feedback; use draft PRs for WIP.
- Use descriptive commit messages (why, not just what).

Quick commands
- Create: git checkout -b feat/short-name
- Push: git push -u origin feat/short-name
- Rebase onto latest main: git fetch origin && git rebase origin/main
- Merge PR locally (if needed): git checkout main && git pull && git merge --no-ff feat/short-name
