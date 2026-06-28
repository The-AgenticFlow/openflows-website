import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Layout from '@/organisms/Layout/Layout'
import styles from './Admin.module.css'

export default function ResearchManager() {
    const { user, adminUser, signOut, canEditBlogs, canDeleteBlogs } = useAuth()
    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteModal, setDeleteModal] = useState({ open: false, item: null })

    const fetchItems = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('research')
                .select('*')
                .order('publish_date', { ascending: false })

            if (fetchError) throw fetchError
            setItems(data || [])
        } catch (err) {
            console.error('Error fetching research:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    const handleDelete = async (item) => {
        if (!canDeleteBlogs()) return

        try {
            const { error } = await supabase
                .from('research')
                .delete()
                .eq('id', item.id)

            if (error) throw error
            setItems(items.filter(i => i.id !== item.id))
            setDeleteModal({ open: false, item: null })
        } catch (err) {
            console.error('Error deleting research:', err)
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
                <header className={styles.dashboardHeader}>
                    <h1 className={styles.dashboardTitle}>Research Management</h1>
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

                <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className={styles.actionBtn} onClick={() => navigate('/')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        {items.length} publications
                    </span>
                </div>

                <div className={styles.toolbar}>
                    {canEditBlogs() && (
                        <button
                            className={styles.newPostBtn}
                            onClick={() => navigate('/research/new')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Publication
                        </button>
                    )}
                </div>

                <div className={styles.blogList}>
                    {loading ? (
                        <div className={styles.emptyState}>
                            <div className={styles.spinner} />
                            <p>Loading publications...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.emptyState}>
                            <p className={styles.error}>{error}</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No publications found</h3>
                            <p>Create your first research publication.</p>
                            {canEditBlogs() && (
                                <button
                                    className={styles.newPostBtn}
                                    onClick={() => navigate('/research/new')}
                                >
                                    Create Publication
                                </button>
                            )}
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className={styles.blogItem}>
                                <div className={styles.blogContent} style={{ flex: 1 }}>
                                    <h3 className={styles.blogTitle}>{item.title}</h3>
                                    <div className={styles.blogMeta}>
                                        <span className={styles.blogCategory}>{item.category}</span>
                                        <span>{item.venue}</span>
                                        <span>{item.publish_date}</span>
                                    </div>
                                </div>

                                <div className={styles.blogActions}>
                                    {canEditBlogs() && (
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => navigate(`/research/edit/${item.id}`)}
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
                                            onClick={() => setDeleteModal({ open: true, item })}
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
                    <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, item: null })}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Delete Publication</h2>
                            </div>
                            <div className={styles.modalBody}>
                                <p>
                                    Are you sure you want to delete <strong>{deleteModal.item?.title}</strong>?
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setDeleteModal({ open: false, item: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={() => handleDelete(deleteModal.item)}
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
