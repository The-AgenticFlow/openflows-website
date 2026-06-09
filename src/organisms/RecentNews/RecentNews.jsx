import { useState, useEffect } from 'react'
import NewsCard from '@/molecules/NewsCard/NewsCard'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styles from './RecentNews.module.css'

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonMeta}>
          <div className={styles.skeletonBadge} />
          <div className={styles.skeletonDate} />
        </div>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonTitleShort} />
      </div>
    </div>
  )
}

export default function RecentNews() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentPosts = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('blogs')
          .select(`
            id,
            title,
            slug,
            excerpt,
            cover_image_url,
            published_at,
            created_at,
            is_featured,
            category:blog_categories(name, slug)
          `)
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('published_at', { ascending: false })
          .limit(3)

        if (fetchError) throw fetchError
        setPosts(data || [])
      } catch (err) {
        console.error('Error fetching recent posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPosts()
  }, [])

  // Map Supabase posts to NewsCard format
  const items = posts.map((post) => ({
    id: post.id,
    category: post.category?.name || 'Blog',
    date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    title: post.title,
    excerpt: post.excerpt,
    href: `/blog/${post.slug}`,
    image: post.cover_image_url || '',
    featured: post.is_featured || false,
  }))

  // Don't render the section if Supabase is not configured and there's no data
  if (!loading && items.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="recent-news-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="recent-news-title" className={styles.title}>Recent news</h2>
          <a href="/blog" className={styles.viewMore}>View more</a>
        </div>
        <div className={styles.grid}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            items.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
