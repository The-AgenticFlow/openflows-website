---
title: How OpenFlows works
section: Introduction
order: 2
description: "OpenFlows behaves like a disciplined engineering team, except the engineers are AI agents that coordinate through a shared, governed system. It automates the repetitive, low-judgment parts of the pipeline so you can focus on the decisions only a person can make. The loop is steady and repeatable."
---

## The end-to-end flow

From the moment an issue appears to the moment a pull request is merged, a ticket moves through a fixed pipeline:

1. **NEXUS** picks up the issue and plans the work.
2. **FORGE** writes a plan, then stops.
3. **SENTINEL** reviews and approves the plan.
4. **FORGE** writes code, runs tests, and opens a pull request.
5. **SENTINEL** reviews the code.
6. **VESSEL** watches CI, handles conflicts, and merges.
7. **LORE** documents the change, optionally.
8. The workspace is torn down, and you have a merged pull request.

## Planning before coding

OpenFlows will not let an agent start writing code before a plan is agreed. FORGE writes a plan and then halts. SENTINEL reviews that plan and either approves it or sends it back. Only an approved plan unlocks the next step. Because this gate is built into the system itself, the ticket cannot move forward without an approval, so skipping the review is impossible even by accident.

## Review that is actually adversarial

Review is what keeps an agent team honest. Code written by an agent gets its first pass of review from another agent, not from a person waiting at the bottom of a queue. Since agents produce far more code than any human can review by hand, the first-pass reviewer has to be an agent too, otherwise the human becomes the bottleneck that gates every pull request.

SENTINEL is not a style checker. It is instructed to attack the work for security holes and risky patterns, quality issues and inconsistencies, and missing test coverage against the agreed contract.

SENTINEL works in its own isolated workspace and never touches the builder's files directly. When it needs proof, for example to run the test suite, it asks the builder's workspace to run a safe, allowlisted command and sends the evidence back. Keeping review and building physically separate is what makes the review trustworthy.

## Self-healing

Agents crash, workspaces go silent, and merge processes stall. OpenFlows is built to absorb this. A central reconciliation loop runs constantly, watching for unmerged pull requests nobody processed, orphaned tickets with no active worker, workspaces that went silent, and chats that errored out. When it finds a problem it retries a bounded number of times. If something genuinely needs a human decision, it stops and escalates to you rather than guessing.

## Humans stay in the loop where it matters

OpenFlows is autonomous but never unsupervised. It pulls a person in only at the decisions that matter: a security call, an ambiguous or underspecified requirement, an architectural choice, or a merge block it cannot resolve on its own.

That is where human judgment belongs, owning the architecture and the product rather than babysitting a review queue. When OpenFlows does need you, you get a notification with links straight to the ticket, the workspace, and the pull request, so you can jump in and decide.

## What's happening under the hood

OpenFlows coordinates these agents through a shared coordination store that records every ticket, worker, approval, review, and pull request. That store is the single record of truth: Coder provides the machines, GitHub holds the code, and OpenFlows holds the coordination state that ties them together. Even when a step fails, the next cycle detects it and nudges the work forward.

## Where to go next

```cards
- [Use cases](/docs/introduction/use-cases): Where this design fits and where it does not.
- [Core Concepts](/docs/concepts/coder-openflows-split): The ideas you need to reason about the system.
- [The Controller](/docs/architecture/controller): The brain and its orchestration loop, in detail.
```
