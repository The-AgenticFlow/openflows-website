---
title: Core Concepts
nav_label: Overview
section: Core Concepts
order: 0
description: "OpenFlows runs a disciplined engineering team of AI agents that coordinate through a shared, governed system. The concepts in this section are the vocabulary the rest of the documentation uses: who the team is, how a ticket travels from issue to merged pull request, why the team plans before it codes, where the coordination state lives, where work actually runs, and how security holds together."
---

If you are deciding whether OpenFlows fits your organisation, read these pages first. If you are already running it, they explain the reasoning behind the behaviour you see in production.

> [!INFO] One idea anchors everything
> **Coder governs *where* agents run. OpenFlows governs *how* they coordinate.** This founding split explains the architecture, and the other concepts build on it.

## Concepts at a Glance

| Concept | What problem it solves | Read more |
| --- | --- | --- |
| **The Team** | Five specialised agents with narrow roles and enforced hand-offs, so no single agent both writes and reviews its own work. | [Details →](/docs/concepts/agent-team) |
| **The Ticket Lifecycle** | A fixed path from GitHub issue to merged pull request, with recovery and human escalation as part of the loop. | [Details →](/docs/getting-started/lifecycle-steps) |
| **The Planning Gate** | No code before an approved plan; the gate is structural and single-use approvals can’t be replayed. | [Details →](/docs/concepts/planning-gate) |
| **The Coordination Store** | A shared, durable record of truth that only the orchestrator and the worker command surface may write. | [Details →](/docs/concepts/coordination-store) |
| **Workspaces** | Isolated execution seats with workspace-scoped credentials and a recorded identity. | [Details →](/docs/concepts/workspaces) |
| **Tenants** | Strictly separated teams on one server, isolated by both identity and namespaced coordination state. | [Details →](/docs/concepts/tenants) |
| **Human Escalation** | The system stops and hands you the decisions that need a judgment call, rather than guessing. | [Details →](/docs/concepts/human-escalation) |
| **The Agent Registry** | Team configuration without code or restarts, with a guardrail against accidentally zeroing a role. | [Details →](/docs/concepts/agent-registry) |
| **The Coder / OpenFlows Split** | Coder governs where agents run; OpenFlows governs how they coordinate. The founding asymmetry. | [Details →](/docs/concepts/coder-openflows-split) |

## How the Concepts Fit Together

OpenFlows is an orchestration layer that turns a self-hosted runtime into an autonomous engineering team. The **Coder / OpenFlows split** sets the stage: the runtime provides governed, ephemeral **workspaces** and real identity, while OpenFlows supplies the coordination that makes them a team. The **agent team** plans, builds, reviews, merges, and documents, and each **ticket** moves through a fixed **lifecycle**. The **planning gate** keeps every ticket honest by refusing to advance work without an approved plan. All of this is held together by the **coordination store** - the single source of truth - and configured through the **agent registry**. **Tenants** isolate many teams on one server, and **human escalation** keeps a person in the loop exactly where a judgment call is needed.

## Where to Start

```cards
- [Architecture-First](/docs/concepts/architecture-first): Why OpenFlows plans before it codes, how the planning gate works, and the "when in doubt, don’t approve" rule.
- [The Agent Team](/docs/concepts/agent-team): NEXUS, FORGE, SENTINEL, VESSEL, and LORE — their roles, how they work in sequence and in parallel, and how they’re configured.
- [The Ticket Lifecycle](/docs/getting-started/lifecycle-steps): How an issue becomes a merged pull request, the fixed phases, and what happens when work gets stuck.
- [The Planning Gate](/docs/concepts/planning-gate): Plan before code: why it’s structural, how the gate is enforced, and why the system blocks rather than guesses.
- [The Coordination Store](/docs/concepts/coordination-store): The single record of truth that keeps every agent, ticket, approval, and review consistent.
- [Workspaces](/docs/concepts/workspaces): Where work actually runs: thin, isolated, disposable workspaces with real identity and tight networks.
- [Tenants](/docs/concepts/tenants): How one server serves many teams — what a tenant is, how isolation is enforced, and how you manage one.
- [Human Escalation](/docs/concepts/human-escalation): When a human gets pulled in, what happens on escalation, and the three ways you can resolve it.
- [The Agent Registry](/docs/concepts/agent-registry): How the team is configured without code — roles, models, skills, and tools — and the zero-capacity safety rule.
- [The Coder / OpenFlows Split](/docs/concepts/coder-openflows-split): The founding idea: Coder governs where agents run; OpenFlows governs how they coordinate.
```

> [!TIP] Read the split first, then the gate
> If you're new, start with the Coder / OpenFlows split to get the mental model, then the planning gate to see how discipline is enforced. The rest of the concepts fill in the details.
