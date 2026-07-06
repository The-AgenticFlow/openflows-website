import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/organisms/Layout/Layout'
import styles from '../pages/admin/Admin.module.css'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const { signIn, isAuthenticated, isConfigured } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect if already authenticated
    useEffect(() => {
        console.log('[AdminLogin] isAuthenticated check:', isAuthenticated);
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/admin'
            console.log('[AdminLogin] Already authenticated, redirecting to:', from);
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, location])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const result = await signIn(email, password)

            if (result.success) {
                const from = location.state?.from?.pathname || '/admin'
                navigate(from, { replace: true })
            } else {
                setError(result.error || 'Failed to sign in')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isConfigured) {
        return (
            <Layout>
                <div className={styles.loginPage}>
                    <div className={styles.unavailableCard}>
                        <div className={styles.unavailableIcon}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h1>Feature Unavailable</h1>
                        <p>The admin panel is not available at this time. Please try again later or contact support if the issue persists.</p>
                        <a href="/" className={styles.homeLink}>Return to Home</a>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <h1>Admin Login</h1>
                        <p>Sign in to manage your blog content</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9v4M9 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                                autoFocus
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner} />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>Need admin access? Contact your system administrator.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}