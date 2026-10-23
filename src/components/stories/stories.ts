interface StoryModule {
  frontmatter: Record<string, string | undefined>;
  rawContent: () => string;
}

export interface Story {
  id: string;
  category: string;
  date?: Date;
  title: string;
  summary: string;
  href: string;
  image: string;
}

const SUMMARY_MAX_LENGTH = 240;

const firstParagraph = (markdown: string): string => {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.replace(/^>\s?/, '').trim())
        .filter(Boolean)
        .join(' '),
    )
    .find((block) => block && !block.startsWith('#') && !block.startsWith('['));
  if (!paragraph) return '';
  return paragraph.length > SUMMARY_MAX_LENGTH
    ? `${paragraph.slice(0, SUMMARY_MAX_LENGTH).replace(/\s+\S*$/, '')}…`
    : paragraph;
};

export const getStories = (): Story[] => {
  const storyModules = import.meta.glob<StoryModule>('/src/content/stories/*.md', { eager: true });
  return Object.entries(storyModules)
    .map(([path, mod]) => {
      const slug = path.split('/').pop()!.replace('.md', '');
      const { frontmatter } = mod;
      return {
        id: slug,
        category: frontmatter.category || '',
        date: frontmatter.date ? new Date(frontmatter.date) : undefined,
        title: frontmatter.title || '',
        summary: frontmatter.excerpt || firstParagraph(mod.rawContent()),
        href: frontmatter.href || `/stories/${slug}`,
        image: frontmatter.image || '',
      };
    })
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
};

export const formatStoryDate = (date?: Date): string =>
  date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
