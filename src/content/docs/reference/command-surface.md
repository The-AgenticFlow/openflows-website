---
title: Command Surface
section: Reference
order: 6
description: "OpenFlows provides a command-line surface alongside the web control panel. They drive the same state, so neither can drift from the other: every panel action maps to a command, and the command surface stays automation-friendly. This page describes the operations available, in plain language - no command syntax, no flags, no exact invocations."
---

The web control panel is the everyday interface; the command surface is for scripting, automation, and headless operation. Both are always in sync because they operate on the same control state.

## Setup & environment operations

| Operation | Purpose |
| --- | --- |
| Start | Begin the Controller loop. This is the default action when you start the system. |
| Bootstrap | Create the initial administrator, register the role templates, and verify that the model and GitHub integrations are working. |
| Diagnose | Check the health of the Coder integration. |

## Tenant operations

| Operation | Purpose |
| --- | --- |
| Add tenant | Create a team bound to a repository, including its user, its orchestrator workspace, and a fresh agent team. |
| List tenants | See the teams running on the server. |
| Clean tenant | Reset stale or failed work back to the start and clear any recovery state. |
| Remove tenant | Tear down a team and its fleet. |

> [!INFO] Removing a tenant
> Removing a tenant tears down the team and its fleet. It is a deliberate, end-of-life action rather than a routine cleanup - the everyday cleanup path is the clean operation, which resets stalled work to the start.

## Status & control operations

| Operation | Purpose |
| --- | --- |
| Status | A read-only snapshot of tickets, workers, and pull requests. |
| Pause / resume | Halt or continue the fleet, gracefully. |
| Drain | Stop picking up new tickets while letting in-flight work finish. |
| Target | Focus the fleet on a specific repository, issue, or label. |
| Set registry | Update the agent team live, with no restart. |

## Gate operations

| Operation | Purpose |
| --- | --- |
| Inspect a gate | Look at the approval state of a gated step. |
| Approve a gate | Record an approval. Used by the reviewer role. |

Gates are where the plan-before-code guardrail lives: work cannot leave planning until a reviewer approves it, and that approval is single-use. The gate operations let you inspect and record that approval state.

## Reset operations

| Operation | Purpose |
| --- | --- |
| Reset orchestration | Restore orchestration content to the bundled defaults. |

> [!TIP] Panel first, commands when needed
> The web control panel is the everyday surface for seeing status, editing the registry, steering the fleet, and handling escalations. Reach for the command surface when you are scripting, automating, or running headless - you are driving the same operations either way.

## Related

- [Configuration Reference](/docs/reference/configuration-reference) - the knobs behind fleet steering and the team registry.
- [Limits & Defaults](/docs/reference/limits-and-defaults) - the meaningful numbers to know.
