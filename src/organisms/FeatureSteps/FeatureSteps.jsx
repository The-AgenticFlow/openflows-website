import WindowFrame from '@/molecules/WindowFrame/WindowFrame'
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
          <WindowFrame title="coder / workspaces">
            <img
              src="/images/howitworks.png"
              alt="Coder workspaces list with FORGE agent workspaces and the NEXUS controller running"
              className={styles.mediaImage}
              width="1717"
              height="1125"
              loading="lazy"
              decoding="async"
            />
          </WindowFrame>
        </div>
      </div>
    </section>
  )
}