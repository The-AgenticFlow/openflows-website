import Layout from '@/organisms/Layout/Layout';
import { AGENT_DATA } from '@/data/agents';
import styles from './Agents.module.css';

export default function Agents() {
  const agents = Object.entries(AGENT_DATA);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>The Team</p>
          <h1 className={styles.title}>Five agents. One pipeline.<br/> Zero manual steps.</h1>
          <p className={styles.subtitle}>
            OpenFlows coordinates five specialized AI agents through a deterministic, event-driven
            pipeline. Each agent has a distinct role, isolated permissions, and its own GitHub identity -
            just like a real development team.
          </p>
        </div>
      </section>

      {/* Agent Grid */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Meet the Team</h2>
          <div className={styles.agentGrid}>
            {agents.map(([id, data]) => (
              <a key={id} href={`/agents/${id}`} className={styles.agentCard}>
                <div className={styles.agentContent}>
                  <p className={styles.agentRole}>{data.role}</p>
                  <h3 className={styles.agentName}>{data.name}</h3>
                  <p className={styles.agentMission}>{data.mission.slice(0, 120)}...</p>
                  <span className={styles.learnMore}>Explore {data.name} ›</span>
                </div>
                <div className={styles.agentImageWrap}>
                  <img src={data.image} alt={data.name} className={styles.agentImage} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Callout */}
      <section className={styles.archSection}>
        <div className={styles.container}>
          <div className={styles.archBox}>
            <div className={styles.archText}>
              <p className={styles.eyebrow}>State & Governance</p>
              <h2 className={styles.archTitle}>Powered by SharedStore</h2>
              <p className={styles.archDesc}>
                Every agent interaction is persisted in a Redis-backed state machine with typed keys:
                <code> tickets</code>, <code>worker_slots</code>, <code>pending_prs</code>.
                A 1000-event ring buffer powers real-time TUI monitoring. In-memory for dev and tests,
                Redis for production - zero config change required.
              </p>
              <a href="/docs/architecture/system-design" className={styles.archLink}>Read the architecture docs ›</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
