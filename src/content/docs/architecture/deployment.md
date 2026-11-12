---
title: Deployment architecture
nav_label: "How It's Deployed"
section: Architecture
order: 13
description: "A production deployment runs Manager as the trusted control plane and Coder as the workspace execution platform. PostgreSQL and Redis serve different kinds of state. GitHub callbacks reach Manager at its public HTTPS origin."
---

| Service | Role |
| --- | --- |
| OpenFlows Manager | Product API, authentication, runtime broker, hook ingress, durable provisioning workers |
| PostgreSQL | Manager ownership, credentials hashes, operations, workspace and lease state |
| Redis | Tenant ACL identities and coordination state |
| Coder and provisioner | Workspace builds, agents, template releases, and execution |
| Secret provider | Platform keys and per-workspace runtime bundles |
| GitHub OAuth App and GitHub App | Human sign-in and repository-scoped installation access |

## Required network paths

- Browsers and GitHub reach Manager's HTTPS origin.
- Manager reaches PostgreSQL, Redis administration, Coder, GitHub, its secret provider, and each tenant's Nexus hook endpoint.
- Coder workspaces reach Manager's runtime API, their tenant Redis endpoint, GitHub, and the Nexus A2A relay when paired.
- Coder lifecycle sender reaches Manager's hook ingress, which authenticates and relays events to Nexus.

## Manager replicas

Manager provisioning jobs live in PostgreSQL and are claimed with leases. Another replica can recover a job after a crashed replica's lease expires. Each instance needs the same configuration, secret provider, and access to shared services. Broker request coalescing is currently local to one process.

## Template releases

Template manifests are immutable by release name. Publish a new release when a template changes, promote it for an organization, and update or rebuild workspaces to pick it up.

> [!INFO] Operator guide
> For exact configuration, setup, doctor, and serving commands, use the [versioned operator documentation](https://github.com/The-AgenticFlow/OpenFlows/tree/main/docs/implementation/centralized-deployment).
