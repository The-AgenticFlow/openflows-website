import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import ImageUploader from '@/components/ImageUploader'
import styles from './Admin.module.css'

export default function ResearchEditor() {
    const { id } = useParams()
    const { adminUser, canEditBlogs } = useAuth()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [form, setForm] = useState({
        title: '',
        slug: '',
        abstract: '',
        content: '',
        category: 'Paper',
        venue: '',
        publish_date: '',
        pdf_url: '',
        cover_image_url: '',
        tags: '',
        authors: [{ name: '', affiliation: '' }],
        status: 'draft',
    })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        if (!canEditBlogs()) {
            navigate('/admin')
        }
    }, [canEditBlogs, navigate])

    useEffect(() => {
        const fetchResearch = async () => {
            if (!isEditing || !isSupabaseConfigured() || !supabase) return

            setLoading(true)
            try {
                const { data, error: fetchError } = await supabase
                    .from('research')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (fetchError) throw fetchError
                if (!data) throw new Error('Publication not found')

                setForm({
                    title: data.title || '',
                    slug: data.slug || '',
                    abstract: data.abstract || '',
                    content: data.content || '',
                    category: data.category || 'Paper',
                    venue: data.venue || '',
                    publish_date: data.publish_date ? data.publish_date.slice(0, 10) : '',
                    pdf_url: data.pdf_url || '',
                    cover_image_url: data.cover_image_url || '',
                    tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                    authors: Array.isArray(data.authors) && data.authors.length > 0 ? data.authors : [{ name: '', affiliation: '' }],
                    status: data.status || 'draft',
                })
            } catch (err) {
                console.error('Error fetching research:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchResearch()
    }, [id, isEditing])

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: name === 'title' && !isEditing ? { title: value, slug: generateSlug(value) } : {},
            [name]: value,
        }))

        if (name === 'title' && !isEditing) {
            setForm(prev => ({ ...prev, slug: generateSlug(value) }))
        }
    }

    const handleAuthorChange = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            authors: prev.authors.map((a, i) => i === index ? { ...a, [field]: value } : a)
        }))
    }

    const addAuthor = () => {
        setForm(prev => ({ ...prev, authors: [...prev.authors, { name: '', affiliation: '' }] }))
    }

    const removeAuthor = (index) => {
        setForm(prev => ({ ...prev, authors: prev.authors.filter((_, i) => i !== index) }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setSaving(true)

        try {
            if (!form.title.trim()) throw new Error('Title is required')
            if (!form.slug.trim()) throw new Error('Slug is required')
            if (!form.abstract.trim()) throw new Error('Abstract is required')
            if (!form.content.trim()) throw new Error('Content is required')

            const validAuthors = form.authors.filter(a => a.name.trim())

            const payload = {
                title: form.title.trim(),
                slug: form.slug.trim(),
                abstract: form.abstract.trim(),
                content: form.content.trim(),
                category: form.category.trim() || 'Paper',
                venue: form.venue.trim() || '',
                publish_date: form.publish_date ? new Date(form.publish_date).toISOString() : new Date().toISOString(),
                pdf_url: form.pdf_url.trim() || null,
                cover_image_url: form.cover_image_url.trim() || null,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                authors: validAuthors,
                status: form.status || 'draft',
            }

            let result
            if (isEditing) {
                result = await supabase
                    .from('research')
                    .update({ ...payload, updated_at: new Date().toISOString() })
                    .eq('id', id)
            } else {
                result = await supabase
                    .from('research')
                    .insert({ ...payload, created_at: new Date().toISOString() })
            }

            if (result.error) throw result.error

            setSuccess(isEditing ? 'Publication updated successfully!' : 'Publication created successfully!')
            setTimeout(() => navigate('/admin/research'), 1500)
        } catch (err) {
            console.error('Error saving research:', err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className={styles.dashboard}>
                    <div className={styles.emptyState}>
                        <div className={styles.spinner} />
                        <p>Loading publication...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className={styles.dashboard}>
                <header className={styles.dashboardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/research')} title="Back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className={styles.dashboardTitle}>
                            {isEditing ? 'Edit Publication' : 'New Publication'}
                        </h1>
                    </div>
                    <button className={styles.cancelBtn} onClick={() => navigate('/admin/research')}>
                        Cancel
                    </button>
                </header>

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

                    <div className={styles.editorGrid}>
                        <div className={styles.editorMain}>
                            <div className={styles.field}>
                                <label htmlFor="title">Title *</label>
                                <input id="title" name="title" type="text" value={form.title} onChange={handleChange} placeholder="Publication title" required />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="slug">Slug *</label>
                                <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange} placeholder="url-friendly-slug" required />
                                <span className={styles.hint}>URL-friendly identifier.</span>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="abstract">Abstract *</label>
                                <textarea id="abstract" name="abstract" value={form.abstract} onChange={handleChange} placeholder="Short abstract shown in listings" rows={4} required />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="content">Content *</label>
                                <textarea id="content" name="content" value={form.content} onChange={handleChange} placeholder="Full publication content (Markdown supported)" rows={20} className={styles.contentEditor} required />
                            </div>
                        </div>

                        <div className={styles.editorSidebar}>
                            <div className={styles.sidebarCard}>
                                <button type="submit" className={styles.submitBtn} disabled={saving}>
                                    {saving ? (
                                        <><span className={styles.spinner} /> Saving...</>
                                    ) : (
                                        isEditing ? 'Update Publication' : 'Create Publication'
                                    )}
                                </button>
                            </div>

                            <div className={styles.sidebarCard}>
                                <h3>Metadata</h3>
                                <div className={styles.field}>
                                    <label htmlFor="status">Status</label>
                                    <select id="status" name="status" value={form.status} onChange={handleChange} className={styles.select}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="category">Category</label>
                                    <select id="category" name="category" value={form.category} onChange={handleChange} className={styles.select}>
                                        <option>Paper</option>
                                        <option>Preprint</option>
                                        <option>Technical Report</option>
                                        <option>Blog Post</option>
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="venue">Venue</label>
                                    <input id="venue" name="venue" type="text" value={form.venue} onChange={handleChange} placeholder="e.g. arXiv, NeurIPS" />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="publish_date">Publish Date</label>
                                    <input id="publish_date" name="publish_date" type="date" value={form.publish_date} onChange={handleChange} />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="pdf_url">PDF URL</label>
                                    <input id="pdf_url" name="pdf_url" type="url" value={form.pdf_url} onChange={handleChange} placeholder="https://arxiv.org/pdf/..." />
                                </div>

                                <div className={styles.field}>
                                    <label>Cover Image</label>
                                    <ImageUploader
                                        currentUrl={form.cover_image_url}
                                        onUpload={(url) => setForm(prev => ({ ...prev, cover_image_url: url }))}
                                        alt={form.title}
                                        size="compact"
                                    />
                                    <input id="cover_image_url" name="cover_image_url" type="url" value={form.cover_image_url} onChange={handleChange} placeholder="Or paste an image URL" style={{ marginTop: '0.5rem' }} />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="tags">Tags</label>
                                    <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="multi-agent, rust, LLM (comma-separated)" />
                                </div>
                            </div>

                            <div className={styles.sidebarCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Authors</h3>
                                    <button type="button" className={styles.addAuthorBtn} onClick={addAuthor}>+ Add</button>
                                </div>
                                {form.authors.map((author, index) => (
                                    <div key={index} className={styles.authorEntry} style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span className={styles.authorEntryLabel}>Author {index + 1}</span>
                                            {form.authors.length > 1 && (
                                                <button type="button" className={styles.removeAuthorBtn} onClick={() => removeAuthor(index)}>Remove</button>
                                            )}
                                        </div>
                                        <div className={styles.field}>
                                            <input type="text" value={author.name} onChange={e => handleAuthorChange(index, 'name', e.target.value)} placeholder="Full name" />
                                        </div>
                                        <div className={styles.field}>
                                            <input type="text" value={author.affiliation} onChange={e => handleAuthorChange(index, 'affiliation', e.target.value)} placeholder="Affiliation" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
