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
            author_name,
            author_avatar_url,
            authors,
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

  const [viewMode, setViewMode] = useState('grid') // Default view mode

  // Use static content if Supabase is not configured or no posts
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

  // Filter posts by category
  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.category?.name === filter)

  const allPosts = posts.length > 0 ? filteredPosts : staticPosts

  // Split: first post is featured hero, rest go into the grid/list
  const [featuredPost, ...remainingPosts] = allPosts

  return (
    <Layout>
      <div className={`${styles.blogWrapper} ${viewMode === 'list' ? styles.isListView : ''}`}>
        <div className={styles.blogLayout}>

          {/* Left Rail (Visible in List View) */}
          <aside className={styles.leftRail}>
            <div className={styles.stickyRail}>
              <h3 className={styles.railTitle}>Journal</h3>
              <nav className={styles.railNav}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.railLink} ${filter === cat ? styles.railLinkActive : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat === 'all' ? 'Latest' : cat}
                  </button>
                ))}
              </nav>

              <div className={styles.ctaWidget}>
                <h4 className={styles.ctaHeading}>Ask</h4>
                <p className={styles.ctaText}>Need implementation details? Jump into the docs and learn more about our agents.</p>
                <Link to="/docs" className={styles.ctaLink}>Open docs</Link>
              </div>
            </div>
          </aside>

          <main className={styles.mainFeed}>
            {/* Header with Hero and View Toggle */}
            <header className={styles.blogHeader}>
              <div className={styles.headerContent}>
                <p className={styles.eyebrow}>Blog</p>
                <h1 className={styles.title}>What we&apos;re building, fixing, and learning.</h1>
                <p className={styles.sub}>
                  Stories from the OpenFlows team — releases, research, and open source news.
                </p>
              </div>

              <div className={styles.viewControls}>
                <div className={styles.toggleGroup}>
                  <button
                    className={`${styles.viewToggle} ${viewMode === 'grid' ? styles.active : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </button>
                  <button
                    className={`${styles.viewToggle} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                      <circle cx="2" cy="6" r="1.5" fill="currentColor" stroke="none" />
                      <circle cx="2" cy="12" r="1.5" fill="currentColor" stroke="none" />
                      <circle cx="2" cy="18" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {/* Content Feed */}
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className={styles.error}>
                <p>Failed to load posts. Please try again later.</p>
              </div>
            ) : (
              <>
                {/* Featured / Most Recent Post — Hero Card */}
                {featuredPost && (
                  <Link to={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
                    {featuredPost.cover_image_url && (
                      <div className={styles.featuredBg}>
                        <img src={featuredPost.cover_image_url} alt="" />
                        <div className={styles.featuredOverlay} />
                      </div>
                    )}
                    <div className={styles.featuredContent}>
                      <div className={styles.featuredTop}>
                        <span className={styles.featuredDate}>
                          {formatDate(featuredPost.published_at || featuredPost.created_at)}
                        </span>
                        {featuredPost.category && (
                          <span className={styles.featuredCategory}>
                            {featuredPost.category.name}
                          </span>
                        )}
                      </div>
                      <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                      <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                      {(() => {
                        // Resolve authors: prefer JSONB array, fallback to legacy fields
                        const resolvedAuthors = (featuredPost.authors && featuredPost.authors.length > 0)
                          ? featuredPost.authors
                          : featuredPost.author_name
                            ? [{ name: featuredPost.author_name, avatar_url: featuredPost.author_avatar_url }]
                            : []

                        if (!resolvedAuthors.length) return null

                        return (
                          <div className={styles.featuredAuthors}>
                            <div className={styles.stackedAvatars}>
                              {resolvedAuthors.slice(0, 3).map((author, i) => (
                                <div key={i} className={styles.stackedAvatar} style={{ zIndex: 10 - i }}>
                                  {author.avatar_url ? (
                                    <img src={author.avatar_url} alt={author.name} />
                                  ) : (
                                    <span>{author.name?.charAt(0).toUpperCase()}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <span className={styles.featuredAuthorNames}>
                              {resolvedAuthors.map(a => a.name).join(', ')}
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                  </Link>
                )}

                {/* Remaining Posts */}
                {remainingPosts.length > 0 && (
                  <div className={viewMode === 'grid' ? styles.postsGrid : styles.postsList}>
                    {remainingPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className={viewMode === 'grid' ? styles.postCard : styles.postRow}
                      >
                        {viewMode === 'grid' ? (
                          <>
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
                              <div className={styles.postFooter}>
                                <span className={styles.readMore}>Read more →</span>
                                {post.author_name && (
                                  <span className={styles.authorBadge}>{post.author_name}</span>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.rowDate}>
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className={styles.rowContent}>
                              <h2 className={styles.rowTitle}>{post.title}</h2>
                              <p className={styles.rowExcerpt}>{post.excerpt}</p>
                              <div className={styles.rowMeta}>
                                {post.category && (
                                  <span className={styles.pillTag}>{post.category.name}</span>
                                )}
                                <span className={styles.rowAuthor}>
                                  {post.author_name || 'OpenFlows Team'}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Right Rail (Visible in List View) */}
          <aside className={styles.rightRail}>
            <div className={styles.stickyRail}>
              <h3 className={styles.railTitle}>Reading Paths</h3>
              <nav className={styles.railNav}>
                <Link to="/docs/security" className={styles.railLink}>Security docs</Link>
                <Link to="/docs/providers" className={styles.railLink}>OpenAI provider</Link>
                <Link to="/docs/plugins" className={styles.railLink}>Plugins</Link>
                <Link to="/showcase" className={styles.railLink}>Showcase</Link>
              </nav>
            </div>
          </aside>

        </div>
      </div>
    </Layout>
  )
}
