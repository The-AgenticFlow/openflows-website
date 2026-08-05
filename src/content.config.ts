import { defineCollection, z } from 'astro:content';

const blogs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string(),
    cover_image_url: z.string().optional(),
    cover_image_alt: z.string().optional(),
    author_name: z.string(),
    author_avatar_url: z.string().optional(),
    authors: z.array(z.object({
      name: z.string(),
      role: z.string().optional(),
      avatar_url: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
    })).optional(),
    category_id: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    published_at: z.date().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    view_count: z.number().optional(),
    read_time_minutes: z.number().optional(),
    is_featured: z.boolean().optional(),
    is_draft: z.boolean().optional().default(false),
  }),
});

const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    abstract: z.string(),
    category: z.string(),
    venue: z.string().optional(),
    publish_date: z.date().optional(),
    pdf_url: z.string().optional(),
    cover_image_url: z.string().optional(),
    tags: z.array(z.string()).optional(),
    authors: z.array(z.object({
      name: z.string(),
      affiliation: z.string().optional(),
    })).optional(),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    is_draft: z.boolean().optional().default(false),
  }),
});

const stories = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
    href: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { blogs, research, stories };
