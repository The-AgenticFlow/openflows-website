---
title: Lifecycle Steps
section: Get Started
order: 5
description: "Every piece of work OpenFlows handles is a **ticket**. A ticket is born from a GitHub issue and progresses through a fixed set of phases until it is merged - or until a human is needed. For the overview and prerequisites, see the [First Issue Walkthrough](/docs/getting-started/first-issue)."
---

## The phases

Each phase is owned by a specific agent. The table below shows each phase, who owns it, and what it accomplishes.

| Phase | Owner | What happens |
| --- | --- | --- |
| Planning | FORGE | FORGE writes a plan for how it will implement the ticket, then halts. Nothing is written yet. |
| Plan review | SENTINEL | SENTINEL reads the plan and either approves it (unlocking the next step) or reports issues. This is the planning gate. |
| Building | FORGE | FORGE implements the approved plan, writes code, and runs tests. Changes are committed to a branch. |
| Review ready | FORGE | FORGE opens a pull request and signals that the work is ready for review. |
| Review | SENTINEL | SENTINEL reviews the pull request adversarially. It can approve, reject (sending work back to FORGE), or request evidence. |
| Merged | VESSEL | VESSEL watches CI, resolves conflicts, and merges the approved pull request. The workspace is then torn down. |

> [!INFO] Plan before code
> FORGE writes a plan and then **halts**. SENTINEL reviews that plan and either **approves** it or sends it back. Only an approved plan unlocks the next step. This gate is structural - the system itself refuses to move a ticket forward without an approval.

## Two special states

- **Blocked.** Work that is stuck - for example, it hit a wall it cannot get past. This often tunnels toward a human decision.
- **Awaiting a human.** The ticket is parked because it needs a judgment call that only a person can make (security, ambiguity, architecture, or an unresolvable merge). OpenFlows stops retrying and tells you.

## Recovery is part of the lifecycle

Things go wrong: a workspace crashes, a process stalls, a merge is blocked. OpenFlows' reconciliation loop watches every ticket and repairs what it can automatically, with a bounded number of retries. When retries are exhausted, the ticket escalates to a human rather than failing silently. When in doubt, it would rather block than guess.

## From the human's perspective

You do not watch every phase. You get involved at the boundaries:

- When a **ticket needs a decision** (you are notified).
- When you **want to check status** (control panel).
- When you **close or comment on the issue** (the team reacts on the next cycle).

> [!TIP] Continue reading
> See [Completion & Merge](/docs/getting-started/completion-and-merge) for how a ticket is reviewed, merged, and torn down.
