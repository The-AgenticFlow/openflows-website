# Blog System Setup Guide

This document explains how to set up the blog system with Supabase for the OpenFlows website.

## Overview

The blog system provides:
- **Admin Panel**: Protected routes for managing blog posts
- **Public Blog**: Dynamic blog pages that fetch from Supabase
- **Image Upload**: Cover image support via Supabase Storage
- **Role-based Access**: Admin, Editor, and Viewer roles

## Architecture

### Database Connection

This system uses **Supabase** as a backend-as-a-service. You don't need a traditional database URL - Supabase manages the PostgreSQL database for you.

**How it works:**
1. Frontend connects to Supabase via REST API (not direct database connection)
2. All database operations go through Supabase's auto-generated APIs
3. Row Level Security (RLS) policies protect the data

### Admin Access

**Admin URLs:**
- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin`
- New Post: `http://localhost:5173/admin/blog/new`
- Edit Post: `http://localhost:5173/admin/blog/edit/:id`

**Who can access?** Users must meet BOTH conditions:
1. Have a Supabase Auth account (created in Supabase Dashboard)
2. Be listed in the `admin_users` table with a role

**Role Permissions:**

| Role | View Posts | Create/Edit | Delete | Publish |
|------|------------|-------------|--------|---------|
| **admin** | ✅ | ✅ | ✅ | ✅ |
| **editor** | ✅ | ✅ | ❌ | ✅ |
| **viewer** | ✅ | ❌ | ❌ | ❌ |

## Prerequisites

