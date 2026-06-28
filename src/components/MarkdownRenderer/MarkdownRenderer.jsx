import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './MarkdownRenderer.module.css'

// Agent names to highlight cyan
const AGENT_NAMES = ['nexus', 'forge', 'sentinel', 'vessel', 'lore']
const AGENT_SET = new Set(AGENT_NAMES)

const TOKEN_RE = /(›|→|->|nexus|forge|sentinel|vessel|lore)/gi

function highlightCodeLine(line, lineIndex) {
    const tokens = line.split(TOKEN_RE)
    return (
        <span key={lineIndex} style={{ display: 'block' }}>
            {tokens.map((token, i) => {
                if (!token) return null
                const lower = token.toLowerCase()
                if (token === '›' || token === '→' || token === '->') {
                    return <span key={i} style={{ color: 'var(--color-cyan)', opacity: 0.9 }}>{token}</span>
                }
                if (AGENT_SET.has(lower)) {
                    return <span key={i} style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>{token}</span>
                }
                return <span key={i}>{token}</span>
            })}
        </span>
    )
}

// Map common aliases to Prism language identifiers
const LANGUAGE_ALIASES = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    rs: 'rust',
    py: 'python',
    rb: 'ruby',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    md: 'markdown',
    tf: 'hcl',
    cs: 'csharp',
    cpp: 'cpp',
    go: 'go',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sql: 'sql',
    graphql: 'graphql',
    gql: 'graphql',
    json: 'json',
    toml: 'toml',
    dockerfile: 'docker',
}

// Languages that use agent-name highlighting instead of Prism
const AGENT_HIGHLIGHT_LANGS = new Set(['bash', 'shell', 'sh', 'zsh', 'text', 'plaintext', ''])

export default function MarkdownRenderer({ content }) {
    if (!content) return null

    return (
        <div className={styles.markdownBody}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Intercept <pre> to prevent double-wrapping; the code renderer handles the block
                    pre({ children }) {
                        return <>{children}</>
                    },
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1].toLowerCase() : ''
                        const lang = LANGUAGE_ALIASES[language] || language

                        // Inline code (single backtick) — stays inline, no block treatment
                        if (inline) {
                            return (
                                <code
                                    style={{
                                        display: 'inline',
                                        background: 'var(--color-surface-2)',
                                        border: '1px solid var(--color-border)',
                                        padding: '0.15em 0.4em',
                                        borderRadius: '4px',
                                        fontFamily: "var(--font-mono, 'Menlo', 'Consolas', monospace)",
                                        fontSize: '0.875em',
                                        color: 'var(--color-text-primary)',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'baseline',
                                    }}
                                    {...props}
                                >
                                    {children}
                                </code>
                            )
                        }

                        const raw = String(children).replace(/\n$/, '')

                        // Plain / shell blocks — agent-name token highlighting
                        if (AGENT_HIGHLIGHT_LANGS.has(lang) || !lang) {
                            return (
                                <pre
                                    style={{
                                        margin: '1.5rem 0',
                                        padding: '1.25rem 1.5rem',
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '0.5rem',
                                        overflowX: 'auto',
                                        lineHeight: 1.75,
                                    }}
                                >
                                    <code
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            fontFamily: "var(--font-mono, 'Menlo', 'Consolas', monospace)",
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-primary)',
                                        }}
                                    >
                                        {raw.split('\n').map((line, i) => highlightCodeLine(line, i))}
                                    </code>
                                </pre>
                            )
                        }

                        // Syntax-highlighted block for real languages
                        return (
                            <SyntaxHighlighter
                                language={lang}
                                style={oneDark}
                                customStyle={{
                                    margin: '1.5rem 0',
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.75,
                                    border: '1px solid var(--color-border)',
                                }}
                                codeTagProps={{
                                    style: { fontFamily: "var(--font-mono, 'Menlo', 'Consolas', monospace)" }
                                }}
                            >
                                {raw}
                            </SyntaxHighlighter>
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
