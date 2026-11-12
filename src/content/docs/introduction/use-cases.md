---
title: Use cases
section: Introduction
order: 3
description: "OpenFlows is a fit whenever you want AI to *do* engineering work inside your own infrastructure, under your own control, rather than handing code off to a hosted tool you cannot audit. Below are the situations where it shines."
---

## An enterprise: governed, auditable AI delivery

**The need.** You want the speed of AI-generated features, but you must keep model keys private, keep a complete audit trail, enforce security policy, and stay within your own network.

**How OpenFlows helps.**

- The AI model runs behind your **own model gateway**, inside your own Coder control plane. Worker workspaces contain **no model keys** - there is no key sitting in a sandbox for an agent to exfiltrate.
- Every step - plan approval, review verdict, merge - is a **typed, recorded event**, so you can audit exactly what happened and why.
- Network policy is tight: agent workspaces can only reach the control plane, GitHub, and the coordination store. Everything else is denied.
- One Coder server can serve **many teams at once**, each isolated from the others.

## A developer workflow: more throughput, same standards

**The need.** You have a backlog of issues and want AI to handle the mechanics - planning, implementation, testing, review - while you own the architecture and the final merge decision.

**How OpenFlows helps.**

- You stay in the loop **only** at security decisions, ambiguous specs, and major calls. Everything else runs autonomously.
- The planning gate means code is never written against an unagreed plan.
- The adversarial review means you don't have to re-litigate every pull request; the system already stressed it.

## A team racing to ship: parallel, self-healing work

**The need.** Multiple issues flowing at once, with machines that crash and processes that stall.

**How OpenFlows helps.**

- OpenFlows runs a fleet of worker workspaces in parallel and assigns work to whichever is free.
- If a workspace crashes or goes silent, the system **detects and recovers** it automatically, with bounded retries.
- Completed pull requests are watched through CI and merged when green.

## A solo developer: a personal AI team for your backlog

**The need.** You work alone, and you have a backlog of issues and features but only so many hours in a day. You want an AI team that does the grunt work and returns reviewed, mergeable changes.

**How OpenFlows helps.**

- Open an issue and let the team plan, build, test, and adversarially review it while you are away - you come back to a reviewed pull request, not a pile of work.
- You stay in control: you own the architecture and the final merge decision, and the team only taps you for the calls that genuinely need a person.
- You can self-host Manager and Coder. Workspaces receive scoped runtime credentials; GitHub and your configured model provider remain external data paths to review.

## A stakeholder: transparency from intent to shipped

**The need.** You want to see progress from "we want this feature" to "it's deployed," without digging through code.

**How OpenFlows helps.**

- Every issue becomes a ticket with a visible lifecycle: planned → built → reviewed → merged.
- Decisions that need a human are surfaced with notifications and direct links.
- A web control panel shows the live state of the whole fleet at a glance.

## Extending the workspace: skills, models, and tools

**The need.** Different features need different capabilities - a new linting skill, a model better suited to a task, an MCP server for a private tool.

**How OpenFlows helps.** OpenFlows is plug-and-play. You can add a **skill**, register an **MCP server**, or enable a new **model** as configuration only - no engineering work required.

> [!INFO] Enterprise and solo, on the same tool
> OpenFlows is position-led as an **enterprise capability** - self-hosted, governed, auditable, and multi-tenant, so a whole company can run many isolated teams on one Coder deployment - while remaining perfectly usable by a **single developer**. The difference is scale and governance, not the product: the same pipeline runs your backlog, whether you're one person or one thousand.

## When might it not be the right fit?

OpenFlows assumes you have a **self-hosted Coder environment** and a GitHub repository you control. It is designed for governed, in-your-network delivery. If you have no existing Coder infrastructure and want a fully hosted, zero-infrastructure AI coding assistant, that's a different trade-off.

## Where to go next

```cards
- [How OpenFlows compares](/docs/introduction/how-openflows-compares): The trade-offs against the common alternatives.
- [Quick Start](/docs/getting-started): Ready to run it? Start here.
```
