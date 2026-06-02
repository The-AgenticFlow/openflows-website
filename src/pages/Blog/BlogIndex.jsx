import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { NEWS_ITEMS } from '@/data/content'
import styles from './Blog.module.css'

export default function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        // Fall back to static content if Supabase is not configured
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

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
            view_count,
            is_featured,
            category:blog_categories(name, slug)
          `)
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('published_at', { ascending: false })

        if (fetchError) throw fetchError
        setPosts(data || [])
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get unique categories
  const categories = ['all', ...new Set(posts.map(p => p.category?.name).filter(Boolean))]

  // Filter posts by category
  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.category?.name === filter)

  // Use static content if Supabase is not configured or no posts
  const displayPosts = posts.length > 0 ? filteredPosts : null
  const staticPosts = NEWS_ITEMS.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.href.replace('/blog/', ''),
    excerpt: item.excerpt,
    cover_image_url: item.image,
    category: { name: item.category },
    published_at: item.date,
    is_featured: item.featured,
  }))

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>Product updates & technical deep dives</h1>
          <p className={styles.sub}>
            Stories from the OpenFlows team — releases, research, and open source news.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {displayPosts && displayPosts.length > 0 && (
        <section className={styles.filterSection}>
          <div className={styles.container}>
            <div className={styles.filterTabs}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterTab} ${filter === cat ? styles.active : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'all' ? 'All Posts' : cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading posts...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Failed to load posts. Please try again later.</p>
            </div>
          ) : displayPosts && displayPosts.length > 0 ? (
            <div className={styles.postsGrid}>
              {displayPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  {post.cover_image_url && (
                    <div className={styles.postImage}>
                      <img src={post.cover_image_url} alt={post.title} />
                    </div>
                  )}
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      {post.category && (
                        <span className={styles.postCategory}>{post.category.name}</span>
                      )}
                      <span className={styles.postDate}>
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <span className={styles.readMore}>Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Fallback to static content
            <div className={styles.postsGrid}>
              {staticPosts.map(post => (
                <Link
                  key={post.id}
                  to={post.slug === 'introducing-demos' ? '/blog/introducing-demos' : `/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  {post.cover_image_url && (
                    <div className={styles.postImage}>
                      <img src={post.cover_image_url} alt={post.title} />
                    </div>
                  )}
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      {post.category && (
                        <span className={styles.postCategory}>{post.category.name}</span>
                      )}
                      <span className={styles.postDate}>{post.published_at}</span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <span className={styles.readMore}>Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
