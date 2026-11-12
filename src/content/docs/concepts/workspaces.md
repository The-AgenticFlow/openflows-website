---
title: Workspaces
section: Core Concepts
order: 5
description: "A **workspace** is where an agent actually does its work. Understanding workspaces is the key to understanding OpenFlows' security model, because nearly everything that makes the system safe comes from how workspaces are built and isolated."
---

Each agent runs in its own short-lived, disposable workspace. It is the "execution seat" for one agent on one ticket: it is created when work on a ticket begins, and it is **torn down** when the work is done.

## A worker workspace is deliberately thin

A worker workspace is kept small on purpose. It contains only what the agent needs to do its job.

| A worker workspace contains | What it is for |
| --- | --- |
| The coordination surface | How the agent talks to the rest of the team. |
| The repository checkout | The code on the branch the agent is working on. |
| Role skills and standards | The role's skills, standards, and persona. |

And, critically, it contains **none** of the following:

| Never in a worker workspace | How it is handled instead |
| --- | --- |
| GitHub App private key | Manager holds the signing key and brokers short-lived installation tokens. |
| Coder operator credential | Manager provisions workspaces through Coder on behalf of Nexus. |
| Other tenants' Redis passwords | Each tenant receives its own Redis ACL identity and namespace. |

> [!WARNING] Workspaces hold scoped credentials
> A running workspace has a bootstrap bundle, tenant Redis access, a runtime session, and possibly a short-lived GitHub token. Protect it as a credential-bearing environment. It does not receive platform signing or operator keys.

## Workspaces are isolated from each other

Every agent works in its own isolated environment. The reviewer and the builder **never share a filesystem**: the reviewer cannot reach into the builder's tree, and can only request that the builder run a safe command and send evidence back. This physical separation is what makes adversarial review trustworthy - a reviewer cannot be fooled or coerced by inspecting or editing the work it is meant to judge.

## Network access is tight

A worker workspace can reach only what it needs:

- The control plane, for coordination and model-backed work.
- GitHub, to push, pull, and manage pull requests.
- The coordination store.
- The internal relay used for delegated verification.

Operators must enforce this network policy in their deployment. Scoped credentials limit authority; they do not remove the need for isolation and monitoring.

## Nobody is anonymous

Hosted GitHub operations use a repository-scoped GitHub App installation token, so commits and API actions appear under the App identity. Manager records the originating workspace and tenant for audit.

## The orchestrator is different

One workspace is long-lived rather than disposable: the **orchestrator** workspace. This runs the tenant flow and hosts the coordination relay. Manager remains the trusted platform authority:

- Nexus requests workers and coordinates their work.
- Manager authenticates runtimes and creates Coder workspaces.
