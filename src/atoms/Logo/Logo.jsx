import styles from './Logo.module.css'

/**
 * SVG wave mark — white rounded square with dark wave lines inside.
 * Matches the logo visible in the reference screenshots.
 */
function WaveMark() {
  return (
    <svg
      className={styles.mark}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* White rounded-square background */}
      <rect width="24" height="24" rx="6" fill="white" />

      {/* Top wave */}
      <path
        d="M5 9.5 C6.5 7.5 8 7.5 9.5 9.5 C11 11.5 12.5 11.5 14 9.5 C15.5 7.5 17 7.5 18.5 9.5"
        stroke="#0a0a0a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom wave */}
      <path
        d="M5 14.5 C6.5 12.5 8 12.5 9.5 14.5 C11 16.5 12.5 16.5 14 14.5 C15.5 12.5 17 12.5 18.5 14.5"
        stroke="#0a0a0a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  )
}

export default function Logo() {
  return (
    <a href="/" className={styles.logo} aria-label="OpenFlows home">
      <WaveMark />
      <span className={styles.name}>OpenFlows</span>
    </a>
  )
}
