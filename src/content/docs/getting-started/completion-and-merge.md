---
title: Completion & Merge
section: Get Started
order: 6
description: "This page covers how work is reviewed, merged, and wrapped up, and how to review what came back. For the overview, see the [main walkthrough page](/docs/getting-started/first-issue)."
---

## 1. The review that is actually adversarial

SENTINEL does not skim for style. It is instructed to attack FORGE's work for:

- **Security holes** and risky patterns.
- **Quality issues** and inconsistencies.
- **Missing test coverage** against the agreed plan.

Crucially, SENTINEL works in its **own isolated workspace**. It never touches FORGE's files directly. When it needs proof - for example, to run the test suite - it asks FORGE's workspace to run a safe, allowlisted command and sends the evidence back. Review and building stay physically separate, which is what makes the review trustworthy.

> [!INFO] When in doubt, don't approve
> The review posture is deliberately strict: if the required evidence is missing or unreadable, the reviewer must not approve. It holds the ticket or escalates rather than guessing. The system would rather block than merge something unverified.

## 2. Merging

Once the plan is approved and the code reviewed, the DevOps agent (VESSEL) handles the final stretch:

- It **watches CI** and waits for the checks to pass.
- It **resolves merge conflicts** when they arise.
- It **merges** the approved pull request.

If a merge is blocked in a way VESSEL cannot resolve, it escalates to you rather than forcing the merge. A merge block is exactly the kind of decision a human should own.

## 3. Teardown

After the merge, the worker workspace is torn down. No lingering source trees, cached build artifacts, or stale state should survive. Workspaces can hold short-lived runtime credentials and GitHub installation tokens, so teardown and token expiry are part of the security lifecycle.

## 4. Review what came back

When the work finishes, you get a **merged pull request** plus a record of the decisions made along the way. To review what came back:

- **Read the pull request** - the branch, the diff, and the commit history form the deliverable.
- **Check the decisions** - the trail of approvals and reviews shows how the work reached merge.
- **Attend to any escalations** - if OpenFlows needed a human call during the run (security, ambiguity, a merge block), you were notified; resolving it let the team continue.

If anything looks wrong after merge, open a follow-up issue and the team will pick it up on its next cycle, just like any other work.

> [!TIP] Continue reading
> See [Ticket Lifecycle](/docs/getting-started/lifecycle-steps) for the phases that lead up to completion, or the [main walkthrough](/docs/getting-started/first-issue) to start from the beginning.
