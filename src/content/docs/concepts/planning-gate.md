---
title: The Planning Gate
section: Core Concepts
order: 3
description: "The planning gate is one of the most important ideas in OpenFlows, because it is what turns \"an AI that writes code\" into \"an AI that works like a disciplined engineer.\""
---

## The problem it solves

Given a spec, code is cheap. The hard, valuable work is deciding *what to build* before writing it. If you let an agent start typing immediately, you often end up with confident, well-written code that solves the wrong problem. The planning gate forces the team to agree on the **plan** first.

## How it works

1. The builder takes the ticket and produces a written plan describing how it intends to implement it.
2. The builder **stops**. Even though it is fully capable of writing code, it waits.
3. The reviewer reviews the plan - the same adversarial reviewer that later reviews the code.
4. Only an **approved** plan unlocks the build phase.

## Why the system can enforce it

This is not a convention or a prompt that an agent could ignore. The planning gate is **structural**:

- A ticket can only enter the pipeline through the planning phase.
- Moving out of planning requires consuming an **approval** that only the reviewer role can create.
- That approval is **single-use** - it can be consumed once, and a second attempt finds nothing.

An agent physically cannot skip the review, approve its own plan, or replay a stale approval. If you look at a ticket and it has no approval, there is no path forward for it. "Let's just skip the review" is not possible, even by accident.

## What this buys you

- **No code before a plan.** You never get an agent barreling ahead on a misunderstanding.
- **A reviewable decision.** The plan and its approval are part of the recorded history.
- **Trustworthy autonomy.** The system can be left to run because it won't cut this corner.

## The "when in doubt, don't approve" principle

The reviewer's job is to be strict. If it cannot verify the required evidence - a plan it can read, a change it can review, a test result that was actually recorded - it must **not** approve. The system would rather hold a ticket, or escalate it to a human, than merge something unverified. This bias toward "block rather than guess" runs through the whole product.

> [!INFO] Plan before code
> Planning first is the cheapest correctness strategy available. A rejected plan costs little; a confident implementation of the wrong thing costs a great deal more. The planning gate keeps the team aligned before a single line is written.

## Where to go next

```cards
- [Architecture-First Development](/docs/concepts/architecture-first): Why planning, review, and structure are the whole product.
- [Lifecycle Steps](/docs/getting-started/lifecycle-steps): See the gate in its place in the ticket lifecycle.
- [Security by Design](/docs/architecture/security-by-design): How single-use approvals protect the gate.
```
