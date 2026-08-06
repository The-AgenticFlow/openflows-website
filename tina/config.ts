import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_REF_NAME ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "master";

export default defineConfig({
  branch,

  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "blogs",
        label: "Blog Posts",
        path: "src/content/blogs",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "author_name",
            label: "Author Name",
          },
          {
            type: "string",
            name: "cover_image_url",
            label: "Cover Image URL",
          },
          {
            type: "string",
            name: "category_id",
            label: "Category",
          },
          {
            type: "string",
            name: "status",
            label: "Status",
            options: [
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ],
          },
          {
            type: "datetime",
            name: "published_at",
            label: "Published At",
          },
          {
            type: "boolean",
            name: "is_featured",
            label: "Featured",
          },
          {
            type: "number",
            name: "read_time_minutes",
            label: "Read Time (minutes)",
          },
          {
            type: "rich-text",
            name: "content",
            label: "Content",
            isBody: true,
          },
        ],
      },
      {
        name: "research",
        label: "Research Papers",
        path: "src/content/research",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
          },
          {
            type: "string",
            name: "abstract",
            label: "Abstract",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
          },
          {
            type: "datetime",
            name: "publish_date",
            label: "Publish Date",
          },
          {
            type: "string",
            name: "venue",
            label: "Venue",
          },
          {
            type: "string",
            name: "pdf_url",
            label: "PDF URL",
          },
          {
            type: "string",
            name: "cover_image_url",
            label: "Cover Image URL",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "object",
            name: "authors",
            label: "Authors",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "affiliation",
                label: "Affiliation",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },
      {
        name: "stories",
        label: "Success Stories",
        path: "src/content/stories",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
          },
          {
            type: "string",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "href",
            label: "URL",
          },
          {
            type: "string",
            name: "image",
            label: "Image URL",
          },
          {
            type: "rich-text",
            name: "content",
            label: "Content",
            isBody: true,
          },
        ],
      },
    ],
  },
});
