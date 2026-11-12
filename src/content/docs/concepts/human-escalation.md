---
title: Human Escalation
section: Core Concepts
order: 7
description: "OpenFlows is autonomous, but it is deliberately **not** unsupervised. There are decisions that should always be made by a person, and the system is engineered to hand those to you clearly and reliably. Escalation is a feature, not a failure: it is a controlled stop rather than a crash."
---

## When OpenFlows pulls a human in

A ticket escalates to a human when it genuinely needs a judgment call:

| Reason | What it looks like |
| --- | --- |
| A security decision | Something touches a security boundary and only a person should judge it. |
| An ambiguous or underspecified requirement | The work is unclear and the team must not guess. |
| An architectural choice | A design direction that needs a human call. |
| A merge block or conflict | A merge conflict or block the team cannot resolve on its own. |

It also escalates after **exhausted automatic recovery**: if the system has retried a failing ticket a bounded number of times and it is still stuck, it stops retrying and tells you rather than spinning forever.

## What happens on escalation

1. The ticket is **parked** - set aside so it doesn't deadlock the rest of the fleet.
2. The **worker is released** back to the pool.
3. You get a **notification** on your configured channels with the ticket, the reason, and direct links to the workspace and the pull request.

Notifications are carefully rate-limited so you never get flooded. If a channel is down, that never breaks the system itself - it just means you check the panel.

## How you resolve an escalation

| You can | How the team responds |
| --- | --- |
| Comment on or close the GitHub issue | The team reacts on its next cycle, reopening or closing the ticket as appropriate. |
| Answer directly in the workspace or chat | Give the agent guidance and it resumes with your direction. |
| Reset the work | Start clean by resetting the stuck work back to the start and letting the team take another pass. |

## Why the system can't just approve around you

OpenFlows' whole posture is *"when in doubt, don't approve."* The gates are structural, so there is no way for an agent to bypass a review or approve without evidence. An unresolved escalation is a dead end until a person or a legitimate reset intervenes.

> [!TIP] You are in the loop where your judgment adds value
> You are in the loop exactly where your judgment adds value - on the decisions - and out of the loop everywhere a well-guarded team can proceed on its own.
