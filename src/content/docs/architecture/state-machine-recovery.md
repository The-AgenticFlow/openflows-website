---
title: State Machine & Recovery
section: Architecture
order: 10
description: "The heart of the Controller is a simple, intentionally boring loop that acts as the system's state machine. Understanding it is understanding how OpenFlows stays correct and self-healing over long, messy runs."
---

## The loop in one line

**Every few seconds: re-read the whole system, advance every piece of work one step, repair what's broken, repeat.**

## Why "read everything, every time"

The Controller deliberately keeps almost no state of its own. On each beat it re-reads the entire system from the coordination store - all tickets, all workers, all pull requests, all heartbeats - and figures out fresh what needs to happen.

This is not wasteful; it's the source of the system's correctness:

- **It converges.** Even if a step failed halfway through the last beat, this beat sees the true state and sets it right.
- **It self-heals.** A workspace that went silent, a chat that errored, a pull request nobody merged - the loop rediscovers each and fixes it.
- **It restarts cleanly.** Nothing important depends on the Controller's memory surviving, because the memory lives in the store.

## What one beat does

A single beat walks the whole team end to end and lets each role advance its affairs by one step:

1. **NEXUS** syncs GitHub issues and pull requests, reconciles the fleet, repairs broken pieces, and dispatches any ticket whose turn it is.
2. **FORGE** advances any in-flight build - handling a plan awaiting approval, a build in progress, or a pull request just opened.
3. **SENTINEL** reviews anything that's ready - an approved-plan check or a pull-request review - and records a verdict.
4. **VESSEL** watches pending pull requests through CI and merges the green ones.
5. **LORE** documents anything that just merged.

Most beats, most things are idle or mid-flight, and the beat is cheap. The loop only does work when there's work to do.

## "A bad beat must never kill the brain"

The most important safety rule in the loop:

> [!WARNING] Log it and move on
> If one beat errors, log it and move on. Never let a bad beat take down the Controller. A one-off failure - a slow API, a hiccup on the network, a workspace that failed to come up - is absorbed and forgotten by the next beat. A persistent fault is retried every beat until it clears.

## The bounded-retry-and-escalate rule

Recovery is powerful but not infinite. The loop repairs broken work **up to a bounded number of attempts**. If a ticket keeps failing past that limit, the loop stops retrying, parks the ticket, and **escalates it to a human** - with a notification and links. It chooses "ask for help" over "spin forever."

Roughly speaking, **recoverable** failures are infrastructure problems - a stopped workspace, a pull request not yet merged, a misbehaving response that can be retried. **Human-escalated** failures are judgment problems - an unclear requirement, work that contradicts the plan, or a security concern that needs a person's call.

## Steering the loop live

Because the loop re-reads state every beat, you can steer it **without restarting**:

- **Pause** - let in-flight work finish but don't pick up anything new.
- **Drain** - stop taking new tickets.
- **Target** - focus only on a specific repository, issue, or label.
- **Resume / normal** - back to business as usual.

These are stored as state, read every beat, and applied on the very next pass. Live steering with zero downtime.

## The takeaway

OpenFlows doesn't try to be perfect in any single moment. It is built to **keep trying** - to read reality, nudge it forward, absorb failures, and converge - which is exactly the behavior you want in an autonomous system running around the clock.
