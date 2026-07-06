import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import MarkdownRenderer from '@/components/MarkdownRenderer/MarkdownRenderer'
import styles from '../pages/research/Research.module.css'

export default function ResearchDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResearch = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('research')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single()

        if (error) throw error
        setItem(data)
      } catch (err) {
        console.error('Error fetching research:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResearch()
  }, [slug])

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className={styles.articleLoading}>
          <div className={styles.spinner} />
          <p>Loading publication...</p>
        </div>
      </Layout>
    )
  }

  if (!item) {
    return (
      <Layout>
        <div className={styles.articleLoading}>
          <p className={styles.emptyTitle}>Publication not found.</p>
          <Link to="/research" className={styles.backLink}>Back to Research</Link>
        </div>
      </Layout>
    )
  }

  const authors = Array.isArray(item.authors) ? item.authors : []

  return (
    <Layout>
      <article className={styles.article}>
        <div className={styles.container}>
          <Link to="/research" className={styles.backLink}>
            &larr; Back to Research
          </Link>

          <header className={styles.articleHeader}>
            <div className={styles.articleMeta}>
              <span className={styles.articleCategory}>{item.category}</span>
              <span className={styles.articleVenue}>{item.venue}</span>
              <span className={styles.articleDate}>{formatDate(item.publish_date)}</span>
            </div>
            <h1 className={styles.articleTitle}>{item.title}</h1>

            {authors.length > 0 && (
              <div className={styles.articleAuthors}>
                {authors.map((a, i) => (
                  <span key={i} className={styles.authorChip}>
                    {a.name}{a.affiliation ? ` (${a.affiliation})` : ''}
                  </span>
                ))}
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className={styles.articleTags}>
                {item.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            {item.pdf_url && (
              <a
                href={item.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pdfBtn}
              >
                View PDF
              </a>
            )}
          </header>

          {item.cover_image_url && (
            <div className={styles.articleCover}>
              <img src={item.cover_image_url} alt={item.title} />
            </div>
          )}

          <div className={styles.articleBody}>
            <MarkdownRenderer>{item.content || ''}</MarkdownRenderer>
          </div>
        </div>
      </article>
    </Layout>
  )
}
