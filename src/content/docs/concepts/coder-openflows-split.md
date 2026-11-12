---
title: The Coder / OpenFlows split
nav_label: The Coder / OpenFlows Split
section: Core Concepts
order: 9
description: "Coder decides where agents execute. Manager decides which user and tenant may run a workspace, which template and repository it uses, and what scoped credentials it may receive. Nexus decides how agents collaborate on that tenant's work."
---

| Component | Primary responsibility |
| --- | --- |
| Coder | Build and execute isolated workspaces; report build and agent state |
| OpenFlows Manager | Authorize users and runtimes; broker GitHub credentials; provision workspaces through Coder |
| Nexus | Coordinate one tenant's issue-to-PR flow, worker assignments, hooks, and A2A evidence |

The Manager holds the platform Coder operator credential and GitHub App private key. Nexus and workers register as workspace runtimes and receive only their own tenant-scoped bundle and short-lived credentials. Manager asks Coder to perform workspace lifecycle operations on their behalf.

Read [Manager Runtime](/docs/architecture/manager-runtime) and [Credentials and Trust](/docs/architecture/credentials) for the protocol and security boundaries.
