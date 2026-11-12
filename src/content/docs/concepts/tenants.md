---
title: Tenants
section: Core Concepts
order: 6
description: "OpenFlows Manager serves multiple organizations and tenants. A **tenant** is one repository automation environment within an organization."
---

If you only have one team, you still have "a tenant" - you just have one. Think of a tenant as "one project and one repository."

## What a tenant is

A tenant binds these records and resources:

- An **OpenFlows organization** and its creator-owned Coder workspace identity.
- A **repository binding** - the GitHub repository that team works on.
- An **orchestrator workspace** that runs that team's pipeline.

## How isolation is enforced

Tenants are isolated in two independent ways at the same time:

1. **Runtime identity.** Manager derives tenant and repository scope from each authenticated workspace.
2. **Coordination state.** Each tenant has a Redis ACL credential and immutable namespace.

The Manager and Redis checks reinforce one another. Operators must still protect the shared services, secrets, and network paths.

## What this means in practice

- **Many teams, one server.** Run several independent OpenFlows teams sharing the same control plane and coordination store.
- **No cross-talk.** One team's tickets, workers, and pull requests are invisible to another.
- **Simple operations.** Administrators manage tenants from the control panel - add a team, list teams, clean up a stuck team, or remove one entirely.

## Managing a tenant

From the control panel, an operator can manage the tenants currently running:

| Action | What it does |
| --- | --- |
| Add | Create a tenant for a repository so its team can start working. |
| List | See the tenants currently running. |
| Clean | Reset a stuck tenant - clear stale or failed work back to the start so the team can take another pass. |
| Remove | Take down a tenant and its fleet entirely. |

**Cleanup is an important operational tool.** If a tenant's work is wedged and automated recovery has already given up, resetting it back to a clean state is the way to get the loop moving again.
