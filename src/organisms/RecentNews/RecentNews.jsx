import NewsCard from '@/molecules/NewsCard/NewsCard'
import { NEWS_ITEMS } from '@/data/content'
import styles from './RecentNews.module.css'

export default function RecentNews() {
  const items = NEWS_ITEMS.filter((item) => !item.featured).slice(0, 6)

  return (
    <section className={styles.section} aria-labelledby="recent-news-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="recent-news-title" className={styles.title}>Recent news</h2>
          <a href="/blog" className={styles.viewMore}>View more</a>
        </div>
        <div className={styles.grid}>
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
