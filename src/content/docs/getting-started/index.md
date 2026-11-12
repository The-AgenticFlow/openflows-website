---
title: Getting Started
nav_label: Quick Start
section: Get Started
order: 1
description: "OpenFlows is an autonomous AI software team that turns GitHub issues into reviewed, production-ready pull requests through OpenFlows Manager and isolated Coder workspaces. It stands up a small team of specialized agents that plan, write, test, and adversarially review code on your behalf. You stay in control of the important decisions; the team handles the execution."
eyebrow: Quick Start Guide
read_time: "~10 min read"
level: Beginner
---

> [!TIP] The one-line idea
> You open a GitHub issue. OpenFlows plans it, writes it, stresses it, and merges it - then tells you what happened. **Coder governs *where* agents run; OpenFlows governs *how* they coordinate.**

## 1. Who it is for

OpenFlows is an **enterprise-grade** orchestration layer - self-hosted, governed, auditable, and multi-tenant - that is just as at home for a **solo developer** who wants a personal AI team. Anyone who wants AI to execute end-to-end with guardrails inside their own environment fits here:

- **Enterprises & teams** that need governed, auditable AI delivery inside their own network, with strict isolation and no model keys in worker workspaces.
- **Developers** who want the mechanics of planning, coding, testing, and review handled while they stay in charge of the important decisions.
- **Solo developers** who want a personal AI team to work through their backlog and return reviewed pull requests, without babysitting every change.

## 2. Prerequisites

- **Self-hosted Coder**: OpenFlows rides on your Coder server, which provides identity, model access, and the disposable workspaces where agents run.
- **GitHub repository**: OpenFlows turns GitHub issues into pull requests, so it needs a repository and GitHub authentication for it.
- **PostgreSQL and Redis**: PostgreSQL stores Manager authority and durable operations; Redis stores tenant coordination state.
- **GitHub OAuth App and GitHub App**: OAuth signs people into Manager; the installed GitHub App brokers repository tokens for runtimes.

> [!INFO] Coder governs where agents run; OpenFlows governs how they coordinate
> The two systems divide the work deliberately:
>
> -   **Coder** decides where work runs. It provides governed, isolated, disposable workspaces and the execution environment.
> -   **Manager** authenticates users and runtimes, provisions workspaces through Coder, and brokers repository-scoped GitHub credentials.
> -   **Nexus** coordinates planning, adversarial review, recovery, and merges for its tenant.
>
> Neither replaces the other. OpenFlows does not manage machines; Coder does not write your code.

## 3. Install & Set Up

Set up Manager, Coder, PostgreSQL, Redis, and the secret provider. Run Manager setup and doctor, sign in, create an organization, install the GitHub App, and create a tenant for its repository. Wait for Nexus to register and heartbeat before opening an issue.

Step-by-step guidance lives on the [Installation](/docs/getting-started/installation) page and the [First Issue Walkthrough](/docs/getting-started/first-issue).

## 4. Track Your First Issue

Once the environment is up and your tenant is configured, create a clear GitHub issue in the bound repository. OpenFlows does the rest:

1. **NEXUS picks** the issue up and turns it into a ticket.
2. **FORGE writes** a plan, then **halts**.
3. **SENTINEL reviews** the plan and approves it.
4. **FORGE implements**, tests, and opens a pull request.
5. **SENTINEL reviews** the pull request adversarially.
6. **VESSEL watches** CI, resolves conflicts, and merges.
7. **LORE documents** the change (where enabled).
8. **The workspace is torn down** after merge - no lingering state.

If at any point OpenFlows needs a human call - a security concern, an ambiguous spec, or an unresolvable merge - you are notified and the team waits for your decision. See the [First Issue Walkthrough](/docs/getting-started/first-issue) and the [Lifecycle](/docs/getting-started/lifecycle-steps) pages for the full picture.

## 5. What OpenFlows is not

- **Not a chat assistant.** It is not a tool you prompt and babysit; it is a team that plans, reviews, and merges under its own guardrails. You decide, it executes.
- **Not a replacement for workspace security.** Workspaces hold scoped runtime and temporary repository credentials and need isolation and monitoring.
- **Not a bare orchestrator you maintain.** The planning gate, adversarial review, recovery, and human escalation are already built - you do not write the coordination logic.
- **Not a replacement for Coder.** It is a layer on top. It needs your self-hosted Coder environment to run, and it favors governance over raw speed.

## 6. Next Steps

```cards
- [Identity and Tokens](/docs/getting-started/token-guide): User login, workspace registration, and brokered GitHub access.
- [Installation](/docs/getting-started/installation): What you need before you start, the topology, and what the installer does.
- [First Issue Walkthrough](/docs/getting-started/first-issue): Step through one complete ticket from issue creation to merged PR.
- [Ticket Lifecycle](/docs/getting-started/lifecycle-steps): The phases every ticket travels through, from planning to merge.
```

> [!INFO] Digging deeper
> -   [Coder Integration](/docs/concepts/coder-openflows-split) - how OpenFlows and Coder split the work
> -   [Architecture-First](/docs/concepts/architecture-first) - why OpenFlows plans before coding
> -   [The Agent Team](/docs/concepts/agent-team) - who NEXUS, FORGE, SENTINEL, VESSEL, and LORE are
> -   [Security Model](/docs/architecture/security-by-design) - runtime boundaries and scoped credentials
> -   [Operations](/docs/guides/operations) - managing the fleet at runtime
> -   [Multi-Tenancy](/docs/guides/multi-tenancy) - one Coder server, many teams
