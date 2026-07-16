import { useState } from 'react'
import styles from './UseCaseTabs.module.css'

/**
 * Placeholder rotating tabs similar to coder.com's "Code at speed. Stay in control."
 * Update USE_CASES with your own copy, background images, and links.
 */
const USE_CASES = [
  {
    id: 'govern',
    label: 'Govern AI agents',
    title: 'Run AI agents with boundaries you control',
    summary:
      'Coder governs where agents run. OpenFlows governs how they coordinate. Define which agents can access production repos, run dangerous commands, or merge to main — every action logged and auditable.',
    href: '/use-cases',
    bullets: [
      'Role-based permissions per agent and repo',
      ' Audit trail from issue to merged PR',
      'Human escalation only for security or ambiguity',
      ' Agent identity inherited from Coder external auth',
    ],
  },
  {
    id: 'onboard',
    label: 'Accelerate onboarding',
    title: 'Spend less time on boilerplate',
    summary:
      'Turn issue backlogs into working code inside your Coder environment. Junior developers learn by reviewing agent output against architectural specs instead of getting blocked on implementation.',
    href: '/use-cases/web-development',
    bullets: [
      'FORGE turns tickets into plan documents and code',
      'New hires learn by reading SENTINEL review reports',
      'Reusable registry patterns for common frameworks',
      'Architecture stays explicit in every PLAN.md',
    ],
  },
  {
    id: 'secure',
    label: 'Secure source code',
    title: 'Keep code in your governed environment',
    summary:
      'Self-host OpenFlows on top of Coder and route agent work through your own GitHub identities, models, and CI runners. No source code or tokens leave your infrastructure.',
    href: '/use-cases',
    bullets: [
      'No personal access tokens in agent configuration',
      'Every action tied to a Coder-authenticated user',
      'Sensitive code stays inside your network',
      'Models route through Coder AI Gateway or LiteLLM fallback',
    ],
  },
  {
    id: 'scale',
    label: 'Optimize compute',
    title: 'Parallelize work without losing control',
    summary:
      'Spin up multiple FORGE workers to tackle independent issues in parallel. SENTINEL reviews each one, VESSEL merges when CI is green — coordinated, governed, and auditable end to end.',
    href: '/use-cases/devops',
    bullets: [
      'Multi-worker FORGE pools for independent tickets',
      'VESSEL resolves conflicts without creating new branches',
      'CI-aware merge gating with automatic retry',
      'Redis-backed state machine tracks every ticket',
    ],
  },
]

export default function UseCaseTabs() {
  const [active, setActive] = useState(0)
  const activeCase = USE_CASES[active]

  return (
    <section className={styles.section} aria-labelledby="use-cases-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Use cases</p>
          <h2 id="use-cases-title" className={styles.title}>
            Code at speed. Stay in control.
          </h2>
        </div>

        <div className={styles.layout}>
          <div className={styles.tabs} role="tablist">
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

          <div className={styles.content} role="tabpanel">
            <div className={styles.text}>
              <h3 className={styles.contentTitle}>{activeCase.title}</h3>
              <p className={styles.contentDesc}>{activeCase.summary}</p>
              <ul className={styles.bulletList}>
                {activeCase.bullets.map((bullet, i) => (
                  <li key={i} className={styles.bulletItem}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
