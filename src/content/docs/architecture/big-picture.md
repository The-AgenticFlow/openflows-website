---
title: The big picture
nav_label: Big Picture
section: Architecture
order: 6
description: "OpenFlows Manager is the trusted product control plane. Coder provides workspace execution. Nexus is the controller inside one tenant's runtime, and workers execute ticket-scoped tasks in separate workspaces."
---

```mermaid title="The product control plane provisions and supports a tenant runtime"
flowchart TB
    user["Signed-in user"] --> manager["OpenFlows Manager"]
    manager --> postgres[(PostgreSQL)]
    manager --> coder["Coder"]
    manager --> github["GitHub App"]
    coder --> nexus["Nexus controller"]
    coder --> workers["Worker workspaces"]
    nexus <--> redis[("Tenant Redis")]
    workers <--> redis
```

| Component | Boundary | Responsibility |
| --- | --- | --- |
| Manager | Product control plane | Users, organizations, GitHub connections, runtime identity, broker, operations, hook ingress |
| Coder | Execution control plane | Templates, builds, workspace agents, and workspace lifecycle |
| Nexus | Tenant controller | Issue sync, scheduling, reconciliation, agent hooks, and A2A relay |
| Forge, Sentinel, Vessel, Lore | Tenant workers | Scoped work in separate disposable Coder workspaces |
| PostgreSQL | Manager system of record | Ownership, operation leases, workspace credentials, and broker leases |
| Redis | Tenant coordination store | Tickets, worker slots, agent heartbeats, A2A evidence, and hook audit |

## From organization to agent work

1. A user signs into Manager, creates an organization, and connects a GitHub App installation.
2. Manager provisions a tenant and Nexus using durable operations and pinned Coder templates.
3. Nexus registers a runtime session, synchronizes repository work using a brokered installation token, and asks Manager for workers.
4. Manager authorizes and creates workers in Coder. The workers register their own scoped runtime sessions.
5. Forge and Sentinel exchange verification requests through the Nexus A2A relay, with evidence stored in tenant Redis.

See [Manager Runtime](/docs/architecture/manager-runtime) for the lifecycle and [Credentials and Trust](/docs/architecture/credentials) for the exact authority boundaries.
