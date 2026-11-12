---
title: Troubleshooting the Common Path
nav_label: Troubleshooting
section: Guides
order: 8
description: "Most of the time, OpenFlows recovers on its own. This guide is for the situations where you need to look closer or nudge it. It's organized by symptom."
---

## Symptom: a ticket seems stuck

**What it might be.**

- A **human escalation** that's waiting on you. Stuck tickets are often just parked decisions.
- Work that hit a **transient failure** which the loop will retry.
- A genuinely wedged piece of work that exhausted its retries.

**What to do.**

1. Check **escalations** first - if there's a pending decision, that's the ticket's state and it needs you (see [Handling Human Escalations](/docs/concepts/human-escalation)).
2. Give it a cycle. The loop re-reads and re-advances every cycle, so many stuck states clear shortly.
3. If it's still stuck after automatic recovery gave up, **reset** the team's stuck work back to the start and let it take a fresh pass.

## Symptom: new work isn't starting

**What it might be.**

- The fleet is **paused or drained** (you or a teammate set it earlier).
- The team is **targeted** at a different repository, issue, or label.

**What to do.** Check the fleet steering state in the panel. If paused, drained, or targeted, switch back to normal to resume pickup.

## Symptom: an environment or integration looks off

**What it might be.** A configuration drift in the Coder or control-plane integration.

**What to do.** Run a **diagnostics** check against the integration and address whatever it reports - identity access, model gateway reachability, GitHub authentication. This is the tooling equivalent of "check under the hood."

## Symptom: workspaces accumulating

**What it might be.** Workspaces that should have been torn down.

**What to do.** Confirm the merge flow completed for those tickets. Workspaces are torn down on merge by design; if a merge didn't finish cleanly, that's the root cause to resolve first.

## Symptom: a previously stuck team

**What it might be.** Work that got wedged and needs a clean state to proceed.

**What to do.** Clean the team's stale or failed tickets back to the start and clear the recovery counters, allowing the loop to begin again.

## The recovery principles to rely on

- **The system self-heals by default.** A single bad step is logged and retried; it never kills the brain.
- **Recovery is bounded, then escalated.** The loop retries a bounded number of times, then asks a human rather than spinning.
- **State is in the store, not a process.** Restarts pick up cleanly; durability means nothing is lost.
- **"When in doubt, don't approve."** A missing artifact or result means the reviewer will not approve - which is a guardrail, not a bug.

## When to escalate to a human (that's you)

If you've checked escalations, given it a cycle, verified steering, and the work is still wedged, use a **reset** - and if the cause is an unclear requirement or a security question, treat it as the decision it is.
