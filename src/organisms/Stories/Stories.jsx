import { useState, useEffect } from 'react'
import Badge from '@/atoms/Badge/Badge'
import NewsCard from '@/molecules/NewsCard/NewsCard'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styles from './Stories.module.css'

export default function Stories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setStories(data || [])
      } catch (err) {
        console.error('Error fetching stories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <section className={styles.section} aria-labelledby="stories-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 id="stories-title" className={styles.title}>Stories</h2>
          </div>
          <p className={styles.empty}>Loading stories...</p>
        </div>
      </section>
    )
  }

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
