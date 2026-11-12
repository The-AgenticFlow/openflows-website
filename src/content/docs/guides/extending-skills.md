---
title: Adding a Skill
nav_label: "Extending: Skills"
section: Guides
order: 4
description: "Skills are how you teach a role something new - a specific workflow, a project convention, a linting process - **without writing any system code**. This is one of the most common extensions, and it's configuration-only."
---

## What a skill is

A skill is a packaged set of instructions a role can load on demand. It typically captures a repeatable capability: "how this project runs its checks," "the conventions we follow for this kind of work," "the steps for that process."

Skills are scoped **per role**, so you can give the builder a coding skill and the reviewer a review skill without the two looking alike.

## Before you start

- You've completed the Quickstart, so a team exists.
- You know which **role** should get the skill (for example, the builder).
- You have the skill content ready - its instructions and any files it needs.

## Steps

1. **Create the skill.** Put the skill definition - its name and instructions - in the skills area of the orchestration content. A skill is essentially a folder with an instruction file inside.
2. **Assign it to a role in the registry.** Open the agent registry for the role and add the skill to that role's skill list.
3. **Apply it.** Save the registry change through the control panel. It's validated and takes effect on the team's next cycle - no restart and no redeploy.

## What you should see

- The role's workspace now carries the skill, and the agent can load it when relevant.
- The skill appears in the role's configured capabilities in the panel.
- The change applied without any restart; the running team picked it up.

## Notes

- Skills are **discovered by the agent** during its session - you don't have to wait for a new workspace to reap the benefit beyond the natural provisioning cycle.
- There's a built-in shared protocol skill that teaches agents how to use the coordination surface; your skills layer on top of that.
- If you need to remove a skill, edit it off the role the same way and save.

## Going further

- Multiple skills compose - a role can carry several.
- For server-side tools rather than instructions, see [Connecting an MCP Server](/docs/guides/extending-mcp).
- For a completely new capability that no existing role embodies, see [Extending with a New Role](/docs/concepts/agent-registry) - the one extension that touches internals.

> [!INFO] Model and tool side-by-side
> Skills, MCP servers, and models are the three per-role capability extensions, and all are configuration-only. They compose: a role can carry several skills, reach several servers, and run on whatever model suits its job. See [Agent Setup](/docs/guides/agent-setup) for how they fit together in the registry.
