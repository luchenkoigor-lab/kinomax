CREATE TABLE content_sources (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv')),
  source_type TEXT NOT NULL CHECK (source_type IN ('hdrezka', 'uakino', 'youtube', 'vimeo', 'tubi', 'plutotv', 'other')),
  source_url TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'UA' CHECK (language IN ('UA', 'RU', 'EN', 'OTHER')),
  quality TEXT DEFAULT 'HD',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, content_type, source_type)
);

ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_sources_select_all" ON content_sources FOR SELECT
  USING (true);

CREATE INDEX idx_content_sources_content ON content_sources(content_id, content_type);
