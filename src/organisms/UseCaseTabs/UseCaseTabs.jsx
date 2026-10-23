import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './UseCaseTabs.module.css'

const USE_CASES = [
  {
    id: 'govern',
    label: 'Govern AI agents',
    title: 'Run AI agents with boundaries you control',
    summary:
      'Coder governs where agents run. OpenFlows governs how they coordinate. Define which agents can access production repos, run dangerous commands, or merge to main. Every action logged and auditable.',
    href: '/docs',
    items: [
      'Role-based permissions per agent and repository',
      'Complete audit trail from issue to merged PR',
      'Human escalation only for security flags or ambiguity',
      'Agent identity inherited from Coder external auth',
    ],
    stats: { label: 'Average time to audit', value: '< 2 min' },
  },
  {
    id: 'onboard',
    label: 'Accelerate onboarding',
    title: 'Junior devs ship code on day one',
    summary:
      'Stop blocking new hires on implementation tasks. OpenFlows handles the boilerplate while your team learns by reviewing agent output against architectural specs. Faster ramp-up, deeper understanding.',
    href: '/docs',
    items: [
      'FORGE turns tickets into detailed plans and reviewed code',
      'New hires learn from SENTINEL review reports, not just code',
      'Reusable patterns for React, Vue, Django, Rails, and more',
      'Architecture decisions captured in PLAN.md, not tribal knowledge',
    ],
    stats: { label: 'Time to first contribution', value: 'Day 1' },
  },
  {
    id: 'secure',
    label: 'Secure source code',
    title: 'Your code never leaves your perimeter',
    summary:
      'Self-host OpenFlows on Coder and route every agent action through your own GitHub identities, models, and CI runners. Source code, tokens, and data stay inside your network, always.',
    href: '/docs',
    items: [
      'Zero personal access tokens in worker configuration',
      'Every action tied to a Coder-authenticated GitHub identity',
      'Source code stays inside your network boundary',
      'Models route through Coder AI Gateway or LiteLLM fallback',
    ],
    stats: { label: 'Security perimeter', value: '100%' },
  },
  {
    id: 'scale',
    label: 'Scale your team',
    title: '10x your capacity, not your headcount',
    summary:
      'Spin up 50 FORGE workers to tackle independent issues in parallel. SENTINEL reviews each one, VESSEL merges when CI is green. Coordinated, governed, and auditable at every step.',
    href: '/docs',
    items: [
      'Multi-worker FORGE pools for parallel ticket processing',
      'VESSEL resolves merge conflicts without losing context',
      'CI-aware merge gating with automatic retry on flaky tests',
      'Redis-backed state machine tracks every ticket in real time',
    ],
    stats: { label: 'Throughput increase', value: '10x' },
  },
]

const AUTO_ADVANCE_MS = 7000
const COUNT_UP_MS = 1100
const EXIT_MS = 320

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pad = (n) => String(n).padStart(2, '0')

/** Counts the first number in a stat such as "< 2 min" or "10x" up from zero. */
function CountUp({ value }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value)

  useEffect(() => {
    if (!match || prefersReducedMotion()) {
      setShown(value)
      return undefined
    }
    const [, before, digits, after] = match
    const target = Number(digits)
    let frame = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(`${before}${Math.round(target * eased)}${after}`)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <span aria-label={value}>{shown}</span>
}

export default function UseCaseTabs() {
  const [active, setActive] = useState(0)
  const [shownIndex, setShownIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [indicator, setIndicator] = useState(null)
  const sectionRef = useRef(null)
  const tabsRef = useRef(null)
  const tabRefs = useRef([])
  const activeCase = USE_CASES[shownIndex]
  const running = autoplay && inView && !paused && !reducedMotion

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Let the current panel fade out before the next one rises in.
  useEffect(() => {
    if (active === shownIndex) return undefined
    if (reducedMotion) {
      setShownIndex(active)
      return undefined
    }
    setLeaving(true)
    const timer = window.setTimeout(() => {
      setShownIndex(active)
      setLeaving(false)
    }, EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [active, shownIndex, reducedMotion])

  const measure = useCallback(() => {
    const tab = tabRefs.current[active]
    if (!tab) return
    setIndicator({ x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight })
  }, [active])

  useLayoutEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const select = (index, { focus = false } = {}) => {
    setAutoplay(false)
    setActive(index)
    if (focus) tabRefs.current[index]?.focus()
  }

  const advance = () => setActive((current) => (current + 1) % USE_CASES.length)

  const onKeyDown = (event, index) => {
    const last = USE_CASES.length - 1
    const keys = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    if (event.key in keys) {
      event.preventDefault()
      select(keys[event.key], { focus: true })
    }
  }

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="use-cases-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Use cases</p>
          <h2 id="use-cases-title" className={styles.title}>
            Code at speed. Stay in control.
          </h2>
          <p className={styles.subtitle}>
            Four ways OpenFlows transforms how your team ships software
          </p>
        </div>

        <div className={styles.layout}>
          <div ref={tabsRef} className={styles.tabs} role="tablist" aria-label="Use cases" aria-orientation="vertical">
            {indicator && (
              <span
                className={styles.indicator}
                aria-hidden="true"
                style={{
                  width: indicator.width,
                  height: indicator.height,
                  transform: `translate(${indicator.x}px, ${indicator.y}px)`,
                }}
              />
            )}
            {USE_CASES.map((useCase, index) => {
              const selected = active === index
              return (
                <button
                  key={useCase.id}
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  type="button"
                  role="tab"
                  id={`use-case-tab-${useCase.id}`}
                  aria-selected={selected}
                  aria-controls="use-case-panel"
                  tabIndex={selected ? 0 : -1}
                  className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span className={styles.tabIndex}>{pad(index + 1)}</span>
                  <span>{useCase.label}</span>
                  {selected && autoplay && !reducedMotion && (
                    <span className={styles.tabProgress} aria-hidden="true">
                      <span
                        key={active}
                        className={styles.tabProgressFill}
                        style={{
                          animationDuration: `${AUTO_ADVANCE_MS}ms`,
                          animationPlayState: running ? 'running' : 'paused',
                        }}
                        onAnimationEnd={advance}
                      />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div
            className={styles.content}
            role="tabpanel"
            id="use-case-panel"
            aria-labelledby={`use-case-tab-${activeCase.id}`}
            aria-live={autoplay ? 'off' : 'polite'}
          >
            <div key={activeCase.id} className={`${styles.contentInner} ${leaving ? styles.leaving : ''}`}>
              <p className={`${styles.counter} ${styles.rise}`} style={{ '--i': 0 }}>
                {pad(shownIndex + 1)} / {pad(USE_CASES.length)}
              </p>
              <h3 className={`${styles.contentTitle} ${styles.rise}`} style={{ '--i': 1 }}>
                {activeCase.title}
              </h3>
              <p className={`${styles.contentDesc} ${styles.rise}`} style={{ '--i': 2 }}>
                {activeCase.summary}
              </p>

              <ul className={styles.itemList}>
                {activeCase.items.map((item, i) => (
                  <li key={item} className={`${styles.item} ${styles.rise}`} style={{ '--i': 3 + i }}>
                    {item}
                  </li>
                ))}
              </ul>

              <div className={`${styles.footer} ${styles.rise}`} style={{ '--i': 3 + activeCase.items.length }}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    <CountUp value={activeCase.stats.value} />
                  </span>
                  <span className={styles.statLabel}>{activeCase.stats.label}</span>
                </div>
                <a href={activeCase.href} className={styles.cta}>
                  Learn more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
