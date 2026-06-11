import Navbar from '@/organisms/Navbar/Navbar'
import Footer from '@/organisms/Footer/Footer'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
