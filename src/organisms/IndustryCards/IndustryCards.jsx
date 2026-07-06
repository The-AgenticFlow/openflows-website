import styles from './IndustryCards.module.css'

/**
 * Placeholder industry cards similar to coder.com's "Developer-first. Agent-ready." section.
 * Update INDUSTRIES with your own copy, icons, and links.
 */
const INDUSTRIES = [
  {
    title: 'Tech Innovators',
    description:
      'Move fast without breaking things. OpenFlows orchestrates a 24/7 agentic dev team on top of your Coder environment — so your engineers focus on architecture, not implementation.',
    icon: '',
    href: '/use-cases',
  },
  {
    title: 'Financial Services',
    description:
      'Stay compliant while accelerating delivery. Every agent action is logged, reviewable, and auditable — governance built into the SDLC, not bolted on.',
    icon: '',
    href: '/use-cases',
  },
  {
    title: 'Government Agencies',
    description:
      'Self-host on air-gapped Coder infrastructure. Keep sensitive code, agent work, and audit trails inside your network at all times.',
    icon: '',
    href: '/use-cases',
  },
]

export default function IndustryCards() {
  return (
    <section className={styles.section} aria-labelledby="industries-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Industries</p>
          <h2 id="industries-title" className={styles.title}>
            Orchestration on top of Coder, built for governed software delivery.
          </h2>
        </div>

        <div className={styles.grid}>
          {INDUSTRIES.map((industry, i) => (
            <a key={i} href={industry.href} className={styles.card}>
              <div className={styles.iconWrap}>
                {industry.icon ? (
                  <img src={industry.icon} alt="" className={styles.icon} />
                ) : (
                  <div className={styles.iconPlaceholder} />
                )}
              </div>
              <h3 className={styles.cardTitle}>{industry.title}</h3>
              <p className={styles.cardDesc}>{industry.description}</p>
              <span className={styles.link}>Learn more →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
