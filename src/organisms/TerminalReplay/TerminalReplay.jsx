import { useEffect, useRef, useState } from 'react'
import styles from './TerminalReplay.module.css'

// A recorded run, replayed line by line. `agent` colours the tag; `ok` marks a success line.
const LINES = [
  { cmd: 'openflows' },
  { ok: true, text: 'Starting end-to-end orchestration' },
  { text: 'Loaded 6 worker slots: [nexus, forge-1, forge-2, sentinel, vessel, lore]' },
  { gap: true },
  { agent: 'nexus', text: 'Polling GitHub for open issues…' },
  { agent: 'nexus', text: 'Found 3 open issues' },
  { agent: 'nexus', text: 'Assigning issue #1 → forge-1 (T-001)' },
  { gap: true },
  { agent: 'forge', text: 'Workspace ready on branch forge-1/T-001' },
  { agent: 'forge', text: 'PLAN.md written · requesting plan review' },
  { agent: 'sentinel', ok: true, text: 'Plan gate → APPROVED' },
  { agent: 'forge', text: 'Implementing segment 1/3…' },
  { agent: 'sentinel', ok: true, text: 'segment-1 → APPROVED' },
  { agent: 'forge', text: 'Implementing segment 2/3…' },
  { agent: 'sentinel', ok: true, text: 'segment-2 → APPROVED' },
  { agent: 'forge', text: 'Implementing segment 3/3…' },
  { agent: 'sentinel', ok: true, text: 'final review → APPROVED' },
  { agent: 'forge', ok: true, text: 'PR #7 opened: "Fix pagination offset in API endpoint"' },
  { gap: true },
  { agent: 'vessel', text: 'Polling CI for PR #7…' },
  { agent: 'vessel', ok: true, text: 'CI green · squash-merging PR #7' },
  { agent: 'lore', ok: true, text: 'ADR-003 written and committed' },
  { gap: true },
  { agent: 'nexus', text: 'T-001 merged. Picking next ticket…' },
  { agent: 'nexus', text: 'No more open issues. Halting gracefully.' },
]

export default function TerminalReplay() {
  const [count, setCount] = useState(0)
  const [run, setRun] = useState(0)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(LINES.length)
      return
    }
    setCount(0)
    let i = 0
    let timer
    const tick = () => {
      i += 1
      setCount(i)
      if (i < LINES.length) timer = setTimeout(tick, LINES[i]?.gap ? 120 : 260)
    }
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [run])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [count])

  const done = count >= LINES.length

  return (
    <div className={`${styles.window} of-dark`}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span>openflows · my-org/my-project</span>
        <button className={styles.replay} onClick={() => setRun((r) => r + 1)} disabled={!done}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5V5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Replay
        </button>
      </div>
      <div className={styles.body} ref={bodyRef} role="log" aria-label="OpenFlows run output">
        {LINES.slice(0, count).map((line, i) => {
          if (line.gap) return <div key={i} className={styles.gap} />
          if (line.cmd) return <div key={i} className={styles.line}><span className={styles.prompt}>❯</span> {line.cmd}</div>
          return (
            <div key={i} className={`${styles.line} ${line.ok ? styles.ok : ''}`} data-agent={line.agent}>
              {line.agent && <span className={styles.tag}>{line.agent}</span>}
              <span className={styles.text}>{line.ok && <b>✓ </b>}{line.text}</span>
            </div>
          )
        })}
        {!done && <span className={styles.cursor} />}
      </div>
    </div>
  )
}
