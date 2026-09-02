import { useLocation } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'
import { TableOfContents } from '@/molecules/DocComponents/DocComponents'

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
    ],
  },
  {
    title: 'Architecture',
    links: [
      { label: 'Overview', href: '/docs/architecture' },
      { label: 'Big Picture', href: '/docs/architecture/big-picture' },
      { label: 'Agent Roles', href: '/docs/concepts/agent-team' },
    ],
  },
  {
    title: 'Other',
    links: [
      { label: 'FAQ', href: '/docs/resources/faq' },
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

        {/* Main content  -  centered within the right column */}
        <div className="contentOuter">
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
          <TableOfContents />
        </div>
      </div>
    </Layout>
  )
}
