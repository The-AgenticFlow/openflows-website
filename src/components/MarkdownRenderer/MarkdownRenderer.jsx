import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './MarkdownRenderer.module.css'

// ─────────────────────────────────────────────────────────────────────────────
// Language alias map
// ─────────────────────────────────────────────────────────────────────────────
const LANGUAGE_ALIASES = {
    js: 'javascript', ts: 'typescript', jsx: 'jsx', tsx: 'tsx',
    rs: 'rust', py: 'python', rb: 'ruby',
    sh: 'bash', shell: 'bash', zsh: 'bash',
    yml: 'yaml', md: 'markdown', tf: 'hcl',
    cs: 'csharp', cpp: 'cpp', go: 'go', java: 'java',
    kt: 'kotlin', swift: 'swift', php: 'php',
    html: 'html', css: 'css', scss: 'scss',
    sql: 'sql', graphql: 'graphql', gql: 'graphql',
    json: 'json', toml: 'toml', dockerfile: 'docker',
}

const PLAIN_LANGS = new Set(['bash', 'shell', 'sh', 'zsh', 'text', 'plaintext', ''])

// ─────────────────────────────────────────────────────────────────────────────
// Preprocess markdown to fix inline code that's on its own line
// The database content has inline code like `codex` on separate lines,
// which ReactMarkdown interprets as block code. We need to merge these
// into the surrounding paragraph text.
// ─────────────────────────────────────────────────────────────────────────────
function isOnlyInlineCode(line) {
    const trimmed = line.trim()
    if (!trimmed) return false
    if (!trimmed.includes('`')) return false
    // Remove all inline code spans and check if only punctuation/whitespace remains
    const stripped = trimmed.replace(/`[^`]+`/g, '').replace(/[,.\s()]/g, '')
    return stripped === ''
}

// Check if a table row is actually a paragraph (only first column has content)
function isFakeTableRow(line) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('|')) return false

    // Split by pipe and check columns
    const columns = trimmed.split('|').map(c => c.trim()).filter(c => c.length > 0)

    // If only first column has meaningful content and rest are empty/minimal
    if (columns.length >= 2) {
        const firstCol = columns[0]
        const otherCols = columns.slice(1)
        const otherColsEmpty = otherCols.every(c => c === '' || c === ' ' || c.length < 2)

        // If first column is long (paragraph-like) and others are empty, it's a fake row
        if (firstCol.length > 50 && otherColsEmpty) {
            return true
        }
    }
    return false
}

// Convert a fake table row to a paragraph
function convertFakeTableRowToParagraph(line) {
    const trimmed = line.trim()
    // Remove leading/trailing pipes and extract first column content
    const match = trimmed.match(/^\|\s*(.+?)\s*\|/)
    if (match) {
        return match[1]
    }
    return trimmed.replace(/^\|/, '').replace(/\|$/, '').trim()
}

function preprocessContent(raw) {
    const lines = raw.split('\n')

    // Debug: log lines around "Key takeaway"
    if (typeof window !== 'undefined') {
        const keyIdx = lines.findIndex(l => l.includes('Key takeaway') || l.includes('key takeaway') || l.includes('key_takeaway'))
        if (keyIdx >= 0 && !window._mdKeyTakeawayDebug) {
            window._mdKeyTakeawayDebug = true
            console.log('[MD KEY TAKEAWAY DEBUG] Total lines:', lines.length)
            console.log('[MD KEY TAKEAWAY DEBUG] Key takeaway at line:', keyIdx)
            const start = Math.max(0, keyIdx - 5)
            const end = Math.min(lines.length, keyIdx + 10)
            for (let i = start; i < end; i++) {
                console.log(`  [${i}] ${JSON.stringify(lines[i])}`)
            }
        }
    }

    const result = []
    let inCodeFence = false
    let pendingParagraph = []
    let inTable = false
    let tableBuffer = []

    function flushParagraph() {
        if (pendingParagraph.length > 0) {
            result.push(pendingParagraph.join(' '))
            pendingParagraph = []
        }
    }

    function flushTable() {
        if (tableBuffer.length > 0) {
            result.push(...tableBuffer)
            tableBuffer = []
        }
    }

    // First pass: identify which lines are "inline code only" lines
    const inlineCodeLines = new Set()
    for (let i = 0; i < lines.length; i++) {
        if (isOnlyInlineCode(lines[i])) {
            inlineCodeLines.add(i)
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        // Track code fence state
        if (trimmed.startsWith('```')) {
            flushParagraph()
            flushTable()
            inCodeFence = !inCodeFence
            result.push(line)
            continue
        }

        // Inside code fence: pass through as-is
        if (inCodeFence) {
            result.push(line)
            continue
        }

        // Check for fake table rows (paragraphs incorrectly formatted as table rows)
        if (isFakeTableRow(trimmed)) {
            flushTable()
            inTable = false
            // Convert to paragraph and add to pending paragraph
            const paragraph = convertFakeTableRowToParagraph(trimmed)
            pendingParagraph.push(paragraph)
            continue
        }

        // Blank line: check if next non-blank line is inline-code-only
        // If so, skip the blank line (keep building paragraph)
        if (trimmed === '') {
            // Look ahead to find next non-blank line
            let nextNonBlankIdx = -1
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].trim() !== '') {
                    nextNonBlankIdx = j
                    break
                }
            }

            // If next content is inline-code-only, skip blank line
            if (nextNonBlankIdx >= 0 && inlineCodeLines.has(nextNonBlankIdx)) {
                continue
            }

            // If next content is a fake table row, skip blank line
            if (nextNonBlankIdx >= 0 && isFakeTableRow(lines[nextNonBlankIdx])) {
                continue
            }

            // If next content is a regular text line (not block element), skip blank line
            if (nextNonBlankIdx >= 0) {
                const nextTrimmed = lines[nextNonBlankIdx].trim()
                const isNextBlockElement =
                    /^#{1,6}\s/.test(nextTrimmed) ||
                    /^(\s*[-*+]|\s*\d+\.)\s/.test(nextTrimmed) ||
                    (/^\|.*\|/.test(nextTrimmed) && !isFakeTableRow(nextTrimmed)) ||
                    /^>\s/.test(nextTrimmed) ||
                    /^(-{3,}|={3,}|\*{3,})$/.test(nextTrimmed) ||
                    /^```/.test(nextTrimmed)

                if (!isNextBlockElement) {
                    continue
                }
            }

            // Otherwise flush paragraph and table, then add blank line
            flushParagraph()
            flushTable()
            result.push('')
            continue
        }

        // Block elements: headings, lists, tables, blockquotes, hr
        const isRealTable = /^\|.*\|/.test(trimmed) && !isFakeTableRow(trimmed)
        const isBlockElement =
            /^#{1,6}\s/.test(trimmed) ||           // heading
            /^(\s*[-*+]|\s*\d+\.)\s/.test(trimmed) || // list
            isRealTable ||                          // real table
            /^>\s/.test(trimmed) ||                 // blockquote
            /^(-{3,}|={3,}|\*{3,})$/.test(trimmed)  // hr

        if (isBlockElement) {
            flushParagraph()
            if (isRealTable) {
                inTable = true
                tableBuffer.push(line)
            } else {
                flushTable()
                inTable = false
                result.push(line)
            }
            continue
        }

        // If we're in a table but this line is not a table row, flush the table first
        if (inTable) {
            const isTableRow = /^\|.*\|/.test(trimmed)
            if (!isTableRow) {
                flushTable()
                inTable = false
                // Add a blank line after the table to properly terminate it in markdown
                result.push('')
                // Fall through to handle this line as regular text
            } else {
                tableBuffer.push(line)
                continue
            }
        }

        // This is a text line (possibly containing inline code)
        // Add to current paragraph
        pendingParagraph.push(trimmed)
    }

    flushParagraph()
    flushTable()
    const processed = result.join('\n')

    // Debug: log the preprocessed output around "Key takeaway"
    if (typeof window !== 'undefined' && !window._mdPreprocessedDebug) {
        window._mdPreprocessedDebug = true
        const processedLines = processed.split('\n')
        const keyIdx = processedLines.findIndex(l => l.includes('Key takeaway'))
        if (keyIdx >= 0) {
            console.log('[MD PREPROCESSED DEBUG] Total processed lines:', processedLines.length)
            console.log('[MD PREPROCESSED DEBUG] Key takeaway at processed line:', keyIdx)
            const start = Math.max(0, keyIdx - 5)
            const end = Math.min(processedLines.length, keyIdx + 5)
            for (let i = start; i < end; i++) {
                console.log(`  [${i}] ${JSON.stringify(processedLines[i])}`)
            }
        }
    }

    return processed
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MarkdownRenderer({ content }) {
    if (!content) return null

    const processedContent = preprocessContent(content)

    return (
        <div className={styles.markdownBody}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table({ children, ...props }) {
                        return (
                            <div className={styles.tableWrapper}>
                                <table {...props}>{children}</table>
                            </div>
                        )
                    },
                    pre({ children, ...props }) {
                        // Check if the child is code that looks like inline code
                        // If so, render as span instead of pre to avoid <pre> inside <p>
                        if (children && children.props && children.props.children) {
                            const codeContent = String(children.props.children || '')
                            const codeClassName = children.props.className || ''
                            const hasLanguage = /language-\w+/.test(codeClassName)
                            const isShortAndNoNewlines = codeContent.length < 100 && !codeContent.includes('\n')

                            if (!hasLanguage && isShortAndNoNewlines) {
                                // This looks like misparsed inline code - render as span
                                return (
                                    <span className={styles.inlineCode} {...props}>
                                        {children.props.children}
                                    </span>
                                )
                            }
                        }
                        return <pre {...props}>{children}</pre>
                    },
                    code({ node, inline, className, children, ...props }) {
                        const raw = String(children)
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1].toLowerCase() : ''

                        // Detect if this looks like inline code that was misparsed as block:
                        // - No language class
                        // - Short content (under 100 chars)
                        // - No newlines
                        // - Content is wrapped in backticks in the original markdown
                        const looksLikeInlineCode =
                            !language &&
                            raw.length < 100 &&
                            !raw.includes('\n') &&
                            !className

                        // Inline code (single backticks) — styled as chips
                        if (inline || looksLikeInlineCode) {
                            return (
                                <code
                                    className={styles.inlineCode}
                                    {...props}
                                >
                                    {children}
                                </code>
                            )
                        }

                        // Block code (triple backticks) — syntax highlighted
                        const lang = LANGUAGE_ALIASES[language] || language

                        // Plain / shell block — simple styling
                        if (PLAIN_LANGS.has(lang) || !lang) {
                            return (
                                <pre className={styles.plainBlock}>
                                    <code className={styles.plainBlockCode}>
                                        {raw.replace(/\n$/, '')}
                                    </code>
                                </pre>
                            )
                        }

                        // Language-specific syntax highlighting
                        return (
                            <SyntaxHighlighter
                                language={lang}
                                style={oneDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.1rem 1.4rem',
                                    background: 'var(--color-surface-2)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.7,
                                }}
                                codeTagProps={{
                                    style: { fontFamily: "var(--font-mono, 'Menlo', 'Consolas', monospace)" }
                                }}
                            >
                                {raw.replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        )
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    )
}
