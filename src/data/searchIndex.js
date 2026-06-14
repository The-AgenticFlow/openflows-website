import { AGENT_DATA } from './agents';
import { NEWS_ITEMS, STORIES } from './content';

/**
 * Unified search index for the entire site.
 */
export const getSearchIndex = () => {
  const index = [];

  // 1. Agents
  Object.entries(AGENT_DATA).forEach(([id, agent]) => {
    index.push({
      id: `agent-${id}`,
      title: agent.name,
      description: agent.mission,
      role: agent.role,
      href: `/agents/${id}`,
      type: 'Agent',
      tags: [...agent.capabilities, agent.role]
    });
  });

  // 2. Blog / News
  NEWS_ITEMS.forEach(item => {
    index.push({
      id: `blog-${item.id}`,
      title: item.title,
      description: item.excerpt,
      href: item.href,
      type: 'Blog',
      date: item.date,
      tags: [item.category]
    });
  });

  // 3. Use Cases / Stories
  STORIES.forEach(item => {
    index.push({
      id: `story-${item.id}`,
      title: item.title,
      href: item.href,
      type: 'Use Case',
      tags: [item.category]
    });
  });

  // 4. Documentation (Manual list based on current structure)
  // In a real app, this might come from a CMS or a JSON manifest of MDX files.
  const docs = [
    { title: 'Getting Started', href: '/docs/getting-started', type: 'Docs', description: 'Install OpenFlows and run your first autonomous workflow.' },
    { title: 'Installation Guide', href: '/docs/getting-started/installation', type: 'Docs', description: 'Shell, Docker, and Cargo installation methods.' },
    { title: 'Agent Setup', href: '/docs/guides/agent-setup', type: 'Docs', description: 'Configure NEXUS, FORGE, SENTINEL, VESSEL, and LORE.' },
    { title: 'Architecture Overview', href: '/docs/architecture', type: 'Docs', description: 'Deep dive into the SharedStore and agent hierarchy.' },
    { title: 'System Design', href: '/docs/architecture/system-design', type: 'Architecture', description: 'How the state machine orchestrates work.' },
    { title: 'FAQ', href: '/docs/faq', type: 'Docs', description: 'Common questions and troubleshooting.' },
  ];

  docs.forEach((doc, idx) => {
    index.push({
      id: `doc-${idx}`,
      ...doc,
      tags: [doc.type]
    });
  });

  return index;
};

/**
 * Basic fuzzy search / filter logic
 */
export const searchSite = (query) => {
  if (!query || query.length < 2) return [];

  const index = getSearchIndex();
  const q = query.toLowerCase();

  return index.filter(item => {
    const inTitle = item.title?.toLowerCase().includes(q);
    const inDesc = item.description?.toLowerCase().includes(q);
    const inTags = item.tags?.some(tag => tag.toLowerCase().includes(q));
    
    return inTitle || inDesc || inTags;
  }).sort((a, b) => {
    // Boost title matches
    const aTitleMatch = a.title.toLowerCase().includes(q) ? 2 : 0;
    const bTitleMatch = b.title.toLowerCase().includes(q) ? 2 : 0;
    return bTitleMatch - aTitleMatch;
  });
};
