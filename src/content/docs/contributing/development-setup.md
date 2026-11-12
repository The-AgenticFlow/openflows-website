---
title: Development Setup
section: Contributing
order: 2
description: "This page describes what you need to set up a local development environment for the OpenFlows project. It is written for contributors who want to build, run, or extend the work, in plain language and without commands."
---

## What the project needs

OpenFlows is an open project, and its documentation website is part of the same repository. To develop locally you need a working Node.js toolchain, then you install the project's dependencies. The project's build tooling (Astro, for the website) is declared in the repository, so a fresh clone plus an install yields a working local environment.

## The core workflow

Once dependencies are installed, the standard loop is straightforward:

- **Run it locally with live reload** while you work - edits show up immediately.
- **Build a production output** to verify the site compiles cleanly from scratch.
- **Preview the built output** before pushing, so what you ship is what you verified.

For detailed, copy-paste commands, refer to the project's **README** in the repository root. It documents the exact steps to install dependencies, start the local server, and build for production.

## Where to find things in the repository

- **Website source** - the user-facing site you are reading (layouts, pages, and components) lives under the `src` tree.
- **Documentation content** - the source Markdown behind these pages lives in the `website-docs` directory.
- **Project configuration** - the site configuration and its dependencies are declared at the repository root.

## Governance at a glance

OpenFlows' own organizing idea - **plan before you build, review before you merge** - extends to how the project itself operates:

- **Small, focused changes** move quickly: open, review, merge.
- **Non-trivial features** are discussed and aligned on before implementation, so the approach is agreed before code is written - mirroring the planning gate.
- **Security-sensitive work** gets extra care, consistent with the product's "when in doubt, don't approve" posture.

OpenFlows is versioned and released in a controlled way: releases bundle a single, coherent version of the system, and are handled through the project's release tooling and workflows. The documentation website ships with the project and is published automatically from its main branch, so the docs you see are tied to the current state of the codebase.

## Roles in the project

- **Maintainers** review and merge contributions and steward the architecture.
- **Contributors** (that's you) propose and build improvements.
- **Users** surface issues and feature ideas that drive direction.

> [!TIP] Align early
> For anything non-trivial, align early - a short discussion before writing code saves a rejected pull request. The project's review culture is rigorous by design; that is what keeps the project (and the product) trustworthy.

## Where to go next

```cards
- [Contributor Guide](/docs/contributing): The full path from idea to merged change.
- [Testing](/docs/contributing/testing): How changes are verified before merging.
- [Adding Skills](/docs/contributing/adding-skills): Contribute capability content, configuration only.
```
