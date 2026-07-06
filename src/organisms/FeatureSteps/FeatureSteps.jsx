import styles from './FeatureSteps.module.css'

export default function FeatureSteps() {
  return (
    <section className={styles.section} aria-labelledby="feature-steps-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 id="feature-steps-title" className={styles.title}>
            <span className={styles.titleLine}>Orchestrate agents on Coder.</span>
            <span className={styles.titleLine}>Keep your team focused on architecture.</span>
          </h2>
        </div>

        <div className={styles.mediaPanel}>
          <img
            src="/images/howitworks.png"
            alt="How OpenFlows orchestrates agents on top of the Coder environment"
            className={styles.mediaImage}
          />
        </div>
      </div>
    </section>
  )
}