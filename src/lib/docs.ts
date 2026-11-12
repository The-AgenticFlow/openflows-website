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
