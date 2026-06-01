import { useState } from 'react'

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

/** Callout box — type: 'info' | 'warning' | 'tip' */
export function Callout({ type = 'info', title, children }) {
  return (
    <div className={`callout ${type}`}>
      {title && <p className="calloutTitle">{title}</p>}
      <p>{children}</p>
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