1. A [Supabase](https://supabase.com) account
2. Node.js 18+ installed
3. Basic understanding of SQL and React

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Name your project (e.g., "openflows-blog")
4. Set a secure database password
5. Choose a region close to your users
6. Click "Create new project"

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to **Project Settings > API**
   - Copy the **Project URL** → `VITE_SUPABASE_URL`
   - Copy the **anon/public key** → `VITE_SUPABASE_ANON_KEY`

3. Your `.env` should look like:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**Note:** The anon key is safe to expose in frontend code. Never use the `service_role` key in frontend code!

### 3. Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy the contents of `supabase/schema.sql`
4. Execute the query

This will create:
- `blog_categories` table
- `blog_tags` table
- `blogs` table
- `blog_tag_relations` junction table
- `admin_users` table
- Row Level Security policies
- Triggers for updated_at and published_at

### 4. Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `blog-images`
3. Set it to **Public**
4. Configure CORS if needed for your domain

### 5. Set Up Authentication

1. Go to Authentication > Providers
2. Enable **Email** provider
3. Configure email templates if desired

### 6. Create Admin User

**IMPORTANT:** The system uses a two-step authentication process:

1. **Supabase Auth** - Handles user registration and login
2. **admin_users table** - Controls who has admin access

**Step 1: Create a Supabase Auth User**

Option A: Via Dashboard
1. Go to **Authentication > Users**
2. Click "Add user"
3. Enter email and password
4. Click "Create user"

Option B: Self-registration (if enabled)
1. Go to `/admin/login`
2. Use Supabase's sign-up flow (if configured)

**Step 2: Add to admin_users Table**

After creating the auth user, add them to the admin_users table:

```sql
INSERT INTO admin_users (email, display_name, role)
VALUES ('your-email@example.com', 'Your Name', 'admin');
```

**How Authentication Works:**

1. User signs in via `/admin/login` with email/password
2. Supabase Auth validates credentials
3. System checks if email exists in `admin_users` table
4. If found and `is_active = true`, access is granted
5. Role determines permissions (admin/editor/viewer)

**Security Features:**

- ✅ **Email-based matching** - Links auth user to admin record by email
- ✅ **Row Level Security** - Database policies protect data
- ✅ **Role-based access** - Different permission levels
- ✅ **Soft delete** - `is_active` flag to disable access
- ✅ **Protected routes** - Frontend guards all admin routes

**To revoke access:**
```sql
UPDATE admin_users
SET is_active = false
WHERE email = 'user@example.com';
```

**To change role:**
```sql
UPDATE admin_users
SET role = 'editor'
WHERE email = 'user@example.com';
```

### 7. Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` and other dependencies.

### 8. Start the Development Server

```bash
npm run dev
```

## Usage

### Admin Panel

Navigate to `/admin/login` to access the admin panel:

1. **Dashboard** (`/admin`): View all posts, filter by status, search
2. **New Post** (`/admin/blog/new`): Create a new blog post
3. **Edit Post** (`/admin/blog/edit/:id`): Edit an existing post

### Blog Pages

- **Blog Index** (`/blog`): Lists all published posts
- **Blog Post** (`/blog/:slug`): Individual post page

### Roles

- **Admin**: Full access (create, edit, delete, publish)
- **Editor**: Can create and edit posts
- **Viewer**: Read-only access to the admin panel

## Database Schema

### blogs table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Post title |
| slug | text | URL-friendly identifier |
| excerpt | text | Short summary |
| content | text | Full post content (HTML/Markdown) |
| cover_image_url | text | Cover image URL |
| cover_image_alt | text | Alt text for cover image |
| author_name | text | Author's name |
| author_avatar_url | text | Author's avatar URL |
| category_id | uuid | Foreign key to blog_categories |
| status | text | 'draft', 'published', or 'archived' |
| published_at | timestamptz | Publication date |
| is_featured | boolean | Featured post flag |
| view_count | integer | View counter |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |
| deleted_at | timestamptz | Soft delete timestamp |

## API Reference

### Fetch Posts

```javascript
const { data, error } = await supabase
  .from('blogs')
  .select(`
    *,
    category:blog_categories(name, slug)
  `)
  .eq('status', 'published')
  .is('deleted_at', null)
  .order('published_at', { ascending: false })
```

### Create Post

```javascript
const { data, error } = await supabase
  .from('blogs')
  .insert({
    title: 'My Post',
    slug: 'my-post',
    excerpt: 'A brief summary',
    content: '<p>Full content here</p>',
    author_name: 'John Doe',
    status: 'draft',
  })
  .select()
  .single()
```

### Upload Image

```javascript
const { data, error } = await supabase.storage
  .from('blog-images')
  .upload('blog-images/my-image.jpg', file)

const { data: urlData } = supabase.storage
  .from('blog-images')
  .getPublicUrl('blog-images/my-image.jpg')
```

## Security

### Row Level Security

The schema implements Row Level Security (RLS):

- **Public users**: Can only read published posts
- **Authenticated admins**: Can manage all posts based on role

### Storage Policies

Configure storage policies for the `blog-images` bucket:

```sql
-- Public can view blog images
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Admins can upload blog images
CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');
```

## Troubleshooting

### "Supabase is not configured"

Make sure your `.env` file exists and contains valid credentials.

### "Access Denied"

Your email must be added to the `admin_users` table with the appropriate role.

### Images not uploading

1. Check that the `blog-images` bucket exists and is public
2. Verify storage policies are configured
3. Check file size (max 5MB by default)

### Posts not appearing

1. Ensure posts have `status = 'published'`
2. Check that `deleted_at` is NULL
3. Verify RLS policies are correctly set

## File Structure

```
src/
├── lib/
│   └── supabase.js          # Supabase client configuration
├── contexts/
│   └── AuthContext.jsx      # Authentication context
├── components/
│   ├── ProtectedRoute.jsx   # Route guard component
│   ├── ImageUploader.jsx    # Image upload component
│   └── *.module.css
├── pages/
│   ├── Admin/
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── BlogEditor.jsx
│   │   └── Admin.module.css
│   └── Blog/
│       ├── BlogIndex.jsx
│       ├── BlogPost.jsx
│       └── Blog.module.css
└── App.jsx                  # Route definitions

supabase/
└── schema.sql               # Database schema
```

## Next Steps

1. Customize the blog design to match your brand
2. Add more features:
   - Comments system
   - Tags support
   - SEO optimization
   - RSS feed
   - Newsletter integration
3. Set up CI/CD for automatic deployments
4. Configure custom domain in Supabase