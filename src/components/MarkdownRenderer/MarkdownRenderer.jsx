import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

import styles from './MarkdownRenderer.module.css'

// Language labels for display
const languageLabels = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  rs: 'Rust',
  rust: 'Rust',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sql: 'SQL',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  toml: 'TOML',
  xml: 'XML',
  graphql: 'GraphQL',
  go: 'Go',
  c: 'C',
  cpp: 'C++',
  cs: 'C#',
  php: 'PHP',
  rb: 'Ruby',
  ruby: 'Ruby',
  swift: 'Swift',
  kt: 'Kotlin',
  kotlin: 'Kotlin',
  dockerfile: 'Dockerfile',
  docker: 'Dockerfile',
  env: 'Environment',
  text: 'Text',
  plaintext: 'Text',
}

function getLanguageLabel(lang) {
  if (!lang) return 'Code'
  const normalized = lang.toLowerCase().trim()
  return languageLabels[normalized] || lang.charAt(0).toUpperCase() + lang.slice(1)
}

function CodeBlockComponent({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const codeText = String(children).replace(/\n$/, '').trim()
    navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (!inline && language) {
    const codeContent = String(children).replace(/\n$/, '')

    return (
      <div className={styles.codeBlockWrapper}>
        <div className={styles.codeBlockHeader}>
          <span className={styles.codeBlockLanguage}>
            {getLanguageLabel(language)}
          </span>
          <button
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          className={styles.syntaxHighlighter}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '0.9rem',
            lineHeight: '1.65',
          }}
          {...props}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export default function MarkdownRenderer({ children, className = '' }) {
  return (
    <div className={`${styles.markdown} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlockComponent,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
