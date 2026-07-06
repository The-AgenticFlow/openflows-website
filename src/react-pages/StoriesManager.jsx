import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import styles from '../pages/admin/Admin.module.css'

export default function StoriesManager() {
    const { user, adminUser, signOut, canEditBlogs, canDeleteBlogs } = useAuth()
    const navigate = useNavigate()

    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteModal, setDeleteModal] = useState({ open: false, story: null })

    const fetchStories = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError
            setStories(data || [])
        } catch (err) {
            console.error('Error fetching stories:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStories()
    }, [fetchStories])

    const handleDelete = async (story) => {
        if (!canDeleteBlogs()) return

        try {
            const { error } = await supabase
                .from('stories')
                .delete()
                .eq('id', story.id)

            if (error) throw error
            setStories(stories.filter(s => s.id !== story.id))
            setDeleteModal({ open: false, story: null })
        } catch (err) {
            console.error('Error deleting story:', err)
            setError(err.message)
        }
    }

    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <Layout>
            <div className={styles.dashboard}>
                {/* Header */}
                <header className={styles.dashboardHeader}>
                    <h1 className={styles.dashboardTitle}>Story Management</h1>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {getInitials(adminUser?.display_name || user?.email)}
                        </div>
                        <div>
                            <p className={styles.userName}>{adminUser?.display_name || 'Admin'}</p>
                            <p className={styles.userRole}>{adminUser?.role || 'viewer'}</p>
                        </div>
                        <button onClick={signOut} className={styles.logoutBtn}>Sign Out</button>
                    </div>
                </header>

                {/* Back link */}
                <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-driftwood)' }}>
                    <button className={styles.actionBtn} onClick={() => navigate('/admin')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <span style={{ color: 'var(--color-graphite)', fontSize: '0.875rem' }}>
                        {stories.length} stories
                    </span>
                    {canEditBlogs() && (
                        <button
                            className={styles.newPostBtn}
                            onClick={() => navigate('/admin/stories/new')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Story
                        </button>
                    )}
                </div>

                {/* Stories List */}
                <div className={styles.blogList}>
                    {loading ? (
                        <div className={styles.emptyState}>
                            <div className={styles.spinner} />
                            <p>Loading stories...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.emptyState}>
                            <p className={styles.error}>{error}</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No stories found</h3>
                            <p>Create your first story to display on the home page.</p>
                            {canEditBlogs() && (
                                <button
                                    className={styles.newPostBtn}
                                    onClick={() => navigate('/admin/stories/new')}
                                >
                                    Create Story
                                </button>
                            )}
                        </div>
                    ) : (
                        stories.map(story => (
                            <div key={story.id} className={styles.blogItem}>
                                {story.image ? (
                                    <img src={story.image} alt={story.title} className={styles.blogImage} />
                                ) : (
                                    <div className={styles.blogImage} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-graphite)'
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="m21 15-5-5L5 21" />
                                        </svg>
                                    </div>
                                )}

                                <div className={styles.blogContent}>
                                    <h3 className={styles.blogTitle}>{story.title}</h3>
                                    <div className={styles.blogMeta}>
                                        <span className={styles.blogCategory}>{story.category}</span>
                                        <span>{story.date}</span>
                                        <span>{story.href}</span>
                                    </div>
                                </div>

                                <div className={styles.blogActions}>
                                    {canEditBlogs() && (
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => navigate(`/admin/stories/edit/${story.id}`)}
                                            title="Edit"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    )}
                                    {canDeleteBlogs() && (
                                        <button
                                            className={`${styles.actionBtn} ${styles.danger}`}
                                            onClick={() => setDeleteModal({ open: true, story })}
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
                    <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, story: null })}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Delete Story</h2>
                            </div>
                            <div className={styles.modalBody}>
                                <p>
                                    Are you sure you want to delete <strong>{deleteModal.story?.title}</strong>?
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setDeleteModal({ open: false, story: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={() => handleDelete(deleteModal.story)}
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
