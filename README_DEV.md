Viktor-inspired portfolio — Developer Quickstart

This README provides a fast, reproducible setup for contributors (Antigravity, Jules).

Prerequisites
- Node 18+ (recommended via nvm)
- npm or yarn
- Git
- (Optional) VS Code + Remote - Containers extension

Quick setup (native)
1. git clone <repo-url>
2. cd <repo-folder>
3. git checkout krymszuch-stack-viktor-inspired-portfolio
4. ./scripts/setup-dev.ps1   # Windows PowerShell

Using VS Code Dev Container (recommended for parity)
1. Open folder in VS Code
2. Reopen in Container (Command Palette -> Remote-Containers: Reopen in Container)
3. Container runs "npm ci" automatically

Common commands
- npm ci              # install deps reproducibly
- npm run dev         # start dev server (if provided)
- npm run lint        # run linters
- npm run test        # run tests

Branching and pull requests
See BRANCHING.md for workflows, naming conventions and PR guidelines.

Troubleshooting
- If node version mismatch: use nvm and run "nvm use 18"
- If CI fails: run "npm run lint" and "npm run test" locally and inspect logs

Contact
- Add notes for Antigravity/Jules in the top of commits or open an issue for onboarding questions.
