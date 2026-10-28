import { getCollection } from 'astro:content';
import type { BlogPost } from './blog';

export interface AuthorView {
  name: string;
  initials: string;
  avatarUrl?: string;
  role?: string;
}

const AVATAR_SIZE_PX = 96;

const normalize = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, ' ');

export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

interface AuthorProfile {
  avatarUrl?: string;
  role?: string;
}

let profiles: Promise<Map<string, AuthorProfile>> | undefined;

// The profile list is read once per build and shared by every page.
const loadProfiles = (): Promise<Map<string, AuthorProfile>> => {
  profiles ??= getCollection('authors').then((entries) => {
    const byName = new Map<string, AuthorProfile>();
    entries.forEach(({ data }) => {
      byName.set(normalize(data.name), {
        avatarUrl: data.avatar || (data.github ? `https://github.com/${data.github}.png?size=${AVATAR_SIZE_PX}` : undefined),
        role: data.role,
      });
    });
    return byName;
  });
  return profiles;
};

/** The people credited on a post, with a photo when their profile has one. */
export const getPostAuthors = async (post: BlogPost): Promise<AuthorView[]> => {
  const directory = await loadProfiles();
  const credited = post.data.authors?.length
    ? post.data.authors.map((author) => ({ name: author.name, avatarUrl: author.avatar_url }))
    : [{ name: post.data.author_name, avatarUrl: post.data.author_avatar_url }];

  return credited
    .filter((author) => author.name)
    .map((author) => {
      const profile = directory.get(normalize(author.name));
      return {
        name: author.name,
        initials: getInitials(author.name),
        avatarUrl: author.avatarUrl || profile?.avatarUrl,
        role: profile?.role,
      };
    });
};
