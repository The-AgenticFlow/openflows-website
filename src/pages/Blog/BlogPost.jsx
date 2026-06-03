import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import ReactMarkdown from 'react-markdown'
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
                {/* Back Button */}
                <Link to="/blog" className={styles.backLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to Blog
                </Link>

                {/* Premium Hero Header */}
                <header className={styles.detailHero}>
                    <div className={styles.heroCard}>
                        {/* Background Image Container */}
                        {post.cover_image_url && (
                            <div className={styles.heroBg}>
                                <img src={post.cover_image_url} alt="" />
                                <div className={styles.heroOverlay} />
                            </div>
                        )}

                        <div className={styles.heroContent}>
                            <div className={styles.heroTop}>
                                <span className={styles.heroDate}>
                                    {formatDate(post.published_at || post.created_at)}
                                </span>
                                <span className={styles.heroReadTime}>
                                    {getReadTime(post.content)} min read
                                </span>
                            </div>

                            <h1 className={styles.heroTitle}>{post.title}</h1>
                            <p className={styles.heroExcerpt}>{post.excerpt}</p>

                            <div className={styles.heroFooter}>
                                <div className={styles.heroMeta}>
                                    {post.category && (
                                        <span className={styles.heroCategory}>{post.category.name}</span>
                                    )}
                                    <div className={styles.heroAuthor}>
                                        {post.author_avatar_url ? (
                                            <img
                                                src={post.author_avatar_url}
                                                alt={post.author_name}
                                                className={styles.miniAvatar}
                                            />
                                        ) : (
                                            <div className={styles.miniAvatarPlaceholder}>
                                                {post.author_name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className={styles.heroAuthorName}>{post.author_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Authors Section */}
                {(() => {
                    // Resolve authors: prefer JSONB array, fallback to legacy fields
                    const resolvedAuthors = (post.authors && post.authors.length > 0)
                        ? post.authors
                        : post.author_name
                            ? [{ name: post.author_name, avatar_url: post.author_avatar_url, role: '', linkedin: '', github: '', twitter: '', website: '' }]
                            : []

                    if (!resolvedAuthors.length) return null

                    return (
                        <section className={styles.authorsSection}>
                            <p className={styles.authorsSectionLabel}>{resolvedAuthors.length > 1 ? 'Authors' : 'Written by'}</p>
                            <div className={styles.authorsGrid}>
                                {resolvedAuthors.map((author, i) => (
                                    <div key={i} className={styles.authorCard}>
                                        <div className={styles.authorCardLeft}>
                                            {author.avatar_url ? (
                                                <img src={author.avatar_url} alt={author.name} className={styles.authorCardAvatar} />
                                            ) : (
                                                <div className={styles.authorCardAvatarPlaceholder}>
                                                    {author.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.authorCardBody}>
                                            <span className={styles.authorCardName}>{author.name}</span>
                                            {author.role && (
                                                <span className={styles.authorCardRole}>{author.role}</span>
                                            )}
                                            <div className={styles.authorSocials}>
                                                {author.github && (
                                                    <a href={author.github.startsWith('http') ? author.github : `https://${author.github}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2c-3.33.72-4.03-1.6-4.03-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0C18 4.68 19 5 19 5c.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                                    </a>
                                                )}
                                                {author.twitter && (
                                                    <a href={author.twitter.startsWith('http') ? author.twitter : `https://${author.twitter}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X / Twitter">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                                    </a>
                                                )}
                                                {author.linkedin && (
                                                    <a href={author.linkedin.startsWith('http') ? author.linkedin : `https://${author.linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                                    </a>
                                                )}
                                                {author.website && (
                                                    <a href={author.website.startsWith('http') ? author.website : `https://${author.website}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Website">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                })()}

                {/* Content */}

                <div className={styles.articleBody}>
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>



                {/* Footer — Share */}
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