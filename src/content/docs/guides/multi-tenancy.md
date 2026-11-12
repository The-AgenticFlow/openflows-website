---
title: Setting Up Multi-Tenant Teams
nav_label: Multi-Tenancy
section: Guides
order: 3
description: "One Coder server can run many independent OpenFlows teams. Each team is a **tenant**, isolated from the others by both identity and coordination state. This guide walks through adding additional teams and managing the set."
---

## How one server serves many

- Each **tenant** is a Manager record bound to one repository and a creator-owned Coder identity, with its own Nexus workspace.
- Tenants can share Coder and Redis infrastructure while using distinct runtime identities and Redis ACL credentials.
- Manager derives tenant scope from the authenticated workspace. Redis also restricts each tenant to its own namespace.

## Steps to add another team

1. **Have the control plane running** (from the Quickstart).
2. **Install the GitHub App** for the organization and select an accessible repository.
3. **Add the tenant** for that repository. Manager provisions its Redis access and Nexus workspace.
4. **Optionally configure notifications** for that tenant's escalations.

That's it - the team is live and can start taking issues for its repository.

## Managing the team set

From the control panel (or the equivalent command surface):

- **List** the tenants running on the server.
- **Add** more tenants as above.
- **Clean** a stuck tenant - reset stale or failed work to the start so its team can proceed.
- **Remove** a tenant and tear down its fleet.

## What you should see

- Each tenant's status is visible separately; you can tell whose tickets are which.
- Teams operate in parallel without cross-talk.
- A cleanup on one tenant never disturbs another.

## Isolation guarantees, restated

- **Identity plane:** Manager binds runtime sessions to workspace, tenant, organization, and repository records.
- **Data plane:** each tenant has a Redis ACL identity and a separate namespace.
- These compose into strong, defense-in-depth isolation on shared infrastructure.

## Practical guidance

- Give each team a **distinct, well-scoped repository** binding so work doesn't collide downstream.
- Set **notifications per tenant** so escalations reach the right people.
- Use **list** regularly to keep an eye on the whole fleet across teams.
- Reserve **clean and remove** for deliberate operations; they reset or tear down a team's work.

> [!TIP] Related
> Once a team is up, [Managing the Fleet](/docs/guides/operations) controls any single team. See [Wiring Notifications](/docs/guides/operations) for per-tenant escalation channels.
