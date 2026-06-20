import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import MarkdownRenderer from '@/components/MarkdownRenderer/MarkdownRenderer'
import TextToSpeechPlayer from '../../components/TextToSpeechPlayer/TextToSpeechPlayer'
import styles from './Blog.module.css'

export default function BlogPost() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

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

    // Copy link to clipboard
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
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

    // Resolve authors: prefer JSONB array, fallback to legacy fields
    const resolvedAuthors = (post.authors && post.authors.length > 0)
        ? post.authors
        : post.author_name
            ? [{ name: post.author_name, avatar_url: post.author_avatar_url, role: '', linkedin: '', github: '', website: '' }]
            : []

    return (
        <Layout>
            <article className={styles.article}>
                {/* Back Button */}
                <Link to="/blog" className={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to Blog
                </Link>

                {/* Hero Card with Cover Image */}
                <header className={styles.heroCard}>
                    {post.cover_image_url && (
                        <div className={styles.heroBg}>
                            <img src={post.cover_image_url} alt="" />
                            <div className={styles.heroOverlay} />
                        </div>
                    )}
                    <div className={styles.heroContent}>
                        <div className={styles.heroMeta}>
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
                            {post.category && (
                                <span className={styles.heroCategory}>{post.category.name}</span>
                            )}
                            {resolvedAuthors.length > 0 && (
                                <div className={styles.heroAuthor}>
                                    {resolvedAuthors[0].avatar_url ? (
                                        <img src={resolvedAuthors[0].avatar_url} alt={resolvedAuthors[0].name} className={styles.heroAvatar} />
                                    ) : (
                                        <div className={styles.heroAvatarPlaceholder}>
                                            {resolvedAuthors[0].name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className={styles.heroAuthorName}>{resolvedAuthors[0].name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Authors Section */}
                {resolvedAuthors.length > 0 && (
                    <section className={styles.authorsSection}>
                        <p className={styles.authorsSectionLabel}>Written by</p>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Text To Speech Player */}
                <div className={styles.ttsPlayer}>
                    <TextToSpeechPlayer title={post.title} text={post.content} />
                </div>

                {/* Share Button */}
                <div className={styles.shareBar}>
                    <button onClick={handleShare} className={styles.shareLinkBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {copied ? 'Copied!' : 'Share'}
                    </button>
                </div>

                {/* Content */}
                <div className={styles.articleBody}>
                    <MarkdownRenderer>{post.content}</MarkdownRenderer>
                </div>

                {/* Footer - Share */}
                <footer className={styles.articleFooter}>
                    <div className={styles.shareButtons}>
                        <span className={styles.shareLabel}>Share this article</span>
                        <div className={styles.shareIcons}>
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