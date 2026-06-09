import styles from './Logo.module.css'

export default function Logo() {
  return (
    <a href="/" className={styles.logo} aria-label="Openflows home">
      <img src="/openlogo.svg" alt="Openflows Logo" className={styles.icon} />
      <span className={styles.name}>Openflows</span>
    </a>
  )
}
