import { useState } from 'react'
import styles from './FeatureSteps.module.css'

/**
 * Placeholder feature steps similar to coder.com's numbered accordion.
 * Update STEPS with your own copy, images, or Lottie animations.
 */
const STEPS = [
  {
    number: '01',
    title: 'Install OpenFlows',
    description:
      'Self-host the orchestration engine on your infrastructure. A single binary, Docker image, or one-line installer gets you running in minutes.',
    image: '', // TODO: add screenshot or Lottie URL
  },
  {
    number: '02',
    title: 'Connect your GitHub repo',
    description:
      'Point OpenFlows at a repository with open issues. NEXUS discovers tickets, assigns them to FORGE workers, and starts the pipeline.',
    image: '',
  },
  {
    number: '03',
    title: 'Agents ship while you sleep',
    description:
      'FORGE plans and writes code, SENTINEL reviews every segment, VESSEL merges green PRs, and LORE documents the work. You wake up to shipped features.',
    image: '',
  },
]

export default function FeatureSteps() {
  const [active, setActive] = useState(0)

  return (
    <section className={styles.section} aria-labelledby="feature-steps-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 id="feature-steps-title" className={styles.title}>
            Orchestrate agents and flows that keep developers in flow.
          </h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.stepsList}>
            {STEPS.map((step, index) => (
              <button
                key={step.number}
                className={`${styles.step} ${active === index ? styles.stepActive : ''}`}
                onClick={() => setActive(index)}
              >
                <span className={styles.stepNumber}>{step.number}</span>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className={styles.mediaPanel}>
            {STEPS[active].image ? (
              <img
                src={STEPS[active].image}
                alt={STEPS[active].title}
                className={styles.mediaImage}
              />
            ) : (
              <div className={styles.mediaPlaceholder}>
                <span className={styles.mediaLabel}>Media placeholder</span>
                <span className={styles.mediaHint}>
                  Add a screenshot, Lottie, or video here
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
