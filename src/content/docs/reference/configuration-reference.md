---
title: Configuration reference
nav_label: Configuration Reference
section: Reference
order: 4
description: "Manager configuration is operator-owned. It includes the public origin, databases, Redis, GitHub Apps, Coder, secret references, and template releases. Changes to these settings generally require validation and a service restart; they are not all editable from the user web interface."
---

| Setting | Purpose |
| --- | --- |
| OPENFLOWS\_MODE | Local or hosted Manager mode |
| OPENFLOWS\_PUBLIC\_URL | Public HTTPS origin used for callbacks and links |
| OPENFLOWS\_DATABASE\_URL | Manager PostgreSQL connection |
| OPENFLOWS\_REDIS\_ADMIN\_URL | Redis administration and tenant ACL provisioning |
| OPENFLOWS\_RUNTIME\_REDIS\_URL | Redis address reachable from workspaces |
| OPENFLOWS\_GITHUB\_APP\_ID | GitHub App identity for repository operations |
| OPENFLOWS\_CODER\_OPERATOR\_TOKEN\_REF | Secret reference for Manager workspace provisioning |
| OPENFLOWS\_RELEASE\_SOURCE | Configured immutable template release source |

## Secrets

Secret reference settings point to values in the configured provider. Do not place the GitHub App private key, Coder operator token, or master encryption key into a Coder template or workspace parameter. Manager resolves them within its trusted boundary.

## Validate before serving

Use `openflows-manager setup` to bootstrap supported integrations and `openflows-manager doctor` to check configuration, external services, and secrets. Use `openflows-manager serve` only after the required checks pass.

> [!INFO] Complete versioned reference
> Configuration evolves with releases. The [Manager configuration source](https://github.com/The-AgenticFlow/OpenFlows/blob/main/crates/openflows-manager/src/config.rs) and [operator guide](https://github.com/The-AgenticFlow/OpenFlows/tree/main/docs/implementation/centralized-deployment) are the version-specific references.
