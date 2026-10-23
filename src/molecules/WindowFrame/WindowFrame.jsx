import styles from './WindowFrame.module.css'

/**
 * Presents a screenshot or recording as an app window with a title bar.
 * @param {{ title: string, children: import('react').ReactNode, className?: string }} props
 */
export default function WindowFrame({ title, children, className = '' }) {
  return (
    <figure className={[styles.window, className].filter(Boolean).join(' ')}>
      <figcaption className={styles.titleBar}>
        <span className={styles.lights} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.title}>{title}</span>
      </figcaption>
      <div className={styles.body}>{children}</div>
    </figure>
  )
}
