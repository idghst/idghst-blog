-- blog.posts
-- FastAPI + PostgreSQL. Next.js 런타임은 content/**/*.mdx를 읽는다.
-- frontmatter(lib/posts.ts PostFrontmatter)와 1:1.

CREATE SCHEMA IF NOT EXISTS blog;

CREATE OR REPLACE FUNCTION blog.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS blog.posts (
    id           BIGINT      GENERATED ALWAYS AS IDENTITY,
    slug         TEXT        NOT NULL,
    title        TEXT        NOT NULL,
    description  TEXT        NOT NULL DEFAULT '',
    type         TEXT        NOT NULL,
    tags         TEXT[]      NOT NULL DEFAULT '{}',
    body         TEXT        NOT NULL,
    ticker       TEXT,
    cover        TEXT,
    locale       TEXT        NOT NULL DEFAULT 'ko',
    draft        BOOLEAN     NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_slug_key UNIQUE (slug),
    CONSTRAINT posts_type_check CHECK (type IN ('guide', 'news', 'stock')),
    CONSTRAINT posts_locale_check CHECK (locale IN ('ko', 'en'))
);

CREATE INDEX IF NOT EXISTS posts_type_published_idx
    ON blog.posts (type, published_at DESC);

CREATE INDEX IF NOT EXISTS posts_published_idx
    ON blog.posts (published_at DESC)
    WHERE draft = FALSE;

CREATE INDEX IF NOT EXISTS posts_tags_gin_idx
    ON blog.posts USING GIN (tags);

DROP TRIGGER IF EXISTS posts_set_updated_at ON blog.posts;
CREATE TRIGGER posts_set_updated_at
    BEFORE UPDATE ON blog.posts
    FOR EACH ROW
    EXECUTE FUNCTION blog.set_updated_at();
