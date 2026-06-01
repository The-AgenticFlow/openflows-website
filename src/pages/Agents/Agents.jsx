import Layout from '@/organisms/Layout/Layout';
import { AGENT_DATA } from '@/data/agents';
import styles from './Agents.module.css';

const ORCHESTRATION_STEPS = [
  { agent: 'NEXUS', action: 'Orchestration', desc: 'Discovers issues and segments them into actionable tasks.' },
  { agent: 'FORGE', action: 'Implementation', desc: 'Writes code in isolated, high-performance environments.' },
  { agent: 'SENTINEL', action: 'Review', desc: 'Gatekeeps every commit against technical contracts.' },
  { agent: 'VESSEL', action: 'Release', desc: 'Coordinates CI/CD success and secure production merges.' },
  { agent: 'LORE', action: 'Archival', desc: 'Maintains documentation and architecture records.' },
];

export default function Agents() {
  const agents = Object.entries(AGENT_DATA);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>The Ecosystem</p>
          <h1 className={styles.title}>The Multi-Agent <br/> Orchestration Engine</h1>
          <p className={styles.subtitle}>
            OpenFlows coordinates specialized agents into a deterministic development lifecycle, 
            eliminating manual churn and ensuring high-reliability code generation.
          </p>
        </div>
      </section>

      {/* Orchestration Loop Visual */}
      <section className={styles.loopSection}>
        <div className={styles.container}>
          <div className={styles.loopHeader}>
            <h2 className={styles.sectionHeading}>The Orchestration Loop</h2>
            <p className={styles.sectionDesc}>How our agents collaborate in real-time via the SharedStore state machine.</p>
          </div>
          
          <div className={styles.loopVisual}>
            {ORCHESTRATION_STEPS.map((step, i) => (
              <div key={step.agent} className={styles.loopStep}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepDot} />
                  <span className={styles.stepAgent}>{step.agent}</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepAction}>{step.action}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
                {i < ORCHESTRATION_STEPS.length - 1 && <div className={styles.stepConnector} />}
              </div>
            ))}
          </div>
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
                  <p className={styles.agentMission}>{data.mission.slice(0, 100)}...</p>
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
              <p className={styles.eyebrow}>Governance & State</p>
              <h2 className={styles.archTitle}>Powered by SharedStore</h2>
              <p className={styles.archDesc}>
                Every agent interaction is persisted in a Redis-backed programmatic state machine. 
                This ensures total observability, safe rework loops, and deterministic outcomes — 
                no matter the complexity of the codebase.
              </p>
              <a href="/platform/shared-store" className={styles.archLink}>Learn about SharedStore ›</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
