---
title: Architecture-First Development
section: Core Concepts
order: 1
description: "OpenFlows is built on a simple thesis: **architecture is the product**. The system does not just generate code - it encodes the engineering discipline that separates production software from a pile of confident, well-written changes. This page explains what that discipline is and why it is structural."
---

## Code is cheap. Thinking is not.

Writing code against a specification has become cheap. What stays hard is *thinking*: understanding the architecture, making product judgments, and keeping security and quality in mind. A team of agents that simply write code would produce impressive-looking work that solves the wrong problem, drifts from your conventions, and skips the careful review gates you rely on.

OpenFlows encodes that discipline as an automated team. It turns the judgment steps - planning, review, verification, and recovery - into enforced parts of the pipeline, applied to every issue, consistently, rather than left to chance.

## Putting each actor at the right level of the chain

The insight behind OpenFlows is that software teams already have the right people - they are often just operating at the wrong level. A person should own the **architecture and the product**: what to build, why it matters, and how it should hold together. They should *not* be the bottleneck that reads every line an agent produces. Because agents write faster than people can review, the first-pass review of agent-written code has to come from another agent - that is what makes the pipeline scale at all.

- **Agents** write, test, review (as a first pass), merge, and document - the repetitive, low-judgment work, run in a well-defined pipeline.
- **Humans** own the architecture and product decisions - the security calls, the ambiguous requirements, the direction - and are pulled in only at those boundaries instead of clicking accept or deny all day.

This is not about replacing engineers. It is about moving them to the level of the chain where they create the most value.

## The guardrails that make it "engineering," not just coding

Four principles run through the whole design, and each is enforced by the system rather than suggested to the agents:

- **Plan before code.** No agent starts writing until a plan is agreed. This is the [planning gate](/docs/concepts/planning-gate).
- **When in doubt, don't approve.** The reviewer blocks rather than guesses when evidence is missing - it would rather hold a ticket or escalate than merge something unverified.
- **Bounded recovery, then human escalation.** The system repairs what it can, a bounded number of times, then asks a person rather than spinning forever.
- **No secrets in worker workspaces.** Trust, keys, and credentials stay concentrated in the control plane; the work plane is disposable and keyless. See [Security by Design](/docs/architecture/security-by-design).

## Why it is structural, not a suggestion

These guardrails are not prompts an agent could ignore. The planning gate cannot be skipped, approvals are single-use, the reviewer works in an isolated workspace, and recovery is bounded. Because the discipline is structural, you can leave the team running and trust that it will not cut corners - which is exactly what makes autonomy safe.

## What this buys you

- **Consistent judgment.** The same plan, review, and verification discipline is applied to every issue.
- **Trustworthy autonomy.** The system can be left to run because it won't bypass the engineering steps.
- **An audit trail.** Every plan approval and review verdict is a recorded, attributable event.

> [!INFO] Architecture as the product
> The value of OpenFlows is not that the agents write code - any assistant can do that. It is that the architecture, contracts, and review gates produce *software*, not just code.

## Where to go next

```cards
- [The Planning Gate](/docs/concepts/planning-gate): The structural rule that starts every ticket.
- [The Agent Team](/docs/concepts/agent-team): The roles that carry out the disciplined pipeline.
- [The Controller](/docs/architecture/controller): The brain that runs the orchestration loop.
```
