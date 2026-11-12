---
title: Roles Reference
section: Reference
order: 2
description: "The OpenFlows team has five roles. This page is the quick lookup for each one: who it is, what it does, and whether it must get approval before acting. The source documentation contains no registry schema reference - that is internal configuration detail. What you need to know is the team behind it."
---

## The five roles

| Role | Name | Responsibility | Requires approval to act? |
| --- | --- | --- | --- |
| NEXUS | Orchestrator | Ingests issues, assigns work, coordinates the team, performs recovery, and escalates to humans. | Yes |
| FORGE | Builder | Plans (then halts), implements the approved plan, runs tests, and opens pull requests. | No |
| SENTINEL | Reviewer | Adversarially reviews the plan and the pull request, approves gates, and requests evidence. | Yes |
| VESSEL | DevOps | Watches continuous integration, resolves merge conflicts, merges approved pull requests, and tears down workspaces. | No |
| LORE | Writer | Documents decisions and maintains changelog/history entries, often disabled by default. | No |

## What “requires approval to act” means

- **Plan-mode roles** (NEXUS, SENTINEL) are designed to review and gate rather than blindly proceed.
- **Builder, DevOps, and Writer roles** act directly, but their actions are bounded by gates: FORGE can’t build without an approved plan, VESSEL won’t merge an unapproved pull request, and LORE only documents merged work.

## The hand-offs between roles

| Hand-off | When it happens |
| --- | --- |
| NEXUS to FORGE | NEXUS assigns a ticket and FORGE begins, once it has an approved plan. |
| FORGE to SENTINEL | FORGE opens a pull request and marks it for review. |
| SENTINEL to VESSEL | SENTINEL approves the reviewed pull request. |
| VESSEL to LORE | VESSEL merges and hands off for documentation. |
| LORE back to NEXUS | Documentation completes and NEXUS returns to orchestration. |

Each transition only happens when the previous step produced the required result: an approved plan, a reviewed pull request, or a successful merge.

## Configuring roles

Every role’s behavior is set in the agent team configuration: how many workers, which model, plan mode, skills, and tools. You change these from the control panel without a restart. See the [Configuration Reference](/docs/reference/configuration-reference).

## Extending roles

- Add **skills** and **external tools** and pick **models** per role, configuration-only.
- Adding a brand-new **role** is an internal change beyond this reference (see the Extending guide for how skills and tools are added).

## Related

- [Glossary](/docs/reference/glossary) - one-line definitions of every term used here.
- [Lifecycle States](/docs/reference/lifecycle-states) - the phases a ticket travels through between these hand-offs.
- [Adding a Skill](/docs/guides/extending-skills) - how the config-only extension point works.
