import { useLocation } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'

// Sidebar navigation tree
const SIDEBAR = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Quick Start', href: '/docs/getting-started' },
      { label: 'Installation', href: '/docs/getting-started/installation' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'Agent Setup', href: '/docs/guides/agent-setup' },
      { label: 'Workflow Integration', href: '/docs/guides/workflow-integration' },
    ],
  },
  {
    title: 'API Reference',
    links: [
      { label: 'Overview', href: '/docs/api' },
      { label: 'Endpoints', href: '/docs/api/endpoints' },
      { label: 'Authentication', href: '/docs/api/authentication' },
    ],
  },
  {
    title: 'Architecture',
    links: [
      { label: 'Overview', href: '/docs/architecture' },
      { label: 'System Design', href: '/docs/architecture/system-design' },
      { label: 'Agent Roles', href: '/docs/architecture/agent-roles' },
    ],
  },
  {
    title: 'Other',
    links: [
      { label: 'FAQ', href: '/docs/faq' },
    ],
  },
]

export default function DocsLayout({ children, breadcrumbs }) {
  const { pathname } = useLocation()

  return (
    <Layout>
      <div className="docsLayout">
        {/* Sidebar */}
        <aside className="sidebar">
          {SIDEBAR.map(({ title, links }) => (
            <div key={title} className="sidebarSection">
              <p className="sidebarTitle">{title}</p>
              <ul className="sidebarNav">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className={`sidebarLink${pathname === href ? ' active' : ''}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="content">
          {breadcrumbs && (
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              {breadcrumbs.map(({ label, href }, i) => (
                <span key={i}>
                  <span className="sep">›</span>
                  {href ? <a href={href}>{label}</a> : <span className="current">{label}</span>}
                </span>
              ))}
            </nav>
          )}
          {children}
        </main>
      </div>
    </Layout>
  )
}
