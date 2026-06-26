import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './MarkdownRenderer.module.css'

// Agent names to highlight cyan
const AGENT_NAMES = ['nexus', 'forge', 'sentinel', 'vessel', 'lore']
const AGENT_SET = new Set(AGENT_NAMES)

// Split a line into tokens: prompt chars, agent names, arrows, and plain text
const TOKEN_RE = /(›|→|->|nexus|forge|sentinel|vessel|lore)/gi

function highlightCodeLine(line, lineIndex) {
    const tokens = line.split(TOKEN_RE)
    return (
        <span key={lineIndex} style={{ display: 'block' }}>
            {tokens.map((token, i) => {
                if (!token) return null
                const lower = token.toLowerCase()
                if (token === '›' || token === '→' || token === '->') {
                    return (
                        <span key={i} style={{ color: 'var(--color-cyan)', opacity: 0.9 }}>
                            {token}
                        </span>
                    )
                }
                if (AGENT_SET.has(lower)) {
                    return (
                        <span key={i} style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>
                            {token}
                        </span>
                    )
                }
                return <span key={i}>{token}</span>
            })}
        </span>
    )
}

function HighlightedCodeBlock({ children, className }) {
    const code = String(children).replace(/\n$/, '')
    const lines = code.split('\n')
    return (
        <code className={className}>
            {lines.map((line, i) => highlightCodeLine(line, i))}
        </code>
    )
}

export default function MarkdownRenderer({ content }) {
    if (!content) return null

    return (
        <div className={styles.markdownBody}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        if (inline) {
                            return <code className={className} {...props}>{children}</code>
                        }
                        return (
                            <HighlightedCodeBlock className={className} {...props}>
                                {children}
                            </HighlightedCodeBlock>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
