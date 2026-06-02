import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import styles from './Blog.module.css'

export default function BlogPost() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const { data, error: fetchError } = await supabase
                    .from('blogs')
                    .select(`
            *,
            category:blog_categories(name, slug)
          `)
                    .eq('slug', slug)
                    .eq('status', 'published')
                    .is('deleted_at', null)
                    .single()

                if (fetchError) throw fetchError
                if (!data) throw new Error('Post not found')

                setPost(data)

                // Increment view count
                await supabase
                    .from('blogs')
                    .update({ view_count: (data.view_count || 0) + 1 })
                    .eq('id', data.id)
            } catch (err) {
                console.error('Error fetching post:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    // Calculate read time
    const getReadTime = (content) => {
        if (!content) return 1
        const words = content.trim().split(/\s+/).length
        return Math.max(1, Math.ceil(words / 200))
    }

    if (loading) {
        return (
            <Layout>
                <div className={styles.article}>
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Loading article...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (error || !post) {
        return <Navigate to="/blog" replace />
    }

    return (
        <Layout>
            <article className={styles.article}>
                {/* Header */}
                <header className={styles.articleHeader}>
                    {post.category && (
                        <span className={styles.tag}>{post.category.name}</span>
                    )}
                    <h1 className={styles.articleTitle}>{post.title}</h1>
                    <p className={styles.articleExcerpt}>{post.excerpt}</p>

                    <div className={styles.articleMeta}>
                        <div className={styles.author}>
                            {post.author_avatar_url ? (
                                <img
                                    src={post.author_avatar_url}
                                    alt={post.author_name}
                                    className={styles.authorAvatar}
                                />
                            ) : (
                                <div className={styles.authorAvatarPlaceholder}>
                                    {post.author_name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className={styles.authorInfo}>
                                <span className={styles.authorName}>{post.author_name}</span>
                                <span className={styles.publishDate}>
                                    {formatDate(post.published_at || post.created_at)}
                                </span>
                            </div>
                        </div>
                        <div className={styles.readTime}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{getReadTime(post.content)} min read</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.cover_image_url && (
                    <div className={styles.coverImage}>
                        <img
                            src={post.cover_image_url}
                            alt={post.cover_image_alt || post.title}
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className={styles.articleBody}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer */}
                <footer className={styles.articleFooter}>
                    <div className={styles.shareButtons}>
                        <span className={styles.shareLabel}>Share this article</span>
                        <div className={styles.shareIcons}>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareBtn}
                                aria-label="Share on Twitter"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareBtn}
                                aria-label="Share on LinkedIn"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </article>
        </Layout>
    )
}