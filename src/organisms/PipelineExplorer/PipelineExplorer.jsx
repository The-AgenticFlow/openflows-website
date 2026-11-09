import { useEffect, useRef, useState } from 'react'
import styles from './PipelineExplorer.module.css'

const STEPS = [
  {
    agent: 'nexus',
    name: 'NEXUS',
    title: 'Triage & assign',
    body: 'You open a GitHub issue. NEXUS syncs it into a typed ticket and hands it to an idle FORGE worker running in its own fresh Coder workspace.',
    points: ['Polls issues every cycle', 'Prioritises CI setup first', 'Recovers orphaned work'],
    file: 'ticket T-142',
    code: [
      ['k', '{'],
      ['p', '  "id": ', 's', '"T-142"', 'p', ','],
      ['p', '  "issue": ', 'n', '318', 'p', ','],
      ['p', '  "title": ', 's', '"Rate-limit the /login endpoint"', 'p', ','],
      ['p', '  "phase": ', 's', '"planning"', 'p', ','],
      ['p', '  "worker": ', 's', '"forge-1"', 'p', ','],
      ['p', '  "branch": ', 's', '"forge-1/T-142"'],
      ['k', '}'],
    ],
  },
  {
    agent: 'sentinel',
    name: 'FORGE → SENTINEL',
    title: 'Plan, then wait for the gate',
    body: 'FORGE writes PLAN.md and halts. No code is written until SENTINEL approves the plan with a single-use approval that cannot be replayed.',
    points: ['Plan is reviewed before code', 'Approval is single-use', 'Rejections loop back with reasons'],
    file: 'PLAN.md',
    code: [
      ['h', '## Plan · T-142'],
      ['c', '1. Token-bucket middleware on POST /login'],
      ['c', '2. Redis counters keyed by IP + account'],
      ['c', '3. 429 + Retry-After, tests for both paths'],
      ['p', ''],
      ['k', 'gate: ', 's', 'plan_ready'],
      ['k', 'verdict: ', 'g', 'APPROVED', 'c', '  # sentinel · round 1'],
    ],
  },
  {
    agent: 'forge',
    name: 'FORGE',
    title: 'Build segment by segment',
    body: 'FORGE implements the approved plan with conventional commits and runs the test suite. The workspace holds zero LLM keys and zero raw credentials.',
    points: ['Isolated, ephemeral workspace', 'Secret scanning before push', 'Tests run by the harness'],
    file: 'git log --oneline',
    code: [
      ['n', 'a91f3c2 ', 'p', 'feat(auth): token-bucket limiter on /login'],
      ['n', '4be07d1 ', 'p', 'feat(auth): redis-backed counters per IP'],
      ['n', 'c3d2a90 ', 'p', 'test(auth): cover 429 and Retry-After'],
      ['p', ''],
      ['c', '$ npm test'],
      ['g', '✓ 48 passed', 'c', ' · 0 failed · 6.2s'],
    ],
  },
  {
    agent: 'sentinel',
    name: 'SENTINEL',
    title: 'Adversarial review',
    body: 'SENTINEL reviews the diff read-only, can run on a different model provider than FORGE, and verifies by running tests in FORGE’s workspace through the audited A2A relay.',
    points: ['Different model, different blind spots', 'No tests means block', 'Timeouts never count as a pass'],
    file: 'review #318',
    code: [
      ['k', 'verify ', 'p', 'forge-1 → ', 's', '"npm test -- auth"'],
      ['g', '  ✓ 12 passed', 'c', '  (a2a, allowlisted)'],
      ['p', ''],
      ['k', 'verdict: ', 'g', 'APPROVE'],
      ['c', 'src/auth/limit.ts:41  nit: name the magic 429'],
      ['c', 'src/auth/limit.ts:63  nit: add jitter to Retry-After'],
    ],
  },
  {
    agent: 'vessel',
    name: 'VESSEL',
    title: 'Merge only when it is safe',
    body: 'VESSEL squash-merges only when the PR is approved, conflict-free, and CI-green. Conflicts and failing checks go back to the same FORGE worker, with context intact.',
    points: ['Missing CI never counts as green', 'Never force-pushes', 'Escalates after 3 attempts'],
    file: 'vessel · PR #318',
    code: [
      ['c', 'checks  ', 'g', '4/4 passing'],
      ['c', 'review  ', 'g', 'approved'],
      ['c', 'mergeable  ', 'g', 'true'],
      ['p', ''],
      ['k', 'squash-merge ', 'p', '#318 → main'],
      ['g', '✓ merged', 'c', ' · issue closed · workspace recycled'],
    ],
  },
  {
    agent: 'lore',
    name: 'LORE',
    title: 'Keep the paper trail',
    body: 'After the merge, LORE records an Architecture Decision Record and updates the changelog, so anyone can reconstruct why the change was made.',
    points: ['Writes only to docs/', 'Never blocks development', 'Optional, enable in the registry'],
    file: 'docs/adr/021-login-rate-limit.md',
    code: [
      ['h', '# ADR-021 · Rate-limit /login'],
      ['k', 'Status: ', 'g', 'Accepted'],
      ['k', 'Context: ', 'p', 'credential stuffing on /login'],
      ['k', 'Decision: ', 'p', 'token bucket, Redis counters'],
      ['k', 'Refs: ', 's', 'T-142, PR #318'],
    ],
  },
]

const DURATION = 6500

export default function PipelineExplorer() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [cycle, setCycle] = useState(0)
  const rootRef = useRef(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false)
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      if (entry.isIntersecting) setCycle((c) => c + 1)
    }, { threshold: 0.35 })
    if (rootRef.current) observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!auto || !visibleRef.current) return
    const timer = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), DURATION)
    return () => clearTimeout(timer)
  }, [active, auto, cycle])

  const select = (i) => {
    setAuto(false)
    setActive(i)
  }

  const step = STEPS[active]

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.rail} role="tablist" aria-label="Pipeline stages">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={i === active}
            className={`${styles.tab} ${i === active ? styles.tabActive : ''} ${i < active ? styles.tabPast : ''}`}
            data-agent={s.agent}
            onClick={() => select(i)}
          >
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.tabText}>
              <span className={styles.tabAgent}>{s.name}</span>
              <span className={styles.tabTitle}>{s.title}</span>
            </span>
            {i === active && auto && (
              <span key={`${active}-${cycle}`} className={styles.timer} style={{ animationDuration: `${DURATION}ms` }} />
            )}
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel" data-agent={step.agent}>
        <div key={active} className={styles.panelInner}>
          <div className={styles.copy}>
            <span className={styles.agentChip}>
              <span className={styles.agentDot} />
              {step.name}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <ul>
              {step.points.map((pt) => (
                <li key={pt}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.code}>
            <div className={styles.codeBar}>
              <span className={styles.codeDots}><i /><i /><i /></span>
              {step.file}
            </div>
            <pre>
              {step.code.map((line, li) => (
                <div key={li} className={styles.codeLine} style={{ animationDelay: `${li * 70}ms` }}>
                  {line.length === 0 ? ' ' : chunk(line).map(([cls, txt], ci) => (
                    <span key={ci} className={styles['t_' + cls]}>{txt}</span>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

function chunk(line) {
  const out = []
  for (let i = 0; i < line.length; i += 2) out.push([line[i], line[i + 1] ?? ''])
  return out
}
