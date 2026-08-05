import NewsCard from '@/molecules/NewsCard/NewsCard'
import styles from './RecentNews.module.css'

export default function RecentNews({ posts = [] }) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className={styles.section} aria-labelledby="recent-news-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="recent-news-title" className={styles.title}>Recent news</h2>
          <a href="/blog" className={styles.viewMore}>View more</a>
        </div>
        <div className={styles.grid}>
          {posts.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
