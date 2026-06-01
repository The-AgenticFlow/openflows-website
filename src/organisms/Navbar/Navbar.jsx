import { useState, useEffect, useCallback, useRef } from 'react'
import Logo from '@/atoms/Logo/Logo'
import Button from '@/atoms/Button/Button'
import styles from './Navbar.module.css'

const NAV_DATA = [
  {
    label: 'Platform',
    href: '/platform',
    dropdown: {
      heading: 'Explore Platform',
      items: [
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'SharedStore', href: '/docs/architecture/system-design' },
        { label: 'FORGE-SENTINEL Pair Harness', href: '/docs/architecture/agent-roles' },
        { label: 'Flow Recovery', href: '/docs/architecture/system-design' },
        { label: 'Security & Safety', href: '/docs/guides/agent-setup' },
      ],
      advancements: [
        { label: 'OpenFlows v1.0 Stable', href: '/blog/openflows-v1' },
        { label: 'VESSEL Conflict Rework Loop', href: '/blog/vessel-conflict-rework' },
      ]
    }
  },
  {
    label: 'Agents',
    href: '/agents',
    dropdown: {
      heading: 'Meet the Agents',
      items: [
        { label: 'NEXUS — Orchestrator', href: '/agents/nexus' },
        { label: 'FORGE — Builder', href: '/agents/forge' },
        { label: 'SENTINEL — Reviewer', href: '/agents/sentinel' },
        { label: 'VESSEL — DevOps', href: '/agents/vessel' },
        { label: 'LORE — Documenter', href: '/agents/lore' },
      ]
    }
  },
  {
    label: 'Docs',
    href: '/docs',
    dropdown: {
      heading: 'Documentation',
      items: [
        { label: 'Getting Started', href: '/docs/getting-started' },
        { label: 'Installation Guide', href: '/docs/getting-started/installation' },
        { label: 'Agent Setup', href: '/docs/guides/agent-setup' },
        { label: 'Architecture Overview', href: '/docs/architecture' },
        { label: 'FAQ', href: '/docs/faq' },
      ]
    }
  },
  {
    label: 'Developers',
    href: '/developers',
    dropdown: {
      heading: 'Developer Resources',
      items: [
        { label: 'API Reference', href: '/developers/api-explorer' },
        { label: 'Integrations', href: '/developers/integrations' },
        { label: 'OpenFlows CLI', href: '/docs/getting-started/installation' },
        { label: 'GitHub Repository', href: 'https://github.com/The-AgenticFlow/AgentFlow', external: true },
      ]
    }
  },
  {
    label: 'Company',
    href: '/about',
    dropdown: {
      heading: 'About OpenFlows',
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Use Cases', href: '/use-cases' },
        { label: 'Demos', href: '/demos' },
        { label: 'Open Source', href: 'https://github.com/The-AgenticFlow/AgentFlow', external: true },
      ]
    }
  },
  { label: 'GitHub', href: 'https://github.com/The-AgenticFlow/AgentFlow', external: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const dropdownTimerRef = useRef(null)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleMouseEnter = (index) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
    if (NAV_DATA[index].dropdown) {
      setActiveDropdown(index)
    } else {
      setActiveDropdown(null)
    }
  }

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  return (
    <>
      <header 
        className={[
          styles.navbar, 
          scrolled ? styles.scrolled : '',
          activeDropdown !== null ? styles.dropdownActive : '',
          isSearchOpen ? styles.searchActive : ''
        ].join(' ')}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.inner}>
          <Logo />

          <nav className={styles.desktopNav} aria-label="Main navigation">
            {NAV_DATA.map((item, index) => (
              <div 
                key={item.label} 
                className={styles.navLinkWrapper}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <a
                  href={item.href}
                  className={[
                    styles.navLink,
                    activeDropdown === index ? styles.active : ''
                  ].join(' ')}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              </div>
            ))}
            
            {/* Search Toggle */}
            <button 
              className={styles.searchButton} 
              aria-label={isSearchOpen ? "Close search" : "Search"}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {!isSearchOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </button>
          </nav>

          <div className={styles.actions}>
            {!isSearchOpen && (
              <>
                <Button variant="ghost" size="sm" href="https://github.com/The-AgenticFlow/AgentFlow" target="_blank" rel="noopener noreferrer">
                  GitHub
                </Button>
                <Button variant="primary" size="sm" href="/docs/getting-started">
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={[styles.bar, menuOpen ? styles.barOpen : ''].join(' ')} />
            <span className={[styles.bar, menuOpen ? styles.barOpen : ''].join(' ')} />
            <span className={[styles.bar, menuOpen ? styles.barOpen : ''].join(' ')} />
          </button>
        </div>

        {/* Mega Dropdown Panel */}
        <div 
          className={[
            styles.megaPanel,
            activeDropdown !== null ? styles.panelVisible : ''
          ].join(' ')}
          onMouseEnter={() => {
            if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
          }}
        >
          <div className={styles.panelContent}>
            {activeDropdown !== null && NAV_DATA[activeDropdown].dropdown && (
              <div className={styles.dropdownGrid}>
                <div className={styles.dropdownMain}>
                  <p className={styles.dropdownHeading}>{NAV_DATA[activeDropdown].dropdown.heading}</p>
                  <div className={styles.dropdownLinks}>
                    {NAV_DATA[activeDropdown].dropdown.items.map((subItem) => (
                      <a key={subItem.label} href={subItem.href} className={styles.megaLink}>
                        {subItem.label}
                        {subItem.external && <span className={styles.externalArrow}>↗</span>}
                      </a>
                    ))}
                  </div>
                </div>
                {NAV_DATA[activeDropdown].dropdown.advancements && (
                  <div className={styles.dropdownSide}>
                    <p className={styles.dropdownHeading}>Latest Advancements</p>
                    <div className={styles.dropdownLinks}>
                      {NAV_DATA[activeDropdown].dropdown.advancements.map((adv) => (
                        <a key={adv.label} href={adv.href} className={styles.advLink}>
                          {adv.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={[styles.searchOverlay, isSearchOpen ? styles.searchOverlayVisible : ''].join(' ')}>
        <div className={styles.searchContent}>
          <div className={styles.searchInputWrapper}>
            <input 
              ref={searchInputRef}
              type="text" 
              className={styles.largeSearchInput} 
              placeholder="Search OpenFlows docs, agents, guides..."
            />
            <button className={styles.searchSubmit} aria-label="Submit search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : ''].join(' ')}>
        {/* ... mobile links ... */}
      </div>
    </>
  )
}
