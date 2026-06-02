import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import ImageUploader from '@/components/ImageUploader'
import ReactMarkdown from 'react-markdown'
import styles from './Admin.module.css'

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

    // Handle image upload
    const handleImageUpload = (url) => {
        setForm(prev => ({
            ...prev,
            cover_image_url: url,
        }))
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
            if (!form.author_name.trim()) throw new Error('Author name is required')

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

            const blogData = {
                title: form.title.trim(),
                slug: form.slug.trim(),
                excerpt: form.excerpt.trim(),
                content: form.content.trim(),
                cover_image_url: form.cover_image_url || null,
                cover_image_alt: form.cover_image_alt || null,
                author_name: form.author_name.trim(),
                author_avatar_url: form.author_avatar_url || null,
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
                                    onUpload={handleImageUpload}
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

                            {/* Author */}
                            <div className={styles.sidebarCard}>
                                <h3>Author</h3>
                                <div className={styles.field}>
                                    <label htmlFor="author_name">Name *</label>
                                    <input
                                        id="author_name"
                                        name="author_name"
                                        type="text"
                                        value={form.author_name}
                                        onChange={handleChange}
                                        placeholder="Author name"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="author_avatar_url">Avatar URL</label>
                                    <input
                                        id="author_avatar_url"
                                        name="author_avatar_url"
                                        type="url"
                                        value={form.author_avatar_url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
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