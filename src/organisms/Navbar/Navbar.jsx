import { useState, useEffect, useCallback } from 'react'
import Logo from '@/atoms/Logo/Logo'
import Button from '@/atoms/Button/Button'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Platform',    href: '/platform' },
  { label: 'Agents',      href: '/agents' },
  { label: 'Enterprise',  href: '/enterprise' },
  { label: 'Developers',  href: '/developers' },
  { label: 'Company',     href: '/company' },
  { label: 'Open Source', href: 'https://github.com/The-AgenticFlow/Openflows', external: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={[styles.navbar, scrolled ? styles.scrolled : ''].join(' ')}>
        <div className={styles.inner}>
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                className={styles.navLink}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {label}
                {external && (
                  <svg
                    className={styles.externalIcon}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8L8 2M8 2H4M8 2V6"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" href="https://github.com/The-AgenticFlow/Openflows" target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
            <Button variant="primary" size="sm" href="#get-started">
              Get Started
            </Button>
          </div>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={[styles.bar, menuOpen ? styles.barOpen : ''].join(' ')} />
            <span className={[styles.bar, menuOpen ? styles.barOpen : ''].join(' ')} />
            <span className={[styles.bar, menuOpen ? styles.barOpen : ''].join(' ')} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : ''].join(' ')}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              className={styles.mobileLink}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className={styles.mobileActions}>
          <Button variant="secondary" size="lg" href="https://github.com/The-AgenticFlow/Openflows" target="_blank" rel="noopener noreferrer">
            GitHub
          </Button>
          <Button variant="primary" size="lg" href="#get-started" onClick={closeMenu}>
            Get Started
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  )
}
