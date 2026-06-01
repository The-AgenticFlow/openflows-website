import Badge from '@/atoms/Badge/Badge'
import NewsCard from '@/molecules/NewsCard/NewsCard'
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
            <NewsCard key={story.id} item={story} variant="vertical" />
          ))}
        </div>
      </div>
    </section>
  )
}
