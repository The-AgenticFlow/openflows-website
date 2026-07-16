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
  { label: 'Community', href: '/about' },
]

const GITHUB_REPO = 'The-AgenticFlow/OpenFlows'

function formatStarCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return String(count)
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [starCount, setStarCount] = useState(null)

  const dropdownTimerRef = useRef(null)

  // Fetch GitHub star count on mount
  useEffect(() => {
    let cancelled = false
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count)
        }
      })
      .catch(() => {
        // Silently fail — button still links to GitHub
      })
    return () => { cancelled = true }
  }, [])

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

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
          </nav>

          <div className={styles.actions}>
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.starButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span className={styles.starCount}>
                {starCount !== null ? formatStarCount(starCount) : '—'}
              </span>
            </a>
            <Button variant="primary" size="sm" href="/docs/getting-started">
              Get Started
            </Button>
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
          <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.starButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span className={styles.starCount}>
              {starCount !== null ? formatStarCount(starCount) : '—'}
            </span>
          </a>
            <Button variant="primary" size="md" href="/docs/getting-started" onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Get Started
            </Button>
        </div>
      </div>
    </>
  )
}