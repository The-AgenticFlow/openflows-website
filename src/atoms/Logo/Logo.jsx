import styles from './Logo.module.css'

export default function Logo({ variant = 'default' }) {
  return (
    <a href="/" className={[styles.logo, styles[variant]].join(' ')} aria-label="OpenFlows home">
      <img 
        src="/openlogo.png" 
        alt="OpenFlows" 
        className={styles.logoImage}
        width="32"
        height="32"
      />
      <span className={styles.name}>OpenFlows</span>
    </a>
  )
}