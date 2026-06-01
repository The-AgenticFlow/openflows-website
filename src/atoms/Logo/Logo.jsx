import styles from './Logo.module.css'

export default function Logo() {
  return (
    <a href="/" className={styles.logo} aria-label="OpenFlows home">
      <span className={styles.icon} aria-hidden="true">🌊</span>
      <span className={styles.name}>OpenFlows</span>
    </a>
  )
}
