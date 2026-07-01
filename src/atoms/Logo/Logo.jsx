import styles from './Logo.module.css'

export default function Logo({ variant = 'default' }) {
  return (
    <a href="/" className={[styles.logo, styles[variant]].join(' ')} aria-label="OpenFlows home">
      <svg
        className={styles.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="currentColor" className={styles.markBg} />
        <path
          d="M8 12L14 22L18 16L24 22"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="22" r="2" fill="white" />
      </svg>
      <span className={styles.name}>OpenFlows</span>
    </a>
  )
}
