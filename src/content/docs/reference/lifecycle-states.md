---
title: Lifecycle States
section: Reference
order: 3
description: "Every ticket travels through a fixed set of states. This reference lists them, what they mean, and what can happen from each one."
---

## The main states

| State | Meaning | Can move to |
| --- | --- | --- |
| Planning | FORGE is writing (or waiting on) the plan; no code is written. The first state a ticket enters. | Blocked, or Building (on plan approval) |
| Building | FORGE implements the approved plan and runs tests. | Testing, Blocked |
| Testing | Test work is underway. | Review ready, Blocked |
| Review ready | FORGE opened a pull request and marked it for review. | Blocked, Awaiting human |
| Review | SENTINEL is adversarially reviewing the pull request. | Merged (on approval), or back to Building (on rejection, continuous-integration failure, or conflict) |
| Merged | VESSEL merged the approved pull request. Terminal - the workspace is torn down and documentation follows. | \- |
| Blocked | Work is stuck at a step. | Usually toward Awaiting human |
| Awaiting human | Parked for a human decision; the system stopped retrying. | Resolved by a human action or a reset |

## The enforced rules

- A fresh ticket can only start in **planning** (or blocked) - it can’t skip planning.
- Leaving **planning** requires consuming an **approval** that only the reviewer can issue.
- The approval is **single-use** - it can’t be replayed.

## Recovery states (invisible but important)

Separate from the ticket phases, recovery tracks things like:

- **Stale worker** - a workspace went silent (its heartbeat fired too long ago) and is marked for recovery.
- **Orphaned ticket** - assigned or in progress, but with no active worker.
- **Crashed workspace** - the machine or session died.
- **Unmerged pull request** - a pull request that should have been processed but wasn’t.

These are repaired automatically, with a bounded number of attempts, before escalation. See the [Limits & Defaults](/docs/reference/limits-and-defaults) reference for how recovery behaves.

## How a human interacts with states

- You’re notified when a ticket enters **awaiting human**.
- You can see every state in the control panel.
- **Closing or commenting on the issue**, or **resetting** a ticket, moves it between states.
- A **merged** ticket is your output: a reviewed, production-ready pull request.

## Related

- [Roles Reference](/docs/reference/roles-reference) - who acts at each phase.
- [Handling Human Escalations](/docs/concepts/human-escalation) - what to do when a ticket reaches you.
