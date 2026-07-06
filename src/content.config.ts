import { defineCollection, z } from 'astro:content';
import { supabaseLoader } from './lib/supabase-loader.js';

const blogs = defineCollection({
  loader: supabaseLoader('blogs'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    content: z.string(),
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
    status: z.enum(['draft', 'published', 'archived']),
    published_at: z.date().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    view_count: z.number().optional(),
    read_time_minutes: z.number().optional(),
    is_featured: z.boolean().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    deleted_at: z.date().optional().nullable(),
  }),
});

const research = defineCollection({
  loader: supabaseLoader('research'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    abstract: z.string(),
    content: z.string(),
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
    status: z.enum(['draft', 'published', 'archived']),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  }),
});

const stories = defineCollection({
  loader: supabaseLoader('stories'),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
    href: z.string(),
    image: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  }),
});

export const collections = { blogs, research, stories };
