---
title: The Coordination Store
section: Core Concepts
order: 4
description: "Every agent, every ticket, every approval, every review, and every pull request is tracked in one place: the **coordination store**. It is the single record of truth that makes the team behave like a coherent organisation rather than a set of disconnected systems."
---

OpenFlows is a distributed system - many workspaces, many agents, all working at once. If each of those workspaces kept its own copy of what was happening, they would drift apart and start to contradict one another. By routing everything through a single store, OpenFlows guarantees that the whole team sees the same state and that no step can be skipped or forged.

## What the store holds

The coordination store is the shared, durable memory of the team. It records everything the team needs to agree on to stay consistent.

| What it tracks | Why it matters |
| --- | --- |
| Tickets | Every piece of work OpenFlows knows about, and the current state of each one. |
| Worker slots | Which agent is available, busy, or assigned to a ticket. |
| Pull requests | The pull requests awaiting a merge. |
| Phases and history | Each ticket’s current phase and the trail that led there. |
| Approvals | The single-use approvals that unlock gated steps. |
| Reviews | Review verdicts and their outcomes. |
| Liveness | The signal that a workspace is still alive and working. |
| Team configuration | The live agent registry and the pause and resume control state. |

## Who is allowed to write

This is a strict design rule: exactly **two** things may ever write to the coordination store.

- The **orchestrator**, the central brain, which writes planning, assignment, and fleet state.
- The **worker command surface**, the only way an agent inside a workspace records its phase, approvals, reviews, and heartbeats.

Everything else - and in particular the agents themselves - cannot touch it. Writes are validated, so malformed or out-of-order writes are rejected rather than silently accepted. This is what makes "the store is the source of truth" a real guarantee rather than a hope.

> [!INFO] The store is a source of truth, not a place to poke around
> Most operators interact with the store through the control panel, which surfaces current tickets, worker status, pending pull requests, and escalations. Day to day you rarely interact with the store directly - the panel sits on top of it, and the store underneath keeps everything consistent.

## Durable by design

The store is configured for durable storage, so the team's record survives restarts. This is what allows OpenFlows to pause mid-flight, restart, and pick up exactly where it left off. The team does not forget where it was just because a process stopped.
