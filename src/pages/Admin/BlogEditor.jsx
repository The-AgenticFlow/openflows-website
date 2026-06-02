import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import ImageUploader from '@/components/ImageUploader'
import ReactMarkdown from 'react-markdown'
import styles from './Admin.module.css'

const DEFAULT_AUTHOR = { name: '', role: '', avatar_url: '', linkedin: '', github: '', twitter: '', website: '' }

const DEFAULT_FORM = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    cover_image_alt: '',
    author_name: '',
    author_avatar_url: '',
    category_id: '',
    status: 'draft',
    is_featured: false,
    meta_title: '',
    meta_description: '',
}

export default function BlogEditor() {
    const { id } = useParams()
    const { adminUser, canEditBlogs } = useAuth()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [form, setForm] = useState(DEFAULT_FORM)
    const [authors, setAuthors] = useState([{ ...DEFAULT_AUTHOR }])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isPreview, setIsPreview] = useState(false)

    // Check permissions
    useEffect(() => {
        if (!canEditBlogs()) {
            navigate('/admin')
        }
    }, [canEditBlogs, navigate])

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            if (!isSupabaseConfigured() || !supabase) return

            const { data } = await supabase
                .from('blog_categories')
                .select('*')
                .order('name')

            setCategories(data || [])
        }

        fetchCategories()
    }, [])

    // Fetch blog if editing
    useEffect(() => {
        const fetchBlog = async () => {
            if (!isEditing || !isSupabaseConfigured() || !supabase) return

            setLoading(true)
            try {
                const { data, error: fetchError } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (fetchError) throw fetchError
                if (!data) throw new Error('Blog not found')

                setForm({
                    title: data.title || '',
                    slug: data.slug || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    cover_image_url: data.cover_image_url || '',
                    cover_image_alt: data.cover_image_alt || '',
                    author_name: data.author_name || '',
                    author_avatar_url: data.author_avatar_url || '',
                    category_id: data.category_id || '',
                    status: data.status || 'draft',
                    is_featured: data.is_featured || false,
                    meta_title: data.meta_title || '',
                    meta_description: data.meta_description || '',
                })
                // Load authors (fallback to legacy single author)
                if (data.authors && data.authors.length > 0) {
                    setAuthors(data.authors)
                } else if (data.author_name) {
                    setAuthors([{ name: data.author_name, role: '', avatar_url: data.author_avatar_url || '', linkedin: '', github: '', twitter: '', website: '' }])
                }
            } catch (err) {
                console.error('Error fetching blog:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [id, isEditing])

    // Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))

        // Auto-generate slug from title
        if (name === 'title' && !isEditing) {
            setForm(prev => ({
                ...prev,
                title: value,
                slug: generateSlug(value),
            }))
        }
    }

    // Handle image uploads
    const handleCoverUpload = (url) => {
        setForm(prev => ({
            ...prev,
            cover_image_url: url,
        }))
    }

    const handleAvatarUpload = (url) => {
        setForm(prev => ({ ...prev, author_avatar_url: url }))
    }

    // --- Multi-author helpers ---
    const handleAuthorChange = (index, field, value) => {
        setAuthors(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))
    }

    const handleAuthorAvatarUpload = (index, url) => {
        setAuthors(prev => prev.map((a, i) => i === index ? { ...a, avatar_url: url } : a))
    }

    const addAuthor = () => {
        setAuthors(prev => [...prev, { ...DEFAULT_AUTHOR }])
    }

    const removeAuthor = (index) => {
        setAuthors(prev => prev.filter((_, i) => i !== index))
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setSaving(true)

        try {
            // Validate required fields
            if (!form.title.trim()) throw new Error('Title is required')
            if (!form.slug.trim()) throw new Error('Slug is required')
            if (!form.excerpt.trim()) throw new Error('Excerpt is required')
            if (!form.content.trim()) throw new Error('Content is required')

            // Validate at least one author has a name
            const validAuthors = authors.filter(a => a.name.trim())
            if (validAuthors.length === 0) throw new Error('At least one author name is required')

            // Check slug uniqueness
            const { data: existingSlug } = await supabase
                .from('blogs')
                .select('id')
                .eq('slug', form.slug)
                .neq('id', id || '00000000-0000-0000-0000-000000000000')
                .single()

            if (existingSlug) {
                throw new Error('A post with this slug already exists')
            }

            // Sync legacy fields from first author
            const primaryAuthor = validAuthors[0]

            const blogData = {
                title: form.title.trim(),
                slug: form.slug.trim(),
                excerpt: form.excerpt.trim(),
                content: form.content.trim(),
                cover_image_url: form.cover_image_url || null,
                cover_image_alt: form.cover_image_alt || null,
                author_name: primaryAuthor.name.trim(),
                author_avatar_url: primaryAuthor.avatar_url || null,
                authors: validAuthors,
                category_id: form.category_id || null,
                status: form.status,
                is_featured: form.is_featured,
                meta_title: form.meta_title || null,
                meta_description: form.meta_description || null,
                updated_at: new Date().toISOString(),
            }

            // Set published_at if publishing for the first time
            if (form.status === 'published' && !isEditing) {
                blogData.published_at = new Date().toISOString()
            }

            let result
            if (isEditing) {
                result = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', id)
                    .select()
                    .single()
            } else {
                blogData.created_at = new Date().toISOString()
                result = await supabase
                    .from('blogs')
                    .insert(blogData)
                    .select()
                    .single()
            }

            if (result.error) throw result.error

            setSuccess(isEditing ? 'Post updated successfully!' : 'Post created successfully!')

            // Redirect after short delay
            setTimeout(() => {
                navigate('/admin')
            }, 1500)
        } catch (err) {
            console.error('Error saving blog:', err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    // Calculate read time
    const calculateReadTime = (content) => {
        const words = content.trim().split(/\s+/).length
        return Math.max(1, Math.ceil(words / 200))
    }

    if (loading) {
        return (
            <Layout>
                <div className={styles.dashboard}>
                    <div className={styles.emptyState}>
                        <div className={styles.spinner} />
                        <p>Loading post...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className={styles.dashboard}>
                {/* Header */}
                <header className={styles.dashboardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={() => navigate('/admin')}
                            title="Back to Dashboard"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className={styles.dashboardTitle}>
                            {isEditing ? 'Edit Post' : 'New Post'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            className={`${styles.filterBtn} ${isPreview ? styles.active : ''}`}
                            onClick={() => setIsPreview(!isPreview)}
                        >
                            {isPreview ? 'Edit Content' : 'Preview Markdown'}
                        </button>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => navigate('/admin')}
                        >
                            Cancel
                        </button>
                    </div>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.editorForm}>
                    {error && (
                        <div className={styles.error}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9v4M9 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className={styles.success}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill="currentColor" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className={styles.editorGrid}>
                        <div className={styles.editorMain}>
                            {/* Title */}
                            <div className={styles.field}>
                                <label htmlFor="title">Title *</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className={styles.field}>
                                <label htmlFor="slug">Slug *</label>
                                <input
                                    id="slug"
                                    name="slug"
                                    type="text"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="post-url-slug"
                                    required
                                />
                                <span className={styles.hint}>URL-friendly identifier. Auto-generated from title.</span>
                            </div>

                            {/* Excerpt */}
                            <div className={styles.field}>
                                <label htmlFor="excerpt">Excerpt *</label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    placeholder="Brief summary of the post (shown in listings)"
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div className={styles.field}>
                                <label htmlFor="content">Content *</label>
                                {isPreview ? (
                                    <div className={styles.previewArea}>
                                        <ReactMarkdown>{form.content || '*No content to preview*'}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        placeholder="Write your post content here... (Markdown supported)"
                                        rows={20}
                                        className={styles.contentEditor}
                                        required
                                    />
                                )}
                                <span className={styles.hint}>
                                    Estimated read time: {calculateReadTime(form.content)} min
                                </span>
                            </div>

                            {/* Cover Image */}
                            <div className={styles.field}>
                                <label>Cover Image</label>
                                <ImageUploader
                                    currentUrl={form.cover_image_url}
                                    onUpload={handleCoverUpload}
                                />
                            </div>

                            {/* Cover Image Alt */}
                            <div className={styles.field}>
                                <label htmlFor="cover_image_alt">Cover Image Alt Text</label>
                                <input
                                    id="cover_image_alt"
                                    name="cover_image_alt"
                                    type="text"
                                    value={form.cover_image_alt}
                                    onChange={handleChange}
                                    placeholder="Describe the cover image for accessibility"
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className={styles.editorSidebar}>
                            {/* Status */}
                            <div className={styles.sidebarCard}>
                                <h3>Status</h3>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            {/* Featured */}
                            <div className={styles.sidebarCard}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={form.is_featured}
                                        onChange={handleChange}
                                    />
                                    <span>Featured Post</span>
                                </label>
                                <p className={styles.hint}>Featured posts appear prominently on the homepage</p>
                            </div>

                            {/* Authors — Multi-author support */}
                            <div className={styles.sidebarCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Authors</h3>
                                    <button type="button" className={styles.addAuthorBtn} onClick={addAuthor}>
                                        + Add
                                    </button>
                                </div>

                                {authors.map((author, index) => (
                                    <div key={index} className={styles.authorEntry}>
                                        <div className={styles.authorEntryHeader}>
                                            <span className={styles.authorEntryLabel}>Author {authors.length > 1 ? index + 1 : ''}</span>
                                            {authors.length > 1 && (
                                                <button type="button" className={styles.removeAuthorBtn} onClick={() => removeAuthor(index)}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        <div className={styles.field}>
                                            <label>Avatar</label>
                                            <ImageUploader
                                                currentUrl={author.avatar_url}
                                                onUpload={(url) => handleAuthorAvatarUpload(index, url)}
                                                size="compact"
                                                alt={author.name || 'Author avatar'}
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className={styles.field}>
                                            <label>Name *</label>
                                            <input
                                                type="text"
                                                value={author.name}
                                                onChange={e => handleAuthorChange(index, 'name', e.target.value)}
                                                placeholder="Full name"
                                            />
                                        </div>

                                        {/* Role */}
                                        <div className={styles.field}>
                                            <label>Role / Title</label>
                                            <input
                                                type="text"
                                                value={author.role}
                                                onChange={e => handleAuthorChange(index, 'role', e.target.value)}
                                                placeholder="e.g. Founder, Engineer"
                                            />
                                        </div>

                                        {/* Social Links */}
                                        <div className={styles.field}>
                                            <label>Social Links</label>
                                            <div className={styles.socialInputs}>
                                                <div className={styles.socialRow}>
                                                    <span className={styles.socialIcon} title="GitHub">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2c-3.33.72-4.03-1.6-4.03-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0C18 4.68 19 5 19 5c.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                                    </span>
                                                    <input type="url" value={author.github} onChange={e => handleAuthorChange(index, 'github', e.target.value)} placeholder="github.com/username" />
                                                </div>
                                                <div className={styles.socialRow}>
                                                    <span className={styles.socialIcon} title="X / Twitter">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                                    </span>
                                                    <input type="url" value={author.twitter} onChange={e => handleAuthorChange(index, 'twitter', e.target.value)} placeholder="x.com/username" />
                                                </div>
                                                <div className={styles.socialRow}>
                                                    <span className={styles.socialIcon} title="LinkedIn">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                    </span>
                                                    <input type="url" value={author.linkedin} onChange={e => handleAuthorChange(index, 'linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                                                </div>
                                                <div className={styles.socialRow}>
                                                    <span className={styles.socialIcon} title="Website">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                                    </span>
                                                    <input type="url" value={author.website} onChange={e => handleAuthorChange(index, 'website', e.target.value)} placeholder="yoursite.com" />
                                                </div>
                                            </div>
                                        </div>

                                        {index < authors.length - 1 && <div className={styles.authorDivider} />}
                                    </div>
                                ))}
                            </div>

                            {/* Category */}
                            <div className={styles.sidebarCard}>
                                <h3>Category</h3>
                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* SEO */}
                            <div className={styles.sidebarCard}>
                                <h3>SEO</h3>
                                <div className={styles.field}>
                                    <label htmlFor="meta_title">Meta Title</label>
                                    <input
                                        id="meta_title"
                                        name="meta_title"
                                        type="text"
                                        value={form.meta_title}
                                        onChange={handleChange}
                                        placeholder="Custom title for SEO (optional)"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="meta_description">Meta Description</label>
                                    <textarea
                                        id="meta_description"
                                        name="meta_description"
                                        value={form.meta_description}
                                        onChange={handleChange}
                                        placeholder="Custom description for SEO (optional)"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={styles.sidebarCard}>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className={styles.spinner} />
                                            Saving...
                                        </>
                                    ) : (
                                        isEditing ? 'Update Post' : 'Create Post'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}