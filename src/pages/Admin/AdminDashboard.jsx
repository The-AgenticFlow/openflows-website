import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import styles from './Admin.module.css'

const STATUS_FILTERS = [
    { value: 'all', label: 'All Posts' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'archived', label: 'Archived' },
]

export default function AdminDashboard() {
    const { user, adminUser, signOut, canEditBlogs, canDeleteBlogs } = useAuth()
    const navigate = useNavigate()

    // State
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [deleteModal, setDeleteModal] = useState({ open: false, blog: null })
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, archived: 0 })

    // Fetch blogs
    const fetchBlogs = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            let query = supabase
                .from('blogs')
                .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image_url,
          status,
          published_at,
          created_at,
          view_count,
          is_featured,
          category:blog_categories(name, slug)
        `)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            // Apply status filter
            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter)
            }

            // Apply search filter
            if (searchQuery.trim()) {
                query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError
            setBlogs(data || [])

            // Fetch stats
            const { data: statsData } = await supabase
                .from('blogs')
                .select('status')
                .is('deleted_at', null)

            if (statsData) {
                setStats({
                    total: statsData.length,
                    published: statsData.filter(b => b.status === 'published').length,
                    drafts: statsData.filter(b => b.status === 'draft').length,
                    archived: statsData.filter(b => b.status === 'archived').length,
                })
            }
        } catch (err) {
            console.error('Error fetching blogs:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [statusFilter, searchQuery])

    useEffect(() => {
        fetchBlogs()
    }, [fetchBlogs])

    // Handle delete
    const handleDelete = async (blog) => {
        if (!canDeleteBlogs()) return

        try {
            const { error } = await supabase
                .from('blogs')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', blog.id)

            if (error) throw error

            setBlogs(blogs.filter(b => b.id !== blog.id))
            setDeleteModal({ open: false, blog: null })
        } catch (err) {
            console.error('Error deleting blog:', err)
            setError(err.message)
        }
    }

    // Handle status toggle
    const handleToggleStatus = async (blog) => {
        if (!canEditBlogs()) return

        const newStatus = blog.status === 'published' ? 'draft' : 'published'

        try {
            const updates = {
                status: newStatus,
                updated_at: new Date().toISOString(),
            }

            if (newStatus === 'published' && !blog.published_at) {
                updates.published_at = new Date().toISOString()
            }

            const { error } = await supabase
                .from('blogs')
                .update(updates)
                .eq('id', blog.id)

            if (error) throw error

            setBlogs(blogs.map(b =>
                b.id === blog.id
                    ? { ...b, status: newStatus, published_at: updates.published_at || b.published_at }
                    : b
            ))
        } catch (err) {
            console.error('Error updating blog status:', err)
            setError(err.message)
        }
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '—'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    // Get user initials
    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <Layout>
            <div className={styles.dashboard}>
                {/* Header */}
                <header className={styles.dashboardHeader}>
                    <h1 className={styles.dashboardTitle}>Blog Management</h1>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {getInitials(adminUser?.display_name || user?.email)}
                        </div>
                        <div>
                            <p className={styles.userName}>{adminUser?.display_name || 'Admin'}</p>
                            <p className={styles.userRole}>{adminUser?.role || 'viewer'}</p>
                        </div>
                        <button onClick={signOut} className={styles.logoutBtn}>
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Total Posts</p>
                        <p className={styles.statValue}>{stats.total}</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Published</p>
                        <p className={styles.statValue}>{stats.published}</p>
                        <p className={`${styles.statChange} positive`}>Live</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Drafts</p>
                        <p className={styles.statValue}>{stats.drafts}</p>
                        <p className={styles.statChange}>Pending review</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Archived</p>
                        <p className={styles.statValue}>{stats.archived}</p>
                        <p className={styles.statChange}>Hidden</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        {STATUS_FILTERS.map(filter => (
                            <button
                                key={filter.value}
                                className={`${styles.filterBtn} ${statusFilter === filter.value ? styles.active : ''}`}
                                onClick={() => setStatusFilter(filter.value)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {canEditBlogs() && (
                        <button
                            className={styles.newPostBtn}
                            onClick={() => navigate('/admin/blog/new')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Post
                        </button>
                    )}
                </div>

                {/* Blog List */}
                <div className={styles.blogList}>
                    {loading ? (
                        <div className={styles.emptyState}>
                            <div className={styles.spinner} />
                            <p>Loading posts...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.emptyState}>
                            <p className={styles.error}>{error}</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                                <path d="M12 8v8M8 12h8" />
                            </svg>
                            <h3>No posts found</h3>
                            <p>Create your first blog post to get started.</p>
                            {canEditBlogs() && (
                                <button
                                    className={styles.newPostBtn}
                                    onClick={() => navigate('/admin/blog/new')}
                                >
                                    Create Post
                                </button>
                            )}
                        </div>
                    ) : (
                        blogs.map(blog => (
                            <div key={blog.id} className={styles.blogItem}>
                                {blog.cover_image_url ? (
                                    <img
                                        src={blog.cover_image_url}
                                        alt={blog.title}
                                        className={styles.blogImage}
                                    />
                                ) : (
                                    <div className={styles.blogImage} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="m21 15-5-5L5 21" />
                                        </svg>
                                    </div>
                                )}

                                <div className={styles.blogContent}>
                                    <h3 className={styles.blogTitle}>
                                        {blog.title}
                                        {blog.is_featured && (
                                            <span className={styles.blogCategory}>Featured</span>
                                        )}
                                    </h3>
                                    <p className={styles.blogExcerpt}>{blog.excerpt}</p>
                                    <div className={styles.blogMeta}>
                                        <span className={`${styles.blogStatus} ${styles[blog.status]}`}>
                                            {blog.status}
                                        </span>
                                        {blog.category && (
                                            <span>{blog.category.name}</span>
                                        )}
                                        <span>{formatDate(blog.published_at || blog.created_at)}</span>
                                        <span>{blog.view_count || 0} views</span>
                                    </div>
                                </div>

                                <div className={styles.blogActions}>
                                    {canEditBlogs() && (
                                        <>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleToggleStatus(blog)}
                                                title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                            >
                                                {blog.status === 'published' ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                        <line x1="1" y1="1" x2="23" y2="23" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                                                title="Edit"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    {canDeleteBlogs() && (
                                        <button
                                            className={`${styles.actionBtn} ${styles.danger}`}
                                            onClick={() => setDeleteModal({ open: true, blog })}
                                            title="Delete"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModal.open && (
                    <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, blog: null })}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Delete Post</h2>
                            </div>
                            <div className={styles.modalBody}>
                                <p>
                                    Are you sure you want to delete <strong>{deleteModal.blog?.title}</strong>?
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setDeleteModal({ open: false, blog: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={() => handleDelete(deleteModal.blog)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}