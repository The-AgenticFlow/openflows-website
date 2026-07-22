import { useState } from 'react'
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

export default function UseCaseTabs() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const activeCase = USE_CASES[active]

  const handleTabChange = (index) => {
    if (index === active || animating) return
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 200)
  }

  return (
    <section className={styles.section} aria-labelledby="use-cases-title">
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
          <div className={styles.tabs} role="tablist">
            {USE_CASES.map((useCase, index) => (
              <button
                key={useCase.id}
                role="tab"
                aria-selected={active === index}
                className={`${styles.tab} ${active === index ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(index)}
              >
                {useCase.label}
              </button>
            ))}
          </div>

          <div className={`${styles.content} ${animating ? styles.contentExit : styles.contentEnter}`} role="tabpanel">
            <h3 className={styles.contentTitle}>{activeCase.title}</h3>
            <p className={styles.contentDesc}>{activeCase.summary}</p>
            
            <ul className={styles.itemList}>
              {activeCase.items.map((item, i) => (
                <li key={i} className={styles.item}>{item}</li>
              ))}
            </ul>

            <div className={styles.footer}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{activeCase.stats.value}</span>
                <span className={styles.statLabel}>{activeCase.stats.label}</span>
              </div>
              <a href={activeCase.href} className={styles.cta}>
                Learn more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}