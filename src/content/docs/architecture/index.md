---
title: Architecture
nav_label: Overview
section: Architecture
order: 1
description: "This section explains how the OpenFlows system is put together - in plain language, with no code. It's written for anyone who wants to understand the system well enough to operate it, extend it, or evaluate its security."
---

**OpenFlows Manager** owns product identity, repository connections, runtime authorization, credential brokerage, and durable workspace operations. **Coder** runs isolated workspaces. A tenant's **Nexus controller** coordinates agents using tenant-scoped Redis and an A2A relay.

## Recommended reading order

1. [Components and Interactions](/docs/architecture/components-and-interactions): identify the independently running parts and trust boundaries.
2. [Manager Runtime](/docs/architecture/manager-runtime): follow registration and durable provisioning.
3. [Credentials and Trust](/docs/architecture/credentials): see which token authorizes each connection.
4. [Hooks and A2A](/docs/architecture/hooks-and-a2a): distinguish lifecycle delivery from tenant-local agent communication.

The pages below continue with the controller, worker fleet, recovery, security, and deployment. If you are new to the product, begin with the [full documentation reading path](/docs).

## The centre of the picture

Nexus requests workers through the Manager runtime API. Manager checks the tenant, role, quota, and pinned template, records a durable operation, and calls Coder to create the workspace. Forge, Sentinel, Vessel, and Lore run inside those workspaces. Nexus never needs the platform Coder operator credential.

The architecture is built on a simple thesis: **architecture is the product**. OpenFlows encodes the engineering - the review gates, the recovery patterns, the trusted boundaries - so that agents produce software, not just code. The guardrails that run through the whole design are straightforward: *plan before code*, *when in doubt, don't approve*, and *bounded recovery then human escalation*. Workspaces receive scoped runtime and Redis credentials; platform signing keys remain in Manager.

> [!INFO] The flow in brief
> A GitHub issue is turned into a ticket \\u2192 dispatched to FORGE to plan and build \\u2192 reviewed at a distance by SENTINEL \\u2192 merged by VESSEL once CI is green \\u2192 documented by LORE \\u2192 the workspace is torn down. Every step is an approved transition, and the whole cycle is self-healing and auditable.

```cards
- [Big Picture](/docs/architecture/big-picture): The control plane and the work plane, and how the two halves fit together.
- [Components and Interactions](/docs/architecture/components-and-interactions): The component boundaries and the authenticated paths between them.
- [Manager Runtime](/docs/architecture/manager-runtime): How workspaces register, request workers, and recover through Manager.
- [Credentials and Trust](/docs/architecture/credentials): Runtime sessions, repository tokens, Redis access, and trust boundaries.
- [Hooks and A2A](/docs/architecture/hooks-and-a2a): Coder lifecycle ingress, agent hooks, and Forge–Sentinel verification.
- [The Controller](/docs/architecture/controller): The long-lived “brain” that ingests work, dispatches agents, and keeps the team moving.
- [The Workspace Fleet](/docs/architecture/workspace-fleet): One long-lived orchestrator workspace and many short-lived, disposable worker workspaces — and how they stay isolated.
- [How the Pieces Talk](/docs/architecture/how-the-pieces-talk): The three channels that keep the team in sync — and the difference between facts and live tasks.
- [State Machine & Recovery](/docs/architecture/state-machine-recovery): The steady “read everything, nudge everything, repeat” beat that makes the system self-healing.
- [Decision & Routing](/docs/architecture/decision-routing): How work is dispatched between roles and how transitions are declared and routed through the pipeline.
- [Security by Design](/docs/architecture/security-by-design): Trust boundaries, short-lived credentials, isolation, and limitations.
- [How It’s Deployed](/docs/architecture/deployment): The reference deployment: the five pieces, how they’re grouped, and standing it up for many teams.
```
