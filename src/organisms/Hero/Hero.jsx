import Button from '@/atoms/Button/Button'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero section">
      <div className={styles.heroBackground} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>
            OpenFlows
          </p>

          <h1 className={styles.heading}>
            <span className={styles.line}><span className={styles.highlight}>Orchestrate</span> AI agents</span>
            <span className={styles.line}>on top of your{' '}
              <a
                href="https://coder.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.coderLink}
              >
                Coder
              </a>
            </span>
            <span className={styles.line}>environment.</span>
          </h1>

          <p className={styles.sub}>
            OpenFlows sits on top of Coder so engineering teams can focus on
            architecture. A flow-agnostic dev team runs safely, securely, and
            with full governance  -  every agent action auditable from issue to
            merge.
          </p>

          <div className={styles.ctaGroup}>
            <Button variant="primary" size="lg" href="/docs/getting-started">
              Install OpenFlows
            </Button>
            <Button variant="secondary" size="lg" href="https://github.com/The-AgenticFlow/OpenFlows" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Button>
          </div>
        </div>
      </div>

      <a href="#trust" className={styles.scrollContinue} aria-label="Know more">
        Know more
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </a>
    </section>
  )
}
