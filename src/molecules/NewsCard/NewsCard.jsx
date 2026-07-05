import Badge from '@/atoms/Badge/Badge'
import styles from './NewsCard.module.css'

/**
 * @param {{ item: import('@/data/content').NewsItem, variant?: 'default' | 'wide' }} props
 */
export default function NewsCard({ item, variant = 'default' }) {
  const { category, date, title, href, image, excerpt } = item

  return (
    <a
      href={href}
      className={[styles.card, styles[variant]].filter(Boolean).join(' ')}
      aria-label={title}
    >
      <div className={styles.imageWrap}>
        {image ? (
          <img src={image} alt={title} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <Badge>{category}</Badge>
          <span className={styles.date}>{date}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      </div>
    </a>
  )
}
