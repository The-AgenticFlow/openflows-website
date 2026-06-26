import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import BlogEditor from './BlogEditor';
import CategoryManager from './CategoryManager';
import ResearchManager from './ResearchManager';
import ResearchEditor from './ResearchEditor';
import StoriesManager from './StoriesManager';
import StoriesEditor from './StoriesEditor';
import styles from './Admin.module.css';

// Protected Route component
function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, adminUser, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loadingContainer">
                <div className="spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Use window.location for full page redirect to Astro route
        window.location.href = `/admin/login?from=${encodeURIComponent(location.pathname)}`;
        return (
            <div className="loadingContainer">
                <div className="spinner" />
                <p>Redirecting to login...</p>
            </div>
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

// Admin routes with navigation
function AdminRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/blog/new"
                element={
                    <ProtectedRoute requiredRole="editor">
                        <BlogEditor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/blog/edit/:id"
                element={
                    <ProtectedRoute requiredRole="editor">
                        <BlogEditor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <CategoryManager />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/research"
                element={
                    <ProtectedRoute>
                        <ResearchManager />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/research/new"
                element={
                    <ProtectedRoute requiredRole="editor">
                        <ResearchEditor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/research/edit/:id"
                element={
                    <ProtectedRoute requiredRole="editor">
                        <ResearchEditor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stories"
                element={
                    <ProtectedRoute>
                        <StoriesManager />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stories/new"
                element={
                    <ProtectedRoute requiredRole="editor">
                        <StoriesEditor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stories/edit/:id"
                element={
                    <ProtectedRoute requiredRole="editor">
                        <StoriesEditor />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

// Unconfigured state component
function UnconfiguredState() {
    return (
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
    );
}

// Main Admin App component
export default function AdminApp() {
    return (
        <BrowserRouter basename="/admin">
            <AuthProvider>
                <AdminAppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

// Inner component that can access AuthContext
function AdminAppContent() {
    const { isConfigured, loading } = useAuth();

    if (loading) {
        return (
            <div className="loadingContainer">
                <div className="spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    if (!isConfigured) {
        return <UnconfiguredState />;
    }

    return <AdminRoutes />;
}
