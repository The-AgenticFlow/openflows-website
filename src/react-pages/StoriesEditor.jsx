import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import ImageUploader from '@/components/ImageUploader'
import styles from '../pages/admin/Admin.module.css'

export default function StoriesEditor({ storyId }) {
    const { id } = useParams()
    const storyIdProp = storyId || id
    const { adminUser, canEditBlogs } = useAuth()
    const navigate = useNavigate()
    const isEditing = Boolean(storyIdProp)

    const [form, setForm] = useState({
        title: '',
        category: '',
        date: '',
        href: '',
        image: '',
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
        const fetchStory = async () => {
            if (!isEditing || !isSupabaseConfigured() || !supabase) return

            setLoading(true)
            try {
                const { data, error: fetchError } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('id', storyIdProp)
                    .single()

                if (fetchError) throw fetchError
                if (!data) throw new Error('Story not found')

                setForm({
                    title: data.title || '',
                    category: data.category || '',
                    date: data.date || '',
                    href: data.href || '',
                    image: data.image || '',
                })
            } catch (err) {
                console.error('Error fetching story:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStory()
    }, [storyIdProp, isEditing])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setSaving(true)

        try {
            if (!form.title.trim()) throw new Error('Title is required')
            if (!form.category.trim()) throw new Error('Category is required')
            if (!form.date.trim()) throw new Error('Date is required')
            if (!form.href.trim()) throw new Error('Link is required')

            const storyData = {
                title: form.title.trim(),
                category: form.category.trim(),
                date: form.date.trim(),
                href: form.href.trim(),
                image: form.image.trim() || null,
            }

            let result
            if (isEditing) {
                result = await supabase
                    .from('stories')
                    .update({ ...storyData, updated_at: new Date().toISOString() })
                    .eq('id', storyIdProp)
            } else {
                result = await supabase
                    .from('stories')
                    .insert({ ...storyData, created_at: new Date().toISOString() })
            }

            if (result.error) throw result.error

            setSuccess(isEditing ? 'Story updated successfully!' : 'Story created successfully!')
            setTimeout(() => navigate('/admin/stories'), 1500)
        } catch (err) {
            console.error('Error saving story:', err)
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
                        <p>Loading story...</p>
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
                        <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={() => navigate('/admin/stories')}
                            title="Back"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className={styles.dashboardTitle}>
                            {isEditing ? 'Edit Story' : 'New Story'}
                        </h1>
                    </div>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => navigate('/admin/stories')}
                    >
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
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Story headline"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="category">Category *</label>
                                <input
                                    id="category"
                                    name="category"
                                    type="text"
                                    value={form.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Startup, DevOps, Open Source"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="date">Date *</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="text"
                                    value={form.date}
                                    onChange={handleChange}
                                    placeholder="e.g. May 2026"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="href">Link *</label>
                                <input
                                    id="href"
                                    name="href"
                                    type="text"
                                    value={form.href}
                                    onChange={handleChange}
                                    placeholder="/use-cases/web-development or https://..."
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Image</label>
                                <ImageUploader
                                    currentUrl={form.image}
                                    onUpload={(url) => setForm(prev => ({ ...prev, image: url }))}
                                    alt={form.title}
                                />
                                {!form.image && (
                                    <span className={styles.hint}>Optional — leave blank for a placeholder. You can also paste an image URL below.</span>
                                )}
                                <input
                                    id="image"
                                    name="image"
                                    type="url"
                                    value={form.image}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                        </div>

                        <div className={styles.editorSidebar}>
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
                                        isEditing ? 'Update Story' : 'Create Story'
                                    )}
                                </button>
                            </div>

                            <div className={styles.sidebarCard}>
                                <p className={styles.hint}>
                                    Stories appear in the Stories section on the home page.
                                    They need a title, category, date, and link.
                                    The image is optional - leave blank for a placeholder.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
