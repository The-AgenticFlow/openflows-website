---
title: How the pieces talk
nav_label: How the Pieces Talk
section: Architecture
order: 9
description: "Manager owns privileged control-plane decisions. Nexus owns the tenant's agent workflow. Coder runs workspaces, and Redis stores tenant coordination state. The channel determines the credential and authority."
---

| Channel | Authentication | What travels over it |
| --- | --- | --- |
| Nexus → Manager | Workspace runtime access token | Worker requests, status, heartbeats, and GitHub credential requests |
| Manager → Coder | Platform operator credential | Template publication and workspace creation or lifecycle |
| Runtime → Redis | Tenant Redis ACL credential | Ticket state, worker slots, heartbeats, A2A evidence |
| Coder → Manager → Nexus | Global then tenant hook JWT | Coder lifecycle events and policy responses |
| Forge / Sentinel → Nexus | Ticket pair token | A2A verification tasks, progress, and results |
| Runtime → GitHub | Brokered installation token | Repository API and Git operations |

## Runtime API

Each workspace registers using a one-time bootstrap and receives an access/refresh pair. Manager derives its tenant, role, and repository from the workspace record. Nexus asks Manager to create workers; Manager records a durable operation and talks to Coder.

## Hooks and A2A

Coder lifecycle events enter through Manager, which authenticates and routes them to the tenant's Nexus hook server. Agent CLI hooks run locally inside worker workspaces. Sentinel and Forge exchange verification tasks through Nexus's A2A relay, which persists evidence to tenant Redis.

Read [Manager Runtime](/docs/architecture/manager-runtime), [Credentials and Trust](/docs/architecture/credentials), and [Hooks and A2A](/docs/architecture/hooks-and-a2a) for the full request flows.
