import { Link } from 'react-router-dom'
import Layout from '@/organisms/Layout/Layout'
import styles from '../pages/NotFound.module.css'

export default function NotFound() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={styles.link}>
          Back to home
        </Link>
      </div>
    </Layout>
  )
}