---
title: Model Routing
section: Guides
order: 2
description: "Different tasks suit different models. Model routing is the practice of choosing which model each role uses, and assigning it so the right reasoning is applied to the right job. Because assignment lives in the [agent registry](/docs/concepts/agent-registry), you can route a role to a different model live, without a restart or redeploy."
---

## Where the catalog lives, and where the routing lives

Models are configured in the platform's AI settings (the Coder dashboard), where you enable the models you want available. OpenFlows then *references* those models for each role - so the catalog lives in the platform, and the routing/assignment lives in your team's registry. To add a new model to the catalog, see [Extending: Models](/docs/guides/extending-models).

## Assigning a model to a role

1. **Make sure the model is enabled** in the platform's AI settings.
2. **Open the agent registry** for the role you want to change (for example, the builder).
3. **Set the model** on that role.
4. **Save.** The change is validated and takes effect on the team's next cycle. No restart, no redeploy.

## Which model for which job?

A sensible starting point for routing models across the team:

| Role | A sensible model |
| --- | --- |
| Builder (FORGE) | A strong general coding model; does the bulk of implementation. |
| Reviewer (SENTINEL) | A model you trust for rigorous, adversarial reasoning about security and quality - often worth a higher-cost, more careful model. |
| Orchestrator / devops / writer | A reliable model; these roles are lighter on raw reasoning. |

You're free to tune from there based on what you observe.

## What you should see

- The role now uses the assigned model for its work.
- The change applied without a restart; the next workspace provisioned for that role reflects the new model.
- The role's model shows in the control panel.

> [!INFO] Availability notes
> A model that isn't enabled in the platform can't be assigned - enable it first. Changing a model affects *new* sessions for that role; the exact timing depends on when the role's next workspace or session is provisioned. This is a per-role control; you can have different roles on different models simultaneously.

## Where to go next

```cards
- [Extending: Models](/docs/guides/extending-models): Add a new model to the platform catalog.
- [Agent Setup](/docs/guides/agent-setup): How model assignment fits with the rest of the registry.
- [Security by Design](/docs/architecture/security-by-design): Why every model call happens through your gateway.
```
