import styles from './TrustBar.module.css'

/**
 * Placeholder trust bar similar to coder.com's customer logo strip.
 * Replace PLACEHOLDER_LOGOS with actual SVG logos or img src strings.
 */
const PLACEHOLDER_LOGOS = [
  { name: 'Customer 1', src: '' },
  { name: 'Customer 2', src: '' },
  { name: 'Customer 3', src: '' },
  { name: 'Customer 4', src: '' },
  { name: 'Customer 5', src: '' },
]

export default function TrustBar() {
  return (
    <section className={styles.section} aria-label="Trusted by">
      <div className={styles.container}>
        <p className={styles.eyebrow}>Trusted by engineering teams at</p>
        <div className={styles.logoRow}>
          {PLACEHOLDER_LOGOS.map((logo, i) => (
            <div key={i} className={styles.logoPlaceholder} title={logo.name}>
              {logo.src ? (
                <img src={logo.src} alt={logo.name} className={styles.logoImage} />
              ) : (
                <span className={styles.logoText}>{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
