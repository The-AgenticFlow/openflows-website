import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blogs'>;

const WORDS_PER_MINUTE = 200;

export const toSafeSlug = (rawSlug: string): string =>
  rawSlug
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getPostHref = (post: BlogPost): string =>
  `/blog/${toSafeSlug(post.data.slug || post.slug)}`;

export const formatPostDate = (date?: Date): string =>
  date
    ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

export const getReadTime = (post: BlogPost): number =>
  post.data.read_time_minutes ||
  Math.max(1, Math.ceil((post.body || '').split(/\s+/).length / WORDS_PER_MINUTE));

export const getAuthorNames = (post: BlogPost): string =>
  post.data.authors?.length
    ? post.data.authors.map((author) => author.name).join(', ')
    : post.data.author_name;

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const posts = await getCollection('blogs');
  return posts
    .filter((post) => !post.data.is_draft && post.data.status === 'published')
    .sort(
      (a, b) =>
        (b.data.published_at?.getTime() ?? 0) - (a.data.published_at?.getTime() ?? 0),
    );
};
