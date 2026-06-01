import styles from './Logo.module.css'

export default function Logo() {
  return (
    <a href="/" className={styles.logo} aria-label="Openflows home">
      <svg
        className={styles.icon}
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5" />
        <path
          d="M8 14 C8 10, 14 7, 14 14 C14 21, 20 18, 20 14"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="14" cy="14" r="2.5" fill="white" />
      </svg>
      <span className={styles.name}>Openflows</span>
    </a>
  )
}
