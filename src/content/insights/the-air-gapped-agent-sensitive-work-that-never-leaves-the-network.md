---
title: "The Air-Gapped Agent: Sensitive Work That Never Leaves the Network"
slug: the-air-gapped-agent-sensitive-work-that-never-leaves-the-network
excerpt: "A government agency cannot adopt an AI software team whose code, decisions, and audit trail live outside its own infrastructure. OpenFlows is designed to run where the agency says it runs."
author_name: OpenFlows
published_at: 2026-09-28T15:00:00.000+01:00
---
A government agency cannot adopt an AI software team whose code, decisions, and audit trail live outside its own infrastructure. OpenFlows is designed to run where the agency says it runs.

A government agency has an obligation that a commercial startup does not: its source code, its agent work, and its audit trail must stay inside the network. The network is air-gapped or closely controlled. No model provider, no hosted vendor, and no third party may hold a copy of what the team produces. When AI delivery is introduced under those constraints, the first question is not capability. It is residency. Where does the work live, and can the agency prove it?

This article explains how OpenFlows meets that obligation by design, and why the answer is structural rather than a policy promise.

## The Fall-Out of AI That Reaches Outside

An agent system that depends on external services fails the residency obligation in predictable ways. Each is a finding a security review writes:

- **The code leaves the network.** A worker workspace talks to a hosted model or a shared cloud service, and the source travels with it.
- **Keys inside the workspace.** A CLI agent needs an API key on the machine that does the work, and a key that exists can be stolen.
- **The record is remote.** The decision log lives on a vendor's server, so the agency cannot show where the evidence is held.
- **Cross-tenant leakage.** One team's work is observable by another, which a cleared environment cannot tolerate.
- **Unreviewed work ships.** The same agent writes and approves its own change, so the approval is not defensible.

OpenFlows closes each of these paths at the architecture level.

## The Controls: Residency by Construction

### The whole system runs on your own Coder

OpenFlows is built to run inside a self-hosted Coder environment. The Coder server, the control plane, and the shared store live where the agency deploys them, inside the network. Nothing about the delivery loop requires a hosted OpenFlows service. The product ships as an open stack that operates on your infrastructure.

### No keys, and no model, in the workspaces

The AI loop does not run where the code is written. Worker workspaces carry no LLM API keys and no agent framework software. The loop runs in the control plane through the Coder AI Gateway, which is itself on your infrastructure.

This is the decisive control. A workspace has nothing to exfiltrate because there is no key and no credential to steal. The GitHub token comes from a single source: the Coder GitHub App, linked per tenant during account setup, with no personal access token issued. Every agent action inherits a real tenant identity through that one authenticated path.

Because the model routing runs on the Coder AI Gateway inside the control plane, an agency can connect its own local models. A model is registered in the Coder dashboard as a configuration entry, and the agents reference it by name. No source code leaves for inference, because the model that reasons over the code is itself on the network. Adding a model is a configuration change, not a change to the delivery loop, so the system works the same whether the agency points it at a hosted provider or at models it runs itself.

### Restricted egress, enforced by policy

Worker workspaces have a heavily restricted network policy. The allowlist admits the control plane, the code host, and the shared store. Everything else is denied by default. The model inference path stays on the AI Gateway, not on the open internet. The workspace is built to talk to your network, and nothing more.

### The code is copied in, not fetched out

The git credentials and network egress stay with a single orchestrator in the control plane. Workers receive the repository as an offline, read-only golden copy seeded from a shared volume. They never hold the credentials and never perform a live external clone. The repository moves inside the network, from the control plane to the worker, without a network dependency in the worker itself.

### Isolation at the tenant level

One Coder server serves many teams, and each tenant is isolated twice: by Coder role-based access control, and by a per-tenant Redis keyspace prefix. One team's work, workspace, and record are never visible to another. In a cleared environment, this separation is not a convenience. It is a requirement.

## The Evidence Posture

The audit trail is durable and it lives where the agency can inspect it. The shared store is the single durable record of how the team coordinates. Every node lifecycle transition emits a typed event, and durable facts are written to explicit store keys, so a restart does not erase the record. The verification channel mirrors every accepted command, result, and rejection into the tenant's own keyspace before a task is acknowledged complete. A result that cannot be persisted cannot approve a gate. The record is therefore not an afterthought. It is a precondition of the work being accepted.

Separation of duties reinforces the record. No agent authors, reviews, and merges its own work. A distinct reviewer approves the plan, using a single-use token that cannot be replayed. A separate role monitors the build and performs the merge. The approval in the record is evidence that a separate review occurred, not a self-endorsement.

## Why It Matters

1. **Residency is provable.** The code, the loop, and the record are all inside the network, so the agency can state where the work lives.
2. **There is nothing to exfiltrate.** With no keys and no model in the workspaces, the standing key-leak risk is absent, not mitigated.
3. **The record is durable and inspectable.** Decisions survive restarts and live in tenant-isolated, auditable keys.
4. **Isolation is enforced, not requested.** Tenant separation holds at the keyspace and RBAC level, by construction.
5. **Approval carries evidentiary weight.** Separation of duties and single-use tokens make each approval defensible.

## Thesis Return

The barrier to AI adoption in a government network is not model capability. It is residency: can the sensitive code, the agent work, and the audit trail stay inside the perimeter? OpenFlows answers yes by construction. The system runs on the agency's own Coder, keeps every key and every model call in the control plane, copies the code in rather than reaching out, and writes a durable, isolated record of everything that happened.

That is an AI software team that operates inside the network the agency controls, and leaves an audit trail it can defend. Sensitive work that never leaves the perimeter is not a constraint on OpenFlows. It is the design.
