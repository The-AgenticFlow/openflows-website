---
title: Operations and monitoring
nav_label: Operations & Monitoring
section: Guides
order: 7
description: "Run Manager, Coder, PostgreSQL, Redis, and the secret provider as monitored services. Separate control-plane operation status from tenant agent progress when diagnosing a slow or stuck tenant."
---

| Signal | What it tells you |
| --- | --- |
| Manager doctor | Configuration, public origin, PostgreSQL, Redis, Coder, secrets, and template source |
| Operation status | Queued, running, retryable failure, permanent failure, or success with current step |
| Workspace status | Desired and observed state, last heartbeat, Coder build and agent state |
| Nexus logs | Issue sync, ticket flow, A2A relay, lifecycle hook delivery, and agent assignment |
| Manager logs | Request ID, operation lease, broker exchange, hook ingress, and provisioning errors |

## Investigate a stuck operation

1. Read the Manager operation ID, state, current step, attempt count, and error code.
2. Check Manager provisioning logs using the operation and tenant IDs. A queued operation with no attempts points to worker or lease availability; repeated attempts point to a failing step.
3. Check Coder build and agent logs if workspace creation has started.
4. Use the operation retry control only after identifying and fixing the underlying dependency. Repeated retries do not repair a missing secret, unreachable service, or invalid template.

## Monitor the runtime

Watch Manager request failures, operation queue age, lease recovery, broker failures, Nexus and worker heartbeats, Redis connectivity, Coder provisioner health, and GitHub rate limits. A running Coder workspace without a Manager runtime heartbeat may still be unusable to OpenFlows.

## Release and recovery

Template releases are immutable. Publish a new release name and promote it before rebuilding workspaces. Back up PostgreSQL, Redis, and secret-provider material together. Test restore and credential rotation before production adoption.

> [!INFO] Operational reference
> See the [deployment architecture](/docs/architecture/deployment) and the versioned [operator guide](https://github.com/The-AgenticFlow/OpenFlows/tree/main/docs/implementation/centralized-deployment) for exact commands.
