---
title: The Agent Registry
section: Core Concepts
order: 8
description: "The **agent registry** is how you configure your team. Who is on it, how many of them, what model they use, and which skills and tools they have - all of it lives here, and you can change it **without a restart or redeploy**."
---

## What the registry controls

For each role on the team, the registry defines:

| Setting | What it controls |
| --- | --- |
| How many workers | The concurrency ceiling for each role - how many instances may run at once. |
| Which model | The model each agent uses. |
| Whether approval is required | Whether the agent must get approval before acting (plan mode). |
| Which skills | The skills available to the agent. |
| Which tools | The tools and servers it can call. |

## Where it lives

The registry is kept in the **control plane**, inside the coordination store - not in a file you edit and redeploy. It is the single source of truth for the team's configuration.

## How you change it

You edit the registry through the **control panel**. The change is validated, and then it takes effect on the team's next cycle. No restart, no redeploy, no waiting for a maintenance window. Change a role's model or add a skill, and the running team picks it up almost immediately.

## The safety rule: you can't accidentally zero out a role

Changing configurations can be risky if done blindly. The registry enforces a guardrail: an override can never silently drive a role down to **zero** workers. If a change would leave a role with no capacity, it is rejected rather than applied, so you can't accidentally disable your whole builder fleet with a bad edit.

## Adding skills, tools, and models

The common way to extend the team is through the registry, with configuration-only changes:

| Extension | How it works |
| --- | --- |
| Add a skill | A skill definition is added and referenced on a role. |
| Add a tool or server | Register it on the role, or centrally. Both can work together. |
| Enable a model | Configure it and reference it on the role. |

These are configuration-only changes. Building a brand-new **role** (with its own persona, workspace template, and routing) is the one change that touches the system's internals - a deliberate, less-common action.

> [!INFO] The panel and the command surface never drift
> The web control panel is the everyday home of the registry. From it you see the live team - roles, their sizes, their models - and edit the fleet directly. It rides on the same state and commands as the command-line surface, so the two can never drift out of sync.
