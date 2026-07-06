import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/organisms/Layout/Layout';
import Button from '@/atoms/Button/Button';
import { AGENT_DATA } from '@/data/agents';
import styles from '../pages/agents/AgentDetail.module.css';

export default function AgentDetail() {
  const { agentId } = useParams();
  const agent = AGENT_DATA[agentId];

  if (!agent) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      {/* Header */}
      <header className={styles.detailHero}>
        <p className={styles.heroEyebrow}>The OpenFlows Team</p>
        <h1 className={styles.heroTitle}>{agent.name}</h1>
        <p className={styles.heroRole}>{agent.role}</p>
      </header>

      {/* Article Body */}
      <article className={styles.article}>
        <p className={styles.lead}>{agent.mission}</p>

        {/* Capabilities */}
        <h2 className={styles.sectionTitle}>Capabilities</h2>
        <ul className={styles.capList}>
          {agent.capabilities.map((cap, i) => (
            <li key={i} className={styles.capItem}>
              <span className={styles.bullet} />
              {cap}
            </li>
          ))}
        </ul>

        {/* Workflow */}
        <h2 className={styles.sectionTitle}>How it works</h2>
        <ol className={styles.flowList}>
          {agent.flow.map((step, i) => {
            const [title, desc] = step.split(': ');
            return (
              <li key={i} className={styles.flowItem}>
                <div className={styles.flowHeading}>
                  <span className={styles.flowNumber}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.flowTitle}>{title}</span>
                </div>
                <p>{desc}</p>
              </li>
            );
          })}
        </ol>

        {/* CTA */}
        <section className={styles.cta}>
          <h3>Deploy {agent.name} on your repo</h3>
          <p>
            Install OpenFlows, point it at a GitHub repository with open issues,
            and {agent.name} will be running in minutes.
          </p>
          <div className={styles.actions}>
            <Button variant="outline" size="md" href="https://github.com/The-AgenticFlow/OpenFlows" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Button>
            <Button variant="cyan" size="md" href="/docs/getting-started/installation">
              Installation Guide &rarr;
            </Button>
          </div>
        </section>
      </article>
    </Layout>
  );
}
