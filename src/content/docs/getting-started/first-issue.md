---
title: First Issue Walkthrough
section: Get Started
order: 3
description: "This walkthrough takes you from a fresh environment to your first merged pull request produced by the OpenFlows team. It is the fastest path to seeing the whole loop work."
---

> [!INFO] Plan before code
> OpenFlows will not let an agent start writing code before a plan is agreed. FORGE writes a plan and then halts; SENTINEL reviews that plan and either approves it or sends it back. Only an approved plan unlocks the next step. This gate is structural - skipping the review is not possible, even by accident.

## 1. Stand up the control plane

Start Manager, PostgreSQL, Redis, Coder, and the secret provider (see [Installation](/docs/getting-started/installation)). Run Manager's setup and doctor checks, then confirm the public Manager URL and Coder URL are reachable.

## 2. Bootstrap the environment

Run Manager setup and verify the deployment. This:

- Checks the operator identity and Coder integration.
- Validates the template source and supported provisioner.
- Checks GitHub configuration, secret references, PostgreSQL, and Redis.

Bootstrap should complete cleanly. If it reports a missing integration - for example, GitHub authentication not set up - resolve that before continuing.

## 3. Add a tenant for your repository

Sign into Manager, create or select an organization, install its GitHub App, and select an accessible repository. Create a tenant for that repository and wait for its Nexus provisioning operation and runtime heartbeat to succeed.

A note on "tenant": in OpenFlows, one Coder server serves many teams. Each tenant is one team bound to one repository. If you only have one team, think of this simply as "setting up your project."

## 4. Verify the GitHub App connection

Confirm the GitHub App installation can access the tenant repository. Runtimes request short-lived, repository-scoped installation tokens from Manager's broker. Hosted GitHub actions use the App bot identity. See [Identity and tokens](/docs/getting-started/token-guide) for the full model.

## 5. (Optional) Turn on notifications

For the smoothest experience, configure at least one notification channel (Slack, Discord, or WhatsApp). These are how OpenFlows tells you when it needs a human decision and how it surfaces reactions you must make. Without them, it still works - you would just check the control panel.

## 6. Open an issue

Create a clearly-scoped GitHub issue in the bound repository. The better the issue is described, the better the plan FORGE will produce. A good issue contains:

- **Context** - why the change is needed.
- **Goal** - a single sentence describing what success looks like.
- **Constraints** - non-functional requirements such as performance or security.
- **Acceptance criteria** - a checklist the reviewer can verify against.

You do not need to write a plan, write tests, or assign the issue. The team handles all of that.

> [!TIP] What happens next
> Watch the pipeline run:
>
> -   **NEXUS** picks the issue up and turns it into a ticket.
> -   **FORGE** writes a plan and **halts**.
> -   **SENTINEL** reviews the plan and approves it.
> -   **FORGE** implements, tests, and opens a pull request.
> -   **SENTINEL** reviews the pull request adversarially.
> -   **VESSEL** watches CI, resolves conflicts, and merges.

## 7. Review what came back

When the work finishes, you get a merged pull request plus a record of the decisions made along the way. If at any point OpenFlows needed a human call - a security concern, an ambiguous spec, or a merge block - you were notified. Walk to that decision, resolve it, and the team continues. See [Completion & Merge](/docs/getting-started/completion-and-merge) for how to review what came back.

> [!TIP] Continue reading
> See [Ticket Lifecycle](/docs/getting-started/lifecycle-steps) for the detailed phases every ticket travels through, and [Completion & Merge](/docs/getting-started/completion-and-merge) for how the work wraps up.

## Next steps

```cards
- [Ticket Lifecycle](/docs/getting-started/lifecycle-steps): The phases from issue detection through merge.
- [Completion & Merge](/docs/getting-started/completion-and-merge): How work is reviewed, merged, and torn down.
- [Identity and Tokens](/docs/getting-started/token-guide): User login, runtime registration, and brokered GitHub access.
```
