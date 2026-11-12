---
title: "What is OpenFlows?"
nav_label: What is OpenFlows
section: Introduction
order: 1
description: "OpenFlows is an autonomous AI software team that turns GitHub issues into reviewed, production-ready pull requests using OpenFlows Manager and isolated Coder workspaces. Instead of a single chatbot that suggests snippets, OpenFlows stands up a small team of specialized AI agents, each with a clear role, that plan, write, test, and risk-review code on your behalf. You keep control of the architecture and the final decisions; the team handles the execution."
---

In short, you open a GitHub issue, and OpenFlows plans it, writes it, stresses it, and merges it, then tells you what happened.

## The founding principle

OpenFlows is built around one idea: Coder decides *where* work runs, and OpenFlows decides *how* agents work together. Coder provides the governed, isolated, disposable workspaces. OpenFlows Manager handles product identity, GitHub connections, runtime credentials, and workspace operations. The Nexus controller coordinates the plan, review, merge, and guardrails.

## The problem it solves

Writing code in teams has become a bottleneck, but not because teams got slower. A language model can now produce working code faster and more consistently than a person typing by hand. Yet humans are still the product owners. They decide what gets built and why, set the architecture, and own the quality of what ships.

The real bottleneck is that people are sitting at the wrong phase of the pipeline. Once agents are involved, an agent can push far more code than any person can review by hand, but that code still needs review. The only first-pass reviewer that can keep up is another agent. OpenFlows makes that first pass an isolated, adversarial agent role, so a skilled engineer no longer has to click accept or deny on trivial changes all day. That engineer is far more valuable one level up the chain, at product design and architecture, where human judgment cannot be replaced.

## Who is it for?

OpenFlows is built to be an enterprise-grade orchestration layer: governed, auditable, and self-hosted on your own infrastructure. It is just as useful for a solo developer who wants a personal AI team working their backlog overnight. It scales from one person to many teams on the same fleet.

- Enterprises and teams that need governed, auditable AI delivery inside their own network, with strict isolation and no model keys in worker workspaces.
- Developers who want the mechanics of planning, coding, testing, and review handled while they stay in charge of the important decisions.
- Solo developers who want a personal AI team to work through issues and return reviewed pull requests, without babysitting every change.

## A quick tour of the team

OpenFlows runs five roles that hand work from one to the next:

- **NEXUS**, the orchestrator, picks up issues, keeps the team moving, recovers from failures, and notifies you when input is needed.
- **FORGE**, the builder, writes code against an agreed plan, creates branches, and opens pull requests.
- **SENTINEL**, the reviewer, risk-reviews both the plan and the code for security, quality, and test coverage.
- **VESSEL**, the merger, watches CI, resolves merge conflicts, and merges green pull requests.
- **LORE**, the writer, documents decisions and keeps project history up to date (often disabled by default).

The rest of this documentation explains how that team works, what it needs, and how to make it yours.

## Where to go next

```cards
- [How OpenFlows works](/docs/introduction/how-it-works): The end-to-end flow, in plain language.
- [How OpenFlows compares](/docs/introduction/how-openflows-compares): How it stacks up against the alternatives.
- [Quick Start](/docs/getting-started): The fastest path to a running team.
```
