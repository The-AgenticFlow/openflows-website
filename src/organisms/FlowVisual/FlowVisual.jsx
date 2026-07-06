import styles from './FlowVisual.module.css'

/**
 * Placeholder for a Lottie / video / animated SVG showing the OpenFlows agent flow.
 * Replace the placeholder with:
 *   - a Lottie component (e.g. from lottie-react)
 *   - a <video> element
 *   - an animated SVG
 *   - an img/GIF
 */
export default function FlowVisual() {
  return (
    <section className={styles.section} aria-labelledby="flow-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>The flow</p>
          <h2 id="flow-title" className={styles.title}>
            Watch the team work in real time.
          </h2>
          <p className={styles.subtitle}>
            NEXUS triages, FORGE builds, SENTINEL reviews, VESSEL ships, and LORE
            documents — all coordinated through a shared Redis state machine on
            top of your Coder environment. Every step governed, auditable, and
            safe.
          </p>
        </div>

        <div className={styles.stage}>
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.placeholderTitle}>Lottie / Video / Animation placeholder</p>
            <p className={styles.placeholderHint}>
              Drop your flow animation here to show agents collaborating end-to-end.
            </p>
          </div>
        </div>

        <div className={styles.agents}>
          {['NEXUS', 'FORGE', 'SENTINEL', 'VESSEL', 'LORE'].map((agent) => (
            <span key={agent} className={styles.agentBadge}>
              {agent}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
