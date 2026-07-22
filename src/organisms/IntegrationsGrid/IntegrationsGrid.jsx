import styles from './IntegrationsGrid.module.css'

/**
 * Placeholder integration logo grid similar to coder.com's "Open by design" section.
 * Replace PLACEHOLDER_INTEGRATIONS with actual integration objects: { name, icon, href }
 */
const PLACEHOLDER_INTEGRATIONS = [
  { name: 'GitHub', icon: '' },
  { name: 'GitLab', icon: '' },
  { name: 'Docker', icon: '' },
  { name: 'Kubernetes', icon: '' },
  { name: 'AWS', icon: '' },
  { name: 'Azure', icon: '' },
  { name: 'Google Cloud', icon: '' },
  { name: 'OpenAI', icon: '' },
  { name: 'Claude', icon: '' },
  { name: 'Gemini', icon: '' },
  { name: 'Redis', icon: '' },
  { name: 'Terraform', icon: '' },
]

export default function IntegrationsGrid() {
  return (
    <section className={styles.section} aria-labelledby="integrations-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Integrations</p>
          <h2 id="integrations-title" className={styles.title}>
            Open by design. Secure by default.
          </h2>
          <p className={styles.subtitle}>
            OpenFlows orchestrates on top of Coder and connects to the tools your
            team already uses  -  from Git providers and cloud platforms to the AI
            models that power each agent. Everything stays inside your governed
            environment.
          </p>
        </div>

        <div className={styles.grid}>
          {PLACEHOLDER_INTEGRATIONS.map((integration, i) => (
            <div key={i} className={styles.card} title={integration.name}>
              {integration.icon ? (
                <img src={integration.icon} alt={integration.name} className={styles.icon} />
              ) : (
                <div className={styles.iconPlaceholder} />
              )}
              <span className={styles.name}>{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
