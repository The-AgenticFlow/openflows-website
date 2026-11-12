---
title: The Agent Team
section: Core Concepts
order: 2
description: "OpenFlows runs a group of AI agents that cooperate like a real engineering team. Each agent has one primary job, and together they close the loop from issue to merged pull request. The team has five roles."
---

## The five roles

| Agent | Role | What it does | Reviews before acting? |
| --- | --- | --- | --- |
| **NEXUS** | Orchestrator | Owns the whole pipeline: picks up issues, assigns work, coordinates the team, recovers from failures, and notifies humans when needed. | Yes |
| **FORGE** | Builder | Writes code against an agreed plan, creates branches, and opens pull requests. | No |
| **SENTINEL** | Reviewer | Adversarially reviews plans and code for security, quality, and test coverage. | Yes |
| **VESSEL** | DevOps | Watches CI, resolves merge conflicts, and merges green pull requests. | No |
| **LORE** | Writer | Documents decisions and updates changelogs after a merge. Often disabled by default. | No |

## What "reviews before acting" means

The roles that review and gate - the orchestrator and the reviewer - are designed to check before they proceed rather than blindly move ahead. The builder, DevOps, and writer roles act directly, but their actions are bounded by gates: the builder can't build without an approved plan, DevOps won't merge an unapproved pull request, and the writer only documents merged work.

## How they act like a team

The team is **sequential where it must be** and **parallel where it can be**. Each transition only happens when the previous step produced the required result - an approved plan, a reviewed pull request, a successful merge.

| Hand-off | What happens |
| --- | --- |
| NEXUS plans the assignment | Hands work to an idle builder. |
| FORGE writes and stops | Waits until its plan is approved. |
| SENTINEL reviews | Never touches the builder’s workspace. |
| VESSEL merges | And tears down the workspace. |
| LORE documents | Records the completed work. |

## Roles are configured, not hard-coded

Which roles exist, how many workers each role can run at once, what model each uses, and what skills and tools are available - all of this is kept in the **agent registry**, which lives in the control plane and can be changed without a restart or redeploy.

## What an agent workspace looks like

Each agent runs in its own isolated, disposable workspace:

- No LLM API keys.
- No raw repository credentials.
- Heavily restricted network access (the control plane, GitHub, and the coordination store - and little else).

The agent coordinates with the team strictly through a small, typed command surface - it never talks directly to the coordination store. This is what keeps the whole system safe and auditable.

## Adding to the team

You can extend what the team can do **without writing code** by adding skills, tools, or models through the registry. Adding a brand-new *role* is the one extension that touches the system's internals.

> [!INFO] Review is a separate role, not a prompt
> The reviewer is not a prompt attached to the builder. It is a separate agent with a separate workspace and a separate model, which is exactly what makes adversarial review meaningful. A writer and a reviewer never share a filesystem.
