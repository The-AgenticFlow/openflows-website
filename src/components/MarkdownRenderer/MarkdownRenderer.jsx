import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/contexts/ThemeContext'
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

// Extract video ID and provider from URL
function parseVideoUrl(url) {
  if (!url) return null

  // YouTube patterns
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    return { provider: 'youtube', id: youtubeMatch[1] }
  }

  // Vimeo patterns
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:.*#|.*\/videos\/)?|player\.vimeo\.com\/video\/)(\d+)/)
  if (vimeoMatch) {
    return { provider: 'vimeo', id: vimeoMatch[1] }
  }

  // Native video (mp4, webm, ogg)
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
  if (videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
    return { provider: 'native', id: url }
  }

  return null
}

// Video Embed Component
function VideoEmbed({ url, title }) {
  const video = parseVideoUrl(url)

  if (!video) return null

  if (video.provider === 'youtube') {
    return (
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={title || 'YouTube video'}
          className={styles.videoIframe}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (video.provider === 'vimeo') {
    return (
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://player.vimeo.com/video/${video.id}`}
          title={title || 'Vimeo video'}
          className={styles.videoIframe}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (video.provider === 'native') {
    return (
      <div className={styles.videoWrapper}>
        <video
          src={video.id}
          title={title || 'Video'}
          className={styles.nativeVideo}
          controls
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  return null
}

export default function MarkdownRenderer({ children, className = '' }) {
  const { theme } = useTheme()

  return (
    <div className={`${styles.markdown} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''

            if (!inline && language) {
              return (
                <div className={styles.codeBlockWrapper}>
                  <div className={styles.codeBlockHeader}>
                    <span className={styles.codeBlockLanguage}>
                      {getLanguageLabel(language)}
                    </span>
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
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              )
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Handle video embeds via custom syntax: ![video](url "title")
          // Or via video paragraphs: standalone video URLs on their own line
          p({ node, children }) {
            // Check if paragraph contains only a video URL
            if (typeof children === 'string') {
              const video = parseVideoUrl(children.trim())
              if (video) {
                return <VideoEmbed url={children.trim()} />
              }
            }

            // Check children array for video links
            if (Array.isArray(children) && children.length === 1) {
              const child = children[0]
              if (child?.props?.href) {
                const video = parseVideoUrl(child.props.href)
                if (video) {
                  return <VideoEmbed url={child.props.href} title={child.props.children} />
                }
              }
            }

            return <p>{children}</p>
          },
          // Handle images - check if they're actually video embeds
          img({ node, src, alt, ...props }) {
            // Check for video embed syntax: ![video](url) or ![youtube](url)
            const altLower = (alt || '').toLowerCase()
            if (altLower === 'video' || altLower === 'youtube' || altLower === 'vimeo') {
              return <VideoEmbed url={src} title={alt} />
            }

            // Check if src is a video URL
            const video = parseVideoUrl(src)
            if (video) {
              return <VideoEmbed url={src} title={alt} />
            }

            // Regular image
            return <img src={src} alt={alt} {...props} />
          },
          // Handle links - check for video embeds
          a({ node, href, children, ...props }) {
            const video = parseVideoUrl(href)
            if (video) {
              // If it's just a video URL link, embed it
              if (typeof children === 'string' || (Array.isArray(children) && children.length === 1 && typeof children[0] === 'string')) {
                const title = typeof children === 'string' ? children : children[0]
                return <VideoEmbed url={href} title={title} />
              }
            }

            // Regular link
            return <a href={href} {...props}>{children}</a>
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
