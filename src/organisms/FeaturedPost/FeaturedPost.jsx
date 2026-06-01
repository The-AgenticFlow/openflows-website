import NewsCard from '@/molecules/NewsCard/NewsCard'
import { NEWS_ITEMS } from '@/data/content'
import styles from './FeaturedPost.module.css'

export default function FeaturedPost() {
  const featured = NEWS_ITEMS.find((item) => item.featured)
  const secondary = NEWS_ITEMS.filter((item) => !item.featured).slice(0, 2)

  if (!featured) return null

  return (
    <section className={styles.section} aria-label="Latest release">
      <div className={styles.container}>
        <div className={styles.grid}>
          <NewsCard item={featured} variant="wide" />
          <div className={styles.secondaryStack}>
            {secondary.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
