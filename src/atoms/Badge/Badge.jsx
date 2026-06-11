import styles from './Badge.module.css'

/**
 * @param {'default' | 'accent' | 'agent'} variant
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(' ')
  return <span className={classes}>{children}</span>
}
