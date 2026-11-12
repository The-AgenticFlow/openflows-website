// Frequently asked questions, shared by the /faq page, the homepage and search.
// The content lives in faq.json so it can be edited from the CMS (Site → FAQ).
// Answers are short Markdown: paragraphs, **bold**, `code` and [links](/docs).
import data from './faq.json';

export interface FaqItem {
  id: string;
  q: string;
  /** Answer as HTML, rendered from the Markdown in faq.json. */
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inline = (s: string) =>
  escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) => {
      const external = /^https?:\/\//.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    });

const toHtml = (markdown: string) =>
  markdown
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${inline(p.replace(/\n/g, ' '))}</p>`)
    .join('');

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

export const FAQ_GROUPS: FaqGroup[] = data.groups.map((g) => ({
  id: g.id || slug(g.title),
  title: g.title,
  items: g.items.map((i) => ({ id: i.id || slug(i.question), q: i.question, a: toHtml(i.answer) })),
}));

/** The questions shown on the homepage, in order. */
export const FAQ_HOME: string[] = data.home;

export const faqItem = (id: string) => FAQ_GROUPS.flatMap((g) => g.items).find((i) => i.id === id)!;
