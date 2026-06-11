import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import styles from './ProtectedRoute.module.css'

export default function ProtectedRoute({
    children,
    requiredRole = null,
    fallbackPath = '/admin/login'
}) {
    const { isAuthenticated, loading, isConfigured, adminUser } = useAuth()
    const location = useLocation()


    // Show loading state
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading (Auth Context)...</p>
            </div>
        )
    }

    // If Supabase is not configured, show a professional unavailable message
    if (!isConfigured) {
        return (
            <div className={styles.unavailable}>
                <div className={styles.unavailableIcon}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h2>Feature Unavailable</h2>
                <p>The admin panel is not available at this time. Please try again later or contact support if the issue persists.</p>
                <a href="/" className={styles.homeLink}>Return to Home</a>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />
    }

    // Check if user has admin profile
    if (!adminUser) {
        return (
            <div className={styles.error}>
                <h2>Access Denied</h2>
                <p>Your account does not have admin privileges. Please contact an administrator.</p>
            </div>
        )
    }

    // Check role-based access
    if (requiredRole) {
        const roleHierarchy = { admin: 3, editor: 2, viewer: 1 }
        const userRoleLevel = roleHierarchy[adminUser.role] || 0
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0

        if (userRoleLevel < requiredRoleLevel) {
            return (
                <div className={styles.error}>
                    <h2>Insufficient Permissions</h2>
                    <p>You need <strong>{requiredRole}</strong> role to access this page.</p>
                    <p>Your current role: <strong>{adminUser.role}</strong></p>
                </div>
            )
        }
    }

    return children
}