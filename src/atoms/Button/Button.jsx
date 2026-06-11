import styles from './Button.module.css'

/**
 * @param {'primary' | 'secondary' | 'ghost' | 'outline'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ')

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  )
}
