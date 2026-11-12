---
title: Notifications Reference
section: Reference
order: 7
description: "A quick reference for OpenFlows notifications: the channels, what they carry, and how they behave."
---

## Channels

| Channel | Connection | Typical use |
| --- | --- | --- |
| Slack | Webhook URL | Team chat / operations channel |
| Discord | Webhook URL | Team chat / operations channel |
| WhatsApp | Credentials and phone numbers | On-call / urgent reach |

Any combination can be enabled; each channel is configured independently. See the [Wiring Notifications](/docs/guides/operations) guide to set them up.

## What notifications carry

An escalation notification includes:

- The **ticket** involved.
- The **reason** it needs a human - security, ambiguity, architecture, merge block, or exhausted retries.
- The **role** that flagged it.
- **Direct links** to the workspace and the GitHub pull request, so you can act immediately.

## Behavior guarantees

| Property | What it means |
| --- | --- |
| Actionable | Includes enough context and links to jump in and decide. |
| Rate-limited | At most one notification per channel per ticket within a window - no floods. |
| Safe | Fire-and-forget: a failing channel is logged and never breaks the orchestration loop. |
| Not the only surface | Escalations always also appear in the control panel, so nothing is lost. |

## What they are for

Notifications exist to surface **human escalations** promptly. They are not a general event stream - the team’s routine progress is visible in the control panel, and you’re only pinged when the team needs your judgment.

## Related

- [Wiring Notifications](/docs/guides/operations) - how to set them up.
- [Handling Human Escalations](/docs/concepts/human-escalation) - what to do when one arrives.
- [Limits & Defaults](/docs/reference/limits-and-defaults) - the notification limits behind these guarantees.
