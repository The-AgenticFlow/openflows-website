import { defineCollection, z } from "astro:content";

const researchCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publish_date: z.string().or(z.date()),
    category: z.string(),
    venue: z.string().optional(),
    abstract: z.string().optional(),
    authors: z
      .array(
        z.object({
          name: z.string(),
          affiliation: z.string().optional(),
        })
      )
      .optional(),
    tags: z.array(z.string()).optional(),
    pdf_url: z.string().url().optional(),
    cover_image_url: z.string().url().optional(),
    slug: z.string().optional(),
  }),
});

const blogsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().optional(),
    author_name: z.string().optional(),
    cover_image_url: z.string().optional(),
    category_id: z.string().optional(),
    status: z.enum(["published", "draft", "archived"]).default("draft"),
    published_at: z.date().optional(),
    is_featured: z.boolean().default(false),
    read_time_minutes: z.number().optional(),
  }),
});

const storiesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string().optional(),
    href: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  research: researchCollection,
  blogs: blogsCollection,
  stories: storiesCollection,
};
