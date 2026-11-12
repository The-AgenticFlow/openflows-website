---
title: Installation
section: Get Started
order: 2
description: "This is the deployment sequence for the Manager-mediated architecture. Use the release-specific configuration and operator guide in the [OpenFlows repository](https://github.com/The-AgenticFlow/OpenFlows/tree/main/docs/implementation/centralized-deployment) for exact commands and supported infrastructure settings."
---

## 1. Prepare services and domains

- PostgreSQL for Manager state and a database for Coder.
- Redis reachable from Manager and Coder workspaces; Manager needs administrative access to create tenant ACL identities.
- Coder with a provisioner and a network path to workspace agents.
- A public HTTPS origin for Manager so GitHub OAuth, App installation callbacks, and webhooks can reach it.
- A GitHub OAuth App for sign-in and a GitHub App for repository installation and brokered runtime access.
- A secret provider, encryption master key, Coder operator credential, and template release source.

## 2. Configure and validate Manager

Provide the Manager's typed deployment configuration and secret references. Run `openflows-manager setup` to bootstrap supported Coder integration, then `openflows-manager doctor` to validate secrets, PostgreSQL, Redis, Coder identity, public origin, template source, and the provisioner. Resolve failed checks before serving traffic.

## 3. Start the control plane

Run `openflows-manager serve` behind HTTPS. The Manager serves the product API and web UI, receives GitHub callbacks and Coder lifecycle hooks, and runs durable background workers. Coder executes the workspaces; Nexus is provisioned inside a tenant.

## 4. Create the first tenant

1. Sign into Manager with GitHub.
2. Create an OpenFlows organization and wait for its provisioning operation to succeed.
3. Install the GitHub App for the intended account and repository. Verify that the connection appears in OpenFlows.
4. Create a tenant for an accessible repository. Manager creates the creator-owned Coder identity, tenant Redis access, and Nexus workspace.
5. Confirm that Nexus registers, heartbeats, and reports a running workspace before opening a test issue.

> [!WARNING] Template releases are immutable
> After changing a template, publish a new release name, promote it to the organization, and update or rebuild affected workspaces. Restarting Manager alone does not replace an existing Coder template version.

```cards
- [Token Guide](/docs/getting-started/token-guide): Understand sign-in, runtime sessions, Redis, and GitHub App tokens.
- [First Issue](/docs/getting-started/first-issue): Run the first ticket through the agent team.
- [Deployment](/docs/architecture/deployment): Review service connections and runtime topology.
```
