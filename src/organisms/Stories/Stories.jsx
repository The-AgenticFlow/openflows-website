import NewsCard from '@/molecules/NewsCard/NewsCard'
import styles from './Stories.module.css'

export default function Stories({ stories = [] }) {
  if (stories.length === 0) {
    return null
  }

  return (
    <section className={styles.section} aria-labelledby="stories-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="stories-title" className={styles.title}>Stories</h2>
        </div>
        <div className={styles.grid}>
          {stories.map((story) => (
            <NewsCard
              key={story.id}
              item={{
                id: story.id,
                category: story.category,
                date: story.date,
                title: story.title,
                href: story.href,
                image: story.image,
              }}
              variant="vertical"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
