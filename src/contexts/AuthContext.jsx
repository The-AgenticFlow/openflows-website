import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const AuthContext = createContext(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [adminUser, setAdminUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Check if Supabase is configured
    const isConfigured = isSupabaseConfigured()

    // Fetch admin user data from admin_users table by email
    const fetchAdminUser = useCallback(async (userEmail) => {
        if (!supabase || !userEmail) {
            console.log('[AuthContext] fetchAdminUser: No supabase or email');
            return null;
        }

        console.log('[AuthContext] fetchAdminUser: Fetching for', userEmail);
        try {
            // Add a timeout to the request to prevent hanging indefinitely
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Fetch admin user timeout')), 5000)
            );

            const fetchPromise = supabase
                .from('admin_users')
                .select('*')
                .eq('email', userEmail)
                .eq('is_active', true)
                .single();

            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

            if (error) {
                console.warn('[AuthContext] fetchAdminUser: Error or not found:', error.message);
                return null;
            }
            
            console.log('[AuthContext] fetchAdminUser: Success');
            return data
        } catch (err) {
            console.error('[AuthContext] fetchAdminUser: Caught error:', err.message)
            return null
        }
    }, [])

    // Initialize auth state
    useEffect(() => {
        if (!isConfigured) {
            console.log('[AuthContext] Initializing: Supabase not configured');
            setLoading(false)
            return
        }

        console.log('[AuthContext] Initializing: Configured, getting session...');

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) throw error

                if (session?.user) {
                    console.log('[AuthContext] getInitialSession: User found', session.user.email);
                    setUser(session.user)
                    const adminData = await fetchAdminUser(session.user.email)
                    setAdminUser(adminData)
                } else {
                    console.log('[AuthContext] getInitialSession: No session');
                }
            } catch (err) {
                console.error('[AuthContext] getInitialSession: Error getting session:', err)
                setError(err.message)
            } finally {
                console.log('[AuthContext] getInitialSession: Setting loading false');
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[AuthContext] onAuthStateChange event:', event);
                
                if (session?.user) {
                    setUser(session.user)
                    // If we're signing in, we want to make sure we have the admin data before we stop loading
                    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                        setLoading(true); // Ensure loading is true while we fetch admin data
                        const adminData = await fetchAdminUser(session.user.email)
                        setAdminUser(adminData)
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setAdminUser(null)
                }

                console.log('[AuthContext] onAuthStateChange: Setting loading false');
                setLoading(false)
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, [isConfigured, fetchAdminUser])

    // Sign in with email/password
    const signIn = useCallback(async (email, password) => {
        if (!isConfigured) {
            throw new Error('Supabase is not configured. Please set up your environment variables.')
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            setUser(data.user)
            const adminData = await fetchAdminUser(data.user.email)
            setAdminUser(adminData)

            return { success: true, user: data.user, adminUser: adminData }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [isConfigured, fetchAdminUser])

    // Sign out
    const signOut = useCallback(async () => {
        if (!isConfigured) return

        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            setUser(null)
            setAdminUser(null)
        } catch (err) {
            console.error('Error signing out:', err)
            setError(err.message)
        }
    }, [isConfigured])

    // Check if user has specific role
    const hasRole = useCallback((role) => {
        if (!adminUser) return false
        if (adminUser.role === 'admin') return true
        return adminUser.role === role
    }, [adminUser])

    // Check if user can edit blogs
    const canEditBlogs = useCallback(() => {
        return hasRole('admin') || hasRole('editor')
    }, [hasRole])

    // Check if user can delete blogs
    const canDeleteBlogs = useCallback(() => {
        return hasRole('admin')
    }, [hasRole])

    const value = {
        user,
        adminUser,
        loading,
        error,
        isConfigured,
        isAuthenticated: !!user,
        isAdmin: adminUser?.role === 'admin',
        isEditor: adminUser?.role === 'editor',
        isViewer: adminUser?.role === 'viewer',
        signIn,
        signOut,
        hasRole,
        canEditBlogs,
        canDeleteBlogs,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}