---
title: Testing
section: Contributing
order: 4
description: "Testing is a non-negotiable part of contributing to OpenFlows. The project's standard is simple: **changes are verified before they are considered done**, and a change is only merged once it passes review and its tests are green. This page explains the testing culture and what is expected of every contribution."
---

## The standard

Before a change is marked complete, it must pass the project's test/build checks. A failing check means the work is not finished - you fix it, or you flag it as blocked rather than working around the failure. This mirrors the product's own posture: verification comes first, and a result that isn't verifiable is not treated as done.

## What runs

The project provides a single, repeatable way to run its checks. In practice that means running the project's test suite or, for the website, a production build from scratch if a build step is part of the check. The exact command is documented in the repository's tooling (and the README), and contributors are expected to run it and see it pass before opening or updating a pull request.

## What is expected of you

- **Run the checks before you submit.** Don't rely on review to catch what a quick local run would find.
- **Keep behavior changes covered.** If your change alters how something behaves, it should be covered by an appropriate test.
- **Don't cheat the gate.** Never mark work complete against failing or broken tests, and don't silently work around a failure.
- **Keep changes scoped.** Smaller, focused changes are easier to verify and review than large rewrites.

> [!INFO] If testing blocks you, say so
> No hallucinated context and no guessing: if a change cannot be verified, that is a legitimate blocker. Report it as blocked with a specific, answerable question rather than shipping something unverified - the project would rather hold work than merge it unverified.

## How this connects to the product

OpenFlows practices what it preaches. The product's reviewer checks every change for test coverage and refuses to approve without verifiable evidence; the project's contribution process works the same way. A contribution flows through the same gate-based culture it asks its agents to follow.

## Where to go next

```cards
- [Development Setup](/docs/contributing/development-setup): Get a local environment working first.
- [Contributor Guide](/docs/contributing): The contribution workflow that tests sit within.
- [Security by Design](/docs/architecture/security-by-design): Why rigorous verification is built into the architecture.
```
