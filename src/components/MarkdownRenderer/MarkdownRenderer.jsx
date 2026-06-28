import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// ─────────────────────────────────────────────────────────────────────────────
// Component: Renders markdown content with standard HTML elements
// No custom styling — lets the browser's default stylesheet handle rendering
// ─────────────────────────────────────────────────────────────────────────────
export default function MarkdownRenderer({ content }) {
    if (!content) return null

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1].toLowerCase() : ''

                    // Inline code — let browser render naturally
                    if (inline) {
                        return <code {...props}>{children}</code>
                    }

                    const raw = String(children).replace(/\n$/, '')

                    // Syntax-highlighted code block
                    if (language) {
                        return (
                            <SyntaxHighlighter
                                language={language}
                                style={oneDark}
                                PreTag="pre"
                                CodeTag="code"
                                customStyle={{
                                    margin: '1em 0',
                                    padding: '1em',
                                    borderRadius: '4px',
                                    fontSize: '0.9em',
                                    lineHeight: 1.5,
                                }}
                            >
                                {raw}
                            </SyntaxHighlighter>
                        )
                    }

                    // Plain code block (no language specified)
                    return (
                        <pre style={{ margin: '1em 0', padding: '1em', overflow: 'auto', background: '#f5f5f5', borderRadius: '4px' }}>
                            <code {...props}>{raw}</code>
                        </pre>
                    )
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
