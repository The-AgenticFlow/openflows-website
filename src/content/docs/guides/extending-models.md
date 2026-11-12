---
title: "Extending: Models"
section: Guides
order: 6
description: "Models are the reasoning engine behind each agent. Extending OpenFlows with a new model is a **configuration-only** change: you enable the model in the platform's AI catalog, and the team can then route any role to it. No system code is involved."
---

## Where models live

Models are configured in the platform's AI settings (the Coder dashboard), where you enable the models you want available. OpenFlows then *references* those models for each role - so the catalog lives in the platform, and the per-role assignment lives in your team's registry.

## Enabling a new model

1. **Open the platform's AI settings** in the Coder dashboard.
2. **Enable the model** you want to add to the catalog.
3. **Save.** The model is now available for any role to reference.

This is a platform-level change. From here, assigning a role to the new model is a separate step that lives in the [agent registry](/docs/concepts/agent-registry) - see [Model Routing](/docs/guides/model-routing).

## What you should see

- The model appears in the platform's catalog and is assignable to roles.
- A role you point at the new model starts using it for the work of that role.
- The model is available to route across the team the moment you enable it.

> [!INFO] Enabling vs. routing
> **Extending: Models** is about making a model available - enabling it in the catalog. **Model Routing** is about deciding which available model each role uses. Enable first, then route: a model that isn't enabled can't be assigned.

## Related extensions

Skills, MCP servers, and models are the three configuration-only capability extensions. They compose: a role can carry several skills, reach several tools, and run on whatever enabled model suits its job.

## Where to go next

```cards
- [Model Routing](/docs/guides/model-routing): Choose which enabled model each role uses.
- [Extending: Skills](/docs/guides/extending-skills): Teach a role something new, configuration only.
- [Extending: MCP](/docs/guides/extending-mcp): Connect external tools and data.
```
