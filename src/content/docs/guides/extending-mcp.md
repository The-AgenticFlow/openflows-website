---
title: Connecting an MCP Server
nav_label: "Extending: MCP"
section: Guides
order: 5
description: "MCP (Model Context Protocol) servers give your agents access to external tools and data - a private API, an internal knowledge base, a specialized tool. OpenFlows makes this a configuration change in most cases."
---

## The two ways to connect a server

OpenFlows supports both, and they **coexist**:

1. **Per-role, via the registry.** Register the server on a specific role. Only that role's agents (for example, the builder) can call its tools.
2. **Centrally, via the Coder dashboard.** Register the server once in the platform's MCP settings, with allow and deny lists and availability policies. This applies to all agent sessions, not just OpenFlows.

Both are merged, so a role ends up with its own servers plus the platform-wide ones.

## Which one to use?

- Use **per-role** when only certain agents should have the tool - a coding tool for the builder, a review tool for the reviewer.
- Use **central** when the tool should be available team-wide, or to all of Coder.

## Connecting per-role (via the registry)

1. **Define the server.** Identify the server and how it's launched.
2. **Add it to the role.** In the agent registry for the role, add the MCP server entry under that role's MCP configuration.
3. **Apply.** Save through the control panel. The change is validated and takes effect without a restart.

The role's workspace then materializes a configuration the agent reads to reach the server.

## Connecting centrally (via the Coder dashboard)

1. **Register the server** in the platform's AI settings under MCP servers.
2. **Configure policies** - which tools are allowed, which denied, and when the server is available.
3. **Save.** The server applies to agent sessions.

This path applies beyond OpenFlows - to all chat sessions in the environment.

## What you should see

- For per-role servers: the role can call the server's tools, and it's visible in the role's configured capabilities.
- For central servers: tools are available to sessions, subject to your allow and deny policy.
- The merged result is what the agent actually sees - its role's servers plus the platform-wide ones.

## Practical guidance

- Prefer the **central** path to keep one consistent catalog for the whole platform.
- Use **per-role** for tools meant for a specific agent only.
- Set **allow and deny lists** on any server that exposes powerful or sensitive operations.
- If the tool factors into review (for example, a linter the reviewer depends on), make sure the *reviewer* role can reach it, not just the builder.

> [!INFO] Related extensions
> Skills, MCP servers, and models are the three configuration-only capability extensions. See [Adding a Skill](/docs/guides/extending-skills) for instruction-based capabilities, and [Enabling a Model](/docs/guides/extending-models) for model selection.
