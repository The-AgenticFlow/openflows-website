import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import styles from '../pages/admin/Admin.module.css'

export default function CategoryManager() {
    const { adminUser, isAdmin } = useAuth()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ name: '', slug: '', description: '' })

    // Check permissions - only admins can manage categories
    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin')
        }
    }, [isAdmin, navigate])

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const { data, error: fetchError } = await supabase
                    .from('blog_categories')
                    .select('*')
                    .order('name')

                if (fetchError) throw fetchError
                setCategories(data || [])
            } catch (err) {
                console.error('Error fetching categories:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Generate slug from name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' && !editingId ? { slug: generateSlug(value) } : {}),
        }))
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setSaving(true)

        try {
            if (!form.name.trim()) throw new Error('Category name is required')
            if (!form.slug.trim()) throw new Error('Slug is required')

            // Check slug uniqueness
            const { data: existingSlug } = await supabase
                .from('blog_categories')
                .select('id')
                .eq('slug', form.slug)
                .neq('id', editingId || '00000000-0000-0000-0000-000000000000')
                .single()

            if (existingSlug) {
                throw new Error('A category with this slug already exists')
            }

            const categoryData = {
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim() || null,
                updated_at: new Date().toISOString(),
            }

            let result
            if (editingId) {
                result = await supabase
                    .from('blog_categories')
                    .update(categoryData)
                    .eq('id', editingId)
                    .select()
                    .single()
            } else {
                categoryData.created_at = new Date().toISOString()
                result = await supabase
                    .from('blog_categories')
                    .insert(categoryData)
                    .select()
                    .single()
            }

            if (result.error) throw result.error

            setSuccess(editingId ? 'Category updated successfully!' : 'Category created successfully!')
            setShowForm(false)
            setEditingId(null)
            setForm({ name: '', slug: '', description: '' })

            // Refresh categories
            const { data } = await supabase
                .from('blog_categories')
                .select('*')
                .order('name')
            setCategories(data || [])

            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error saving category:', err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    // Handle edit
    const handleEdit = (category) => {
        setForm({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        })
        setEditingId(category.id)
        setShowForm(true)
    }

    // Handle delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category? Posts in this category will have their category set to null.')) {
            return
        }

        setError(null)
        setSuccess(null)
        setSaving(true)

        try {
            const { error: deleteError } = await supabase
                .from('blog_categories')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            setSuccess('Category deleted successfully!')
            setCategories(prev => prev.filter(c => c.id !== id))

            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error deleting category:', err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    // Cancel editing
    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setForm({ name: '', slug: '', description: '' })
    }

    if (loading) {
        return (
            <Layout>
                <div className={styles.dashboard}>
                    <div className={styles.emptyState}>
                        <div className={styles.spinner} />
                        <p>Loading categories...</p>
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
                        <h1 className={styles.dashboardTitle}>Manage Categories</h1>
                    </div>
                    <button
                        type="button"
                        className={styles.submitBtn}
                        onClick={() => setShowForm(true)}
                    >
                        + Add Category
                    </button>
                </header>

                {/* Messages */}
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

                {/* Add/Edit Form */}
                {showForm && (
                    <div className={styles.editorForm} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label htmlFor="name">Name *</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Category name"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="slug">Slug *</label>
                                <input
                                    id="slug"
                                    name="slug"
                                    type="text"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="category-slug"
                                    required
                                />
                                <span className={styles.hint}>URL-friendly identifier. Auto-generated from name.</span>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of this category"
                                    rows={3}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className={styles.submitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
                                </button>
                                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories List */}
                <div className={styles.editorForm}>
                    <h2 style={{ marginBottom: '1.5rem' }}>All Categories ({categories.length})</h2>
                    {categories.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No categories yet. Add your first category above.</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.id}>
                                            <td><strong>{cat.name}</strong></td>
                                            <td><code>{cat.slug}</code></td>
                                            <td>{cat.description || ' - '}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        type="button"
                                                        className={styles.actionBtn}
                                                        onClick={() => handleEdit(cat)}
                                                        title="Edit"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                        onClick={() => handleDelete(cat.id)}
                                                        title="Delete"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
