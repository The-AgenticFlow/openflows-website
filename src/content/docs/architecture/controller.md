---
title: The Nexus controller
nav_label: The Controller
section: Architecture
order: 7
description: "Nexus is the long-running controller inside a tenant's Coder workspace. It reads repository issues, maintains the ticket flow, assigns roles, detects stalled work, and escalates decisions requiring a person."
---

## Startup

Nexus registers with Manager using its workspace bootstrap, opens the tenant-scoped Redis store, starts Manager heartbeats, publishes role-specific agent hooks and assets, and serves the lifecycle hook consumer and A2A JSON-RPC relay.

## Scheduling

Nexus selects a ticket, role, branch, and slot. For hosted workers it calls Manager's runtime workspace API with an idempotency key. Manager checks the caller, capacity, and pinned template, then provisions through Coder. Nexus polls the managed workspace status and adopts it when running.

## GitHub

Nexus asks Manager's broker for a short-lived installation token for API work. It does not need the GitHub App private key or a person's GitHub OAuth token.

## Reconciliation and recovery

The controller repeatedly reads tenant state from Redis and advances the flow. Manager independently reclaims expired provisioning operation leases in PostgreSQL. A failed Nexus pass can be retried; a failed Manager operation has a separate durable status and retry policy.

See [Manager Runtime](/docs/architecture/manager-runtime) for the workspace control path and [Hooks and A2A](/docs/architecture/hooks-and-a2a) for its two inbound services.
