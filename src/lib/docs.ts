import type { CollectionEntry } from 'astro:content';

/** Folder in src/content/docs -> CMS collection name (see public/admin/config.yml). */
export const DOCS_DIRS: Record<string, string> = {
  introduction: 'Introduction',
  'getting-started': 'Get Started',
  concepts: 'Core Concepts',
  architecture: 'Architecture',
  guides: 'Guides',
  reference: 'Reference',
  contributing: 'Contributing',
  resources: 'Resources',
};

/** Path of a docs page under /docs: "guides/troubleshooting", or "guides" for guides/index.md. */
export const docPath = (entry: CollectionEntry<'docs'>) => entry.id.replace(/\/index$/, '').replace(/^index$/, '');

export const docHref = (entry: CollectionEntry<'docs'>) => `/docs/${docPath(entry)}`;

/** Link that opens this page in the CMS editor. */
export const docCmsUrl = (entry: CollectionEntry<'docs'>) => {
  const [dir, ...rest] = entry.id.split('/');
  return `/admin/#/collections/docs-${dir}/entries/${rest.join('/') || 'index'}`;
};

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Short Markdown (links, **bold**, *italic*, `code`) to HTML, for one-line fields like the description. */
export const inlineMarkdown = (s: string) =>
  escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) =>
      /^https?:\/\//.test(href) ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>` : `<a href="${href}">${text}</a>`,
    );

/** The same fields as plain text, for meta descriptions and search. */
export const plainMarkdown = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*`]/g, '');
