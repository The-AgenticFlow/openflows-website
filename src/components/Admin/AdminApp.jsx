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
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/admin" replace />;
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
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
}

// Main Admin App component
export default function AdminApp() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AdminRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
