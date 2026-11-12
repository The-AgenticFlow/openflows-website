---
title: Further Reading
section: Resources
order: 2
description: "A curated path through OpenFlows material, from gentle introduction to deep architecture."
---

## Start here

- [Documentation Home](/docs) - the whole set of concepts, architecture, guides, and references.
- [Architecture-First Development](/docs/concepts/architecture-first) - the organizing idea behind everything.
- [Coder Integration](/docs/concepts/coder-openflows-split) - the Coder / OpenFlows split that defines the system.

## Learn the concepts

- [The Agent Team](/docs/concepts/agent-team) - the five roles.
- [The Ticket Lifecycle](/docs/getting-started/lifecycle-steps) - how work progresses.
- [The Planning Gate](/docs/concepts/architecture-first) - why plan-before-code is structural.
- [Human Escalation](/docs/concepts/human-escalation) - how a person gets pulled in.

## Go deep on architecture

- [Big Picture](/docs/architecture) - the control plane and the work plane.
- [The Controller / NEXUS](/docs/architecture/controller) - the brain and its orchestration loop.
- [The Workspace Fleet](/docs/architecture/workspace-fleet) - where work runs and why it’s safe.
- [How the Pieces Talk](/docs/architecture/big-picture) - the communication channels between roles.
- [Security by Design](/docs/architecture/security-by-design) - why the architecture is safe by construction.

## Go deeper still (technical, beyond this site)

The internals behind these pages are documented in the project’s technical architecture documentation. Look in the project repository’s architecture folder for authoritative deep-dives on the full system from issue to merged pull request, the controller internals and orchestration, the worker workspace and its coordination surface, the shared coordination store, and the live task relay for delegated verification.

These are engineering references for those working on or extending the system. This site is the user-facing companion to that material.

> [!INFO] A code-free note
> Because this documentation is strictly user-facing, it doesn’t reproduce the technical documents’ internal structure or identifiers. Follow the repository’s architecture folder to read them.

## Places to look things up

- [Reference](/docs/reference) - glossary, roles, lifecycle states, configuration, limits, and the command surface.
- [Guides](/docs/guides) - practical walkthroughs for operating and extending a team.
