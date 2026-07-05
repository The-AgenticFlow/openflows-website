import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Context
import { AuthProvider } from '@/contexts/AuthContext'

// Components
import ProtectedRoute from '@/components/ProtectedRoute'

// Existing pages
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Agents from '@/pages/Agents/Agents'
import AgentDetail from '@/pages/AgentDetail/AgentDetail'

// Docs
import DocsHome from '@/pages/Docs/DocsHome'
import GettingStarted from '@/pages/Docs/GettingStarted'
import Installation from '@/pages/Docs/Installation'
import GuidesHome from '@/pages/Docs/GuidesHome'
import AgentSetup from '@/pages/Docs/AgentSetup'

import ArchitectureHome from '@/pages/Docs/ArchitectureHome'
import SystemDesign from '@/pages/Docs/SystemDesign'
import AgentRoles from '@/pages/Docs/AgentRoles'
import Faq from '@/pages/Docs/Faq'

// Blog
import BlogIndex from '@/pages/Blog/BlogIndex'
import BlogPost from '@/pages/Blog/BlogPost'
import IntroducingDemos from '@/pages/Blog/IntroducingDemos'

// Research
import ResearchIndex from '@/pages/Research/ResearchIndex'
import ResearchDetail from '@/pages/Research/ResearchDetail'

// Developer
import Developer from '@/pages/Developer/Developer'

// Admin
import AdminLogin from '@/pages/Admin/AdminLogin'
import AdminDashboard from '@/pages/Admin/AdminDashboard'
import BlogEditor from '@/pages/Admin/BlogEditor'
import StoriesManager from '@/pages/Admin/StoriesManager'
import StoriesEditor from '@/pages/Admin/StoriesEditor'
import ResearchManager from '@/pages/Admin/ResearchManager'
import ResearchEditor from '@/pages/Admin/ResearchEditor'
import CategoryManager from '@/pages/Admin/CategoryManager'

// Demos
import DemosIndex from '@/pages/Demos/DemosIndex'
import Terminal from '@/pages/Demos/Terminal'
import Walkthrough from '@/pages/Demos/Walkthrough'

// Use Cases
import UseCasesIndex from '@/pages/UseCases/UseCasesIndex'
import WebDevelopment from '@/pages/UseCases/WebDevelopment'
import DevOps from '@/pages/UseCases/DevOps'

// 404
import NotFound from '@/pages/NotFound/NotFound'

// Global docs styles (shared across all content pages)
import '@/styles/docs.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Core */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:agentId" element={<AgentDetail />} />

          {/* Docs */}
          <Route path="/docs" element={<DocsHome />} />
          <Route path="/docs/getting-started" element={<GettingStarted />} />
          <Route path="/docs/getting-started/installation" element={<Installation />} />
          <Route path="/docs/guides" element={<GuidesHome />} />
          <Route path="/docs/guides/agent-setup" element={<AgentSetup />} />

          <Route path="/docs/architecture" element={<ArchitectureHome />} />
          <Route path="/docs/architecture/system-design" element={<SystemDesign />} />
          <Route path="/docs/architecture/agent-roles" element={<AgentRoles />} />
          <Route path="/docs/faq" element={<Faq />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/introducing-demos" element={<IntroducingDemos />} />

          {/* Research */}
          <Route path="/research" element={<ResearchIndex />} />
          <Route path="/research/:slug" element={<ResearchDetail />} />

          {/* Developer */}
          <Route path="/developer" element={<Developer />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="viewer">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/new"
            element={
              <ProtectedRoute requiredRole="editor">
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:id"
            element={
              <ProtectedRoute requiredRole="editor">
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stories"
            element={
              <ProtectedRoute requiredRole="viewer">
                <StoriesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stories/new"
            element={
              <ProtectedRoute requiredRole="editor">
                <StoriesEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stories/edit/:id"
            element={
              <ProtectedRoute requiredRole="editor">
                <StoriesEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/research"
            element={
              <ProtectedRoute requiredRole="viewer">
                <ResearchManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/research/new"
            element={
              <ProtectedRoute requiredRole="editor">
                <ResearchEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/research/edit/:id"
            element={
              <ProtectedRoute requiredRole="editor">
                <ResearchEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requiredRole="admin">
                <CategoryManager />
              </ProtectedRoute>
            }
          />

          {/* Demos */}
          <Route path="/demos" element={<DemosIndex />} />
          <Route path="/demos/terminal" element={<Terminal />} />
          <Route path="/demos/walkthrough" element={<Walkthrough />} />

          {/* Use Cases */}
          <Route path="/use-cases" element={<UseCasesIndex />} />
          <Route path="/use-cases/web-development" element={<WebDevelopment />} />
          <Route path="/use-cases/devops" element={<DevOps />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
