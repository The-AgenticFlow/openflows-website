---
title: Contributor Guide
section: Contributing
order: 1
description: "OpenFlows is an open project, and contributions are welcome. Every contribution - whether it’s a bug report, a documentation improvement, or a new feature - flows through a workflow that mirrors the product’s own culture: a plan or proposal is discussed and agreed before implementation, the change is reviewed, and only reviewed work is merged."
---

## Ways to contribute

- **Report an issue.** Found a bug, a confusing behavior, or something that doesn’t match the documentation? Open an issue describing what you observed and what you expected.
- **Propose a feature.** Describe the problem you’re solving and the behavior you’d want to see, and note which existing role or flow it relates to.
- **Fix a bug or ship a feature.** Individual work items are usually scoped as focused changes, each reviewed before merging.
- **Improve documentation.** Accurate, user-facing docs matter - a doc improvement is a real contribution.

## The contribution workflow

1. **Check existing work.** Look through open issues and pull requests to avoid duplicating effort.
2. **Discuss a non-trivial change first.** For larger features, open an issue or start a discussion to align on the approach before writing code.
3. **Make a focused change.** Keep your change scoped to a clear unit of work. Smaller, reviewable changes move faster than large rewrites.
4. **Keep quality high.** Follow the project’s conventions and make sure any behavior changes are covered as appropriate.
5. **Open a pull request.** Explain what you changed and why, and reference the issue it addresses.
6. **Address review feedback.** Maintainers (and the project’s own review culture) may request adjustments before merging.

> [!INFO] The workflow fits the product
> OpenFlows practices what its own architecture preaches. A plan or proposal is discussed and agreed before implementation, the change is reviewed, and only reviewed work is merged. Your contribution flows through that same gate-based culture. The project follows an architecture-first, review-before-merge process, and releases are versioned in a controlled way; the documentation website you are reading is part of the project and is published automatically from its main branch, so the docs you see track the current state of the codebase.

## Governance at a glance

How decisions are made:

- **Small, focused changes** move quickly: open, review, merge.
- **Non-trivial features** are discussed and aligned on before implementation, so the approach is agreed before code is written - mirroring the planning gate.
- **Security-sensitive work** gets extra care, consistent with the product's "when in doubt, don't approve" posture.
- **Maintainers** review and merge contributions and steward the architecture; **contributors** propose and build improvements; **users** surface issues and ideas that drive direction.

For a working local environment, testing expectations, and the release model, see the pages in this section.

## What makes a good contribution

- **Clear scope** - one problem, one coherent change.
- **Aligns with the architecture** - respects the split between Coder (where work runs) and OpenFlows (how it coordinates), and the security-by-design rules.
- **Reviewed with the product’s own standards in mind** - quality, security, and test coverage matter.

Start small, align early, and iterate - that’s the most reliable path to a merge.

## In this section

- [Development Setup](/docs/contributing/development-setup) - get a local environment working.
- [Adding Skills](/docs/contributing/adding-skills) - contributing capability content without code.
- [Testing](/docs/contributing/testing) - how changes are verified before merging.
