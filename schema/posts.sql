-- posts.sql
-- 향후 FastAPI + PostgreSQL 백엔드용 스키마 선설계.
-- 현재 Next.js 앱은 content/**/*.mdx 파일을 직접 읽으며 이 DB에 런타임 연결하지 않는다.
-- frontmatter(lib/posts.ts PostFrontmatter)와 1:1로 대응한다.

CREATE TABLE IF NOT EXISTS posts (
    id           BIGINT      GENERATED ALWAYS AS IDENTITY,
    slug         TEXT        NOT NULL,
    title        TEXT        NOT NULL,
    description  TEXT        NOT NULL DEFAULT '',
    type         TEXT        NOT NULL,          -- 'guide' | 'news' | 'stock'
    tags         TEXT[]      NOT NULL DEFAULT '{}',
    body         TEXT        NOT NULL,          -- MDX 본문 (frontmatter 제외)
    ticker       TEXT,                          -- 종목 코드 (stock 타입에서 사용)
    cover        TEXT,                          -- 대표 이미지 URL
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

-- 목록/필터 쿼리를 위한 인덱스
CREATE INDEX IF NOT EXISTS posts_type_published_idx
    ON posts (type, published_at DESC);

CREATE INDEX IF NOT EXISTS posts_published_idx
    ON posts (published_at DESC)
    WHERE draft = FALSE;

-- 태그 배열 검색용 GIN 인덱스
CREATE INDEX IF NOT EXISTS posts_tags_gin_idx
    ON posts USING GIN (tags);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_set_updated_at ON posts;
CREATE TRIGGER posts_set_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
