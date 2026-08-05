import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminWrapper({ children }) {
    const [isClient, setIsClient] = useState(false)
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setIsClient(true)
        setMounted(true)
    }, [])
    
    if (!mounted) {
        return null
    }
    
    if (!isClient) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontFamily: 'system-ui, sans-serif',
                background: '#f9fafb',
                color: '#374151'
            }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1.5rem'
                    }} />
                    <p style={{ fontSize: '1.125rem', margin: 0 }}>Loading admin panel...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }
    
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
            </AuthProvider>
        </BrowserRouter>
    )
}