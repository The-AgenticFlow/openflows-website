// Site-wide search index, generated at build time and fetched by the search
// dialog in the navbar. One entry per page: where it lives, what kind of page
// it is, its title, a short summary and its plain text for matching.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts, getPostHref } from '@/components/blog/blog';
import { getStories } from '@/components/stories/stories';
import { AGENT_SUMMARY } from '@/data/agentSummary';
import { FAQ_GROUPS } from '@/data/faq';
import { docHref, plainMarkdown } from '@/lib/docs';

interface Entry {
  url: string;
  type: 'Page' | 'FAQ' | 'Docs' | 'Blog' | 'Research' | 'Case study' | 'Agent';
  title: string;
  summary: string;
  text: string;
}

const TEXT_LIMIT = 6000;

const plain = (source: string) =>
  source
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/\{`[\s\S]*?`\}/g, (m) => m.slice(2, -2))
    .replace(/<[^>]+>/g, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/[#*_>`|[\]()]/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clip = (text: string, max = 180) => (text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text);

const PAGES: Omit<Entry, 'text'>[] = [
  { url: '/', type: 'Page', title: 'Home', summary: 'Orchestrate AI agents on top of your Coder environment.' },
  { url: '/agents', type: 'Page', title: 'The agent team', summary: 'Five agents, one governed pipeline: NEXUS, FORGE, SENTINEL, VESSEL and LORE.' },
  { url: '/enterprise', type: 'Page', title: 'Enterprise', summary: 'Guardrails, trust boundaries, deployment and evaluation for engineering organizations.' },
  { url: '/demos', type: 'Page', title: 'Demos', summary: 'Watch the pipeline from an open GitHub issue to a merged pull request.' },
  { url: '/developers', type: 'Page', title: 'Developers', summary: 'Integration guides, architecture references and the source code.' },
  { url: '/developers/integrations', type: 'Page', title: 'Integrations', summary: 'Setup modes, GitHub, models, notifications and the CLI.' },
  { url: '/about', type: 'Page', title: 'Community', summary: 'Discord, GitHub, discussions, ways to contribute and the team.' },
  { url: '/resources', type: 'Page', title: 'Resources', summary: 'Blog posts, research papers and case studies.' },
  { url: '/resources#contact', type: 'Page', title: 'Contact', summary: 'Talk to the maintainers about an evaluation, a partnership or a deployment.' },
];

const pageSources = import.meta.glob<string>(
  ['/src/pages/index.astro', '/src/pages/agents/index.astro', '/src/pages/enterprise.astro', '/src/pages/demos/index.astro', '/src/pages/developers/*.astro', '/src/pages/about.astro'],
  { query: '?raw', import: 'default', eager: true },
);
const docSources = import.meta.glob<string>('/src/pages/docs/**/*.astro', { query: '?raw', import: 'default', eager: true });

const pageText = (url: string) => {
  const file = url === '/' ? '/src/pages/index.astro' : Object.keys(pageSources).find((p) => p.replace('/src/pages', '').replace(/(\/index)?\.astro$/, '') === url);
  return file ? clip(plain(pageSources[file]), TEXT_LIMIT) : '';
};

const docUrl = (path: string) => path.replace('/src/pages', '').replace(/(\/index)?\.astro$/, '') || '/docs';

const docEntry = (path: string, source: string): Entry => {
  const h1 = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
  const crumb = source.match(/label: '([^']+)' }\]/)?.[1];
  const title = plain(h1 ?? crumb ?? 'Documentation');
  const firstP = source.match(/<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/)?.[1];
  const text = plain(source);
  return { url: docUrl(path), type: 'Docs', title, summary: clip(plain(firstP ?? text)), text: clip(text, TEXT_LIMIT) };
};

export const GET: APIRoute = async () => {
  const entries: Entry[] = [];

  for (const page of PAGES) entries.push({ ...page, text: page.url.includes('#') ? '' : pageText(page.url) });

  for (const [path, source] of Object.entries(docSources)) if (!path.includes('[')) entries.push(docEntry(path, source));

  for (const doc of await getCollection('docs')) {
    if (doc.data.hidden) continue;
    const text = plain(doc.body ?? '');
    entries.push({ url: docHref(doc), type: 'Docs', title: doc.data.title, summary: clip(plainMarkdown(doc.data.description ?? '') || text), text: clip(`${plainMarkdown(doc.data.description ?? '')} ${text}`, TEXT_LIMIT) });
  }

  for (const post of await getPublishedPosts()) {
    entries.push({ url: getPostHref(post), type: 'Blog', title: post.data.title, summary: clip(post.data.excerpt ?? ''), text: clip(plain(post.body ?? ''), TEXT_LIMIT) });
  }

  const research = (await getCollection('research')).filter((item) => item.data.status === 'published' && !item.data.is_draft);
  for (const item of research) {
    entries.push({
      url: `/research/${(item.data.slug || item.slug).trim()}`,
      type: 'Research',
      title: item.data.title,
      summary: clip(plain(item.data.abstract ?? '')),
      text: clip(plain(item.body ?? ''), TEXT_LIMIT),
    });
  }

  for (const story of getStories()) entries.push({ url: story.href, type: 'Case study', title: story.title, summary: clip(story.summary), text: story.summary });

  for (const agent of AGENT_SUMMARY) {
    entries.push({ url: `/agents/${agent.id}`, type: 'Agent', title: `${agent.name} · ${agent.role}`, summary: agent.tagline, text: `${agent.tagline} Focus: ${agent.tags.join(', ')}. Runs in ${agent.spec.runs}. Writes ${agent.spec.writes}. Never ${agent.spec.never}.` });
  }

  for (const item of FAQ_GROUPS.flatMap((g) => g.items)) {
    const answer = plain(item.a);
    entries.push({ url: `/faq#${item.id}`, type: 'FAQ', title: item.q, summary: clip(answer), text: answer });
  }

  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
};
