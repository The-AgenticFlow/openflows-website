import styles from './FlowVisual.module.css'

export default function FlowVisual() {
  return (
    <section className={styles.section} aria-labelledby="flow-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>The flow</p>
          <h2 id="flow-title" className={styles.title}>
            Watch the team work in real time.
          </h2>
          <p className={styles.subtitle}>
            NEXUS triages, FORGE builds, SENTINEL reviews, VESSEL ships, and LORE
            documents  -  all coordinated through a shared Redis state machine on
            top of your Coder environment. Every step governed, auditable, and
            safe.
          </p>
        </div>

        <div className={styles.stage}>
          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.loom.com/embed/46d47c9e9291445a8eb9cc88b2a26627?hideOwner=true&hideTitle=true&hideEmbedTopBar=true"
              title="OpenFlows agent flow demo"
              frameBorder="0"
              allow="fullscreen"
              allowFullScreen
              className={styles.videoEmbed}
            />
          </div>
        </div>

        <div className={styles.agents}>
          {['NEXUS', 'FORGE', 'SENTINEL', 'VESSEL', 'LORE'].map((agent) => (
            <span key={agent} className={styles.agentBadge}>
              {agent}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
