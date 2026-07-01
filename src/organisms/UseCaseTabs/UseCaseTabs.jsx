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
    description:
      'Define which agents can access production repos, run dangerous commands, or merge to main. Every action is logged and auditable.',
    image: '',
    href: '/use-cases',
  },
  {
    id: 'onboard',
    label: 'Accelerate onboarding',
    title: 'New developers ship on day one',
    description:
      'OpenFlows turns issue backlogs into working code, so junior developers learn by reviewing agent output instead of getting blocked.',
    image: '',
    href: '/use-cases',
  },
  {
    id: 'secure',
    label: 'Secure source code',
    title: 'Keep sensitive code in your infrastructure',
    description:
      'Self-host OpenFlows and route agent work through your own GitHub accounts, models, and CI runners. No data leaves your environment.',
    image: '',
    href: '/use-cases',
  },
  {
    id: 'scale',
    label: 'Optimize compute',
    title: 'Parallelize development work',
    description:
      'Spin up multiple FORGE workers to tackle independent issues in parallel. SENTINEL reviews each one, VESSEL merges the winners.',
    image: '',
    href: '/use-cases',
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
              <p className={styles.contentDesc}>{activeCase.description}</p>
              <a href={activeCase.href} className={styles.link}>
                Learn more →
              </a>
            </div>

            <div className={styles.media}>
              {activeCase.image ? (
                <img src={activeCase.image} alt={activeCase.title} className={styles.mediaImage} />
              ) : (
                <div className={styles.mediaPlaceholder}>
                  <span>Image / Lottie / Video placeholder</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
