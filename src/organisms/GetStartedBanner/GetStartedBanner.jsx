import Button from '@/atoms/Button/Button'
import styles from './GetStartedBanner.module.css'

export default function GetStartedBanner() {
  return (
    <section className={styles.section} id="get-started" aria-labelledby="get-started-title">
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 id="get-started-title" className={styles.heading}>
            Get started with OpenFlows
          </h2>
          <p className={styles.sub}>
            Install in 60 seconds. Point it at a GitHub repo with open issues. Watch your team ship.
          </p>
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="md"
              href="https://github.com/The-AgenticFlow/OpenFlows"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </Button>
            <Button
              variant="secondary"
              size="md"
              href="/docs/getting-started/installation"
            >
              Installation Guide →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
