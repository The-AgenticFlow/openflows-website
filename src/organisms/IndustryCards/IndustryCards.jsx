import styles from './IndustryCards.module.css'

/**
 * Placeholder industry cards similar to coder.com's "Developer-first. Agent-ready." section.
 * Update INDUSTRIES with your own copy, icons, and links.
 */
const INDUSTRIES = [
  {
    title: 'Tech Innovators',
    description:
      'Move fast without breaking things. OpenFlows orchestrates a 24/7 agentic dev team on top of your Coder environment  -  so your engineers focus on architecture, not implementation.',
    icon: '',
    href: '/insights/openflows-agentic-dev-team-puts-engineering-back-in-control',
  },
  {
    title: 'Financial Services',
    description:
      'An AI delivery system either produces a defensible record or it does not. OpenFlows makes the record part of the design, so every change is auditable by construction.',
    icon: '',
    href: '/insights/the-auditable-agent-compliance-evidence-as-a-design-property',
  },
  {
    title: 'Government Agencies',
    description:
      'A government agency cannot adopt an AI software team whose code, decisions, and audit trail live outside its own infrastructure. OpenFlows runs where the agency says it runs.',
    icon: '',
    href: '/insights/the-air-gapped-agent-sensitive-work-that-never-leaves-the-network',
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
