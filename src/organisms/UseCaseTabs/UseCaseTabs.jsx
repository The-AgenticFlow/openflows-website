import { useState } from 'react'
import styles from './UseCaseTabs.module.css'

const USE_CASES = [
  {
    id: 'govern',
    label: 'Govern AI agents',
    title: 'Run AI agents with boundaries you control',
    summary:
      'Coder governs where agents run. OpenFlows governs how they coordinate. Define which agents can access production repos, run dangerous commands, or merge to main. Every action logged and auditable.',
    href: '/docs/architecture/security-by-design',
    items: [
      'Role-based permissions per agent and repository',
      'Complete audit trail from issue to merged PR',
      'Human escalation only for security flags or ambiguity',
      'Agent identity inherited from Coder external auth',
    ],
  },
  {
    id: 'onboard',
    label: 'Accelerate onboarding',
    title: 'Junior devs ship code on day one',
    summary:
      'Stop blocking new hires on implementation tasks. OpenFlows handles the boilerplate while your team learns by reviewing agent output against architectural specs. Faster ramp-up, deeper understanding.',
    href: '/docs/concepts/planning-gate',
    items: [
      'FORGE turns tickets into detailed plans and reviewed code',
      'New hires learn from SENTINEL review reports, not just code',
      'Reusable patterns for React, Vue, Django, Rails, and more',
      'Architecture decisions captured in PLAN.md, not tribal knowledge',
    ],
  },
  {
    id: 'secure',
    label: 'Secure source code',
    title: 'Your code never leaves your perimeter',
    summary:
      'Self-host OpenFlows on Coder and route every agent action through your own GitHub identities, models, and CI runners. Source code, tokens, and data stay inside your network, always.',
    href: '/docs/architecture/credentials',
    items: [
      'Zero personal access tokens in worker configuration',
      'Every action tied to a Coder-authenticated GitHub identity',
      'Source code stays inside your network boundary',
      'Models route through the Coder AI Gateway',
    ],
  },
  {
    id: 'scale',
    label: 'Scale your team',
    title: 'Scale capacity, not headcount',
    summary:
      'Run a pool of FORGE workers on independent issues in parallel. SENTINEL reviews each one, VESSEL merges when CI is green. Coordinated, governed, and auditable at every step.',
    href: '/docs/guides/multi-tenancy',
    items: [
      'Multi-worker FORGE pools for parallel ticket processing',
      'VESSEL resolves merge conflicts without losing context',
      'CI-aware merge gating with automatic retry on flaky tests',
      'Redis-backed state machine tracks every ticket in real time',
    ],
  },
]

export default function UseCaseTabs() {
  const [active, setActive] = useState(0)
  const activeCase = USE_CASES[active]

  return (
    <div className={styles.layout}>
      <div className={styles.tabs} role="tablist" aria-label="Use cases">
        {USE_CASES.map((useCase, index) => (
          <button
            key={useCase.id}
            role="tab"
            aria-selected={active === index}
            className={`${styles.tab} ${active === index ? styles.tabActive : ''}`}
            onClick={() => setActive(index)}
          >
            {useCase.label}
          </button>
        ))}
      </div>

      <div key={activeCase.id} className={styles.content} role="tabpanel">
        <div className={styles.contentCopy}>
          <h3 className={styles.contentTitle}>{activeCase.title}</h3>
          <p className={styles.contentDesc}>{activeCase.summary}</p>
          <a href={activeCase.href} className={styles.cta}>
            Read how it works
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
        <ul className={styles.itemList}>
          {activeCase.items.map((item, i) => (
            <li key={item} className={styles.item} style={{ animationDelay: `${i * 70}ms` }}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
