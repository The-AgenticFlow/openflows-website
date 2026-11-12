---
title: Identity and token guide
nav_label: Token Guide
section: Get Started
order: 4
description: "Signing into OpenFlows, running a workspace, accessing GitHub, and coordinating a Forge–Sentinel pair use different credentials. The Manager validates each credential for one purpose."
---

## User sign-in and GitHub installation

A person signs in with GitHub to access the OpenFlows web interface. An organization admin connects a GitHub App installation and selects a repository that the installation can access. This browser session establishes the user's product permissions; it is not injected into a worker.

## Workspace registration

Manager creates a one-time bootstrap value for each Coder workspace and mounts it in a read-only runtime bundle. Workspace startup calls `POST /api/v1/runtime/register`. Manager consumes the bootstrap and returns short-lived access and rotating refresh credentials. The workspace uses these to heartbeat, request a worker (Nexus only), or call the GitHub broker.

## GitHub repository access

When Nexus or a worker needs GitHub access, it calls `POST /api/v1/runtime/github-credentials` with purpose `api` or `git`. Manager determines the installation, repository, and permissions from the authenticated workspace and returns a short-lived GitHub App installation token. GitHub records hosted operations under the App bot identity.

## Redis and A2A

The runtime bundle also carries a tenant-specific Redis credential and namespace. A2A verification uses a separate pair token for a particular ticket; it cannot be used as a Manager or Redis credential.

> [!WARNING] Workspace credential exposure
> A running worker can read its own runtime bundle and temporary tokens. It cannot read the GitHub App private key, platform Coder credential, or another tenant's Redis password. Protect and revoke workspaces accordingly.

```cards
- [Credentials and Trust](/docs/architecture/credentials): The complete credential boundary and lifecycle.
- [Security Model](/docs/architecture/security-by-design): Isolation, audit, and remaining operational risks.
```
