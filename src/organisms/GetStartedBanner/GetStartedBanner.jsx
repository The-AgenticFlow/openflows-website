import Button from '@/atoms/Button/Button'
import styles from './GetStartedBanner.module.css'

export default function GetStartedBanner() {
  return (
    <section className={styles.section} id="get-started" aria-labelledby="get-started-title">
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 id="get-started-title" className={styles.heading}>
            Get started with Openflows
          </h2>
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="md"
              href="https://github.com/The-AgenticFlow/Openflows"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </Button>
            <Button
              variant="primary"
              size="md"
              href="/docs/getting-started"
            >
              Read the docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
