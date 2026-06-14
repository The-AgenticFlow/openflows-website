
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/organisms/Layout/Layout';
import Button from '@/atoms/Button/Button';
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
      {/* Article Header */}
      <header className={styles.detailHero}>
        <div className={styles.heroCard}>
          {agent.image && (
            <div className={styles.heroBg}>
              <img src={agent.image} alt="" />
              <div className={styles.heroOverlay} />
            </div>
          )}
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>The OpenFlows Team</p>
            <h1 className={styles.heroTitle}>{agent.name}</h1>
            <p className={styles.heroExcerpt}>{agent.role}</p>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className={styles.article}>
        {/* Mission / Introduction */}
        <p className={styles.lead}>{agent.mission}</p>

        {/* Capabilities */}
        <section className={styles.articleSection}>
          <h2>Capabilities</h2>
          <ul className={styles.capList}>
            {agent.capabilities.map((cap, i) => (
              <li key={i} className={styles.capItem}>
                <span className={styles.check}>✓</span>
                {cap}
              </li>
            ))}
          </ul>
        </section>

        {/* Workflow */}
        <section className={styles.articleSection}>
          <h2>How it works</h2>
          <ol className={styles.flowList}>
            {agent.flow.map((step, i) => {
              const [title, desc] = step.split(': ');
              return (
                <li key={i} className={styles.flowItem}>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <hr className={styles.divider} />

        {/* CTA */}
        <section className={styles.articleCta}>
          <h3>Deploy {agent.name} on your repo</h3>
          <p>
            Install OpenFlows, point it at a GitHub repository with open issues,
            and {agent.name} will be running in minutes.
          </p>
          <div className={styles.actions}>
            <Button variant="outline" size="md" href="https://github.com/The-AgenticFlow/AgentFlow" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Button>
            <Button variant="cyan" size="md" href="/docs/getting-started/installation">
              Installation Guide →
            </Button>
          </div>
        </section>
      </article>
    </Layout>
  );
}
