---
title: Agent Setup
section: Guides
order: 1
description: "OpenFlows is organized around a team of roles - the agents that turn an issue into a merged pull request. Configuring that team is done entirely through the **agent registry**: who is on the team, how many workers each role runs, which model they use, and which skills and tools they have. Everything lives there, and you can change it without a restart or redeploy."
---

## The team of roles

Each role is a distinct capability on the team. They work in a sequence - plan, build, review, merge, document - under the coordination of the orchestrator.

| Role | What it does |
| --- | --- |
| FORGE | The builder. Does the bulk of implementation once a plan is approved. |
| SENTINEL | The reviewer. Attacks plans and code adversarially for security and quality. |
| VESSEL | The mergers. Watches CI, resolves conflicts, and merges approved work. |
| LORE | The writer. Updates changelogs and project history for merged changes. |
| NEXUS | The orchestrator. Ingests tickets and keeps the team moving. |

## What the registry controls

For each role, the registry defines:

- **How many workers** the role may run at once.
- **Which model** the agent uses for its reasoning.
- **Whether approval is required** before acting.
- **Which skills** are available to it.
- **Which tools and MCP servers** it can call.

The registry lives in the control plane, not in a file you edit and redeploy. It is the single source of truth for the team's configuration.

## How you change it

You edit the registry through the control panel. The change is validated, then it takes effect on the team's next cycle. No restart, no redeploy, no waiting for a maintenance window. Change a role's model or add a skill, and the running team picks it up almost immediately.

> [!INFO] Configure models, skills, and tools here
> The registry is the common seam for the everyday extensions:

- **Add a skill** - a set of instructions a role can load on demand (see [Adding a Skill](/docs/guides/extending-skills)).
- **Connect an MCP server** - register a tool on a role, or centrally (see [Connecting an MCP Server](/docs/guides/extending-mcp)).
- **Enable a model** - configure it in the platform, then reference it on a role (see [Enabling a Model](/docs/guides/extending-models)).

## The safety rule

Changing configuration can be risky if done blindly. The registry enforces a guardrail: a change can never silently drive a role down to zero workers. If a change would leave a role with no capacity, it's rejected rather than applied - so you can't accidentally disable your whole builder fleet with a bad edit.

## Configuration-only extensions

Adding a skill, connecting a server, or enabling a model are all **configuration-only** changes. They don't touch the system's internals. The one extension that does is building a brand-new *role*, with its own persona, workspace template, and routing - see [Extending with a New Role](/docs/concepts/agent-registry) for why that one is different.

## The control panel

The panel is the everyday home of the registry. From it you see the live team - roles, their sizes, their models - and edit the fleet directly. It rides on the same state and commands as the command-line surface, so the two can never drift out of sync.

> [!TIP] How the pieces fit
> Coder governs **where** agents run - the workspaces and the platform's AI catalog. OpenFlows governs **how** they coordinate - turning enabled models, skills, and tools into a working team through the registry.
