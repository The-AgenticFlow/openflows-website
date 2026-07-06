import styles from './TrustBar.module.css'

const LOGOS = [
  { name: 'Adorsys', src: '/images/logo-adorsys.png' },
  { name: 'Clemios', src: '/images/logo-clemios.jpeg' },
  { name: 'Rust Cameroon', src: '/images/logo-rust-cameroon.jpeg' },
  { name: 'Rust Nigeria', src: '/images/logo-rust-nigeria.png' },
  { name: 'Rust Africa', src: '/images/logo-rust-africa.jpeg' },
]

// Duplicate the list so the marquee loops seamlessly
const MARQUEE_LOGOS = [...LOGOS, ...LOGOS]

export default function TrustBar() {
  return (
    <section id="trust" className={styles.section} aria-label="Trusted by">
      <div className={styles.container}>
        <p className={styles.eyebrow}>Trusted by engineering teams at</p>
        <div className={styles.marquee}>
          <div className={styles.logoRow}>
            {MARQUEE_LOGOS.map((logo, i) => (
              <div key={i} className={styles.logoPlaceholder} title={logo.name}>
                <img src={logo.src} alt={logo.name} className={styles.logoImage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}