---
title: Decision & Routing
section: Architecture
order: 11
description: "Routing is how work moves between roles. The Controller doesn't command agents with ad-hoc messages; it runs a **flow** - an ordered map of steps and the allowed transitions between them - and it is the single place those transitions are declared. This page explains how work is dispatched between roles and how each transition is routed."
---

## The routing flow

Work moves through the team in a fixed order - NEXUS dispatches, FORGE builds, SENTINEL reviews, VESSEL merges, LORE documents - and then back around to NEXUS:

| Transition | Stage | What routes |
| --- | --- | --- |
| NEXUS → FORGE | A ticket’s turn | NEXUS assigns a ticket and requests a managed Forge workspace. |
| FORGE → SENTINEL | Plan review | FORGE finishes a plan and hands it over; SENTINEL reviews and approves before any code is written. |
| FORGE → SENTINEL | Review | FORGE implements against the approved plan and opens a pull request; SENTINEL reviews it. |
| SENTINEL → VESSEL | Merge | An approved review routes the pull request to VESSEL to watch CI and merge. |
| VESSEL → LORE | Document | A successful merge routes the completed work to LORE to document. |
| LORE → NEXUS | Loop | Documented, merged work returns to NEXUS, which picks up the next ticket. |

## How a step routes to the next

Each step follows the same three-part rhythm:

1. **Read** the current state of the work.
2. **Act** - do the external work called for (provisioning a workspace, writing code, running a review, opening or merging a pull request).
3. **Record and route** - write the result and hand control to the next allowed step.

A transition only happens when the previous step produced the required result - an approved plan, a reviewed pull request, a successful merge. The Controller advances each piece of in-flight work by exactly one step on every beat of its orchestration loop.

## The declared transitions are the guardrail

Because every possible transition is declared in one place, the system can't wander off into an unplanned path. A builder can't route work to a merge on its own, and a reviewer can't begin a build. Each role is only handed the work that the previous step produced:

- **FORGE can't build without an approved plan.** A plan awaiting approval stays with the builder until SENTINEL approves it.
- **SENTINEL only reviews what's ready** - an approved-plan check or a pull-request review - and records a verdict.
- **VESSEL won't merge an unapproved pull request.** Merge is only offered to VESSEL after a review approves it.
- **LORE only documents merged work.** Documentation is triggered by a successful merge.

## When a path can't continue

If an unexpected path is ever taken, the Controller treats it as an anomaly rather than silently ignoring it. And if work can't advance because judgment is needed - an unclear requirement, a security concern, or verification that keeps failing - the work is parked and escalated to a human instead of being routed onward on a guess. The review posture stays strict: when in doubt, don't approve.

> [!INFO] Routing is state, not conversation
> Work is routed by writing results to the shared record of truth, not by sending ad-hoc messages. The Controller re-reads that state on every beat, so a step's result is picked up and handed to the next role automatically - and the routing can be steered live, without restarting.
