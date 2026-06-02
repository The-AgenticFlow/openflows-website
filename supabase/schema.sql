    -- =====================================================
    -- OpenFlows Blog System - Supabase PostgreSQL Schema
    -- =====================================================

    -- Enable Row Level Security (RLS)
    alter default privileges in schema public revoke all on tables from public;
    alter default privileges in schema public grant select on tables to anon;
    alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

    -- =====================================================
    -- BLOG CATEGORIES
    -- =====================================================
    create table if not exists blog_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
    );

    -- Insert default categories
    insert into blog_categories (name, slug, description) values
    ('Release', 'release', 'Product releases and updates'),
    ('Research', 'research', 'Technical research and deep dives'),
    ('Product', 'product', 'Product announcements and features'),
    ('Open Source', 'open-source', 'Open source community news'),
    ('Tutorial', 'tutorial', 'How-to guides and tutorials')
    on conflict (slug) do nothing;

    -- =====================================================
    -- BLOG TAGS
    -- =====================================================
    create table if not exists blog_tags (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique,
    created_at timestamptz default now()
    );

    -- =====================================================
    -- BLOGS (Main articles table)
    -- =====================================================
    create table if not exists blogs (
    id uuid primary key default gen_random_uuid(),
    
    -- Core content
    title text not null,
    slug text not null unique,
    excerpt text not null,
    content text not null, -- Markdown/HTML content
    
    -- Media
    cover_image_url text, -- URL to cover image in storage
    cover_image_alt text,
    
    -- Metadata
    author_name text not null,
    author_avatar_url text,
    category_id uuid references blog_categories(id) on delete set null,
    
    -- Status & Visibility
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    published_at timestamptz,
    
    -- SEO
    meta_title text,
    meta_description text,
    
    -- Engagement
    view_count integer default 0,
    read_time_minutes integer default 5,
    
    -- Featured
    is_featured boolean default false,
    
    -- Timestamps
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    -- Soft delete
    deleted_at timestamptz
    );

    -- Create index for faster queries
    create index if not exists blogs_status_idx on blogs(status);
    create index if not exists blogs_published_at_idx on blogs(published_at desc);
    create index if not exists blogs_category_idx on blogs(category_id);
    create index if not exists blogs_slug_idx on blogs(slug);
    create index if not exists blogs_featured_idx on blogs(is_featured) where is_featured = true;

    -- =====================================================
    -- BLOG TAGS JUNCTION TABLE (Many-to-Many)
    -- =====================================================
    create table if not exists blog_tag_relations (
    blog_id uuid references blogs(id) on delete cascade,
    tag_id uuid references blog_tags(id) on delete cascade,
    primary key (blog_id, tag_id)
    );

    -- =====================================================
    -- ADMIN USERS
    -- =====================================================
    create table if not exists admin_users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    display_name text,
    avatar_url text,
    role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
    );

    -- =====================================================
    -- ROW LEVEL SECURITY POLICIES
    -- =====================================================

    -- Blogs: Public can read published posts
    create policy "Public can view published blogs"
    on blogs for select
    using (status = 'published' and deleted_at is null);

    -- Blogs: Authenticated users can manage all blogs
    create policy "Admins can manage all blogs"
    on blogs for all
    to authenticated
    using (true)
    with check (true);

    -- Blog categories: Public read, admin write
    create policy "Public can view categories"
    on blog_categories for select
    using (true);

    create policy "Admins can manage categories"
    on blog_categories for all
    to authenticated
    using (true)
    with check (true);

    -- Blog tags: Public read, admin write
    create policy "Public can view tags"
    on blog_tags for select
    using (true);

    create policy "Admins can manage tags"
    on blog_tags for all
    to authenticated
    using (true)
    with check (true);

    -- Admin users: Authenticated can view; only admins can modify
    create policy "Authenticated users can view admin profiles"
    on admin_users for select
    to authenticated
    using (true);

    create policy "Admins can manage admin profiles"
    on admin_users for insert, update, delete
    to authenticated
    using (
        exists (
            select 1 from admin_users 
            where email = auth.email() 
            and role = 'admin'
        )
    );

    -- =====================================================
    -- FUNCTIONS & TRIGGERS
    -- =====================================================

    -- Function to auto-update updated_at timestamp
    create or replace function update_updated_at()
    returns trigger as $$
    begin
    new.updated_at = now();
    return new;
    end;
    $$ language plpgsql;

    -- Apply triggers to tables
    create trigger update_blogs_updated_at
    before update on blogs
    for each row execute function update_updated_at();

    create trigger update_blog_categories_updated_at
    before update on blog_categories
    for each row execute function update_updated_at();

    create trigger update_admin_users_updated_at
    before update on admin_users
    for each row execute function update_updated_at();

    -- Function to auto-set published_at when status changes to published
    create or replace function set_published_at()
    returns trigger as $$
    begin
    if new.status = 'published' and old.status != 'published' then
        new.published_at = now();
    end if;
    return new;
    end;
    $$ language plpgsql;

    create trigger set_blogs_published_at
    before update on blogs
    for each row execute function set_published_at();

    -- =====================================================
    -- STORAGE BUCKET FOR BLOG IMAGES
    -- =====================================================

    -- Note: Storage buckets are created via Supabase Dashboard or API
    -- Run this in Supabase SQL Editor after creating the bucket:
    /*
    insert into storage.buckets (id, name, public)
    values ('blog-images', 'blog-images', true)
    on conflict (id) do nothing;

    -- Storage policies for blog-images bucket
    create policy "Public can view blog images"
    on storage.objects for select
    using (bucket_id = 'blog-images');

    create policy "Admins can upload blog images"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'blog-images');

    create policy "Admins can update blog images"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'blog-images');

    create policy "Admins can delete blog images"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'blog-images');
    */

    -- =====================================================
    -- INITIAL ADMIN USER (Set via Supabase Dashboard)
    -- =====================================================
    -- After setting up authentication, add your email as admin:
    -- insert into admin_users (email, display_name, role) 
    -- values ('your-email@example.com', 'Your Name', 'admin');