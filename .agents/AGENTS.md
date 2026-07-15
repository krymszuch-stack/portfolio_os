# Rules for AI Agents (Jules and Antigravity)

This file contains rules and guidelines for AI agents working in this workspace.

## Critical Rules

1. **Verify Code Before Any Push or PR:**
   Always run:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
   All must pass with 0 errors.

2. **Concept Compliance:**
   We are building a **Smart Visual Card** (complements CV & LinkedIn) with a secure **Azure cloud backend** and **AI Generator**.
   Always maintain the visibility of the "Stwórz własne portfolio" (Create your own portfolio) CTA.
   *Azure Failover (Theoretical):* If Gemini token limits are exhausted, the architecture assumes automatic switchover to independent custom AI agents on Microsoft Azure.

3. **Style & Aesthetics:**
   Use premium glassmorphism, tailored accent colors, and custom fonts. Preserve comments.

## 🔄 State Tracking & Recovery Protocol (JULES_STATE.md)

To maintain continuity between automated agent runs:
1. **On Startup:** 
   You MUST check if `JULES_STATE.md` exists in the repository root. If the file status is `BLOCKED`, `ERROR`, or `PAUSED`, you must prioritize resolving the issues described in `JULES_STATE.md` **before** starting any new task from the user.
2. **On Session End / Failure:**
   If you hit compile, test, or lint errors that you cannot resolve in your current turn, or if you must pause the task, you MUST write the current state to `JULES_STATE.md` with:
   - Status (`ERROR`, `PAUSED`, `ALL_GREEN`)
   - The exact error log or where you got stuck
   - A list of files currently being modified
   - Next steps for the succeeding agent.
   Do not delete the file once fixed — simply set status to `ALL_GREEN` or `READY`.
