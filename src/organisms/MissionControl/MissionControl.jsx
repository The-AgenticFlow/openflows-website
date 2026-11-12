import { useEffect, useRef, useState } from 'react'
import styles from './MissionControl.module.css'

const PHASES = [
  { id: 'planning', label: 'Planning' },
  { id: 'building', label: 'Building' },
  { id: 'testing', label: 'Testing' },
  { id: 'review', label: 'Review' },
  { id: 'merged', label: 'Merged' },
]

// A replay of one ticket's lifecycle. `phase` moves the stepper; `at` is the clock shown in the log.
const EVENTS = [
  { agent: 'nexus', at: '00:00', text: 'Synced 3 open issues from acme/web → T-142, T-143, T-144' },
  { agent: 'nexus', at: '00:04', text: 'Assigned T-142 → forge-1 · workspace forge-1-t142 is up', phase: 'planning' },
  { agent: 'forge', at: '01:12', text: 'Wrote PLAN.md (3 segments) · status plan_ready, halting' },
  { agent: 'sentinel', at: '02:03', text: 'Plan gate APPROVED · single-use approval consumed', tone: 'ok', phase: 'building' },
  { agent: 'forge', at: '04:40', text: 'Segment 1/3 · feat(auth): token-bucket limiter on /login' },
  { agent: 'forge', at: '07:18', text: 'Segment 2/3 · feat(auth): Redis-backed counters per IP' },
  { agent: 'forge', at: '08:55', text: 'Test suite · 48 passed, 0 failed', tone: 'ok', phase: 'testing' },
  { agent: 'forge', at: '09:31', text: 'Opened PR #318 · review_ready', phase: 'review' },
  { agent: 'sentinel', at: '10:02', text: 'A2A verify in forge-1 → npm test -- auth · 12 passed', tone: 'ok' },
  { agent: 'sentinel', at: '11:47', text: 'Review APPROVE · 0 blocking findings, 2 nits inline' },
  { agent: 'vessel', at: '13:20', text: 'CI green (4/4 checks) · squash-merging #318' },
  { agent: 'vessel', at: '14:08', text: 'Merged into main · workspace torn down', tone: 'ok', phase: 'merged' },
  { agent: 'lore', at: '14:30', text: 'ADR-021 recorded · CHANGELOG.md updated' },
  { agent: 'nexus', at: '14:52', text: 'T-142 done in 14m 52s · picking up T-143' },
]

const TICKETS = [
  { id: 'T-141', title: 'Fix pagination offset in /api/items', state: 'merged' },
  { id: 'T-142', title: 'Rate-limit the /login endpoint', state: 'live' },
  { id: 'T-143', title: 'OpenAPI schema for /teams', state: 'queued' },
  { id: 'T-144', title: 'Move sessions to Redis', state: 'queued' },
]

const AGENT_LABEL = {
  nexus: 'NEXUS',
  forge: 'FORGE',
  sentinel: 'SENTINEL',
  vessel: 'VESSEL',
  lore: 'LORE',
}

function phaseAt(count) {
  let phase = null
  for (let i = 0; i < count; i++) if (EVENTS[i].phase) phase = EVENTS[i].phase
  return phase
}

export default function MissionControl() {
  const [count, setCount] = useState(0)
  const rootRef = useRef(null)
  const logRef = useRef(null)
  const visibleRef = useRef(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCount(EVENTS.length)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
    })
    if (rootRef.current) observer.observe(rootRef.current)

    let current = 0
    let timer
    const tick = () => {
      if (visibleRef.current && !document.hidden) {
        current = current >= EVENTS.length ? 0 : current + 1
        setCount(current)
      }
      const delay = current >= EVENTS.length ? 4200 : current === 0 ? 700 : 1250
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 900)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' })
  }, [count])

  const phase = phaseAt(count)
  const phaseIndex = PHASES.findIndex((p) => p.id === phase)
  const done = phase === 'merged'
  const lastAgent = count > 0 ? EVENTS[count - 1].agent : 'nexus'

  return (
    <div className={`${styles.root} of-dark`} ref={rootRef}>
      <div className={styles.bar}>
        <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
        <span className={styles.barTitle}>openflows · tenant <b>acme/web</b></span>
        <span className={styles.barStatus}>
          <span className={`${styles.liveDot} ${done ? styles.liveDotDone : ''}`} />
          {done ? 'merged' : 'running'}
        </span>
      </div>

      <div className={styles.body}>
        <aside className={styles.tickets} aria-label="Ticket queue">
          <p className={styles.colLabel}>Queue</p>
          {TICKETS.map((t) => {
            let state = t.state
            if (t.state === 'live') state = done ? 'merged' : count > 1 ? 'active' : 'queued'
            return (
              <div key={t.id} className={`${styles.ticket} ${state === 'active' ? styles.ticketActive : ''}`}>
                <div className={styles.ticketTop}>
                  <span className={styles.ticketId}>{t.id}</span>
                  <span className={`${styles.badge} ${styles['badge_' + state]}`}>
                    {state === 'active' ? PHASES[Math.max(phaseIndex, 0)].label : state}
                  </span>
                </div>
                <p className={styles.ticketTitle}>{t.title}</p>
                {state === 'active' && (
                  <div className={styles.progress}>
                    <span style={{ width: `${((phaseIndex + 1) / PHASES.length) * 100}%` }} />
                  </div>
                )}
              </div>
            )
          })}

          <div className={styles.fleet}>
            <p className={styles.colLabel}>Fleet</p>
            {Object.keys(AGENT_LABEL).map((agent) => (
              <div key={agent} className={styles.fleetRow} data-agent={agent}>
                <span className={`${styles.fleetDot} ${lastAgent === agent && !done ? styles.fleetDotBusy : ''}`} />
                <span>{AGENT_LABEL[agent].toLowerCase()}</span>
                <span className={styles.fleetState}>{lastAgent === agent && !done ? 'working' : 'idle'}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className={styles.main}>
          <ol className={styles.stepper} aria-label="Ticket lifecycle">
            {PHASES.map((p, i) => (
              <li
                key={p.id}
                className={`${styles.step} ${i < phaseIndex || done ? styles.stepDone : ''} ${i === phaseIndex && !done ? styles.stepActive : ''}`}
              >
                <span className={styles.stepDot} />
                <span className={styles.stepLabel}>{p.label}</span>
              </li>
            ))}
          </ol>

          <div className={styles.log} ref={logRef} aria-live="off">
            {EVENTS.slice(0, count).map((e, i) => (
              <div key={i} className={styles.line} data-agent={e.agent}>
                <span className={styles.time}>{e.at}</span>
                <span className={styles.agent}>{AGENT_LABEL[e.agent]}</span>
                <span className={`${styles.text} ${e.tone === 'ok' ? styles.textOk : ''}`}>{e.text}</span>
              </div>
            ))}
            {!done && (
              <div className={styles.cursorLine}>
                <span className={styles.time}>··:··</span>
                <span className={styles.cursor} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
