import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminWrapper({ children }) {
    const [isClient, setIsClient] = useState(false)
    
    useEffect(() => {
        setIsClient(true)
    }, [])
    
    if (!isClient) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                fontFamily: 'system-ui, sans-serif',
                color: '#666'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p>Loading admin panel...</p>
                </div>
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