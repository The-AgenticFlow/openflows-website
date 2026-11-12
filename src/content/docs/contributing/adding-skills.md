---
title: Contributing Skills Content
nav_label: Adding Skills
section: Contributing
order: 3
description: "Skills are the configuration-only way to teach a role something new - a workflow, a project convention, a linting process. Because a skill is packaged instructions rather than system code, contributing good skill content is one of the lightest and most accessible ways to help the project."
---

## How skills work

A skill is a set of instructions a role can load on demand. It typically captures a repeatable capability - how this project runs its checks, the conventions we follow for this kind of work, the steps for that process - and it is scoped per role, so the builder and the reviewer can carry different skills. Each skill is configured into a role through the team configuration, without any system code change.

For the full walkthrough of what a skill is and how a role picks one up, see the [Adding a Skill](/docs/guides/extending-skills) guide.

## Contributing skills content

From a contributor’s perspective, a skill contribution is a documentation-and-content change:

- **Describe the capability clearly.** State what outcome the skill produces, when a role should use it, and what inputs and outputs it needs.
- **Write precise instructions.** A good skill is specific enough to be followed deterministically and includes a worked example.
- **Document failure modes.** What can go wrong, how to detect it, and what the role should do next.
- **Keep it scoped.** One skill does one thing. If a contribution needs to change how the system itself behaves, it’s a core feature, not a skill.

> [!INFO] No code change required
> Adding skill content should never require touching system code. If your proposal needs that, it isn’t a skill - it belongs in a core-feature discussion instead. Align on the approach before investing in the content.

## How a skill contribution enters the project

A skills-content contribution follows the same review-before-merge path as any other change: check existing work to avoid duplication, make a focused change, keep quality high, and open a pull request that explains what you added and why. Maintainers review it with the project’s standards in mind before merging.

## Related

- [Adding a Skill](/docs/guides/extending-skills) - how skills work and how a role uses one.
- [Contributor Guide](/docs/contributing) - the contribution workflow.
