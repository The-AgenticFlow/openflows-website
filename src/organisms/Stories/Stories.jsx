import Badge from '@/atoms/Badge/Badge'
import { STORIES } from '@/data/content'
import styles from './Stories.module.css'

export default function Stories() {
  return (
    <section className={styles.section} aria-labelledby="stories-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="stories-title" className={styles.title}>Stories</h2>
          <a href="/stories" className={styles.viewAll}>View all</a>
        </div>
        <div className={styles.grid}>
          {STORIES.map((story) => (
            <a key={story.id} href={story.href} className={styles.card}>
              <div className={styles.imageWrap}>
                {story.image ? (
                  <img src={story.image} alt={story.title} className={styles.image} loading="lazy" />
                ) : (
                  <div className={styles.imagePlaceholder} aria-hidden="true">
                    <span className={styles.placeholderIcon}>🤖</span>
                  </div>
                )}
              </div>
              <div className={styles.body}>
                <div className={styles.meta}>
                  <Badge>{story.category}</Badge>
                  <span className={styles.date}>{story.date}</span>
                </div>
                <h3 className={styles.cardTitle}>{story.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
