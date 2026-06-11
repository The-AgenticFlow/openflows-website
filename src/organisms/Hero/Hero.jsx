import { useState, useEffect, useRef } from 'react'
import Badge from '@/atoms/Badge/Badge'
import styles from './Hero.module.css'

const TYPEWRITER_LINES = [
  'nexus: syncing 3 open issues from github...',
  'nexus: assigning T-001 → forge-1',
  'forge-1: worktree created → writing PLAN.md',
  'sentinel: reviewing CONTRACT.md → AGREED',
  'forge-1: implementing segment 2/4...',
  'sentinel: segment-2-eval.md → APPROVED',
  'forge-1: all segments done → opening PR #7',
  'vessel: CI success ✓ → squash-merging PR #7',
  'lore: writing ADR-003 → docs committed',
  'nexus: T-001 merged. picking next ticket.',
]

const QUICK_LINKS = [
  { label: 'Install in 60 seconds', href: '#get-started' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Meet the agents', href: '/agents' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Open Source', href: 'https://github.com/The-AgenticFlow/AgentFlow', external: true },
]

function useTypewriter(lines, speed = 38) {
  const [displayed, setDisplayed] = useState([])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (lineIndex >= lines.length) return

    if (charIndex <= lines[lineIndex].length) {
      timerRef.current = setTimeout(() => {
        if (charIndex === lines[lineIndex].length) {
          // line complete — pause then move to next
          setTimeout(() => {
            setDisplayed((prev) => [...prev, lines[lineIndex]])
            setLineIndex((i) => i + 1)
            setCharIndex(0)
          }, 320)
        } else {
          setCharIndex((c) => c + 1)
        }
      }, speed)
    }

    return () => clearTimeout(timerRef.current)
  }, [lineIndex, charIndex, lines, speed])

  const currentPartial = lineIndex < lines.length
    ? lines[lineIndex].slice(0, charIndex)
    : ''

  return { displayed, currentPartial }
}

export default function Hero() {
  const { displayed, currentPartial } = useTypewriter(TYPEWRITER_LINES)

  return (
    <section className={styles.hero} aria-label="Hero section">
      <div className={styles.content}>
        {/* Main heading */}
        <h1 className={`${styles.heading} fade-up delay-1`}>
          Your autonomous <br className={styles.br} />
          AI development team
        </h1>

        {/* Sub-heading */}
        <p className={`${styles.sub} fade-up delay-2`}>
          OpenFlows is a squad of specialized AI agents — written in Rust — that discovers
          your GitHub issues, writes code, reviews it, opens pull requests, and merges them.
          All without you writing a single line of code.
        </p>

        {/* Terminal animation */}
        <div className={`${styles.terminal} fade-up delay-3`} aria-live="polite" aria-label="Live orchestration log">
          <div className={styles.terminalHeader}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.terminalTitle}>openflows run</span>
          </div>
          <div className={styles.terminalBody}>
            {displayed.map((line, i) => (
              <div key={i} className={styles.line}>
                <span className={styles.prompt}>❯</span>
                <span>{line}</span>
              </div>
            ))}
            {currentPartial !== '' && (
              <div className={styles.line}>
                <span className={styles.prompt}>❯</span>
                <span>{currentPartial}</span>
                <span className={styles.cursor} aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        {/* Quick-link pills */}
        <div className={`${styles.pills} fade-up delay-4`}>
          {QUICK_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={styles.pill}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
