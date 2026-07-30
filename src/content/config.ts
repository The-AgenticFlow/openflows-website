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

export const collections = {
  research: researchCollection,
};
