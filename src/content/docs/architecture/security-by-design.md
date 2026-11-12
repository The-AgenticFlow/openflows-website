---
title: Security model
nav_label: Security by Design
section: Architecture
order: 12
description: "OpenFlows separates platform authority from tenant execution. Manager holds infrastructure signing and provisioning credentials; Coder runs the workspaces; Nexus coordinates a tenant's agents. Every runtime API call resolves scope from a registered workspace."
---

## Controls and boundaries

| Boundary | Enforcement |
| --- | --- |
| Platform secrets | GitHub App signing key, Coder operator credential, and Manager encryption key remain in the trusted control plane. |
| Runtime identity | One-time workspace bootstrap, hashed access and refresh credentials, and server-derived scope. |
| GitHub access | Brokered installation token limited to the authorized repository and role-specific permissions. |
| Tenant coordination | Tenant Redis ACL credential plus immutable tenant namespace. |
| Provisioning | Durable operations, database leases, capacity reservations, and idempotent requests. |
| Coder lifecycle ingress | Manager verifies a global JWT, resolves the workspace to a tenant, and re-signs the event for Nexus. |
| A2A verification | Ticket pair token, Forge-only claim, tenant-scoped task and audit records. |

## Workspace exposure

A worker is isolated and disposable, but it is not credential-free. Its mounted bundle contains a one-time bootstrap and tenant Redis access. It holds a runtime session and may receive short-lived GitHub installation tokens for its repository. A compromised workspace can act within those scopes until the credentials expire or are revoked.

Manager does not mount its database connection, GitHub App private key, Coder operator token, or master encryption key into workspaces. Repository permissions are selected on the server, and the runtime cannot name a different installation or permission set in its request.

## Independent review

Forge and Sentinel have separate workspaces. Sentinel asks Forge to run verification through Nexus's A2A relay, receives recorded evidence, and does not enter Forge's filesystem. Missing or invalid evidence must not approve a review gate.

## Operational responsibilities

Operators must secure network paths, the secret provider, PostgreSQL, Redis, Coder, template releases, logs, and backup copies. The current GitHub broker coalesces equivalent requests within a Manager process; distributed single-flight across replicas remains an improvement.

> [!INFO] Inspect the protocols
> See [Credentials and Trust](/docs/architecture/credentials) for token lifecycles and [Hooks and A2A](/docs/architecture/hooks-and-a2a) for event authentication.
