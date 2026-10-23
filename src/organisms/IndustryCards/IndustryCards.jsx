import styles from './IndustryCards.module.css'

const ICON_PATHS = {
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 22h18" />
      <path d="M6 18v-7" />
      <path d="M10 18v-7" />
      <path d="M14 18v-7" />
      <path d="M18 18v-7" />
      <path d="M12 2 20 7H4z" />
    </>
  ),
}

function IndustryIcon({ name }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

const INDUSTRIES = [
  {
    title: 'Tech Innovators',
    description:
      'Move fast without breaking things. OpenFlows orchestrates a 24/7 agentic dev team on top of your Coder environment  -  so your engineers focus on architecture, not implementation.',
    icon: 'rocket',
    href: '/insights/openflows-agentic-dev-team-puts-engineering-back-in-control',
  },
  {
    title: 'Financial Services',
    description:
      'An AI delivery system either produces a defensible record or it does not. OpenFlows makes the record part of the design, so every change is auditable by construction.',
    icon: 'coin',
    href: '/insights/the-auditable-agent-compliance-evidence-as-a-design-property',
  },
  {
    title: 'Government Agencies',
    description:
      'A government agency cannot adopt an AI software team whose code, decisions, and audit trail live outside its own infrastructure. OpenFlows runs where the agency says it runs.',
    icon: 'landmark',
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
          {INDUSTRIES.map((industry) => (
            <a key={industry.title} href={industry.href} className={styles.card}>
              <div className={styles.iconWrap}>
                <IndustryIcon name={industry.icon} />
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
