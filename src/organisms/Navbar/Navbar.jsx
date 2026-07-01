import { useState, useEffect, useCallback, useRef } from 'react'
import Logo from '@/atoms/Logo/Logo'
import Button from '@/atoms/Button/Button'

import styles from './Navbar.module.css'

const NAV_DATA = [
  {
    label: 'Product',
    href: '/agents',
    dropdown: {
      heading: 'Product',
      items: [
        { label: 'Agents', href: '/agents' },
        { label: 'How it works', href: '/#how-it-works' },
        { label: 'Use cases', href: '/use-cases' },
        { label: 'Demos', href: '/demos' },
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
        { label: 'Installation', href: '/docs/getting-started/installation' },
        { label: 'Agent Setup', href: '/docs/guides/agent-setup' },
        { label: 'Architecture', href: '/docs/architecture' },
        { label: 'FAQ', href: '/docs/faq' },
      ]
    }
  },
  {
    label: 'Resources',
    href: '/developer',
    dropdown: {
      heading: 'Resources',
      items: [
        { label: 'Developer Hub', href: '/developer' },
        { label: 'Research', href: '/research' },
        { label: 'Blog', href: '/blog' },
        { label: 'GitHub', href: 'https://github.com/The-AgenticFlow/OpenFlows', external: true },
      ]
    }
  },
  { label: 'Company', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  const searchInputRef = useRef(null)
  const dropdownTimerRef = useRef(null)

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Dynamic import to keep nav bundle light
    import('@/data/searchIndex').then(({ searchSite }) => {
      setSearchResults(searchSite(query))
    })
  }

  const filteredResults = activeFilter === 'All'
    ? searchResults
    : searchResults.filter(r => r.type === activeFilter)

  const CATEGORIES = ['All', 'Agent', 'Docs', 'Blog', 'Use Case']

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setMenuOpen(false)
      }
    }

    if (isSearchOpen) {
      if (searchInputRef.current) searchInputRef.current.focus()
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.style.overflow = ''
      setSearchQuery('')
      setSearchResults([])
      window.removeEventListener('keydown', handleEsc)
    }

    return () => window.removeEventListener('keydown', handleEsc)
  }, [isSearchOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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
                <Button variant="ghost" size="sm" href="https://github.com/The-AgenticFlow/OpenFlows" target="_blank" rel="noopener noreferrer">
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
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery.length >= 2 && (
            <div className={styles.resultsContainer}>
              <div className={styles.searchFilters}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={[styles.filterBtn, activeFilter === cat ? styles.filterActive : ''].join(' ')}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className={styles.searchResults}>
                {filteredResults.length > 0 ? (
                  filteredResults.map(result => (
                    <a key={result.id} href={result.href} onClick={() => setIsSearchOpen(false)} className={styles.resultItem}>
                      <div className={styles.resultHeader}>
                        <span className={styles.resultTitle}>{result.title}</span>
                        <span className={styles.resultType}>{result.type}</span>
                      </div>
                      {result.description && (
                        <p className={styles.resultSnippet}>{result.description}</p>
                      )}
                    </a>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : ''].join(' ')}>
        <nav className={styles.mobileNav}>
          {NAV_DATA.map((item) => (
            <div key={item.label}>
              <a
                href={item.href}
                className={styles.mobileNavLink}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                {item.external && <span className={styles.mobileNavLinkExternal}>↗</span>}
              </a>
              {item.dropdown && (
                <div className={styles.mobileSubSection}>
                  <p className={styles.mobileSubHeading}>{item.dropdown.heading}</p>
                  {item.dropdown.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className={styles.mobileSubLink}
                      target={subItem.external ? '_blank' : undefined}
                      rel={subItem.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className={styles.mobileActions}>
          <Button variant="primary" size="md" href="/docs/getting-started" onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
            Get Started
          </Button>
        </div>
      </div>
    </>
  )
}
