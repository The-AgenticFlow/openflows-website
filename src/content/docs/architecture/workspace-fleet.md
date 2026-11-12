---
title: The workspace fleet
nav_label: The Workspace Fleet
section: Architecture
order: 8
description: "Each tenant has a Nexus controller workspace and may have Forge, Sentinel, Vessel, and Lore worker workspaces. Manager records their owner, role, tenant, desired state, Coder identity, and pinned template release. Coder builds and runs them."
---

## Nexus

Nexus is long-running. It coordinates tickets and hosts the A2A relay and tenant lifecycle hook server. It calls Manager to request or supervise workers, and it accesses its repository through the GitHub credential broker.

## Workers

Workers are role-scoped and can be removed after their assignment. They have separate filesystems and use a ticket pair token when participating in A2A verification. Their startup uses a mounted runtime bundle and a brokered, short-lived GitHub installation token for repository access.

## Credential boundary

A workspace can read its own tenant Redis credential, runtime session, and temporary GitHub token. It cannot read Manager's GitHub App private key, Coder operator token, or another tenant's Redis credential. Do not treat a running agent workspace as a credential-free sandbox.

## Liveness and cleanup

Workspaces heartbeat to Manager, while agent progress and assignment heartbeats live in tenant Redis. Manager records lifecycle state durably. Nexus uses the coordination signals to detect stale agents and request recovery. Cleanup revokes runtime authority and releases capacity.

> [!INFO] Separate controls
> Manager controls workspace identity and lifecycle. Nexus controls the tenant's workflow. Coder reports build and agent execution state.
