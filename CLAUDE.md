# CLAUDE.md

This is the entry point for any AI coding agent working in the Truvend repo.

## Before doing anything

Read all six files in `/context`, in this order:

1. `context/project-overview.md`
2. `context/architecture.md`
3. `context/code-standards.md`
4. `context/ai-workflow-rules.md`
5. `context/ui-context.md`
6. `context/progress-tracker.md`

Do not write or edit code before reading all six. `ai-workflow-rules.md` contains the binding rules for how to scope work, handle ambiguity, and verify completion — treat it as authoritative over any conflicting instinct.

## Repo ownership

Monorepo. `/context` and this file are shared by the whole team and owned by no single side — propose changes rather than silently editing them mid-task.

- `/frontend` — Next.js 15 (App Router) + TailwindCSS + shadcn/ui
- `/backend` — Node.js + Express + TypeScript, Supabase, Nomba, Gemini integrations

Team: Ashiah (Project Manager), Emmanuel (Backend Developer), SD (Frontend Developer), Ayomide (Cybersecurity Expert).

## The one rule that matters most

The frontend never talks to Nomba or Gemini directly, and never sees their API keys or secrets. Every payment action and every fraud check goes through the backend. See `architecture.md` for the full invariant list — these are not stylistic preferences, they are the security model the whole product depends on.
