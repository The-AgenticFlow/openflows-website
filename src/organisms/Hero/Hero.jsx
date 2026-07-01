import { useState, useEffect, useRef } from 'react'
import Button from '@/atoms/Button/Button'
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

function useTypewriter(lines, speed = 32) {
  const [displayed, setDisplayed] = useState([])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (lineIndex >= lines.length) return

    if (charIndex <= lines[lineIndex].length) {
      timerRef.current = setTimeout(() => {
        if (charIndex === lines[lineIndex].length) {
          setTimeout(() => {
            setDisplayed((prev) => [...prev, lines[lineIndex]])
            setLineIndex((i) => i + 1)
            setCharIndex(0)
          }, 280)
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
      <div className={styles.heroBackground} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.text}>
          <p className={`${styles.eyebrow} fade-up delay-1`}>
            OpenFlows
          </p>

          <h1 className={`${styles.heading} fade-up delay-2`}>
            The agent and flow orchestrator for software engineering.
          </h1>

          <p className={`${styles.sub} fade-up delay-3`}>
            Build, run, and govern AI agents that work with your developers
            at the architecture level. OpenFlows keeps your team in flow with
            automated planning, review, deployment, and documentation.
          </p>

          <div className={`${styles.ctaGroup} fade-up delay-4`}>
            <Button variant="primary" size="lg" href="/docs/getting-started">
              Install OpenFlows
            </Button>
            <Button variant="secondary" size="lg" href="/trial">
              Start a trial
            </Button>
          </div>
        </div>

        <div className={`${styles.visual} fade-up delay-5`}>
          <div className={styles.productFrame}>
            <div className={styles.productHeader}>
              <span className={styles.productDot} />
              <span className={styles.productDot} />
              <span className={styles.productDot} />
              <span className={styles.productTitle}>openflows run</span>
            </div>
            <div className={styles.productBody}>
              <div className={styles.terminal} aria-live="polite" aria-label="Live orchestration log">
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
              <div className={styles.screenshot}>
                <span>Product screenshot / Lottie / video placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
