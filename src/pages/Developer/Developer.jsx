import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styles from './Developer.module.css'

export default function Developer() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPosts = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                // Fetch blogs with category "Developer"
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
                    .eq('blog_categories.slug', 'developer')
                    .is('deleted_at', null)
                    .order('published_at', { ascending: false })

                if (fetchError) throw fetchError
                setPosts(data || [])
            } catch (err) {
                console.error('Error fetching developer posts:', err)
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

    return (
        <Layout>
            <div className={styles.developerWrapper}>
                <div className={styles.developerLayout}>
                    <main className={styles.mainFeed}>
                        {/* Header */}
                        <header className={styles.developerHeader}>
                            <div className={styles.headerContent}>
                                <p className={styles.eyebrow}>Developer</p>
                                <h1 className={styles.title}>Articles & Guides for Developers</h1>
                                <p className={styles.sub}>
                                    Technical deep dives, API guides, integration tutorials, and SDK documentation from the OpenFlows team.
                                </p>
                            </div>
                        </header>

                        {/* Content Feed */}
                        {loading ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <p>Loading articles...</p>
                            </div>
                        ) : error ? (
                            <div className={styles.error}>
                                <p>Failed to load articles. Please try again later.</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyTitle}>No developer articles yet.</p>
                                <p className={styles.emptyText}>Check back soon for technical guides and tutorials.</p>
                            </div>
                        ) : (
                            <div className={styles.postsGrid}>
                                {posts.map((post) => (
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
                                            <div className={styles.postFooter}>
                                                <span className={styles.readMore}>Read more →</span>
                                                {(() => {
                                                    const resolvedAuthors = (post.authors && post.authors.length > 0)
                                                        ? post.authors
                                                        : post.author_name
                                                            ? [{ name: post.author_name, avatar_url: post.author_avatar_url }]
                                                            : []
                                                    if (!resolvedAuthors.length) return null
                                                    const author = resolvedAuthors[0]
                                                    return (
                                                        <div className={styles.postAuthor}>
                                                            {author.avatar_url ? (
                                                                <img src={author.avatar_url} alt={author.name} className={styles.postAuthorAvatar} />
                                                            ) : (
                                                                <div className={styles.postAuthorAvatarPlaceholder}>{author.name?.charAt(0).toUpperCase()}</div>
                                                            )}
                                                            <span className={styles.postAuthorName}>{author.name}</span>
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    )
}
