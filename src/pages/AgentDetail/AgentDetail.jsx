import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/organisms/Layout/Layout';
import { AGENT_DATA } from '@/data/agents';
import styles from './AgentDetail.module.css';

export default function AgentDetail() {
  const { agentId } = useParams();
  const agent = AGENT_DATA[agentId];

  if (!agent) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>The Agentic Ecosystem</p>
          <h1 className={styles.name}>{agent.name}</h1>
          <p className={styles.role}>{agent.role}</p>
        </div>
      </section>

      {/* Mission & Visual */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <h2 className={styles.sectionHeading}>Technical Mission</h2>
              <p className={styles.description}>{agent.mission}</p>
              
              <div className={styles.capList}>
                {agent.capabilities.map((cap, i) => (
                  <div key={i} className={styles.capItem}>
                    <span className={styles.check}>✓</span>
                    {cap}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.imageWrap}>
              <img src={agent.image} alt={agent.name} className={styles.image} />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className={styles.workflowSection}>
        <div className={styles.container}>
          <h2 className={styles.workflowHeading}>How it works</h2>
          <div className={styles.flowGrid}>
            {agent.flow.map((step, i) => {
              const [title, desc] = step.split(': ');
              return (
                <div key={i} className={styles.flowCard}>
                  <div className={styles.flowNumber}>{i + 1}</div>
                  <h3 className={styles.flowTitle}>{title}</h3>
                  <p className={styles.flowDesc}>{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2>Ready to deploy {agent.name}?</h2>
            <p>Integrate autonomous orchestration into your GitHub workflow in minutes.</p>
            <div className={styles.actions}>
              <a href="https://github.com/The-AgenticFlow/Openflows" className={styles.primaryBtn}>View on GitHub</a>
              <a href="/docs" className={styles.secondaryBtn}>Read Documentation ›</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
