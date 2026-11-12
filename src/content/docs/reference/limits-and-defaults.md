---
title: Limits & Defaults
section: Reference
order: 5
description: "The meaningful numbers to know when operating OpenFlows. Most of these are deliberate design choices rather than settings you’d tune - they’re presented here in plain language as behaviors and ranges, not as configuration constants."
---

## Health & liveness

| Number | Meaning |
| --- | --- |
| Beacon refresh | Workers refresh their liveness beacon on a short cadence. |
| Beacon lifetime | If a beacon stops refreshing, it expires on its own shortly after. |
| Staleness threshold | A worker silent past this point is declared stale and recoverable. |

Net effect: OpenFlows detects a dead or unresponsive worker within roughly a couple of minutes, without needing to poke every container.

## Recovery

| Number | Meaning |
| --- | --- |
| Recovery attempts | A bounded retry count per ticket. |
| After exhausting | The ticket escalates to a human instead of retrying forever. |

Recovery is bounded, then escalated - the system stops and asks rather than retrying forever.

## Notifications

| Limit | Meaning |
| --- | --- |
| Per-channel cooldown | At most one notification per channel per ticket within a window - prevents alert floods. |
| Failure safety | A failing channel is logged, never fatal to the orchestration. |

## Delegated verification

During delegated verification, the reviewer asks the builder to run a safe command and return evidence:

| Limit | Meaning |
| --- | --- |
| Command set | Only a fixed allowlist of safe commands can be run during delegated verification. |
| Timeout cap | A verification run has a hard maximum timeout. |
| Output bound | Captured output is bounded so large logs don’t overflow the exchange. |

## Orchestration pacing

| Number | Meaning |
| --- | --- |
| Pass interval | The cadence at which the Controller re-reads the whole system and advances work. |
| Pass bound | A single pass is bounded so it can’t loop forever; it stops and retries next beat. |
| Self-healing | A bad pass is logged and retried - it never kills the controller. |

## Durability

| Item | Meaning |
| --- | --- |
| Coordination store | Configured for durable storage so team state survives restarts. |
| Two-writer rule | Only the controller and the worker surface may write; writes are validated. |

## Design invariants (not configurable)

| Invariant | Why it exists |
| --- | --- |
| Planning before code | No code until the plan is approved. |
| Single-use approvals | A gate approval can’t be replayed. |
| Isolated review | Reviewer and builder never share a filesystem. |
| No keys in workers | Security by construction. |
| “When in doubt, don’t approve” | The reviewer blocks rather than guesses. |
| Bounded then escalate | Recovery stops and asks rather than spinning. |

## Related

- [Configuration Reference](/docs/reference/configuration-reference) - the knobs you can change.
- [Notifications Reference](/docs/reference/notifications-reference) - how notifications carry their limits.
- [Security by Design](/docs/architecture/security-by-design) - why the invariants exist.
