import styles from './Logo.module.css'

export default function Logo() {
  return (
    <a href="/" className={styles.logo} aria-label="Openflows home">
      <span className={styles.wave} aria-hidden="true">🌊</span>
      <span className={styles.name}>Openflows</span>
    </a>
  )
}
