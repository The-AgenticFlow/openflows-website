import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styles from '../pages/research/Research.module.css'

export default function ResearchIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
          .eq('status', 'published')
          .order('publish_date', { ascending: false })

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error('Error fetching research:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResearch()
  }, [])

  const categories = ['all', ...new Set(items.map(i => i.category).filter(Boolean))]
  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Research</p>
          <h1 className={styles.title}>Publications</h1>
          <p className={styles.sub}>Papers, preprints, and technical reports on autonomous multi-agent software engineering and the OpenFlows architecture.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading publications...</p>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No publications yet.</p>
              <p className={styles.emptyText}>Research content will appear here once published.</p>
            </div>
          ) : (
            <>
              {categories.length > 1 && (
                <div className={styles.filterBar}>
                  {categories.map(c => (
                    <button
                      key={c}
                      className={`${styles.filterBtn}${filter === c ? ' active' : ''}`}
                      onClick={() => setFilter(c)}
                    >
                      {c === 'all' ? 'All' : c}
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.grid}>
                {filtered.map(item => (
                  <article key={item.id} className={styles.card}>
                    <Link to={`/research/${item.slug}`} className={styles.cardLink}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardCategory}>{item.category}</span>
                        <span className={styles.cardDate}>{formatDate(item.publish_date)}</span>
                      </div>
                      <h2 className={styles.cardTitle}>{item.title}</h2>
                      <p className={styles.cardAbstract}>{item.abstract}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardVenue}>{item.venue}</span>
                        <span className={styles.cardArrow}>Read &rarr;</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}
