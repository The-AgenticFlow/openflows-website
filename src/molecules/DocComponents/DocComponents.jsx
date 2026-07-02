import { useState, useEffect, useRef } from 'react'

/** Code block with copy button */
export function CodeBlock({ lang, children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="codeBlock">
      <div className="codeHeader">
        <span className="codeLang">{lang}</span>
        <button className="copyBtn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  )
}

/** Simple data table */
export function DocsTable({ headers, rows }) {
  return (
    <table className="docsTable">
      <thead>
        <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Card grid for doc index pages */
export function DocCards({ cards }) {
  return (
    <div className="docCards">
      {cards.map(({ icon, title, desc, href }) => (
        <a key={href} href={href} className="docCard">
          <div className="docCardIcon">{icon}</div>
          <div className="docCardTitle">{title}</div>
          <div className="docCardDesc">{desc}</div>
        </a>
      ))}
    </div>
  )
}

/** Accordion — items: [{title, content (JSX)}] */
export function Accordion({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="accordion">
      {items.map(({ title, content }, i) => (
        <div key={i} className="accordionItem">
          <div
            className="accordionHeader"
            onClick={() => setOpen(open === i ? -1 : i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setOpen(open === i ? -1 : i)}
          >
            <span className="accordionTitle">{title}</span>
            <span className={`accordionIcon${open === i ? ' open' : ''}`}>▼</span>
          </div>
          {open === i && <div className="accordionBody">{content}</div>}
        </div>
      ))}
    </div>
  )
}

/** Tab switcher — tabs: [{label, content (JSX)}] */
export function TabSwitcher({ tabs }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="tabTabs">
        {tabs.map(({ label }, i) => (
          <button
            key={label}
            className={`tabTab${active === i ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {tabs.map(({ content }, i) => (
        <div key={i} className={`tabPanel${active === i ? ' active' : ''}`}>
          {content}
        </div>
      ))}
    </div>
  )
}

/* ── Callout icons (inline SVG, no deps) ── */
const CALLOUT_ICONS = {
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  tip: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
}

/** Callout box — type: 'info' | 'warning' | 'tip' (with icon) */
export function Callout({ type = 'info', title, children }) {
  return (
    <div className={`callout ${type}`}>
      <div className="calloutBody">
        <span className="calloutIcon">{CALLOUT_ICONS[type]}</span>
        <div className="calloutContent">
          {title && <p className="calloutTitle">{title}</p>}
          <div className="calloutText">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** Step heading — numbered badge + title for scannable progression */
export function StepHeading({ step, id, children }) {
  return (
    <h2 id={id} className="stepHeading" data-step={step}>
      <span className="stepBadge">{step}</span>
      <span className="stepTitle">{children}</span>
    </h2>
  )
}

/** Prerequisite card */
export function PrereqCard({ name, detail, install }) {
  return (
    <div className="prereqCard">
      <div className="prereqCardName">{name}</div>
      <div className="prereqCardDetail">{detail}</div>
      <div className="prereqCardInstall">{install}</div>
    </div>
  )
}

/** Feedback footer — "Was this helpful?" */
export function FeedbackFooter() {
  const [vote, setVote] = useState(null)
  return (
    <div className="feedbackFooter">
      <div className="feedbackLabel">Was this guide helpful?</div>
      <div className="feedbackButtons">
        <button
          className={`feedbackBtn${vote === 'up' ? ' voted' : ''}`}
          onClick={() => setVote('up')}
          aria-label="Yes, helpful"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          Yes
        </button>
        <button
          className={`feedbackBtn${vote === 'down' ? ' voted' : ''}`}
          onClick={() => setVote('down')}
          aria-label="No, not helpful"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
          </svg>
          No
        </button>
      </div>
      {vote && <p className="feedbackThanks">Thanks for the feedback!</p>}
    </div>
  )
}

/** Table of Contents — auto-generated from h2/h3 in content, with scroll-spy */
export function TableOfContents() {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const contentRef = useRef(null)

  useEffect(() => {
    const content = document.querySelector('.content')
    if (!content) return
    contentRef.current = content

    const els = Array.from(content.querySelectorAll('h2[id], h3[id]'))
    const items = els.map((el) => ({
      id: el.id,
      text: el.dataset.step ? el.dataset.step + '. ' + el.querySelector('.stepTitle')?.textContent : el.textContent,
      level: el.tagName === 'H3' ? 3 : 2,
    }))
    setHeadings(items)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (headings.length < 2) return null

  return (
    <nav className="toc" aria-label="On this page">
      <p className="tocTitle">On this page</p>
      <ul className="tocList">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`tocLink${activeId === id ? ' active' : ''}${level === 3 ? ' sub' : ''}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Before/After comparison */
export function Comparison({ before, after }) {
  return (
    <div className="comparison">
      <div className="comparisonCol before">
        <p className="comparisonLabel">✕ Before OpenFlows</p>
        <ul className="comparisonList">
          {before.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className="comparisonCol after">
        <p className="comparisonLabel">✓ With OpenFlows</p>
        <ul className="comparisonList">
          {after.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}
