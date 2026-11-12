---
title: Hooks and agent-to-agent communication
nav_label: Hooks and A2A
section: Architecture
order: 5
description: "Two hook mechanisms and one A2A relay participate in the runtime. Each has its own sender, authentication, and state."
---

## Coder lifecycle events

```mermaid title="Coder event relay through Manager"
sequenceDiagram
    participant C as Coder
    participant M as Manager hook ingress
    participant N as Nexus hook server
    participant R as Tenant Redis
    C->>M: Signed lifecycle event
    M->>M: Verify signature and tenant mapping
    M->>N: Relay body with tenant signature
    N->>N: Verify tenant signature
    N->>R: Record audit event
    N-->>M: Hook decision
    M-->>C: Hook decision
```

1. Coder sends a signed lifecycle event to Manager's `/api/v1/hooks/coder/chat` endpoint.
2. Manager verifies the global signature and payload hash, resolves the Coder workspace to exactly one tenant, then signs the same body with that tenant's hook key.
3. Manager relays the event to the Nexus hook server at `/experimental/hooks/chat`. Nexus verifies the tenant signature, writes an audit event to tenant Redis, and may wake its flow loop.
4. Nexus returns a hook decision through Manager to the Coder sender.

## Agent CLI hooks

Nexus publishes role-specific shell hooks and agent assets to a shared artifacts volume. A Forge or Sentinel workspace copies its own hooks during startup and configures its local agent client. These local scripts call the harness; they are distinct from Coder's HTTP lifecycle events.

## Forge and Sentinel A2A verification

```mermaid title="Forge and Sentinel exchange evidence through Nexus"
sequenceDiagram
    participant S as Sentinel
    participant N as Nexus A2A relay
    participant R as Tenant Redis
    participant F as Forge
    S->>N: Verification task with pair token
    N->>R: Store task and token-bound state
    F->>N: Claim authorized task
    F->>F: Run verification in Forge workspace
    F->>N: Send progress and result
    N->>R: Persist result and audit evidence
    S->>N: Read result
    N-->>S: Verification evidence
```

Nexus derives a ticket pair token and stores its hash in tenant Redis. Manager passes the raw token when it creates the paired worker workspaces. Sentinel sends a verification request to the Nexus JSON-RPC relay. Forge claims the task, runs the allowed verification in its own workspace, and sends progress and results back. Sentinel reads the recorded result without entering Forge's filesystem.

The relay stores tasks, results, and audit evidence in tenant Redis so it can recover after a Nexus restart. Manager provisions and scopes the participants, but Forge and Sentinel send A2A traffic directly to Nexus.

> [!INFO] Different tokens
> Coder hook JWTs authenticate lifecycle delivery. A2A pair tokens authenticate one verification pair. Runtime access tokens authenticate workspace calls to Manager. None substitutes for another.
