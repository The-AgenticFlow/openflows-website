import { useState, useEffect, useRef } from 'react'
import Layout from '@/organisms/Layout/Layout'
import { Callout } from '@/molecules/DocComponents/DocComponents'
import styles from './Demos.module.css'

const LINES = [
  { type: 'cmd',     text: 'openflows' },
  { type: 'success', text: '✓ Starting REAL End-to-End Orchestration' },
  { type: 'output',  text: '  Loaded 6 worker slots: [nexus, forge-1, forge-2, sentinel, vessel, lore]' },
  { type: 'output',  text: '' },
  { type: 'output',  text: '[nexus] Polling GitHub for open issues...' },
  { type: 'output',  text: '[nexus] Found 3 open issues' },
  { type: 'output',  text: '[nexus] Assigning issue #1 → forge-1  (T-001)' },
  { type: 'output',  text: '' },
  { type: 'output',  text: '[forge-1] Worktree created: forge-1/T-001' },
  { type: 'output',  text: '[forge-1] Spawning Claude Code...' },
  { type: 'output',  text: '[forge-1] PLAN.md written - spawning SENTINEL for review' },
  { type: 'output',  text: '[sentinel] CONTRACT.md → AGREED' },
  { type: 'output',  text: '[forge-1] Implementing segment 1/3...' },
  { type: 'output',  text: '[sentinel] segment-1-eval.md → APPROVED' },
  { type: 'output',  text: '[forge-1] Implementing segment 2/3...' },
  { type: 'output',  text: '[sentinel] segment-2-eval.md → APPROVED' },
  { type: 'output',  text: '[forge-1] Implementing segment 3/3...' },
  { type: 'output',  text: '[sentinel] final-review.md → APPROVED' },
  { type: 'success', text: '[forge-1] PR #7 opened: "Fix pagination offset in API endpoint"' },
  { type: 'output',  text: '' },
  { type: 'output',  text: '[vessel] Polling CI for PR #7 (10s interval)...' },
  { type: 'success', text: '[vessel] CI: success ✓ - squash-merging PR #7' },
  { type: 'output',  text: '[lore] ADR-003 written and committed' },
  { type: 'output',  text: '' },
  { type: 'output',  text: '[nexus] T-001 merged. Picking next ticket...' },
  { type: 'output',  text: '[nexus] No more open issues. Halting gracefully.' },
]

function TerminalAnimation({ running }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!running) { setVisibleCount(0); return }
    setVisibleCount(0)
    let i = 0
    const tick = () => {
      i++
      setVisibleCount(i)
      if (i < LINES.length) timerRef.current = setTimeout(tick, i === 0 ? 400 : 180)
    }
    timerRef.current = setTimeout(tick, 300)
    return () => clearTimeout(timerRef.current)
  }, [running])

  return (
    <div className="terminalBody">
      {LINES.slice(0, visibleCount).map((line, i) => (
        <span key={i} className="tLine">
          {line.type === 'cmd' && <><span className="tPrompt">❯ </span>{line.text}</>}
          {line.type === 'success' && <span className="tSuccess">{line.text}</span>}
          {line.type === 'output' && <span className="tOutput">{line.text}</span>}
        </span>
      ))}
      {visibleCount < LINES.length && visibleCount > 0 && (
        <span className="tLine"><span className="tOutput">▌</span></span>
      )}
    </div>
  )
}

export default function Terminal() {
  const [running, setRunning] = useState(true)

  return (
    <Layout>
      <div className={styles.terminalPage}>
        <p className={styles.eyebrow}>Demos</p>
        <h1 className={styles.title}>Terminal Simulation</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Watch OpenFlows autonomously discover a GitHub issue, plan the implementation, write code, review it, and merge the pull request - all without human intervention.
        </p>

        <div className="terminalDemo">
          <div className="terminalBar">
            <span className="tDot red" />
            <span className="tDot yellow" />
            <span className="tDot green" />
            <span className="terminalTitle">openflows - my-org/my-project</span>
          </div>
          <TerminalAnimation running={running} />
        </div>

        <button className={styles.replayBtn} onClick={() => { setRunning(false); setTimeout(() => setRunning(true), 50) }}>
          ↻ Replay
        </button>

        <Callout type="tip" title="This is a simulation">
          This demo plays a pre-recorded session. In production, OpenFlows reads your real GitHub issues, clones your actual codebase, and writes production code. Try it yourself with the <a href="/docs/getting-started">Quick Start Guide</a>.
        </Callout>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>What you just saw</h2>
        <ol style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li><strong>NEXUS</strong> polls GitHub, discovers open issues, assigns T-001 to forge-1</li>
          <li><strong>FORGE</strong> creates an isolated worktree, writes PLAN.md, spawns Claude Code</li>
          <li><strong>SENTINEL</strong> reviews the plan (CONTRACT.md: AGREED) before any code is written</li>
          <li><strong>FORGE</strong> implements segment by segment; SENTINEL evaluates each one</li>
          <li><strong>SENTINEL</strong> final review approved - FORGE opens PR #7 via GitHub MCP</li>
          <li><strong>VESSEL</strong> polls CI at 10s intervals, squash-merges when green</li>
          <li><strong>LORE</strong> writes ADR-003 and commits it to the repo</li>
        </ol>
      </div>
    </Layout>
  )
}
